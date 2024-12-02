import React, { useState, useEffect, useRef } from 'react';
import { firebase } from '../../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { getFirestore, doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { FaSpinner } from 'react-icons/fa'; 
import AgentNav from '../../components/AgentNav'
const placesLibrary = ['places'];
const Index = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
      const [userData, setUserData] = useState(null);
      const [selectedId, setSelectedId] = useState(null); 
      const [selectedBenefits, setSelectedBenefits] = useState([]);
      useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
            fetchUserData(user);
          } else {
            setUser(null);
            setUserData(null);
            router.push('/signin'); // Redirect to the login page if the user is not authenticated
          }
        });
    
        return () => unsubscribe();
      }, []);
    
      const fetchUserData = async (user) => {
        try {
          const db = getFirestore();
          const userDocRef = doc(db, 'Users', user.uid); // Update the path to the user document
          const userDocSnap = await getDoc(userDocRef);
    
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
              setUserData(userData);
           
          } else {
            router.push('/signin');
            // Handle case where user data doesn't exist in Firestore
            // You can create a new user profile or handle it based on your app's logic
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };
    

  const [isSubmitting, setIsSubmitting] = useState(false);
 
  


  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
    setSelectedId(null);
    setLocation(''); // Clear the location
    setFormData({
      description: '',
      nearby:'',
      district:'',
      Owner: '',
      category: 'Hotel',
      HotelName: '',
      Verified: 'false',
      roomTypes: [{ type: '', price: '', availability: '', images: [], videoSrc: null }],
    });
    setSelectedBenefits([]); // Clear selected benefits
  };


  const [Hoteldata, setHoteldata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    if (user) {
        const db = getFirestore();
        const HotelCollection = collection(db, 'Hoteldetail');
        const HotelQuery = query(HotelCollection, where('AgentId', '==', user.uid));

        // Real-time listener using onSnapshot
        const unsubscribe = onSnapshot(HotelQuery, (snapshot) => {
            const data = [];
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            setHoteldata(data);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching real-time data: ', error);
        });

        // Clean up the listener when component unmounts
        return () => unsubscribe();
    }
}, [user]);
  console.log("Hoteldata",Hoteldata)

  const [Location, setLocation] = useState('');
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);


  const [formData, setFormData] = useState({
    description: '',
    nearby:'',
    district:'',
    Owner: '',
    category: 'Hotel',
    HotelName: '',
    Verified: 'false',
    roomTypes: [{ type: '', price: '', availability: '', images: [], videoSrc: null }], 
    createdAt: new Date().toISOString(), // Add createdAt field with current date
  });
  const handleImageChange = (index, e) => {
    const files = e.target.files;
    const updatedRoomTypes = [...formData.roomTypes];

    if (!updatedRoomTypes[index]) updatedRoomTypes[index] = { images: [] };

    // Add new files and generate preview URLs
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const previewUrl = URL.createObjectURL(file);
            updatedRoomTypes[index].images.push({ file, previewUrl });
        });
    }

    setFormData({ ...formData, roomTypes: updatedRoomTypes });
};


const handleVideoChange = (index, e) => {
  const video = e.target.files[0];
  const updatedRoomTypes = [...formData.roomTypes];

  if (video) {
      const videoPreviewUrl = URL.createObjectURL(video);
      updatedRoomTypes[index].videoSrc = { file: video, videoPreviewUrl };
  }
  
  setFormData({ ...formData, roomTypes: updatedRoomTypes });
};





const handleRoomTypeChange = (index, event) => {
  const { name, value } = event.target;
  const updatedRoomTypes = [...formData.roomTypes];
  updatedRoomTypes[index] = {
      ...updatedRoomTypes[index],
      [name]: value,
      images: updatedRoomTypes[index].images || [] // Ensure images is always an array
  };
  setFormData({ ...formData, roomTypes: updatedRoomTypes });
};

const handleAddRoomType = () => {
  const updatedRoomTypes = [...formData.roomTypes, { type: '', price: '', availability: '', images: [], videoSrc: null }];
  setFormData({ ...formData, roomTypes: updatedRoomTypes });
};

const handleRemoveRoomType = (index) => {
  const updatedRoomTypes = formData.roomTypes.filter((_, i) => i !== index);
  setFormData({ ...formData, roomTypes: updatedRoomTypes });
};



const handleDeleteImage = (roomIndex, imgIndex) => {
  const updatedRoomTypes = [...formData.roomTypes];
  updatedRoomTypes[roomIndex].images.splice(imgIndex, 1); // Remove image by index
  setFormData({ ...formData, roomTypes: updatedRoomTypes });
};

const handleDeleteVideo = (roomIndex) => {
  const updatedRoomTypes = [...formData.roomTypes];
  updatedRoomTypes[roomIndex].videoSrc = null; // Clear video source
  setFormData({ ...formData, roomTypes: updatedRoomTypes });
};


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAoNz2LqEAQJjrBYsVKDs6gHQpIulUslxk',
    libraries: placesLibrary,
  });

  const autocompleteRef = useRef();

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const autocomplete = autocompleteRef.current;

    if (autocomplete && autocomplete.getPlace) {
      const place = autocomplete.getPlace();

      if (place && place.formatted_address) {
        setLocation(place.formatted_address); // Update to set the full formatted address
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleBenefitChange = (e) => {
    const { name } = e.target;
    setSelectedBenefits(prevState =>
      prevState.includes(name) ? prevState.filter(benefit => benefit !== name) : [...prevState, name]
    );
  };


  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      try {
          const storageRef = firebase.storage().ref();
          const updatedRoomTypes = [];
  
          for (let i = 0; i < formData.roomTypes.length; i++) {
              const roomType = { ...formData.roomTypes[i] };
  
              // Handle image upload
              const uploadedImageUrls = roomType.images.filter(img => typeof img === 'string');
              for (let j = 0; j < roomType.images.length; j++) {
                  const imageObj = roomType.images[j];
                  if (typeof imageObj !== 'string') {
                      const imageRef = storageRef.child(`roomImages/${imageObj.file.name}`);
                      const uploadTask = imageRef.put(imageObj.file);
  
                      // Monitor the image upload progress
                      uploadTask.on(
                          'state_changed',
                          (snapshot) => {
                              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                              setImageUploadProgress(progress);
                          },
                          (error) => {
                              console.error('Error uploading image: ', error);
                              toast.error('Image upload failed. Please try again.', { position: toast.POSITION.TOP_CENTER });
                          }
                      );
  
                      // Wait for the upload to complete
                      await uploadTask;
                      const downloadURL = await imageRef.getDownloadURL();
                      uploadedImageUrls.push(downloadURL);
                  }
              }
              roomType.images = uploadedImageUrls;
  
              // Handle video upload
              if (roomType.videoSrc && typeof roomType.videoSrc !== 'string') {
                  const videoRef = storageRef.child(`roomVideos/${roomType.videoSrc.file.name}`);
                  const videoUploadTask = videoRef.put(roomType.videoSrc.file);
  
                  // Monitor the video upload progress
                  videoUploadTask.on(
                      'state_changed',
                      (snapshot) => {
                          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                          setVideoUploadProgress(progress);
                      },
                      (error) => {
                          console.error('Error uploading video: ', error);
                          toast.error('Video upload failed. Please try again.', { position: toast.POSITION.TOP_CENTER });
                      }
                  );
  
                  // Wait for the upload to complete
                  await videoUploadTask;
                  roomType.videoSrc = await videoRef.getDownloadURL();
              }
  
              updatedRoomTypes.push(roomType);
          }
  
          const dataWithMedia = {
              ...formData,
              roomTypes: updatedRoomTypes,
              AgentId: user.uid,
              Verified: formData.Verified === 'true' ? 'true' : 'false', 
              location: Location,
              benefits: selectedBenefits,
          };
  
          const db = firebase.firestore();
          if (selectedId) {
              await db.collection('Hoteldetail').doc(selectedId).update(dataWithMedia);
              toast.success('Update successful!', { position: toast.POSITION.TOP_CENTER });
          } else {
              await db.collection('Hoteldetail').add(dataWithMedia);
              toast.success('Submission successful!', { position: toast.POSITION.TOP_CENTER });
          }
  
          setShowAllInputFormats(false);
          setFormData({
              description: '',
              nearby:'',
              district:'',
              Owner: '',
              category: 'Hotel',
              HotelName: '',
              Verified: 'false',
              roomTypes: [{ type: '', price: '', availability: '', images: [], videoSrc: null }],
          });
          setSelectedId(null);
      } catch (error) {
          console.error('Error adding/updating document: ', error);
          toast.error('Submission failed. Please try again.', { position: toast.POSITION.TOP_CENTER });
      } finally {
          setIsSubmitting(false);
          // Optionally reset progress after submission
          setImageUploadProgress(0);
          setVideoUploadProgress(0);
      }
  };
  






  const handleEdit = (data) => {
    setFormData({
      description: data.description || '', 
      nearby: data.nearby || '',
      district: data.district || '',
      Owner: data.Owner || '', 
      category: data.category || 'Hotel', 
      HotelName: data.HotelName || '', 
      Verified: data.Verified || 'false', 
      roomTypes: data.roomTypes.map(roomType => ({
          ...roomType,
          videoSrc: roomType.videoSrc || null
      })) || [{ type: '', price: '', availability: '', images: [], videoSrc: null }],
    });
    setSelectedBenefits(data.benefits || []); 
    setLocation(data.location || ''); // Ensure location is correctly set for editing
    setSelectedId(data.id);
    setShowAllInputFormats(true);
  };




  const handleDelete = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection('Hoteldetail').doc(id).delete();
      const updatedData = Hoteldata.filter((item) => item.id !== id);
      setHoteldata(updatedData);
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
    <div className='bg-white'>
       <AgentNav/>
       <div className="mt-24">
    {isLoading ? ( // Display loading message while isLoading is true
        <div className="flex justify-center items-center h-screen">
            <button
                type="button"
                className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]"
            >
                Loading
                <FaSpinner className="ml-2 animate-spin inline" size={18} /> {/* Using FaSpinner from React Icons */}
            </button>
        </div>
    ) : (
        <div className="text-center p-8 bg-white dark:bg-white">
            {showAllInputFormats ? (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div className="bg-white w-full  p-8 rounded-lg shadow-lg overflow-auto max-h-full">
                 <div className='flex justify-end' >
                 <button onClick={handleCloseAllInputFormats} className="w-36 p-2 mb-2 bg-red-500 text-white rounded-md">
                       Close
                     </button>
                     </div>
                     <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-4">
                     {isSubmitting && (
                            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-200">
                                <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Image Upload Progress</label>
                                        <div className="w-full bg-gray-200 rounded">
                                            <div className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full" style={{ width: `${imageUploadProgress}%` }}>
                                                {imageUploadProgress.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Video Upload Progress</label>
                                        <div className="w-full bg-gray-200 rounded">
                                            <div className="bg-green-500 text-xs font-medium text-green-100 text-center p-0.5 leading-none rounded-l-full" style={{ width: `${videoUploadProgress}%` }}>
                                                {videoUploadProgress.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
              
           
           <div className="flex w-full gap-4"> 
          
                          
                   <div className="w-1/2">
                   <input
                     type="text"
                     name="HotelName"
                     value={formData.HotelName}
                     onChange={handleChange}
                     placeholder="Hotel Name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                   />
                   </div>
                  </div> 
           
                  <div className="flex w-full gap-4"> 
                  <div className="w-1/2">
                   <input
                     type="text"
                     name="Owner"
                     value={formData.Owner}
                     onChange={handleChange}
                     placeholder="Hotel Owner Name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                   />
                 
           </div>
           <div className="w-1/2">{/* Ensure the parent container spans the full width */}
             <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
               <input
                 name="Location"
                 type="Location"
                 value={Location}
                 onChange={(e) => setLocation(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded-md"
                 style={{ width: '100%' }} 
                 placeholder="Enter Your location"
               />
             </Autocomplete>
           </div>
           </div>

           <div className="flex w-full gap-4"> 
           <div className="w-1/2">
           <input
                     type="text"
                     name="nearby"
                     value={formData.nearby}
                     onChange={handleChange}
                     placeholder="Nearby area"
                    className="w-full p-2 border border-gray-300 rounded-md"
                   />
                           </div>
                          
                   <div className="w-1/2">
                   <input
                     type="text"
                     name="district"
                     value={formData.district}
                     onChange={handleChange}
                     placeholder="District Name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                   />
                   </div>
                  </div> 
           
           <div className="w-full">
             <textarea
               name="description"
               value={formData.description}
               onChange={handleChange}
               placeholder="Description"
               className="w-full p-2 border border-gray-300 rounded-md"
               rows="4" // This attribute controls the number of visible text lines for the textarea
             ></textarea>
             <h2 class="text-md font-bold  text-gray-900">Select Benifits</h2>
           <div className="  grid grid-cols-1 lg:grid-cols-4 gap-4">
             {['Food', 'Laundry', 'Parking', 'WiFi', '24/7 Security', 'Aquaguard'].map((benefit) => (
               <div key={benefit} className="relative flex w-60 items-center rounded bg-gray-50 py-2 px-4 pl-14 font-medium text-gray-700">
                 <input 
                   id={benefit} 
                   className="peer hidden" 
                   type="checkbox"
                   name={benefit}
                   checked={selectedBenefits.includes(benefit)}
                   onChange={handleBenefitChange} 
                 />
                 <label className="absolute left-0 top-0 h-full w-full cursor-pointer rounded border peer-checked:border-blue-600 peer-checked:bg-blue-100" htmlFor={benefit}></label>
                 <div className="absolute left-4 h-3 w-3 rounded border-2 border-gray-300 bg-gray-200 ring-blue-600 ring-offset-2 peer-checked:border-transparent peer-checked:bg-blue-600 peer-checked:ring-2"></div>
                 <span className="pointer-events-none z-10 ml-4">{benefit}</span>
               </div>
             ))}
           </div>
           </div>
           
           
           
           
           
           
           {Array.isArray(formData.roomTypes) && formData.roomTypes.map((roomType, index) => (
  <div key={index} className="flex flex-col md:flex-row justify-center gap-4 w-full border p-4 rounded-lg shadow-lg bg-white">
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-2">Room  {index + 1}</h3>
      
      {/* Grid layout for input fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1">Room Type</label>
          <select
            name="type"
            value={roomType.type}
            onChange={(e) => handleRoomTypeChange(index, e)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Type</option>
  <option value="Single Room">Single Room</option>
  <option value="Double Sharing Room">Double Sharing Room</option>
  <option value="Triple Sharing Room">Triple Sharing Room</option>
  <option value="Single Ac Room">Single Ac Room</option>
  <option value="Double Sharing Ac Room">Double Sharing Ac Room</option>
  <option value="Triple Sharing Ac Room">Triple Sharing Ac Room</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div>
          <label className="block mb-1">Availability</label>
          <input
            type="number"
            name="availability"
            value={roomType.availability}
            onChange={(e) => handleRoomTypeChange(index, e)}
            placeholder="Availability"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Price/Month</label>
        <input
          type="number"
          name="price"
          value={roomType.price}
          onChange={(e) => handleRoomTypeChange(index, e)}
          placeholder="Enter Price/Month"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* File upload sections */}
      <div>
    <label>Upload Images</label>
    <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleImageChange(index, e)}
    />
  <div className="image-previews flex flex-wrap gap-4">
  {roomType.images && roomType.images.length > 0 && roomType.images.map((img, imgIndex) => (
        <div key={imgIndex} className="flex flex-col items-center">
            {typeof img === 'string' ? (
                <img src={img} alt="Uploaded Image" className="w-36 h-36" />
            ) : (
                <img src={img.previewUrl} alt="Image Preview" className="w-36 h-36" />
            )}
            <button
                onClick={() => handleDeleteImage(index, imgIndex)}
                className="mt-2 bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600 transition"
            >
                Delete
            </button>
        </div>
    ))}
</div>

</div>

<div>
    <label>Upload Video</label>
    <input
        type="file"
        accept="video/*"
        onChange={(e) => handleVideoChange(index, e)}
    />
    {roomType.videoSrc && (
        <div className="video-container">
            <video width="200" height="200" controls>
                <source
                    src={
                        typeof roomType.videoSrc === 'string'
                            ? roomType.videoSrc
                            : roomType.videoSrc.videoPreviewUrl
                    }
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
            <button
                onClick={() => handleDeleteVideo(index)}
                className="mt-2 bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600 transition"
            >
                Delete Video
            </button>
        </div>
    )}
</div>
<button
                        type="button"
                        onClick={() => handleRemoveRoomType(index)}
                        className="w-36 p-2 mt-2 mb-2 bg-red-500 text-white rounded-md"
                      >
                        Remove Room 
                      </button>
    </div>
  </div>
))}




                   <button type="button" onClick={handleAddRoomType} className="w-full p-2 bg-blue-500 text-white rounded-md">
                     Add Room 
                   </button>
                   <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md" disabled={isSubmitting}>
                     {isSubmitting ? 'Submitting...' : 'Submit'}
                   </button>
                 </form>
               </div>
               </div>
            ) : (
                // Display the add Hotel Detail button when showAllInputFormats is false
                <div className="flex justify-end">
                    <button onClick={handleShowAllInputFormats} className="w-36 font-bold p-2 bg-blue-500 text-white rounded-md">
                        <span className="text-2xl font-bold">+</span> Add Hotel Detail
                    </button>
                </div>
            )}
         <div className="grid px-8 mb-20 mt-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Hoteldata.length === 0 ? (
        <div className="flex justify-center items-center">
            <p className="text-2xl text-gray-600">No Data</p>
        </div>
    ) : (
        Hoteldata.map((item) => (
            <div key={item.id} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-800 shadow-md hover:shadow-lg rounded-md">
                <div className="flex-none lg:flex-col">
                <a href={`/Hoteldetail?id=${item.id}`}>
                        {item.roomTypes && item.roomTypes.length > 0 && item.roomTypes[0].images && item.roomTypes[0].images.length > 0 ? (
                            <div className="h-full w-full lg:h-64 lg:w-full rounded-md lg:mb-0 mb-3">
                                <img src={item.roomTypes[0].images[0]} alt={`Room type image`} className="w-full h-64 object-cover rounded-md" />
                            </div>
                        ) : (
                            <div className="h-full w-full lg:h-64 lg:w-full rounded-md lg:mb-0 mb-3 bg-gray-300 flex items-center justify-center">
                                <p className="text-gray-500">No Image Available</p>
                            </div>
                        )}
                    </a>
                    <div className="flex-auto mt-4 px-6 lg:ml-3 justify-evenly py-2">
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between min-w-0">
                                <h2 className="mr-auto text-blue-600 text-base capitalize font-medium truncate">{item.HotelName}</h2>
                            </div>
                            <p className="text-primary text-sm mt-2 font-semibold">
                                {item.Verified === 'true' ? 'Verified' : 'Verification Under Process'}
                            </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <button onClick={() => handleEdit(item)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))
    )}
</div>

            <ToastContainer />
        </div>
    )}
</div>
    </div>
  );
};

export default Index;
