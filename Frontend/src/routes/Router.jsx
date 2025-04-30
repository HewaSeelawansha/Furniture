import {createBrowserRouter} from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import PrivateRoute from "./PrivateRoute";
import App from "../App";
import UserGuide from "../components/UserGuide";
import RoomDesigner from "../pages/designRoom/RoomDesigner";
import Room2DView from "../pages/designRoom/Room2DView";
import Room3DView from "../pages/designRoom/Room3DView";
import Furniture from "../pages/furniture/Furniture";
import AddFurniture from "../pages/furniture/AddFurniture";
import SingleFurniture from "../pages/furniture/SingleFurniture";
import Reservation from "../pages/furniture/Reservation";
import ManageReservations from "../pages/furniture/ManageReservations";
import PaymentGateway from "../pages/payments/PaymentGateway";


const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoute><App/></PrivateRoute>,
        children: [
            {
                path: '',
                element: <UserGuide/>
              },
              {
                path: "room",
                element: <RoomDesigner />,
              },
              {
                path: "room/2d-view",
                element: <Room2DView />,
              },
              {
                path: "room/3d-view",
                element: <Room3DView />,
              },
              {
                path: "furniture",
                element: <Furniture />
              },
              {
                path: "add-furniture",
                element: <AddFurniture/>
              },
              {
                path: "furniture/:id",
                element: <SingleFurniture/>
              },
              {
                path: "reservation",
                element: <Reservation/>
              },
              {
                path: "reservations",
                element: <ManageReservations/>
              },
              {
                path: "make-payment/:id", 
                element: <PaymentGateway/>
              },
        ]
    },
    {
        path: "login",
        element: <Login/>,
    },
    {
        path: "signup",
        element: <Register/>,
    }
]);

export default router;