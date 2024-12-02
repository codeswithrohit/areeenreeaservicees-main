import React, { useState } from 'react';
import { firebase } from '../Firebase/config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setResetSent(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResetSent(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
        <h1 className="text-center text-2xl font-bold mb-6">Forgot Password</h1>
        {resetSent ? (
          <div className="text-center mb-4 text-green-500">
            Reset email sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Email Address
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Reset Password
            </button>
            {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
