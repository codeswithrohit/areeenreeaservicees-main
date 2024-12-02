/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect,Historyef, useRef } from 'react';
import { firebase } from '../../Firebase/config';
import { useRouter } from 'next/router';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavbar from "../../components/AdminNavbar";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const Coupan = () => {
  const router = useRouter(); // Access the router

 



  const [HistoryData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [formData, setFormData] = useState({
    code: '',
    price: '',
    expirydate: new Date(), // Default value for expirydate
  });
  const handleExpirydateChange = (date) => {
    setFormData({ ...formData, expirydate: date });
  };


  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
   
    if (name === "frontImage") {
      setFormData({ ...formData, [name]: files[0] });
    } 
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const db = firebase.firestore();
      const storage = firebase.storage();
      const expiryDateOnly = formData.expirydate.toISOString().split('T')[0];
      
  
      // Get the current date
      const currentDate = new Date().toISOString(); // Get the current date in ISO format
  
      // Include the current date in the data to upload
      const dataToUpload = { ...formData,  date: currentDate,date: currentDate,
        expirydate: expiryDateOnly,
   };
  
      await db.collection("Coupan").add(dataToUpload);
      toast.success("Data uploaded successfully!");
      router.reload();
    } catch (error) {
      console.error("Error uploading data: ", error);
      toast.error("Error uploading data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  




  // New state to manage pop-up visibility and selected History's data
  const [showPopup, setShowPopup] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [editedHistory, setEditedHistory] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
    
        const db = firebase.firestore();
        const HistorysRef = db.collection('Coupan');

        HistorysRef
          .get()
          .then((querySnapshot) => {
            const HistoryData = [];
            querySnapshot.forEach((doc) => {
              HistoryData.push({ ...doc.data(), id: doc.id });
            });

            

            setHistoryData(HistoryData);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error getting documents: ', error);
            setIsLoading(false);
          });
      
    });

    return () => unsubscribe();
  }, [router]);

 console.log(HistoryData)

  // Function to handle showing E details
  const handleEditDetails = (History) => {
    setSelectedHistory(History);
    setEditedHistory({ ...History });
    setShowPopup(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedHistory((prevHistory) => ({
      ...prevHistory,
      [name]: value,
    }));
  };
 

  

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editedHistory) {
        const db = firebase.firestore();
        const HistoryRef = db.collection('Coupan').doc(editedHistory.id);
        await HistoryRef.update({
          code: editedHistory.code,
          price: editedHistory.price,
        });
        setShowPopup(false);
        setEditedHistory(null);
        toast.success('Changes saved successfully!', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        router.reload();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('An error occurred while saving changes.', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
      });
    }
  };

  // Function to handle closing the pop-up
  const handleClosePopup = () => {
    setSelectedHistory(null);
    setShowPopup(false);
  };



  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = HistoryData.slice(startIndex, endIndex);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(HistoryData.length / itemsPerPage);

  const handleDelete = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection('Coupan').doc(id).delete();
      const updatedData = HistoryData.filter((item) => item.id !== id);
      setHistoryData(updatedData);
      toast.success('Deletion successful!', {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Deletion failed. Please try again.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };




  return (
    <div className="m-auto min-h-screen bg-white dark:bg-gray-900">

<AdminNavbar/>
      <section className="bg-white lg:ml-64  dark:bg-gray-900">
      <h1 className="text-xl font-bold text-center mt-4 text-red-600" >Add Coupan</h1>
        <div className="container px-6 py-10 mx-auto">
         
        { showAllInputFormats ? (
<div>
<form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
 
 
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
      <input
        type="text"
        name="code"
        placeholder="Enter Coupan code"
        onChange={handleInputChanges}
        required
        className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div>
      <input
        type="text"
        name="price"
        placeholder="Enter percentage number for offer"
        onChange={handleInputChanges}
        required
        className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    
  </div>
  <div className="flex items-center mb-4">
  <label className="mr-4 text-gray-600">Expiry Date:</label>
  <div className="relative">
    <DatePicker
      selected={formData.expirydate}
      onChange={handleExpirydateChange}
      dateFormat="dd/MM/yyyy"
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      // Other DatePicker props can be added as needed
    />
    <span className="absolute top-0 right-3 flex items-center h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
        />
      </svg>
    </span>
  </div>
</div>

  {/* Add similar grid layouts for the remaining input fields */}
  {/* ... */}
  <div className="flex items-center justify-center mt-4">
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
    <button onClick={handleCloseAllInputFormats}
  className="bg-red-500 hover:bg-red-700 ml-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
    Close Form
  </button>
  </div>
</form>

</div>
) : (
// Display the add PG Detail button when isEditing is false and showAllInputFormats is false
<button onClick={handleShowAllInputFormats} className="w-full p-2 bg-blue-500 text-white rounded-md">
  Add Coupan Details
</button>
)}
         

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
  {isLoading ? (
    <h1>Loading</h1>
  ) : (
    HistoryData.map((History, idx) => (
      <div key={idx} className="max-w-sm rounded overflow-hidden shadow-lg m-4">
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{History.code}</div>
                    <h5 className='font-bold' >Exipre at {History.expirydate}</h5>
                    <div className="flex justify-between mt-4">
                      <button  onClick={() => handleDelete(History.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none">
                        Delete
                      </button>
                      {/* You can add an edit functionality or price to an edit page */}
                      {/* <price href={`/edit/${History.id}`}> */}
                      {/*   <a className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none">Edit</a> */}
                      {/* </price> */}
                      <button  onClick={() => handleEditDetails(History)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>







          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {/* Back Button */}
              <button
                onClick={() => handlePaginationClick(currentPage - 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === 1 ? 'bg-red-400 cursor-not-allowed' : ''
                }`}
                disabled={currentPage === 1}
              >
                <FiChevronLeft className="inline-block mr-1" /> Previous
              </button>

              {/* Page Buttons */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePaginationClick(index + 1)}
                  className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                    currentPage === index + 1 ? 'bg-red-400' : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePaginationClick(currentPage + 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === totalPages ? 'bg-red-400 cursor-not-allowed' : ''
                }`}
                disabled={currentPage === totalPages}
              >
                Next <FiChevronRight className="inline-block ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>







      {/* Render pop-up if showPopup is true */}
      {showPopup && selectedHistory && (
        <div className="fixed lg:ml-64  overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg mt-80">
         

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-black">
                   code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={editedHistory.code}
                    onChange={(e) => setEditedHistory({ ...editedHistory, code: e.target.value })}
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-black">
                   price
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={editedHistory.price}
                    onChange={(e) => setEditedHistory({ ...editedHistory, price: e.target.value })}
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              
                {/* Add more fields here for editing */}
              </div>
              
            
              
              
              <div className="mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-300 rounded-md mr-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-md"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}




<ToastContainer />


    </div>
  );
};

export default Coupan;
