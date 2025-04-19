import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';

function Room2DView() {
  const {
    roomConfig,
    setRoomConfig
  } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentRoomConfig = roomConfig || location.state?.roomConfig;
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempColor, setTempColor] = useState('#ffffff');
  const [editingRoom, setEditingRoom] = useState(false);
  const nodeRef = useRef(null);

  if (!currentRoomConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No room configuration found</h2>
          <button 
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => navigate('/room')}
          >
            Back to Designer
          </button>
        </div>
      </div>
    );
  }

  const handleItemClick = (index) => {
    if (editMode) {
      setSelectedItem(index);
      setEditingRoom(false);
      setTempColor(currentRoomConfig.furniture[index].color);
    }
  };

  const handleRoomClick = () => {
    if (editMode) {
      setSelectedItem(null);
      setEditingRoom(true);
      setTempColor(currentRoomConfig.color);
    }
  };

  const updateColor = () => {
    if (editingRoom) {
      setRoomConfig({
        ...currentRoomConfig,
        color: tempColor
      });
    } else if (selectedItem !== null) {
      const updatedFurniture = [...currentRoomConfig.furniture];
      updatedFurniture[selectedItem] = {
        ...updatedFurniture[selectedItem],
        color: tempColor
      };
      
      setRoomConfig({
        ...currentRoomConfig,
        furniture: updatedFurniture
      });
    }
    setSelectedItem(null);
    setEditingRoom(false);
  };

  const renderRoomShape = () => {
    const width = currentRoomConfig.width * 40;
    const height = currentRoomConfig.height * 40;
    const color = currentRoomConfig.color;
  
    if (currentRoomConfig.shape === 'rectangle') {
      return (
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: color }}
          onClick={handleRoomClick}
        />
      );
    } else {
      // L-Shaped Room that fills the entire container
      return (
        <div className="absolute inset-0" onClick={handleRoomClick}>
          {/* Vertical part of L (full height) */}
          <div 
            className="absolute"
            style={{
              width: `${width/2}px`, // Half the width
              height: `${height}px`, // Full height
              backgroundColor: color,
              left: 0,
              top: 0
            }}
          />
          {/* Horizontal part of L (full width) */}
          <div 
            className="absolute"
            style={{
              width: `${width*2}px`, // Full width
              height: `${height/2}px`, // Half the height
              backgroundColor: color,
              left: 0,
              bottom: 0 // Changed from top: 0 to bottom: 0
            }}
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">{currentRoomConfig.name}</h1>
                <p className="text-blue-100">
                  {currentRoomConfig.width}m × {currentRoomConfig.height}m • {currentRoomConfig.furniture.length} items
                </p>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0">
                <button 
                  className={`px-4 py-2 rounded-md ${editMode ? 'bg-blue-800 text-white' : 'bg-white text-blue-600'} hover:bg-blue-700 hover:text-white transition-colors`}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Done Editing' : 'Edit Colors'}
                </button>
                <button 
                  className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => navigate('/room')}
                >
                  Back to Designer
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* 2D Room Visualization */}
            <div className="flex justify-center mb-8">
              <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                <div
                  style={{
                    width: `${currentRoomConfig.width * 40}px`,
                    height: `${currentRoomConfig.height * 40}px`,
                    minWidth: '300px',
                    minHeight: '300px'
                  }}
                >
                  {renderRoomShape()}
                  
                  {currentRoomConfig.furniture.map((item, index) => (
                    <Draggable 
                      key={index} 
                      bounds="parent" 
                      nodeRef={nodeRef}
                      defaultPosition={{
                        x: index * 50 % (currentRoomConfig.width * 40 - item.width * 40),
                        y: Math.floor(index / 3) * 50 % (currentRoomConfig.height * 40 - item.height * 40)
                      }}
                    >
                      <div
                        ref={nodeRef}
                        className={`absolute flex items-center justify-center text-white font-bold cursor-move transition-all
                          ${selectedItem === index ? 'ring-4 ring-indigo-500 z-10' : ''}`}
                        style={{
                          width: `${item.width * 40}px`,
                          height: `${item.height * 40}px`,
                          backgroundColor: item.color,
                          borderRadius: item.shape === 'round' ? '50%' : '4px',
                        }}
                        onClick={() => handleItemClick(index)}
                      >
                        {editMode && (
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <span className="text-xs bg-black bg-opacity-50 px-1 rounded">{item.type}</span>
                          </div>
                        )}
                      </div>
                    </Draggable>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Picker for Edit Mode */}
            {(editMode && (selectedItem !== null || editingRoom)) && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-xl border border-gray-300 z-20">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={tempColor} 
                      onChange={(e) => setTempColor(e.target.value)}
                      className="w-12 h-12 cursor-pointer rounded-lg border border-gray-300"
                    />
                    <span className="text-gray-700">
                      {editingRoom ? 'Room' : currentRoomConfig.furniture[selectedItem]?.type}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-full border border-gray-300 hover:ring-2 hover:ring-blue-500 transition-all"
                        style={{ backgroundColor: color }}
                        onClick={() => setTempColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full flex justify-end gap-3 mt-4">
                  <button
                    className="px-4 py-2 w-full bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    onClick={() => {
                      setSelectedItem(null);
                      setEditingRoom(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 w-full bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={updateColor}
                  >
                    Apply
                  </button>
                </div>
                
                {/* <p className="text-sm mt-2 text-center text-gray-600">
                  {editingRoom ? 'Editing Room Color' : `Editing ${currentRoomConfig.furniture[selectedItem]?.type}`}
                </p> */}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                className="flex-grow bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg font-semibold transition-colors"
                onClick={() => navigate('/room/3d-view', { state: { roomConfig: currentRoomConfig } })}
              >
                View in 3D
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room2DView;