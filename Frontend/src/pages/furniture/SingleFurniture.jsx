import React from 'react';
import { useFetchFurnitureByIdQuery } from '../../redux/features/furnitures/furnituresApi';
import { useNavigate, useParams } from 'react-router-dom';

const SingleFurniture = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: furniture, isLoading, isError } = useFetchFurnitureByIdQuery(id);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error loading furniture</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Product Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{furniture?.title}</h1>
            <p className="mt-2 text-lg text-gray-600">{furniture?.description}</p>
          </div>

          {/* Product Content */}
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2 p-6">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                <img 
                  src={furniture?.Image || 'https://i.ibb.co/tPJnyqL1/btmn.jpg'} 
                  alt={furniture?.title} 
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6 flex flex-col">
              {/* Price and Stock */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900">${furniture?.price}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${furniture?.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {furniture?.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <p className="mt-2 text-gray-500">{furniture?.stock} units available</p>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Added:</span> {new Date(furniture?.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Last Updated:</span> {new Date(furniture?.updatedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button className="flex-1 bg-blue-600 py-3 px-8 border border-transparent rounded-md text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => navigate('/reservation')}
                  >
                    Reserve
                  </button>
                  <button className="flex-1 bg-white py-3 px-8 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => navigate('/furniture')}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600">{furniture?.description || 'No detailed description available for this product.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleFurniture;