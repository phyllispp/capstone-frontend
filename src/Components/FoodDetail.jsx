import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDate } from "./dateUtils";

export default function FoodDetail({ userId }) {
  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fetcher = async (url) => (await axios.get(url)).data;
  const [errorNotification, setErrorNotification] = useState({
    show: false,
    message: "",
  });

  const baskets = useQuery({
    queryKey: ["basket", `${BASE_URL}/category/${params.basketId}`],
    queryFn: () => fetcher(`${BASE_URL}/category/${params.basketId}`),
  });
  console.log("baskets", baskets, baskets.data);

  // add a basket to cart

  const postRequest = async (url, data) => await axios.post(url, data);
  const { mutate } = useMutation({
    mutationFn: (formData) => postRequest(`${BASE_URL}/cart`, formData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["cart", `${BASE_URL}/cart`],
      });
      queryClient.setQueryData(
        ["cartItems", `${BASE_URL}/cart/${res.data.buyer_id}`],
        res.data
      );
      navigate(`/cart`);
    },
    onError: () => {
      // Customize this message based on the error if needed
      setErrorNotification({
        show: true,
        message: "You can only add items from one seller to the cart at a time",
      });
    },
  });

  const handleAddToCart = () => {
    console.log(params.basketId);
    const formData = {
      buyerId: userId,
      basketId: Number(params.basketId),
      stock: 1,
    };
    mutate(formData);
  };

  return (
    <>
      <Link
        to="/search"
        className="absolute top-0 left-0 p-4 text-[#F59F50] font-medium"
      >
        &larr; Back
      </Link>
      {/* title */}
      <div className="text-2xl flex justify-center">
        <div>
          <p className="text-[#E55555] font-bold">Food</p>
        </div>
        <div>
          <p className="text-[#9EB97D] italic">Detail</p>
        </div>
      </div>
      <br />
      {/* error notification */}
      <div>
        {errorNotification.show && (
          <div
            role="alert"
            className="alert alert-error flex items-center bg-gray-100 border-gray-300 text-gray-800 p-4 rounded-lg shadow-md max-w-xs mx-auto my-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="text-sm">{errorNotification.message}</span>
          </div>
        )}
      </div>
      {/* food detail */}
      {baskets.data?.map((basket) => (
        <div key={basket.id} className="bg-[#EFEEDE] p-4 shadow rounded mb-4">
          <img
            src={basket.photo}
            alt={basket.title}
            className="object-cover h-48 w-96"
          />
          <div className="text-left">
            <p className="text-lg font-semibold my-2">{basket.title}</p>
            <div className="text-xs font-light my-1">
              <p>Pick-up start time: {formatDate(basket.pickupStartTime)}</p>
              <p>Pick-up end time: {formatDate(basket.pickupEndTime)}</p>
            </div>
            <div className="text-sm my-2">
              <p>Original price:</p>
              <p className="line-through">${basket.originalPrice}</p>
              <p>Discounted price:</p>
              <p>${basket.discountedPrice}</p>
            </div>
            <p className="font-semibold my-1">Product Description</p>
            <p className="text-sm">{basket.description}.</p>
            <p className="font-semibold my-1">Allergies</p>
            <p className="text-sm">{basket.allergens}</p>
            <p className="font-semibold my-1">Stock Available</p>
            <p className="text-sm">{basket.stock} left</p>
            <p className="font-semibold my-1">Weight per unit</p>
            <p className="text-sm">{basket.weightPerUnit}</p>
          </div>
          <button
            className="bg-[#F59F50] text-white py-2 px-4 rounded-full"
            onClick={handleAddToCart}
          >
            Place Order
          </button>
        </div>
      ))}
    </>
  );
}
