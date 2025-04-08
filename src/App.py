from flask import Flask, request, jsonify
from datetime import datetime
import datetime
from datetime import time,date
 
from flask_cors import CORS, cross_origin
import pyodbc
from datetime import datetime, time
import bcrypt
 
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests
 
# SQL Server Connection Details
DRIVER = "{ODBC Driver 13 for SQL Server}"
SERVER = "INBAAVVMMSUSQL"
DATABASE = "ISRO_DB"
USERNAME = None  # Use None for Windows Authentication
PASSWORD = None  # Use None for Windows Authentication
 
def get_db_connection():
    """ Establish a connection to the SQL Server database """
    try:
        conn = pyodbc.connect(
            f"DRIVER={DRIVER};"
            f"SERVER={SERVER};"
            f"DATABASE={DATABASE};"
            "Trusted_Connection=yes;"  # Use Windows Authentication
        )
        print("✅ Database connection successful!")
        return conn
    except pyodbc.Error as e:
        print(f"❌ SQL Server Connection Error: {e}")
        return None
    except Exception as e:
        print(f"❌ Unexpected Database Error: {e}")
        return None
   
def validate_data(data):
    errors = []
 
    # Required Fields Check
    required_fields = ['ScheduleID', 'Date', 'PassID', 'Station', 'Status', 'Satellite', 'Orbit', 'Elevation', 'AOS', 'LOS', 'Operation']
    missing_fields = [field for field in required_fields if data.get(field) is None]
 
    if missing_fields:
        errors.append(f"Missing fields: {', '.join(missing_fields)}")
 
    # ✅ Convert Date to String if it's a date object
    if 'Date' in data and data['Date']:
        if isinstance(data['Date'], (date, datetime)):
            data['Date'] = data['Date'].strftime('%Y-%m-%d')
        elif isinstance(data['Date'], str):
            try:
                datetime.strptime(data['Date'], '%Y-%m-%d')
            except ValueError:
                errors.append("Invalid Date format. Expected YYYY-MM-DD")
 
    # ✅ Validate Orbit and Elevation as Numbers
    for field in ['Orbit', 'Elevation']:
        if field in data and data[field] is not None:
            try:
                float(data[field])
            except ValueError:
                errors.append(f"{field} must be a valid number")
 
    # ✅ Convert AOS and LOS to HH:MM:SS if stored as datetime.time
    def extract_time(value, field_name):
        if value:
            if isinstance(value, (datetime, time)):
                return value.strftime('%H:%M:%S')  # Convert datetime.time to string
            elif isinstance(value, str):
                try:
                    datetime.strptime(value, "%H:%M:%S")  # Ensure it's valid time format
                    return value
                except ValueError:
                    errors.append(f"Invalid {field_name} format. Expected HH:MM:SS")
                    return None
        return "00:00:00"  # ✅ Provide a default value instead of NULL
 
    aos_time = extract_time(data.get('AOS'), "AOS")
    los_time = extract_time(data.get('LOS'), "LOS")
 
    return errors, aos_time, los_time
 
# ✅ Sync API Route
@app.route('/api/sync', methods=['POST'])
def sync_schedule():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
 
        # ✅ Fetch Records from [SatelliteSchedule] NOT in [SatelliteScheduleUpdates]
        fetch_query = """
        SELECT ScheduleID, Date, PassID, Station, Status, Satellite, Orbit, Elevation, AOS, LOS, Operation
        FROM SatelliteSchedule
        WHERE ScheduleID NOT IN (SELECT ScheduleID FROM SatelliteScheduleUpdates)
        """
        cursor.execute(fetch_query)
        records = cursor.fetchall()
 
        print(f"✅ Fetched {len(records)} records from SatelliteSchedule.")
 
        if not records:
            return jsonify({"message": "No new records to sync."}), 200
 
        valid_data = []
        invalid_records = []
 
        # ✅ Process Each Record
        for row in records:
            data = {
                "ScheduleID": row[0],
                "Date": row[1],
                "PassID": row[2],
                "Station": row[3],
                "Status": row[4],
                "Satellite": row[5],
                "Orbit": row[6],
                "Elevation": row[7],
                "AOS": row[8],
                "LOS": row[9],
                "Operation": row[10],
            }
 
            # ✅ Validate Data
            errors, aos_time, los_time = validate_data(data)
 
            if errors:
                print(f"❌ Record {data['ScheduleID']} failed validation: {errors}")
                invalid_records.append({"ScheduleID": data["ScheduleID"], "errors": errors})
            else:
                # ✅ Ensure AOS & LOS are not NULL (use "00:00:00" as default if missing)
                valid_data.append((
                    data['ScheduleID'], data['Date'], data['PassID'], data['Station'], data['Status'],
                    data['Satellite'], data['Orbit'], data['Elevation'], aos_time or "00:00:00", los_time or "00:00:00", data['Operation']
                ))
 
        print(f"✅ Valid records count: {len(valid_data)}")
        print(f"❌ Invalid records count: {len(invalid_records)}")
 
        # ✅ Insert Valid Records into [SatelliteScheduleUpdates]
        if valid_data:
            insert_query = """
            INSERT INTO SatelliteScheduleUpdates
            (ScheduleID, Date, PassID, Station, Status, Satellite, Orbit, Elevation, AOS, LOS, Operation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            for record in valid_data:
                cursor.execute(insert_query, record)
            conn.commit()
            print("✅ Database commit successful.")
 
        return jsonify({
            "message": f"Synced {len(valid_data)} records successfully.",
            "invalid_records": invalid_records
        }), 200
 
    except Exception as e:
        print(f"❌ Error syncing schedule: {e}")
        return jsonify({"error": str(e)}), 500
 
    finally:
        cursor.close()
        conn.close()
 
 
 
@app.route('/api/data', methods=['GET'])
def get_data():
    """ Fetch data from SatelliteSchedule table """
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
 
        cursor = conn.cursor()
        query = """
        SELECT ScheduleID, Date, PassID, Station, Status, Satellite, Orbit, Elevation, AOS, LOS, Operation
        FROM SatelliteScheduleUpdates
        """
        print(f"🔍 Executing query: {query}")
 
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        data = []
 
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
 
            # Convert time and date objects to string in correct format
            for key, value in row_dict.items():
                if isinstance(value, time):
                    row_dict[key] = value.strftime('%H:%M:%S')  # Keep time format
                elif isinstance(value,date):  # Ensure it applies to date objects
                    row_dict[key] = value.strftime('%d-%m-%Y')  # Convert to DD-MM-YYYY
 
            data.append(row_dict)
 
        print(f"✅ Retrieved data: {data}")
        return jsonify(data)
 
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
 
    finally:
        cursor.close()
        conn.close()
 
@app.route('/api/validate-login', methods=['POST', 'OPTIONS'])
@cross_origin()  # Allow CORS for this endpoint
def validate_login():
    """Validate username and password against the database."""
    data = request.json
    print("Received data:", data)  # Log the incoming request data
 
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400
 
    input_username = data.get('username')
    input_password = data.get('password')
 
    if not input_username or not input_password:
        return jsonify({"success": False, "message": "Username and password are required"}), 400
 
    conn = get_db_connection()
    if conn is None:
        return jsonify({"success": False, "message": "Failed to connect to the database"}), 500
 
    try:
        cursor = conn.cursor()
        # Fetch the plain password for the given username
        query = "SELECT password FROM users WHERE username = ?"
        print(f"🔍 Executing query: {query} with username={input_username}")
        cursor.execute(query, (input_username,))
        row = cursor.fetchone()
 
        if row:
            stored_password = row[0]  # Plain password from the database
            print(f"🔑 Retrieved password: {stored_password}")
 
            if input_password == stored_password:
                print("✅ Password matched! Login successful.")
                return jsonify({"success": True, "message": "Login Successful"})
            else:
                print("❌ Password does not match.")
 
        print("❌ Invalid username or password.")
        return jsonify({"success": False, "message": "Invalid Username or Password"}), 401
 
    except Exception as e:
        print(f"❌ Error validating login: {e}")
        return jsonify({"success": False, "message": "An unexpected error occurred", "error_details": str(e)}), 500
 
    finally:
        if 'cursor' in locals():
            cursor.close()
        if conn:
            conn.close()
 
 
@app.route('/api/logs', methods=['GET'])
def get_logs():
    """ Fetch data from Logs table """
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
 
        cursor = conn.cursor()
        query = "SELECT Log_ID, Timestamp, Equipment, Equipment_Health, Activity_Action, Status, Comments_Remarks FROM Logs"
        print(f"🔍 Executing query: {query}")
 
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        data = []
 
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
 
            # Convert timestamp to a string format
            if isinstance(row_dict["Timestamp"], datetime):
                row_dict["Timestamp"] = row_dict["Timestamp"].strftime('%Y-%m-%d %H:%M:%S')
 
            data.append(row_dict)
 
        print(f"✅ Retrieved logs: {data}")
        return jsonify(data)
    except Exception as e:
        print(f"❌ Error fetching logs: {e}")
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
 
from datetime import datetime
@app.route('/api/update-schedule-updates', methods=['POST'])
def update_schedule():
    data = request.get_json()
    print("Received data:", data)  # Debugging log
 
    if not data or 'ScheduleID' not in data:
        return jsonify({"error": "Invalid data"}), 400
 
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
 
        # ✅ **Convert Date format properly**
        parsed_date = data.get('Date')
        if parsed_date:
            try:
                parsed_date = datetime.strptime(parsed_date, '%d-%m-%Y').strftime('%Y-%m-%d')
            except ValueError:
                try:
                    parsed_date = datetime.strptime(parsed_date, '%Y-%m-%d').strftime('%Y-%m-%d')
                except ValueError:
                    return jsonify({"error": "Invalid date format. Expected DD-MM-YYYY or YYYY-MM-DD."}), 400
 
        # ✅ **First try to update (to avoid duplicates)**
        update_query = """
        UPDATE SatelliteScheduleUpdates
        SET Date = ?, PassID = ?, Station = ?, Status = ?, Satellite = ?, Orbit = ?, Elevation = ?,
            AOS = ?, LOS = ?, Operation = ?
        WHERE ScheduleID = ?
        """
 
        values = (
            parsed_date, data.get('PassID'), data.get('Station'), data.get('Status'), data.get('Satellite'),
            data.get('Orbit'), data.get('Elevation'), data.get('AOS'), data.get('LOS'), data.get('Operation'),
            data.get('ScheduleID')
        )
 
        cursor.execute(update_query, values)
        rows_affected = cursor.rowcount
        conn.commit()
 
        if rows_affected > 0:
            print(f"✅ Updated {rows_affected} record(s) in SatelliteScheduleUpdates.")
            return jsonify({"message": "Update successful in SatelliteScheduleUpdates"}), 200
 
        # ✅ **If no rows were updated, insert a new record**
        insert_query = """
        INSERT INTO SatelliteScheduleUpdates (ScheduleID, Date, PassID, Station, Status, Satellite, Orbit, Elevation, AOS, LOS, Operation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        insert_values = (
            data['ScheduleID'], parsed_date, data.get('PassID'), data.get('Station'), data.get('Status'),
            data.get('Satellite'), data.get('Orbit'), data.get('Elevation'), data.get('AOS'), data.get('LOS'), data.get('Operation')
        )
 
        cursor.execute(insert_query, insert_values)
        conn.commit()
        print("✅ Inserted new record into SatelliteScheduleUpdates.")
 
        return jsonify({"message": "Insert successful in SatelliteScheduleUpdates"}), 201
 
    except Exception as e:
        print(f"❌ Error updating schedule: {e}")  # Debugging log
        return jsonify({"error": str(e)}), 500
 
    finally:
        cursor.close()
        conn.close()
 
 
# ✅ API Endpoint to Fetch Equipment Status Data
@app.route('/api/equipment-status', methods=['GET'])
def get_equipment_status():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
 
        query = """
        SELECT
            SUM(CASE WHEN Status = 'Online' THEN 1 ELSE 0 END) AS OnlineCount,
            SUM(CASE WHEN Status = 'Error' THEN 1 ELSE 0 END) AS ErrorCount,
            SUM(CASE WHEN Status = 'Offline' THEN 1 ELSE 0 END) AS OfflineCount,
            COUNT(*) AS Total
        FROM EquipmentStatus
        """
        cursor.execute(query)
        row = cursor.fetchone()
 
        if row:
            total = row.Total if row.Total else 1  # Avoid division by zero
            data = {
                "Online": round((row.OnlineCount / total) * 100, 2),
                "Error": round((row.ErrorCount / total) * 100, 2),
                "Offline": round((row.OfflineCount / total) * 100, 2)
            }
        else:
            data = {"Online": 0, "Error": 0, "Offline": 0}
 
        return jsonify(data)
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
    finally:
        cursor.close()
        conn.close()
 
@app.route('/api/ReportTable', methods=['GET'])
def get_report():
    """ Fetch data from ReportTable """
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
 
        cursor = conn.cursor()
        query = (
            "SELECT Shift_Start, Shift_End, Shift_InCharge, Shift_Remarks, Pass_No, Satellite_NameID, "
            "Pass_Start, Pass_End, Ground_Station, Activity, Status, Pass_Remarks, Overall_Summary, "
            "Total_Passes, Critical_Passes, Anomalies_Identified, Escalations, Total_Data_Transferred, "
            "Command_Execution_Success_Percent, SNR, Processing_Delay, Pending_Activities, Critical_Alerts_Events "
            "FROM ReportTable"
        )
        print(f"🔍 Executing query: {query}")
 
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        data = []
 
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            # Convert datetime and time objects to string if needed
            for key, value in row_dict.items():
                if isinstance(value, datetime):
                    row_dict[key] = value.strftime('%Y-%m-%d %H:%M:%S')
                elif isinstance(value, time):
                    row_dict[key] = value.strftime('%H:%M:%S')
            data.append(row_dict)
 
        print(f"✅ Retrieved report data: {data}")
        return jsonify(data)
    except Exception as e:
        print(f"❌ Error fetching report data: {e}")
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
 
from datetime import datetime
@app.route('/api/update-schedule-updates', methods=['POST'])
def update_schedule_updates():
    try:
        data = request.json
        print("Received Data:", data)  # Debugging line
 
        def parse_string(value):
            return str(value) if value not in [None, ""] else None
 
        def parse_int(value):
            try:
                return int(value) if value not in [None, ""] else None
            except ValueError:
                raise ValueError(f"Invalid integer value: {value}")
 
        def parse_float(value):
            try:
                return float(value) if value not in [None, ""] else None
            except ValueError:
                raise ValueError(f"Invalid float value: {value}")
 
        def format_date(value):
            try:
                return datetime.strptime(value, "%d-%m-%Y").date() if value else None
            except ValueError:
                raise ValueError(f"Invalid date format: {value}, expected DD-MM-YYYY")
 
        # Extract values
        pass_id = parse_string(data.get('PassID'))  # Ensure it's a string
        schedule_id = parse_int(data.get('ScheduleID'))
        formatted_date = format_date(data.get('Date'))
        elevation = parse_float(data.get('Elevation'))
 
        conn = get_db_connection()
        cursor = conn.cursor()
 
        query = """
        INSERT INTO SatelliteScheduleUpdates
        (PassID, ScheduleID, Date, Station, Status, Satellite, Orbit, Elevation, AOS, LOS, Operation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        values = (
            pass_id, schedule_id, formatted_date, data['Station'], data['Status'],
            data['Satellite'], data['Orbit'], elevation, data['AOS'], data['LOS'], data['Operation']
        )
 
        cursor.execute(query, values)
        conn.commit()
 
        return jsonify({"message": "Schedule update added successfully"}), 200
 
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
 
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500
 
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
 
if __name__ == '__main__':
    app.run(debug=True)