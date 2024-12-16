import Aboutus from '../components/AreneChef/Aboutus'
import HeroSection from '../components/AreneChef/HeroSection'
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import MenuSection from '../components/AreneChef/MenuSection'
import OfferSection from '../components/AreneChef/OfferSection'
import Testimonial from '../components/AreneChef/Testimonial'
import DownloadApp from '../components/AreneChef/DownloadApp'

const AreneChef = () => {
  
    const [loading, setLoading] = useState(true);
    const [fetchedData, setFetchedData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Replace 'yourCollectionName' with the actual collection name
          const collectionRef = firebase.firestore().collection('Cloud Kitchen');
    
          // Get all documents from the collection
          const querySnapshot = await collectionRef.get();
    
          // Extract the data from the documents along with document IDs
          const data = querySnapshot.docs.map((doc) => {
            const userData = doc.data();
            return {
              id: doc.id, // Add document ID to the data
              ...userData,
              distance: null, // Initially set distance as null
            };
          });
    
          // Set the fetched data to the state
          setFetchedData(data);
    
          setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false); // Set loading to false in case of error
        }
      };
    
      fetchData(); // Call the function to fetch data
    }, []);
  return (
    <div>
        <HeroSection/>
        <Aboutus/>
        <MenuSection fetchData={fetchedData} />
        <OfferSection/>
        {/* <Testimonial/> */}
        <DownloadApp/>
    </div>
  )
}

export default AreneChef