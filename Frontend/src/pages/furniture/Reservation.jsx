import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { handleError, handleSuccess } from '../../utils/authSwal'; 
import { useForm } from 'react-hook-form';
import { useFetchAllFurnituresQuery } from '../../redux/features/furnitures/furnituresApi';
import { useAddReservationMutation } from '../../redux/features/reservations/reservationApi';

const Reservation = () => {
    const navigate = useNavigate();
    const [selectedFurniture, setSelectedFurniture] = useState({});
    const { data: furnitures = [], isLoading, isError } = useFetchAllFurnituresQuery();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [addReservation, { isLoading: isAdding }] = useAddReservationMutation();
    const user = useSelector((state) => state.auth.user);

    const handleIncrement = (id) => {
        setSelectedFurniture(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };
      
    const handleDecrement = (id) => {
        setSelectedFurniture(prev => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0)
        }));
    };
    
    const onSubmit = async (data) => {
        try {
            const address = `${data.houseNumber}, ${data.street}, ${data.state}, ${data.zipcode}`;
            
            const furnitureItems = Object.entries(selectedFurniture)
                .filter(([_, quantity]) => quantity > 0)
                .map(([itemId, quantity]) => ({ itemId, quantity }));
            
            if (furnitureItems.length === 0) {
                handleError('Please select at least one furniture item');
                return;
            }

            const totalQuantity = Object.values(selectedFurniture).reduce((sum, qty) => sum + qty, 0);
            const totalPrice = Object.entries(selectedFurniture)
                .filter(([_, qty]) => qty > 0)
                .reduce((sum, [id, qty]) => {
                    const item = furnitures.find(f => f._id === id);
                    return sum + (item ? item.price * qty : 0);
                }, 0);
            
            const reservationData = { 
                customerName: data.name,
                address,
                nic: data.nic,
                furnitureItems,
                totalQuantity,
                totalPrice,
                status: 'pending'
            };

            await addReservation(reservationData).unwrap();
            handleSuccess('Reservation created successfully!');
            navigate('/reservations');
        } catch (error) {
            console.error('Reservation error:', error);
            handleError(
                'Failed to create reservation', 
                error.data?.message || error.message || 'Please try again later'
            );
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading furniture...</div>;
    if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error loading furniture data</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Make a New Reservation</h1>
                        <p className="text-indigo-100">Fill in the details below to make a new reservation</p>
                    </div>
        
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Customer Name
                            </label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                id="name"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter the customer's name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>
        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="houseNumber" className="block text-sm text-gray-600 mb-1">
                                        House / No.
                                    </label>
                                    <input
                                        {...register("houseNumber", { required: "House number is required" })}
                                        id="houseNumber"
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g. 221B"
                                    />
                                    {errors.houseNumber && (
                                        <p className="mt-1 text-sm text-red-600">{errors.houseNumber.message}</p>
                                    )}
                                </div>
        
                                <div>
                                    <label htmlFor="street" className="block text-sm text-gray-600 mb-1">
                                        Street
                                    </label>
                                    <input
                                        {...register("street", { required: "Street is required" })}
                                        id="street"
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g. Vauxhall Street"
                                    />
                                    {errors.street && (
                                        <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
                                    )}
                                </div>
        
                                <div>
                                    <label htmlFor="state" className="block text-sm text-gray-600 mb-1">
                                        State
                                    </label>
                                    <input
                                        {...register("state", { required: "State is required" })}
                                        id="state"
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g. Colombo"
                                    />
                                    {errors.state && (
                                        <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                                    )}
                                </div>
        
                                <div>
                                    <label htmlFor="zipcode" className="block text-sm text-gray-600 mb-1">
                                        Zip Code
                                    </label>
                                    <input
                                        {...register("zipcode", { required: "Zip code is required" })}
                                        id="zipcode"
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g. 20222"
                                    />
                                    {errors.zipcode && (
                                        <p className="mt-1 text-sm text-red-600">{errors.zipcode.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
        
                        <div>
                            <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-1">
                                NIC
                            </label>
                            <input
                                {...register("nic", { required: "NIC is required" })}
                                id="nic"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter the customer's NIC number"
                            />
                            {errors.nic && (
                                <p className="mt-1 text-sm text-red-600">{errors.nic.message}</p>
                            )}
                        </div>
        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Furniture
                            </label>
                            
                            <div className="relative">
                                <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                                    {furnitures.map((item) => (
                                        <div 
                                            key={item._id} 
                                            className="flex-shrink-0 w-64 bg-white rounded-lg border border-gray-200 shadow-sm p-4"
                                        >
                                            <div className="h-32 mb-3 overflow-hidden rounded-md">
                                                <img
                                                    src={item?.Image || 'https://i.ibb.co/tPJnyqL1/btmn.jpg'}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                                                <span className="text-sm font-semibold text-blue-600">${item.price}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDecrement(item._id)}
                                                        disabled={!selectedFurniture[item._id] || selectedFurniture[item._id] <= 0}
                                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 disabled:opacity-50"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm w-6 text-center">
                                                        {selectedFurniture[item._id] || 0}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleIncrement(item._id)}
                                                        disabled={item.stock <= (selectedFurniture[item._id] || 0)}
                                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 disabled:opacity-50"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
            
                            {Object.keys(selectedFurniture).filter(id => selectedFurniture[id] > 0).length > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Items:</h4>
                                    <ul className="space-y-1">
                                        {Object.entries(selectedFurniture)
                                            .filter(([_, quantity]) => quantity > 0)
                                            .map(([id, quantity]) => {
                                                const item = furnitures.find(f => f._id === id);
                                                return item ? (
                                                    <li key={id} className="flex justify-between text-sm">
                                                        <span>{item.title} × {quantity}</span>
                                                        <span>${(item.price * quantity).toFixed(2)}</span>
                                                    </li>
                                                ) : null;
                                            })}
                                    </ul>
                                </div>
                            )}
                        </div>
        
                        <div className="flex flex-col space-y-4 pt-4">
                            <div className="flex justify-between items-center">
                                <div className="text-2xl font-semibold text-gray-800">
                                    Total Quantity: <span className="text-blue-600">
                                        {Object.values(selectedFurniture).reduce((sum, qty) => sum + qty, 0)}
                                    </span>
                                </div>
                                <div className="text-2xl font-semibold text-gray-800">
                                    Total Price: <span className="text-green-600">
                                        ${Object.entries(selectedFurniture)
                                            .filter(([_, qty]) => qty > 0)
                                            .reduce((sum, [id, qty]) => {
                                                const item = furnitures.find(f => f._id === id);
                                                return sum + (item ? item.price * qty : 0);
                                            }, 0)
                                            .toFixed(2)}
                                    </span>
                                </div>
                            </div>
        
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/furniture')}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAdding || Object.keys(selectedFurniture).filter(id => selectedFurniture[id] > 0).length === 0}
                                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        isAdding ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isAdding ? 'Processing...' : 'Make Reservation'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Reservation;