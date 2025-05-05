import React from 'react';
import { FaPaintBrush, FaChair, FaCalendarCheck, FaPlusCircle, FaQuestionCircle } from 'react-icons/fa';
import ug1 from '/guides/ug1.png'
import ug2 from '/guides/ug2.png'
import ug3 from '/guides/ug3.png'
import ug4 from '/guides/ug4.png'
import ug5 from '/guides/ug5.png'
import ug6 from '/guides/ug6.png'

const UserGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <header className="mb-6 text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 flex items-center">
            <FaQuestionCircle className="mr-3 text-blue-600" />
            Designer's Guide
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know to manage your furniture designs
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Room Designer Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="h-[290px] bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center">
              <img 
                src={ug3} 
                alt="Room Designer Preview" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <FaPaintBrush className="text-2xl text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Room Designer</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Select room size, color, and shape (Rectangle/L-shaped)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Add furniture from dropdown with size/color options
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Visualize in 2D with color customization
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  View in immersive 3D with real-time color changes
                </li>
              </ul>
            </div>
          </div>

          {/* Furniture Gallery Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="h-[290px] bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
              <img 
                src={ug2}
                alt="Furniture Gallery Preview" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <FaChair className="text-2xl text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Furniture Gallery</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Browse all available furniture pieces
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  View individual furniture details
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  See high-quality images with specifications
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Quick access to add to designs or reservations
                </li>
              </ul>
            </div>
          </div>

          {/* Reservations Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="h-[290px] bg-gradient-to-r from-green-400 to-teal-600 flex items-center justify-center">
              <img 
                src={ug1}
                alt="Reservations Preview" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <FaCalendarCheck className="text-2xl text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  View all reservations in detailed cards
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Update status (Pending/Confirmed/Completed/Cancelled)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Process payments (Credit Card or Cash)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Track payment status (Paid/Unpaid)
                </li>
              </ul>
            </div>
          </div>

          {/* Make Reservation Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="h-[290px] bg-gradient-to-r from-purple-400 to-pink-600 flex items-center justify-center">
              <img 
                src={ug5}
                alt="Make Reservation Preview" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <FaCalendarCheck className="text-2xl text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Make Reservation</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Enter customer details (Name, Address)
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Select furniture with quantity controls (+/-)
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Real-time price calculation
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Option to cancel or submit reservation
                </li>
              </ul>
            </div>
          </div>

          {/* PDF Export Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="h-[290px] bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center">
              <img 
                src={ug6}
                alt="Make Reservation Preview" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">3D Design Export</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  Download high-quality PDF of your 3D room design
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  Share with family or clients for approval
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  Includes room details and specifications
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  Professional layout with timestamps
                </li>
              </ul>
            </div>
          </div>

          {/* Add Furniture Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="h-[290px] bg-gradient-to-r from-red-400 to-yellow-500 flex items-center justify-center">
              <img 
                src={ug4} 
                alt="Add Furniture Preview" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <FaPlusCircle className="text-2xl text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Add Furniture</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Add new furniture to your catalog
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Upload images, set prices and quantities
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Include detailed descriptions
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Cancel or submit new furniture entries
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;