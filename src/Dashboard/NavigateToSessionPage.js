import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

export default function NavigateToSessionPage() {
  const [autoTracking, setAutoTracking] = useState(false);
  const navigate = useNavigate();

  const handleSaveConfiguration = () => {
    alert("Configuration Saved!");
  };

  return (
    <div className="center-wrapper color-black items-center">
      <div className="content-box p-8">
        {/* Header Section */}
        <div className="header flex items-center justify-center mb-4 relative">
          <h2 className="text-xl font-extrabold item-center absolute left-0 right-0 text-center">
            Edit Session Details
          </h2>
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              fontWeight: "bold",
              padding: "8px 12px",
              borderRadius: "5px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
            }}
            onClick={() => navigate("/dashboard")}
          >
            X
          </button>
        </div>

        {/* Form Section */}
        <form className="space-y-4 w-full">
          <div>
            <label className="text-xl font-bold block text-center">
              Equip Name
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option>Equip 15</option>
              <option>Equip 16</option>
              <option>Equip 17</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Equip Type
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option>Antenna Dish</option>
              <option>Transceiver</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Frequency Band
              </label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option>C</option>
                <option>Ku</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Frequency
              </label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option>5.6 MHz</option>
                <option>7.2 MHz</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bandwidth
            </label>
            <input
              type="text"
              defaultValue="38 MHz"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Satellites
            </label>
            <input
              type="text"
              defaultValue="S1, S2, S3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="flex items-center mt-4">
            <Switch
              checked={autoTracking}
              onChange={setAutoTracking}
              className={`${
                autoTracking ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  autoTracking ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full`}
              />
            </Switch>
            <span className="ml-2 text-gray-700">Auto-Tracking</span>
          </div>

          <div className="flex justify-between mt-6">
            <button type="button" className="text-blue-600 underline">
              View Config History
            </button>
            <button type="button" className="text-gray-500 underline">
              Restore Default
            </button>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSaveConfiguration}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
            >
              Set Configuration
            </button>
          </div>

          <p className="text-gray-400 text-xs mt-2 text-right">
  *Last Updated by User U1 on 26-1-2024 at 16:37 IST
</p>

        </form>
      </div>

      <style jsx>{`
        .center-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .content-box {
          background: #ffffff;
          width: 400px;
          min-height: 500px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
