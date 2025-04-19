import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { MdDashboard, MdDashboardCustomize, MdOutlineLogout } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { TbCategoryPlus } from "react-icons/tb"
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutUserMutation } from './redux/features/users/usersApi';
import { logout } from './redux/features/auth/authSlice';
import { handleError, handleSuccess } from './utils/authSwal';
import { RiArmchairFill, RiDashboardHorizontalFill } from "react-icons/ri";
import { BiSolidAddToQueue } from "react-icons/bi";
import { FaPaintRoller, FaCartArrowDown } from "react-icons/fa";
import { MdOutlineViewList } from "react-icons/md";

const App = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [logoutDesigner] = useLogoutUserMutation();
    const dispatch = useDispatch();
    
    const handleLogOut = async () => {
        try {
            await logoutDesigner().unwrap();
            dispatch(logout());
            localStorage.removeItem("token");
            handleSuccess("Logout successfully!")
            navigate("/"); 
        } catch (error) {
            console.error("Logout failed:", error);
            handleError("Failed to logout!")
        }
    };

    const [roomConfigs, setRoomConfigs] = useState([]);
    const [currentRoomConfig, setCurrentRoomConfig] = useState({
        name: 'New Room Design',
        width: 5,
        height: 5,
        color: '#ffffff',
        shape: 'rectangle', 
        furniture: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    const saveDesign = (config) => {
        const existingIndex = roomConfigs.findIndex(rc => rc.createdAt === config.createdAt);
        if (existingIndex >= 0) {
            const updated = [...roomConfigs];
            updated[existingIndex] = {
                ...config,
                updatedAt: new Date().toISOString()
            };
            setRoomConfigs(updated);
        } else {
            setRoomConfigs([...roomConfigs, {
                ...config,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }]);
        }
        setCurrentRoomConfig(config);
    };

    const deleteDesign = (createdAt) => {
        setRoomConfigs(roomConfigs.filter(rc => rc.createdAt !== createdAt));
        if (currentRoomConfig.createdAt === createdAt) {
            setCurrentRoomConfig({
                name: 'New Room Design',
                width: 5,
                height: 5,
                color: '#ffffff',
                shape: 'rectangle',
                furniture: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            handleSuccess('Saved design deleted successfully!')
        }
    };

    useEffect(() => {
        document.body.style.paddingTop = '0px';
        return () => {
            document.body.style.paddingTop = '72px'; 
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Layout */}
            <div className="drawer lg:drawer-open">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                
                {/* Page Content */}
                <div className="drawer-content flex flex-col">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center justify-between bg-blue-600 p-4 text-white">
                        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
                            <RiDashboardHorizontalFill className="text-xl" />
                        </label>
                        <h1 className="text-xl font-bold">Cozy Corner</h1>
                        <div className="w-6"></div> {/* Spacer */}
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="flex-1 p-4 lg:p-6">
                        <Outlet context={{
                            roomConfig: currentRoomConfig,
                            setRoomConfig: setCurrentRoomConfig,
                            saveDesign,
                            savedDesigns: roomConfigs,
                            loadDesign: (config) => setCurrentRoomConfig(config),
                            deleteDesign
                        }} />
                    </div>
                </div>
                
                {/* Sidebar */}
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="bg-blue-300 menu w-80 min-h-full text-base-content shadow-xl">
                        {/* Sidebar Header */}
                        <div className="p-4 rounded-lg bg-blue-600 text-white">
                            <h1 className="text-3xl font-bold text-center">Cozy Corner</h1>
                            {/* <p className="text-blue-100 font-bold text-center mt-1">Hello!</p> */}
                        </div>
                        
                        {/* Navigation Links */}
                        <ul className="p-4 space-y-2">
                            <li>
                                <Link to="/" className="bg-blue-100 rounded-lg flex items-center gap-3 hover:bg-blue-50 rounded-lg p-3">
                                    <RiDashboardHorizontalFill className="text-blue-600 text-lg" />
                                    <span className="font-medium">Designer's Guide</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/room" className="bg-blue-100 rounded-lg flex items-center gap-3 hover:bg-blue-50 rounded-lg p-3">
                                    <FaPaintRoller className="text-blue-600 text-lg" />
                                    <span className="font-medium">Room Designer</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/furniture" className="bg-blue-100 rounded-lg flex items-center gap-3 hover:bg-blue-50 rounded-lg p-3">
                                    <RiArmchairFill className="text-blue-600 text-lg" />
                                    <span className="font-medium">Furniture Gallery</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/reservations" className="bg-blue-100 rounded-lg flex items-center gap-3 hover:bg-blue-50 rounded-lg p-3">
                                    <MdOutlineViewList className="text-blue-600 text-lg" />
                                    <span className="font-medium">Reservations</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/reservation" className="bg-blue-100 rounded-lg flex items-center gap-3 hover:bg-blue-50 rounded-lg p-3">
                                    <FaCartArrowDown className="text-blue-600 text-lg" />
                                    <span className="font-medium">Make a Reservations</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/add-furniture" className="bg-blue-100 rounded-lg flex items-center gap-3 hover:bg-blue-50 rounded-lg p-3">
                                    <BiSolidAddToQueue className="text-blue-600 text-lg" />
                                    <span className="font-medium">Add Furniture</span>
                                </Link>
                            </li>
                        </ul>
                        
                        {/* Bottom Section */}
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <button
                            onClick={handleLogOut}
                            className="w-full flex bg-rose-200 items-center justify-center gap-3 p-3 text-red-600 hover:bg-rose-100 rounded-lg transition-colors"
                          >
                            <MdOutlineLogout className="text-lg" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;