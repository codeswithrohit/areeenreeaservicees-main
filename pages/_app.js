import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {firebase } from '../Firebase/config'
import PreLoader from "../src/components/PreLoader";
import "../styles/globals.css";
import Header1 from "../src/layouts/headers/Header1";
import Navbar from "../components/Navbar";
import Footer from "../src/layouts/Footer";
import MobileMenu from "../src/layouts/MobileMenu";
import 'tailwindcss/tailwind.css'; 
import Hometab from "../components/Hometab";

const MyApp = ({ Component, pageProps }) => {
 
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const fetchedUserData = userDoc.data();
        setUserData(fetchedUserData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

// console.log("userData")
  

  const showHeaderFooterMobileMenu = !router.pathname.includes('/Admin') && !router.pathname.includes('/Agent') && !router.pathname.includes('/AreneChefVendor') && !router.pathname.includes('/ArenelaundryVendor') && !router.pathname.includes('/PostProperty') && !router.pathname.includes('/Deliveryboy');


  return (
    <Fragment>
      <Head>
        <title>Arene Services | Real Estate | Property in India | Buy/Sell | Rent Properties</title>
        <link
          rel="shortcut icon"
          href="assets/images/favicon.ico"
          type="image/png"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600&family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {showHeaderFooterMobileMenu && (
        <Fragment>
          {/* <MobileMenu /> */}
          <Navbar/>
          {/* <Header1 /> */}
         
        </Fragment>
      )}
      
      <Component userData={userData}  {...pageProps} />
      {showHeaderFooterMobileMenu && (
        <Fragment>
          <Footer />
        </Fragment>
      )}
    </Fragment>
  );
};
export default MyApp;
