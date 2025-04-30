import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaCalendarAlt, FaCheck, FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';
import { useProcessPaymentMutation } from '../../redux/features/payments/paymentApi';
import { useFetchReservationByIdQuery } from '../../redux/features/reservations/reservationApi';
import { handleError, handleSuccess } from '../../utils/authSwal';

const PaymentGateway = () => {
  const { id: reservationId } = useParams();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const { data: reservation, isLoading } = useFetchReservationByIdQuery(reservationId);
  const [processPayment] = useProcessPaymentMutation();

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s+/g, '');
    if (value.length <= 16) {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiry(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.length < 12) {
        handleError('Please enter a valid card number');
        return;
      }
      if (!expiry || expiry.length < 5) {
        handleError('Please enter a valid expiry date');
        return;
      }
      if (!cvc || cvc.length < 3) {
        handleError('Please enter a valid CVC');
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      const paymentData = {
        reservationId,
        paymentMethod,
        ...(paymentMethod === 'card' && { cardLastFour: cardNumber.slice(-4) })
      };

      const result = await processPayment(paymentData).unwrap();
      
      setPaymentSuccess(true);
      handleSuccess(paymentMethod === 'card' 
        ? 'Payment processed successfully!' 
        : 'Reservation confirmed! Pay with cash at the location.');
    } catch (error) {
      console.error('Payment error:', error);
      handleError(error.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading reservation details...</div>;

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {paymentMethod === 'card' ? 'Payment Successful!' : 'Reservation Confirmed!'}
          </h2>
          <p className="text-gray-600 mb-4">Reservation #{reservationId.slice(-6).toUpperCase()}</p>
          <p className="text-lg font-bold text-green-600 mb-6">${reservation?.totalPrice.toFixed(2)}</p>
          {paymentMethod === 'cash' && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
              <h3 className="font-bold text-blue-800 mb-2">Cash Payment Instructions</h3>
              <p className="text-sm text-gray-700">
                Please bring exact cash amount to the location at your scheduled time.
              </p>
            </div>
          )}
          <button
            onClick={() => navigate('/reservations')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Back to Reservations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md">
        <div className="bg-blue-600 px-6 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 text-white hover:text-gray-200"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Payment for Reservation #{reservationId.slice(-6).toUpperCase()}</h1>
            <p className="text-indigo-100">${reservation?.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center px-4 py-2 border rounded-md ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <FaCreditCard className="mr-2" />
                Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center px-4 py-2 border rounded-md ${
                  paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <FaMoneyBillWave className="mr-2" />
                Cash
              </button>
            </div>
          </div>

          {paymentMethod === 'card' ? (
            <>
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCreditCard className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="cardNumber"
                    value={formatCardNumber(cardNumber)}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    maxLength={19}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Enter any 12-16 digit number for this prototype</p>
              </div>

              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="expiry"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      maxLength={5}
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Any future date accepted</p>
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="cvc"
                      value={cvc}
                      onChange={(e) => {
                        if (e.target.value.length <= 3) {
                          setCvc(e.target.value.replace(/\D/g, ''));
                        }
                      }}
                      placeholder="123"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-600 mb-2">Pay with Cash</h3>
              <p className="text-sm text-gray-700">
                You'll pay ${reservation?.totalPrice.toFixed(2)} in cash when you arrive at the location.
                Please bring exact amount.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing || !reservation}
            className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${
              paymentMethod === 'cash' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              paymentMethod === 'cash' ? 'focus:ring-green-500' : 'focus:ring-blue-500'
            } ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : paymentMethod === 'cash' ? (
              `Confirm Reservation (Pay $${reservation?.totalPrice.toFixed(2) || '0.00'})`
            ) : (
              `Pay $${reservation?.totalPrice.toFixed(2) || '0.00'}`
            )}
          </button>

          {paymentMethod === 'card' && (
            <div className="flex items-center justify-center text-xs text-gray-500">
              <FaLock className="mr-1" />
              <span>Your payment is secured with 256-bit encryption</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentGateway;