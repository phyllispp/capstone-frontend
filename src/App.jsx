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
  Navigate,
} from "react-router-dom";

function App() {
  const [userId, setUserId] = useState("");
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  let username;
  if (isAuthenticated && user) {
    username = user["https://localhost:5173/username"];
  }
  console.log(username);

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

  // const ProtectedRoute = ({ children }) => {
  //   return isAuthenticated ? children : <Navigate to="/login" />;
  // };
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <AuthPage />,
    },
    {
      path: "/",
      element: (
        <>
          <Home userId={userId} axiosAuth={axiosAuth} />
          <NavBar />
        </>
      ),
    },
    {
      path: "/favorites",
      element: (
        <>
          <Favorites />
          <NavBar />
        </>
      ),
    },
    {
      path: "/search",
      element: (
        <>
          <Search axiosAuth={axiosAuth} />
          <NavBar />
        </>
      ),
    },
    {
      path: "/search/basket/:basketId",
      element: (
        <>
          <FoodDetail userId={userId} axiosAuth={axiosAuth} />
          <NavBar />
        </>
      ),
    },
    {
      path: "/search/seller/:sellerId",
      element: (
        <>
          <SellerProfile userId={userId} axiosAuth={axiosAuth} />
          <NavBar />
        </>
      ),
    },
    {
      path: "/cart",
      element: (
        <>
          <Cart userId={userId} axiosAuth={axiosAuth} />
          <NavBar />
        </>
      ),
    },
    {
      path: "/order",
      element: (
        <>
          <OrderPlaced userId={userId} axiosAuth={axiosAuth} />
          <NavBar />
        </>
      ),
    },
    {
      path: "/profile",
      element: (
        <>
          <Profile userId={userId} axiosAuth={axiosAuth} />
          <NavBar />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
