import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import {toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;

      if (user) {
        const userRef = firebase.firestore().collection('Users').doc(user.uid);
        const doc = await userRef.get();

        if (doc.exists) {
          toast.success('Google Sign-In Successful!');
          router.push('/');
        } else {
          toast.error('User not found ');
          router.push('/register');
        }
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
      toast.error(`Google Sign-In Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordSignIn = async () => {
    setLoading(true);
    try {
      const result = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = result.user;

      if (user) {
        const userRef = firebase.firestore().collection('Users').doc(user.uid);
        const doc = await userRef.get();

        if (doc.exists) {
          toast.success('Login Successful!');
          router.push('/');
        } else {
          toast.error('User not found ');
          router.push('/register');
        }
      }
    } catch (error) {
      console.error('Email/Password Sign-In Error:', error.message);
      toast.error(`Login Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-[sans-serif] bg-white flex items-center justify-center p-4">
      <div className="max-w-6xl max-md:max-w-lg rounded-md p-6">
        <div className="grid md:grid-cols-2 items-center gap-8">
          <div className="max-md:order-1 lg:min-w-[450px]">
            <img
              src="https://readymadeui.com/signin-image.webp"
              className="lg:w-11/12 w-full object-cover"
              alt="login-image"
            />
          </div>

          <form className="md:max-w-md w-full mx-auto">
            <div className="mb-4">
              <h3 className="text-4xl font-extrabold text-blue-600">Sign in</h3>
            </div>

            {/* Google Sign-In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 mb-6 text-sm font-semibold rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="inline mr-4" viewBox="0 0 512 512">
                  <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" data-original="#fbbd00" />
                  <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" data-original="#0f9d58" />
                  <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" data-original="#31aa52" />
                  <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" data-original="#3c79e6" />
                  <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" data-original="#cf2d48" />
                  <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z" data-original="#eb4132" />
                </svg>
              Sign in with Google
            </button>

            {/* Divider */}
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Email Input */}
            <div className="relative flex items-center">
              <input
                name="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter email"
              />
            </div>

            {/* Password Input */}
            <div className="relative flex items-center mt-8">
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter password"
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="text-gray-800 ml-3 text-sm">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Email/Password Sign-In Button */}
            <div className="mt-12">
              <button
                type="button"
                onClick={handleEmailPasswordSignIn}
                disabled={loading}
                className="w-full py-2.5 px-5 text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-gray-800 text-sm text-center mt-6">
                Don't have an account?{' '}
                <a href="/register" className="text-blue-600 font-semibold hover:underline ml-1">
                  Register here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Login;
