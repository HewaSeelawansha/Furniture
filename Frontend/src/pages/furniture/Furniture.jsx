import React from 'react';
import { useFetchAllFurnituresQuery } from '../../redux/features/furnitures/furnituresApi';
import { useNavigate } from 'react-router-dom';

const Furniture = () => {
  const navigate = useNavigate();
  const { data: furnitures = [], isLoading, isError } = useFetchAllFurnituresQuery();

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error loading furniture</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Furniture Collection</h1>
          <p className="mt-2 text-lg text-gray-600">Discover our premium selection of furniture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {furnitures.map((item) => (
            <div 
              key={item._id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={item?.Image || 'https://i.ibb.co/tPJnyqL1/btmn.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{item.title}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    ${item.price}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </span>
                  <button
                    onClick={() => navigate(`/furniture/${item._id}`)}
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {furnitures.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-500">No furniture available at the moment</h3>
            <p className="mt-2 text-gray-400">Please check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Furniture;