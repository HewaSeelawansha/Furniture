import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../utils/authSwal';
import { useFetchAllReservationsQuery, useUpdateReservationStatusMutation } from '../../redux/features/reservations/reservationApi';

const ManageReservations = () => {
    const navigate = useNavigate();
    const { data: reservations = [], isLoading, isError } = useFetchAllReservationsQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateReservationStatusMutation();
    const [selectedStatus, setSelectedStatus] = React.useState({});

    const handleStatusChange = (reservationId, status) => {
        setSelectedStatus(prev => ({ ...prev, [reservationId]: status }));
    };

    const handleStatusUpdate = async (reservationId) => {
        const status = selectedStatus[reservationId];
        if (!status) {
            handleError('Please select a status');
            return;
        }

        try {
            await updateStatus({ id: reservationId, status }).unwrap();
            handleSuccess('Reservation status updated successfully!');
        } catch (error) {
            console.error(error);
            handleError('Failed to update reservation status');
        }
    };

    const handleMakePayment = (reservationId) => {
        navigate(`/make-payment/${reservationId}`);
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading reservations...</div>;
    if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error loading reservation data</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Reservation Management</h1>
                    <p className="mt-2 text-lg text-gray-600">View and manage all reservations</p>
                </div>

                {/* Single Column Layout */}
                <div className="space-y-6">
                    {reservations.map((reservation) => (
                        <div key={reservation._id} className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
                            {/* Reservation Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            Reservation #{reservation._id.slice(-6).toUpperCase()}
                                        </h2>
                                        <p className="text-blue-100">{reservation.customerName} • NIC: {reservation.nic}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                        reservation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content - Two Column Layout Inside */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column - Details */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Address</h3>
                                        <p className="text-gray-900">{reservation.address}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Furniture Items</h3>
                                        <div className="space-y-2">
                                            {reservation.furnitureItems.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center py-1">
                                                    <span className="text-gray-900 font-medium">
                                                        {item.itemId.title} × {item.quantity}
                                                    </span>
                                                    <span className="text-blue-600 font-semibold">
                                                        ${(item.itemId.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Column - Payment Status */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">Status:</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    reservation.payment > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {reservation.payment > 0 ? 'Paid' : 'Not Paid'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">Paid:</span>
                                                <span className={`font-semibold ${
                                                    reservation.payment > 0 ? 'text-green-600' : 'text-gray-500'
                                                }`}>
                                                    ${reservation.payment.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">Total:</span>
                                                <span className="font-semibold text-gray-900">
                                                    ${reservation.totalPrice.toFixed(2)}
                                                </span>
                                            </div>
                                            {reservation.payment > 0 && (
                                                <div className="pt-2 border-t">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-gray-700">Balance:</span>
                                                        <span className={`font-semibold ${
                                                            (reservation.totalPrice - reservation.payment) > 0 
                                                                ? 'text-orange-600' 
                                                                : 'text-green-600'
                                                        }`}>
                                                            ${(reservation.totalPrice - reservation.payment).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Actions */}
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-blue-800 mb-2">Update Status</h3>
                                        <div className="">
                                            <select
                                                value={selectedStatus[reservation._id] || reservation.status}
                                                onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                                                className="w-full flex-1 mb-2 py-2 px-3 rounded-lg border border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            <button
                                                onClick={() => handleStatusUpdate(reservation._id)}
                                                disabled={isUpdating}
                                                className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleMakePayment(reservation._id)}
                                        disabled={reservation.payment >= reservation.totalPrice}
                                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                                            reservation.payment >= reservation.totalPrice 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    >
                                        {reservation.payment > 0 ? (
                                            <span className="flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                {reservation.payment >= reservation.totalPrice ? 'Fully Paid' : 'Pay Remaining'}
                                            </span>
                                        ) : (
                                            `Process Payment ($${reservation.totalPrice.toFixed(2)})`
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {reservations.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <h3 className="text-xl font-medium text-gray-500">No reservations found</h3>
                            <p className="mt-2 text-gray-400">All reservations will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageReservations;