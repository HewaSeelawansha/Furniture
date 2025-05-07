import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Environment } from "@react-three/drei";
import { useLocation, useNavigate } from "react-router-dom";
import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import * as THREE from 'three';
import jsPDF from 'jspdf';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Something went wrong</h2>
      <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
        <pre className="whitespace-pre-wrap text-sm">{error.message}</pre>
      </div>
      <button 
        onClick={resetErrorBoundary}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Try again
      </button>
    </div>
  );
}

function FurnitureModel({ modelPath, position, color, scale = 1 }) {
  const { scene } = useGLTF(modelPath);
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        const newMaterial = child.material.clone();
        newMaterial.color.set(color);
        child.material = newMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene, color]);

  return <primitive object={clonedScene} position={position} scale={[scale, scale, scale]} />;
}

function Room3D({ room, furniture = [], onBack }) {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showColorEditor, setShowColorEditor] = useState(false);
  const [tempColors, setTempColors] = useState({
    walls: room.color,
    furniture: furniture.reduce((acc, item, index) => {
      acc[index] = item.color;
      return acc;
    }, {})
  });
  const colorEditorRef = useRef(null);

  const FLOOR_COLOR = '#6b6b6b';

  const calculatePosition = (index) => {
    const legWidth = room.width / 2;
    const legHeight = room.height / 2;
    
    if (room.shape === 'rectangle') {
      const spacing = Math.max(room.width, room.height) * 0.8;
      const cols = Math.ceil(Math.sqrt(Math.max(1, furniture.length)));
      const x = (index % cols) * spacing / cols - spacing/2 + spacing/cols/2;
      const z = Math.floor(index / cols) * spacing / cols - spacing/2 + spacing/cols/2;
      return [x, 0, z];
    } else {
      const positions = [
        [-legWidth/2, 0, -legHeight/2],
        [-legWidth/2, 0, legHeight/4],
        [-legWidth/4, 0, -legHeight/2],
        [legWidth/2, 0, legHeight/4],
        [-legWidth/2, 0, legHeight/4],
        [-legWidth/2, 0, 0]
      ];
      return positions[index % positions.length];
    }
  };

  const createLShapeGeometry = () => {
    const shape = new THREE.Shape();
    const halfWidth = room.width / 2;
    const halfHeight = room.height / 2;
    
    shape.moveTo(-halfWidth, -halfHeight);
    shape.lineTo(halfWidth, -halfHeight);
    shape.lineTo(halfWidth, 0);
    shape.lineTo(0, 0);
    shape.lineTo(0, halfHeight);
    shape.lineTo(-halfWidth, halfHeight);
    shape.lineTo(-halfWidth, -halfHeight);
    
    return shape;
  };

  const handleFurnitureClick = (event, index) => {
    event.stopPropagation();
    setSelectedItem(index);
    setShowColorEditor(true);
  };

  const handleWallClick = (event) => {
    event.stopPropagation();
    setSelectedItem(null);
    setShowColorEditor(true);
  };

  const handleColorChange = (color, isWalls = false) => {
    if (isWalls) {
      setTempColors(prev => ({ ...prev, walls: color }));
    } else if (selectedItem !== null) {
      setTempColors(prev => ({
        ...prev,
        furniture: { ...prev.furniture, [selectedItem]: color }
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorEditorRef.current && !colorEditorRef.current.contains(event.target)) {
        setShowColorEditor(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas 
        shadows
        camera={{ position: [0, room.height * 1.5, room.width * 1.5], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
        <Environment preset="city" />

        {/* Room Floor */}
        <mesh 
          position={[0, -0.1, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          {room.shape === 'rectangle' ? (
            <planeGeometry args={[room.width, room.height]} />
          ) : (
            <shapeGeometry args={[createLShapeGeometry()]} />
          )}
          <meshStandardMaterial color={FLOOR_COLOR} />
        </mesh>

        {/* Room Walls */}
        {room.shape === 'rectangle' ? (
          <group>
            <mesh onClick={handleWallClick} position={[0, room.height/2, -room.height/2]} receiveShadow>
              <boxGeometry args={[room.width, room.height, 0.1]} />
              <meshStandardMaterial color={tempColors.walls} />
            </mesh>
            <mesh onClick={handleWallClick} position={[-room.width/2, room.height/2, 0]} receiveShadow>
              <boxGeometry args={[0.1, room.height, room.height]} />
              <meshStandardMaterial color={tempColors.walls} />
            </mesh>
            <mesh onClick={handleWallClick} position={[room.width/2, room.height/2, 0]} receiveShadow>
              <boxGeometry args={[0.1, room.height, room.height]} />
              <meshStandardMaterial color={tempColors.walls} />
            </mesh>
          </group>
        ) : (
          <group>
            <mesh onClick={handleWallClick} position={[-room.height/4, room.height/2, -room.height/2]} receiveShadow>
              <boxGeometry args={[room.width/2, room.height, 0.1]} />
              <meshStandardMaterial color={tempColors.walls} />
            </mesh>
            <mesh onClick={handleWallClick} position={[-room.width/2, room.height/2, 0]} receiveShadow>
              <boxGeometry args={[0.1, room.height, room.height]} />
              <meshStandardMaterial color={tempColors.walls} />
            </mesh>
            <mesh onClick={handleWallClick} position={[0, room.height/2, -room.height/4]} receiveShadow>
              <boxGeometry args={[0.1, room.height, room.height/2]} />
              <meshStandardMaterial color={tempColors.walls} />
            </mesh>
            <mesh onClick={handleWallClick} position={[room.width/2, room.height/2, room.height/4]} receiveShadow>
              <boxGeometry args={[0.1, room.height, room.height/2]} />
              <meshStandardMaterial color={tempColors.walls} />
            </mesh>
            <mesh onClick={handleWallClick} position={[room.height/4, room.height/2, 0]} receiveShadow>
              <boxGeometry args={[room.width/2, room.height, 0.1]} />
              <meshStandardMaterial color={tempColors.walls} />
            </mesh>
          </group>
        )}

        {/* Furniture */}
        <Suspense fallback={null}>
          {furniture.map((item, index) => (
            item?.model && (
              <group 
                key={index} 
                position={calculatePosition(index)}
                onClick={(e) => handleFurnitureClick(e, index)}
                userData={{ isFurniture: true }}
              >
                <FurnitureModel 
                  modelPath={item.model} 
                  color={tempColors.furniture[index] || item.color}
                  scale={Math.min(item.width, item.height, 1.5)}
                />
                {selectedItem === index && (
                  <Html center>
                    <div className="bg-white p-2 rounded shadow-lg text-black text-sm">
                      {item.type}
                    </div>
                  </Html>
                )}
              </group>
            )
          ))}
        </Suspense>
      </Canvas>

      {/* Color Editor Popup */}
      {showColorEditor && (
        <div 
          ref={colorEditorRef}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-xl border border-gray-300 z-50 animate-slide-up"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedItem === null ? tempColors.walls : tempColors.furniture[selectedItem]}
                onChange={(e) => handleColorChange(e.target.value, selectedItem === null)}
                className="w-12 h-12 cursor-pointer rounded border border-gray-300"
              />
              <span className="text-sm text-gray-700">
                {selectedItem === null ? 'Walls' : furniture[selectedItem]?.type}
              </span>
            </div>
            
            <div className="flex gap-2">
              {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-300 hover:ring-2 hover:ring-blue-500 transition-all"
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorChange(color, selectedItem === null);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 w-full bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setShowColorEditor(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
        <p className="text-gray-600 mb-3">Size: {room.width}m × {room.height}m | Shape: {room.shape}</p>
        <button 
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => onBack(room)}
        >
          Back to 2D
        </button>
      </div>
    </div>
  );
}

export default function Room3DView() {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [roomConfig, setRoomConfig] = useState(() => {
    const defaultConfig = { 
      width: 5, 
      height: 5, 
      color: "#3b82f6", 
      name: "Default Room",
      shape: "rectangle",
      furniture: [] 
    };
    return location.state?.roomConfig || defaultConfig;
  });

  useEffect(() => {
    roomConfig.furniture.forEach(item => {
      if (item.model) {
        useGLTF.preload(item.model);
      }
    });
  }, [roomConfig.furniture]);

  const handleBack = (updatedConfig) => {
    setRoomConfig(updatedConfig);
    navigate('/room/2d-view', { state: { roomConfig: updatedConfig } });
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const canvas = document.querySelector('canvas');
      
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm'
      });
      
      const imgWidth = 280; // A4 width
      const imgHeight = (tempCanvas.height / tempCanvas.width) * imgWidth;
      
      const now = new Date();
      const formattedDateTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/,/g, '').replace(/\//g, '-');
      
      const topMargin = 10;
      const titleFontSize = 18;
      const detailsFontSize = 12;
      const dateFontSize = 10;
      const lineSpacing = 5; 
      const bottomMargin = 15; 
      
      pdf.setFontSize(titleFontSize);
      pdf.setTextColor(0, 0, 0);
      pdf.text(roomConfig.name, pdf.internal.pageSize.getWidth() / 2, topMargin, { 
        align: 'center',
        baseline: 'top'
      });
      
      pdf.setFontSize(detailsFontSize);
      pdf.text(
        `Size: ${roomConfig.width}m × ${roomConfig.height}m | Shape: ${roomConfig.shape}`,
        pdf.internal.pageSize.getWidth() / 2,
        topMargin + titleFontSize / 2 + lineSpacing, 
        { align: 'center' }
      );
      
      const imageTopPosition = topMargin + titleFontSize / 2 + detailsFontSize / 2 + lineSpacing * 2;
      
      pdf.addImage(
        tempCanvas.toDataURL('image/png'), 
        'PNG', 
        10, 
        imageTopPosition,
        imgWidth, 
        imgHeight
      );
      
      pdf.setFontSize(dateFontSize);
      pdf.text(
        `Generated: ${formattedDateTime}`,
        pdf.internal.pageSize.getWidth() - 10,
        pdf.internal.pageSize.getHeight() - bottomMargin,
        { align: 'right' }
      );
      
      // Create filename with date-time
      const filename = `${roomConfig.name.replace(/\s+/g, '_')}_3d_view_${formattedDateTime.replace(/:/g, '-').replace(/\s/g, '_')}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">3D Room Visualization</h1>
              <p className="text-blue-100">Viewing: {roomConfig.name}</p>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>


          {/* Main Content */}
          <div className="p-6">
            <div className="w-full h-[800px] rounded-lg border border-gray-200 overflow-hidden">
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => navigate('/')}
              >
                <Room3D 
                  room={roomConfig} 
                  furniture={roomConfig.furniture || []} 
                  onBack={handleBack}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}