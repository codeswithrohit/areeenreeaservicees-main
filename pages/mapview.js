import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
    const [bookingData, setBookingData] = useState(null);
    const [address, setAddress] = useState(null);
    const [deliveryboylocation, setDeliveryboylocation] = useState({ latitude: null, longitude: null, address: '' });
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const router = useRouter();
    const { orderId } = router.query;
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const directionsServiceRef = useRef(null);
    const directionsRendererRef = useRef(null);
    const deliveryMarkerRef = useRef(null);
    const addressMarkerRef = useRef(null);

    const calculateAndDisplayRoute = (map, origin, destination) => {
        if (!directionsServiceRef.current) {
            directionsServiceRef.current = new window.google.maps.DirectionsService();
        }
        if (!directionsRendererRef.current) {
            directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: true,
            });
        }

        directionsServiceRef.current.route(
            {
                origin: origin,
                destination: destination,
                travelMode: 'DRIVING',
            },
            (response, status) => {
                if (status === 'OK') {
                    directionsRendererRef.current.setDirections(response);

                    const route = response.routes[0];
                    const leg = route.legs[0];
                    setDistance(leg.distance.text);
                    setDuration(leg.duration.text);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            }
        );
    };

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const db = firebase.firestore();
                const bookingRef = db.collection('kitchenorder').where('orderId', '==', orderId);
                const snapshot = await bookingRef.get();

                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    setBookingData(data);
                    setAddress(data.address);
                    setDeliveryboylocation(data.deliveryboylocation);
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching booking details:', error);
                setLoading(false);
            }
        };

        if (orderId) {
            fetchBookingDetails();
        }
    }, [orderId]);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            if (!window.google) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAoNz2LqEAQJjrBYsVKDs6gHQpIulUslxk&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = initializeMap;
                document.head.appendChild(script);
            } else {
                initializeMap();
            }
        };

        const initializeMap = () => {
            if (deliveryboylocation && deliveryboylocation.latitude !== null && deliveryboylocation.longitude !== null) {
                const { latitude, longitude, address: deliveryAddress } = deliveryboylocation;

                const mapInstance = new window.google.maps.Map(mapRef.current, {
                    center: { lat: latitude, lng: longitude },
                    zoom: 12,
                });
                mapInstanceRef.current = mapInstance;

                deliveryMarkerRef.current = new window.google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: mapInstance,
                    title: deliveryAddress || "Delivery Boy Location",
                    icon: {
                        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 5,
                        strokeColor: 'green',
                        strokeWeight: 2,
                        fillColor: 'green',
                        fillOpacity: 1,
                    },
                });

                if (address) {
                    geocodeAddress(address, (geocodeResult) => {
                        if (geocodeResult) {
                            const { lat, lng } = geocodeResult.geometry.location;

                            addressMarkerRef.current = new window.google.maps.Marker({
                                position: { lat: lat(), lng: lng() },
                                map: mapInstance,
                                title: "Delivery Address",
                            });

                            calculateAndDisplayRoute(mapInstance, { lat: latitude, lng: longitude }, { lat: lat(), lng: lng() });
                        }
                    });
                }
            } else {
                console.error('Delivery location coordinates are not available.');
            }
        };

        const geocodeAddress = (address, callback) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK') {
                    callback(results[0]);
                } else {
                    console.error('Geocode was not successful for the following reason:', status);
                    callback(null);
                }
            });
        };

        if (orderId && deliveryboylocation && deliveryboylocation.latitude !== null && deliveryboylocation.longitude !== null) {
            loadGoogleMapsScript();
        }
    }, [address, deliveryboylocation, orderId]);

    useEffect(() => {
        if (orderId) {
            const db = firebase.firestore();
            const bookingRef = db.collection('kitchenorder').where('orderId', '==', orderId);
            
            const unsubscribe = bookingRef.onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    setDeliveryboylocation(data.deliveryboylocation);
                    
                    if (mapInstanceRef.current && deliveryMarkerRef.current) {
                        const { latitude, longitude } = data.deliveryboylocation;
                        deliveryMarkerRef.current.setPosition({ lat: latitude, lng: longitude });
                        mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });

                        if (addressMarkerRef.current) {
                            const addressPosition = addressMarkerRef.current.getPosition();
                            calculateAndDisplayRoute(mapInstanceRef.current, { lat: latitude, lng: longitude }, { lat: addressPosition.lat(), lng: addressPosition.lng() });
                        }
                    }
                });
            });

            return () => unsubscribe();
        }
    }, [orderId]);

    return (
        <div className='bg-white min-h-screen py-16' >
            <div ref={mapRef} style={{ height: '800px', width: '100%' }}></div>
            <div>
            {distance && duration && (
    <div className='fixed bottom-10 right-0 mt-4 mr-4 p-2 text-xs bg-white shadow-lg rounded-lg flex flex-col items-end space-y-1 font-bold text-green-600'>
        <p>Delivery Boy At: {deliveryboylocation.address}</p>
        <p>Distance: {distance}</p>
        <p>Estimated Delivery Time: {duration}</p>
    </div>
)}

            </div>
            <ToastContainer />
        </div>
    );
};

export default Test;
