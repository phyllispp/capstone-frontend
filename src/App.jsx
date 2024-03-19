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
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { BASE_URL } from "./Components/Constant";
import { useAuth0 } from "@auth0/auth0-react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Navigate,
} from "react-router-dom";

function App() {
  const [userId, setUserId] = useState("");
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  const { data: accessToken } = useQuery({
    queryKey: ["accessToken"],
    queryFn: async () =>
      await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_APP_AUDIENCE },
      }),
    enabled: isAuthenticated,
  });

  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const fetcher = async (url) => (await axiosAuth.get(url)).data;
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetcher(`${BASE_URL}/user/${user?.email}`),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    setUserId(userData?.id);
  }, [userData?.id]);
  console.log(userData);

  console.log(isAuthenticated);

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
          <>
            <Home userId={userId} axiosAuth={axiosAuth} />
            <NavBar />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path: "/favorites",
      element: (
        <ProtectedRoute>
          <>
            <Favorites />
            <NavBar />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path: "/search",
      element: (
        <ProtectedRoute>
          <>
            <Search axiosAuth={axiosAuth} />
            <NavBar />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path: "/search/basket/:basketId",
      element: (
        <ProtectedRoute>
          <>
            <FoodDetail userId={userId} axiosAuth={axiosAuth} />
            <NavBar />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path: "/search/seller/:sellerId",
      element: (
        <ProtectedRoute>
          <>
            <SellerProfile userId={userId} axiosAuth={axiosAuth} />
            <NavBar />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path: "/cart",
      element: (
        <ProtectedRoute>
          <>
            <Cart userId={userId} axiosAuth={axiosAuth} />
            <NavBar />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path: "/order",
      element: (
        <ProtectedRoute>
          <>
            <OrderPlaced userId={userId} axiosAuth={axiosAuth} />
            <NavBar />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <>
            <Profile userId={userId} axiosAuth={axiosAuth} />
            <NavBar />
          </>
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
