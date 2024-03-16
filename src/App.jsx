import "./App.css";
import AuthPage from "./Components/AuthPage";
import Cart from "./Components/Cart";
import Favorites from "./Components/Favorites";
import FoodDetail from "./Components/FoodDetail";
import Home from "./Components/Home";
import OrderPlaced from "./Components/OrderPlaced";
import Profile from "./Components/Profile";
import Search from "./Components/Search";
import NavBar from "./Components/NavBar";
import SellerProfile from "./Components/SellerProfile";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

function App() {
  //will import isAuthenticated from auth0 later
  const isAuthenticated = true;

  //will have a userId once we have auth0
  const userId = 1;

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <AuthPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home userId={userId} />
          <NavBar />
        </ProtectedRoute>
      ),
    },
    {
      path: "/favorites",
      element: (
        <ProtectedRoute>
          <Favorites />
          <NavBar />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search",
      element: (
        <ProtectedRoute>
          <Search />
          <NavBar />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search/basket/:basketId",
      element: (
        <ProtectedRoute>
          <FoodDetail userId={userId} />
          <NavBar />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search/seller/:sellerId",
      element: (
        <ProtectedRoute>
          <SellerProfile />
          <NavBar />
        </ProtectedRoute>
      ),
    },
    {
      path: "/cart",
      element: (
        <ProtectedRoute>
          <Cart userId={userId} />
          <NavBar />
        </ProtectedRoute>
      ),
    },
    {
      path: "/order",
      element: (
        <ProtectedRoute>
          <OrderPlaced userId={userId} />
          <NavBar />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile userId={userId} />
          <NavBar />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
