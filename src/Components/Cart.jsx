import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDate } from "./dateUtils";

export default function Cart({ userId }) {
  const fetcher = async (url) => (await axios.get(url)).data;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // retrieve item in cart
  const cartItems = useQuery({
    queryKey: ["cartItems"],
    queryFn: () => fetcher(`${BASE_URL}/cart/${userId}`),
  });
  console.log(cartItems.data);

  // calculate price
  const totalPrice =
    cartItems?.data?.reduce((total, item) => {
      return total + item.basket.discountedPrice * item.stock;
    }, 0) || 0;
  console.log(totalPrice);

  // delete a food item from cart
  const putRequest = async (url, data) => await axios.put(url, data);
  const { mutate: deleteBasket } = useMutation({
    mutationFn: (basketId) => putRequest(`${BASE_URL}/cart/delete/${basketId}`),
    onSuccess: (data, basketId) => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      queryClient.setQueryData(["cartItems"], (oldQueryData) => {
        return oldQueryData.data.filter((basket) => basket.id !== basketId);
      });
    },
  });

  const handleDelete = (basketId) => {
    deleteBasket(basketId);
  };

  // post request for stripe payment
  const postRequest = async (url, data) => await axios.post(url, data);
  const { mutate: pay } = useMutation({
    mutationFn: () =>
      postRequest(`${BASE_URL}/pay`, {
        totalPrice: totalPrice,
        buyerId: userId,
      }),
    onSuccess: (res) => (window.location = res.data.url),
  });

  return (
    <>
      {/* title */}
      <div className="text-2xl flex justify-center">
        <div>
          <p className="text-[#E55555] font-bold">Food</p>
        </div>
        <div>
          <p className="text-[#9EB97D] italic">Cart</p>
        </div>
      </div>
      <br />
      {cartItems.data && cartItems.data.length > 0 ? (
        <div className="bg-[#EFEEDE] p-4 shadow rounded mb-4">
          {cartItems.data.map((item) => (
            <div key={item.basket.id}>
              <img
                src={item.basket.photo}
                alt={item.basket.title}
                className="object-cover h-48 w-96 my-5"
              />
              <p className="text-sm my-2">
                Current item in your cart: {item.basket.title}
              </p>
              <p className="text-sm my-2">Your total would be: ${totalPrice}</p>
              <div className="text-xs font-light my-2">
                <p>
                  Pick-up start time: {formatDate(item.basket.pickupStartTime)}
                </p>
                <p>Pick-up end time: {formatDate(item.basket.pickupEndTime)}</p>
              </div>
              <div className="flex justify-evenly my-5">
                <button
                  className="bg-[#E55555] text-white py-2 px-4 rounded-full"
                  onClick={() => handleDelete(item.basket.id)}
                >
                  Remove
                </button>
                <button
                  className="bg-[#F59F50] text-white py-2 px-4 rounded-full"
                  onClick={() => pay()}
                >
                  Checkout
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-[#AEAEAE] font-bold my-10">
            Your cart is currently empty
          </p>
          <img
            src="empty-cart.png"
            alt="empty-cart"
            className="object-scale-up h-48 w-48 mx-auto my-10"
          />
          <button
            onClick={() => navigate(`/search`)}
            className="bg-[#F59F50] text-white py-2 px-4 rounded-full"
          >
            Continue Shopping
          </button>
        </>
      )}
    </>
  );
}
