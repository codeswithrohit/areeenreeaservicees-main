import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { FaHome, FaClipboardList, FaUser } from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostPropertyNav = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const navigateTo = (path) => {
    if (userData && !userData.verified) {
      toast.error('Your account is currently under verification. Please allow up to 24 business hours for verification to complete');
      return;
    }
    router.push(`/PostProperty${path}`);
  };

  const navigate = (path) => {
    router.push(`/PostProperty${path}`);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid);
        fetchUserData(user);
      } else {
        setUser(null);
        setUserData(null);
        router.push('/PostProperty/Register');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    fetchUserData(user);
  }, [loading, user]);

  const fetchUserData = async (user) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'Users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserData(userData);
      } else {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [menuState, setMenuState] = useState(false);

  const navigation = [
    { title: "Sell Property", path: "/addbuydata" },
    { title: "Rent Property", path: "/addrent" },
    { title: "PG", path: "/addpg" },
    { title: "Hotel", path: "/addhotel" },
    { title: "Banquet Hall", path: "/addbanqueethall" },
    { title: "Resort", path: "/addresort" },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="fixed top-0 w-full z-30">
        <nav className="bg-white shadow-md border-b">
          <div className="flex items-center justify-between py-4 px-6 max-w-screen-xl mx-auto md:px-8">
            <a href="/">
              <img src="https://areneservices.in/icon.png" width={80} height={30} alt="logo" />
            </a>
            <button
              className="lg:hidden outline-none text-gray-400"
              onClick={() => setMenuState(!menuState)}
            >
              {menuState ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
            <ul className={`absolute z-20 bg-white w-full top-16 left-0 p-6 lg:static lg:flex lg:space-x-8 ${menuState ? '' : 'hidden'}`}>
              {navigation.map((item, idx) => (
                <li key={idx} className="text-gray-700 cursor-pointer hover:bg-blue-600 font-semibold hover:text-white hover:font-bold p-2 text-white bg-gray-800">
                  <a onClick={() => navigateTo(item.path)}>{item.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="fixed bottom-0 w-full bg-white shadow-md z-30">
        <ul className="flex justify-around items-center py-3">
          <li
            className={`flex flex-col items-center w-full text-sm font-medium cursor-pointer ${
              router.pathname === '/PostProperty' ? 'text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => navigate('')}
          >
            <FaHome className="w-6 h-6 mb-1" />
            Home
          </li>
          <li
            className={`flex flex-col items-center w-full text-sm font-medium cursor-pointer ${
              router.pathname.startsWith('/PostProperty/Orders') ? 'text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => navigate('/Orders')}
          >
            <FaClipboardList className="w-6 h-6 mb-1" />
            Orders
          </li>
          <li
            className={`flex flex-col items-center w-full text-sm font-medium cursor-pointer ${
              router.pathname.startsWith('/PostProperty/Profile') ? 'text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => navigate('/Profile')}
          >
            <FaUser className="w-6 h-6 mb-1" />
            Profile
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PostPropertyNav;
