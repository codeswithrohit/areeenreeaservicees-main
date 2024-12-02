import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import AdminNavbar from '../../components/AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Propertyenquiry = () => {
  const [propeertenquiry, setPropertyEnq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amounts, setAmounts] = useState({}); // State to manage amounts for each entry

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('PropertyData')
      .orderBy('enquiryDate', 'desc')  // Ensure that documents are ordered by date
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPropertyEnq(data);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching property enquiries:', error);
          setLoading(false);
        }
      );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleCallbackChange = async (id, newStatus) => {
    try {
      await firebase.firestore().collection('PropertyData').doc(id).update({
        CallBack: newStatus,
      });
      toast.success('Callback status updated successfully');
    } catch (error) {
      console.error('Error updating callback status:', error);
      toast.error('Error updating callback status');
    }
  };

  const handleConfirmationChange = async (id, newStatus) => {
    try {
      if (newStatus === 'Done') {
        const amount = window.prompt("Enter the amount:"); // Prompt for amount
        if (amount) {
          // If the user enters an amount, update Firestore
          await firebase.firestore().collection('PropertyData').doc(id).update({
            confirmstatus: newStatus,
            amount: amount,
          });
          toast.success('Amount and confirmation status updated successfully');
          setAmounts((prev) => {
            const { [id]: _, ...rest } = prev; // Remove the amount field for that entry after update
            return rest;
          });
        } else {
          toast.error('Amount is required to set status as Done.');
        }
      } else {
        await firebase.firestore().collection('PropertyData').doc(id).update({
          confirmstatus: newStatus,
        });
        toast.success('Confirmation status updated successfully');
      }
    } catch (error) {
      console.error('Error updating confirmation status:', error);
      toast.error('Error updating confirmation status');
    }
  };

  const handleAmountChange = (id, value) => {
    setAmounts((prev) => ({ ...prev, [id]: value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="lg:ml-64 p-8">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="w-full bg-gray-200 text-gray-600">
                <th className="py-3 px-4 border-b border-gray-300 text-left">Name</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">Phone</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">Property Name</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">Property Location</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">Agent Id</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">Enquiry Date</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">Call Back</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">Confirmation Status</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {propeertenquiry.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-4 border-b text-black border-gray-300">{item.name}</td>
                  <td className="py-3 px-4 border-b text-black border-gray-300">{item.phone}</td>
                  <td className="py-3 px-4 border-b text-black border-gray-300">{item.propertyname}</td>
                  <td className="py-3 px-4 border-b text-black border-gray-300 text-xs">{item.propertylocation}</td>
                  <td className="py-3 px-4 border-b text-black border-gray-300">{item.AgentId}</td>
                  <td className="py-3 px-4 border-b text-black border-gray-300">{item.enquiryDate}</td>
                  <td className="py-3 px-4 border-b text-black border-gray-300">
                    <select
                      value={item.CallBack}
                      onChange={(e) => handleCallbackChange(item.id, e.target.value)}
                      className="p-2 border text-black border-gray-300 rounded"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <select
                      value={item.confirmstatus || 'Pending'}
                      onChange={(e) => handleConfirmationChange(item.id, e.target.value)}
                      className="p-2 border text-black border-gray-300 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                      <option value="Payment Done">Payment Done</option>
                      <option value="Cancel">Cancel</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 border-b text-black border-gray-300">
                    {item.confirmstatus === 'Done' && (
                      <div>{item.amount || 'N/A'}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Propertyenquiry;
