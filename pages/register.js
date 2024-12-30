import React, { useState } from 'react';
import { firebase } from '../Firebase/config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/router';
import { CSSTransition } from 'react-transition-group'; // Importing CSSTransition for animation

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    termsAccepted: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState(1); // Track the current step
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
    });
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and conditions!');
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password);
      
      const user = userCredential.user;
      await firebase.firestore().collection('Users').doc(user.uid).set({
        name: formData.name,
        email: formData.email,
      });

      toast.success('Signup successful with Email!');
      // Proceed to second step (document verification)
      setStep(2); // Move to step 2
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsSubmitting(true);

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);

      const user = result.user;
      await firebase.firestore().collection('Users').doc(user.uid).set({
        name: user.displayName || 'No Name',
        email: user.email,
      });

      toast.success('Signup successful with Google!');
      // Proceed to second step (document verification)
      setStep(2); // Move to step 2
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = async () => {
    if (!formData.aadharFront || !formData.aadharBack || !formData.panCard || !formData.mobile) {
      toast.error('Please upload all required documents and provide a mobile number!');
      return;
    }
  
    // Check file sizes (minimum 300KB)
    const files = [
      { file: formData.aadharFront, name: 'aadharFront' },
      { file: formData.aadharBack, name: 'aadharBack' },
      { file: formData.panCard, name: 'panCard' },
    ];
  
    for (const { file, name } of files) {
      if (file && file.size > 300 * 1024) { // File size less than 300KB
        toast.error(`${name} must be less than 300KB`);
        return;
      }
    }
  
    try {
      setIsSubmitting(true);
      setUploadProgress(0);
  
      // ✅ Check if mobile number already exists
      const mobileQuery = await firebase.firestore()
        .collection('Users')
        .where('mobileNumber', '==', formData.mobile)
        .get();
  
      if (!mobileQuery.empty) {
        toast.error('This mobile number is already registered. Please use a different number.');
        setIsSubmitting(false);
        return;
      }
  
      const storageRef = firebase.storage().ref();
  
      const uploadFile = async (file, fileName) => {
        const fileRef = storageRef.child(`documents/${fileName}`);
        const uploadTask = fileRef.put(file);
  
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(progress);
            },
            (error) => {
              toast.error(`Error uploading ${fileName}: ${error.message}`);
              reject(error);
            },
            async () => {
              const url = await fileRef.getDownloadURL();
              resolve(url);
            }
          );
        });
      };
  
      const [aadharFrontURL, aadharBackURL, panCardURL] = await Promise.all([
        uploadFile(formData.aadharFront, 'aadharFront.jpg'),
        uploadFile(formData.aadharBack, 'aadharBack.jpg'),
        uploadFile(formData.panCard, 'panCard.jpg'),
      ]);
  
      const user = firebase.auth().currentUser;
      if (user) {
        await firebase.firestore().collection('Users').doc(user.uid).update({
          mobileNumber: formData.mobile,
          documents: {
            aadharFront: aadharFrontURL,
            aadharBack: aadharBackURL,
            panCard: panCardURL,
          },
        });
  
        toast.success('Mobile number and documents uploaded successfully!');
        router.push('/login');
      } else {
        toast.error('No authenticated user found. Please log in again.');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };
  
  
  

  return (
    <div className="font-[sans-serif] bg-white md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-md:order-1 p-4 bg-gray-50 h-full">
          <img
            src="https://readymadeui.com/signin-image.webp"
            className="lg:max-w-[90%] w-full h-full object-contain block mx-auto"
            alt="login-image"
          />
        </div>

        <div className="flex items-center p-6 h-full w-full">
          <form className="max-w-lg w-full mx-auto" onSubmit={handleEmailSignup}>
            <h3 className="text-blue-500 md:text-3xl text-2xl font-extrabold text-center mb-6">
              Create an account
            </h3>

            {/* Google Signup */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 mb-6 text-sm font-semibold rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="inline mr-4" viewBox="0 0 512 512">
                  <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" data-original="#fbbd00" />
                  <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" data-original="#0f9d58" />
                  <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" data-original="#31aa52" />
                  <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" data-original="#3c79e6" />
                  <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" data-original="#cf2d48" />
                  <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z" data-original="#eb4132" />
                </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-gray-500 text-lg px-4">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Step 1 (Email and Password Signup) */}
            <CSSTransition in={step === 1} timeout={300} classNames="fade" unmountOnExit>
              <div className={`flex flex-col gap-4 ${step === 1 ? 'block' : 'hidden'}`}>
                <input
                  className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                {/* Terms and Conditions */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-600">
                    I accept the{' '}
                    <a href="#" className="text-blue-600">terms and conditions</a>.
                  </label>
                </div>
                <button
                  type="submit"
                  className={`w-full py-3 bg-blue-600 text-white rounded-md ${isSubmitting ? 'opacity-50' : ''}`}
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
              </div>
            </CSSTransition>

            {/* Step 2 (Document Upload) */}
      {/* Step 2 (Mobile Number & Document Upload) */}
      <CSSTransition in={step === 2} timeout={300} classNames="fade" unmountOnExit>
  <div className="flex flex-col gap-6 p-6 bg-white rounded-lg border border-gray-200">
    {/* Section Heading */}
    <h2 className="text-xl font-bold text-center text-blue-700 mb-4">
    Please provide your mobile number and upload the required documents for Verification.
    </h2>
   

    {/* Mobile Number */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
      <input
        className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        name="mobile"
        type="tel"
        placeholder="Enter Mobile Number"
        value={formData.mobile}
        onChange={handleChange}
        required
      />
    </div>

    {/* Aadhar Front Upload */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Front</label>
      <input
        className="w-full p-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        name="aadharFront"
        type="file"
        accept="image/*"
        onChange={handleChange}
        required
      />
    </div>

    {/* Aadhar Back Upload */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Back</label>
      <input
        className="w-full p-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        name="aadharBack"
        type="file"
        accept="image/*"
        onChange={handleChange}
        required
      />
    </div>

    {/* PAN Card Upload */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
      <input
        className="w-full p-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        name="panCard"
        type="file"
        accept="image/*"
        onChange={handleChange}
        required
      />
    </div>

    {/* Upload Progress Bar */}
    {uploadProgress > 0 && (
      <div className="w-full bg-gray-200 mb-2 rounded-full h-2.5 mt-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${uploadProgress}%` }}
        ></div>
        <p className="text-center text-sm mt-2 text-blue-700 font-medium">{uploadProgress}% Uploaded</p>
      </div>
    )}

    {/* Upload Button */}
    <button
      type="button"
      onClick={handleDocumentUpload}
      className={`w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition ${
        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Uploading...' : 'Submit Details'}
    </button>
  </div>
</CSSTransition>


          </form>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Register;
