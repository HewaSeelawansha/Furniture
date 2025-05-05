import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { handleSuccess } from '../../utils/authSwal';

const FURNITURE_MODELS = {
  Chair: '/models/chair.glb',
  Table: '/models/table.glb',
  Sofa: '/models/sofa.glb',
  Bed: '/models/bed.glb',
  Cabinet: '/models/cabinet.glb'
};

const FURNITURE_TYPES = Object.keys(FURNITURE_MODELS);

function RoomDesigner() { 
  const {
    roomConfig,
    setRoomConfig,
    saveDesign,
    savedDesigns = [],
    loadDesign,
    deleteDesign
  } = useOutletContext();

  const navigate = useNavigate();
  const [newFurniture, setNewFurniture] = useState({ 
    type: 'Chair', 
    width: 1, 
    height: 1, 
    color: '#000000', 
    shape: 'rectangle',
    model: FURNITURE_MODELS.Chair
  });
  
  const addFurniture = () => {
    if (newFurniture.width > 0 && newFurniture.height > 0) {
      const furnitureItem = {
        ...newFurniture,
        model: FURNITURE_MODELS[newFurniture.type] || FURNITURE_MODELS.Chair
      };
      
      setRoomConfig({
        ...roomConfig,
        furniture: [...roomConfig.furniture, furnitureItem]
      });
      
      setNewFurniture({ 
        type: 'Chair', 
        width: 1, 
        height: 1, 
        color: '#000000', 
        shape: 'rectangle',
        model: FURNITURE_MODELS.Chair
      });
    }
  };
  
  const removeFurniture = (index) => {
    const updatedFurniture = [...roomConfig.furniture];
    updatedFurniture.splice(index, 1);
    setRoomConfig({
      ...roomConfig,
      furniture: updatedFurniture
    });
  };
  
  const handleVisualize = () => {
    saveDesign(roomConfig);
    navigate('/room/2d-view');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Room Designer</h1>
            <p className="text-blue-100">Create and customize your perfect room layout</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <select 
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    loadDesign(savedDesigns.find(d => d.createdAt === e.target.value));
                  }
                }}
              >
                <option value="">Load Saved Design...</option>
                {savedDesigns.map((design) => (
                  <option key={design.createdAt} value={design.createdAt}>
                    {design.name} ({formatDate(design.createdAt)})
                  </option>
                ))}
              </select>
              
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                onClick={() => {
                    deleteDesign(roomConfig.createdAt);
                }}
                disabled={!savedDesigns.some(d => d.createdAt === roomConfig.createdAt)}
              >
                Delete Design
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Room Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={roomConfig.name}
                    onChange={(e) => setRoomConfig({
                      ...roomConfig,
                      name: e.target.value
                    })}
                    placeholder="My Room Design"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                      value={roomConfig.color}
                      onChange={(e) => setRoomConfig({
                        ...roomConfig,
                        color: e.target.value
                      })}
                    />
                    <span className="text-sm text-gray-600">{roomConfig.color}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (meters)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={roomConfig.width}
                    onChange={(e) => setRoomConfig({
                      ...roomConfig,
                      width: Math.max(1, Math.min(20, parseFloat(e.target.value) || 1))
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (meters)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={roomConfig.height}
                    onChange={(e) => setRoomConfig({
                      ...roomConfig,
                      height: Math.max(1, Math.min(20, parseFloat(e.target.value) || 1))
                    })}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Shape</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={roomConfig.shape}
                  onChange={(e) => setRoomConfig({
                    ...roomConfig,
                    shape: e.target.value
                  })}
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="l-shaped">L-Shaped</option>
                </select>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Furniture</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={newFurniture.type}
                    onChange={(e) => setNewFurniture({
                      ...newFurniture,
                      type: e.target.value,
                      model: FURNITURE_MODELS[e.target.value] || FURNITURE_MODELS.Chair
                    })}
                  >
                    {FURNITURE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (m)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={newFurniture.width}
                    onChange={(e) => setNewFurniture({
                      ...newFurniture,
                      width: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (m)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={newFurniture.height}
                    onChange={(e) => setNewFurniture({
                      ...newFurniture,
                      height: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="color"
                    className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                    value={newFurniture.color}
                    onChange={(e) => setNewFurniture({
                      ...newFurniture,
                      color: e.target.value
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={newFurniture.shape}
                    onChange={(e) => setNewFurniture({
                      ...newFurniture,
                      shape: e.target.value.toLowerCase()
                    })}
                  >
                    <option>Rectangle</option>
                    <option>Round</option>
                  </select>
                </div>
              </div>
              
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                onClick={addFurniture}
                disabled={!newFurniture.width || !newFurniture.height}
              >
                Add Furniture
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Current Furniture ({roomConfig.furniture.length})
              </h2>
              
              {roomConfig.furniture.length === 0 ? (
                <p className="text-gray-500 italic">No furniture added yet</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                  {roomConfig.furniture.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg text-white flex items-center justify-between shadow"
                      style={{ backgroundColor: item.color }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-sm border-2 border-white"
                          style={{
                            borderRadius: item.shape === 'round' ? '50%' : '4px',
                            backgroundColor: item.color
                          }}
                        />
                        <div>
                          <span className="font-bold">{item.type}</span>
                          <span className="text-xs block opacity-80">{item.width}m × {item.height}m</span>
                        </div>
                      </div>
                      <button
                        className="ml-2 text-white hover:text-red-200 transition text-xl font-bold"
                        onClick={() => removeFurniture(index)}
                        aria-label="Remove furniture"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-grow bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-lg font-semibold"
                onClick={() => saveDesign(roomConfig)}
              >
                Save Design
              </button>
              <button
                className="flex-grow bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg font-semibold disabled:opacity-50"
                onClick={handleVisualize}
                disabled={!roomConfig.furniture.length}
              >
                Visualize in 2D
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDesigner;