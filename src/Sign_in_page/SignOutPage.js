import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignOutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a delay for user feedback
    const timer = setTimeout(() => {
      navigate('/SignupPage'); // Redirect after sign out
    }, 3000); // 3-second delay for the message

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="signout-page">
      <h1>You have successfully signed out.</h1>
      <p>Redirecting to the Signup Page...</p>
    </div>
  );
};

export default SignOutPage;
