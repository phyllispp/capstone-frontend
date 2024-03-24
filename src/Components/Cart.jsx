import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import { useNavigate } from "react-router-dom";
import { formatDate } from "./dateOnlyUtils";
import { formatDateTwo } from "./dateUtilsTwo";
import { Link } from "react-router-dom";

export default function Cart({ userId, axiosAuth }) {
  const fetcher = async (url) => (await axiosAuth.get(url)).data;
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
  const putRequest = async (url, data) => await axiosAuth.put(url, data);
  const { mutate: deleteBasket } = useMutation({
    mutationFn: (basketId) => putRequest(`${BASE_URL}/cart/delete/${basketId}`),
    onSuccess: (data, basketId) => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      queryClient.setQueryData(["cartItems"], (oldQueryData) => {
        return oldQueryData.data.filter((basket) => basket.id !== basketId);
      });
    },
  });

  // post request for stripe payment
  const postRequest = async (url, data) => await axiosAuth.post(url, data);
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
        <div className="flex flex-col items-center p-2 ml-2 bg-white shadow rounded mb-2">
          {cartItems.data.map((item) => (
            <div key={item.basket.id} className="flex items-center w-full mb-4">
              <Link to={`/search/basket/${item.basket.id}`}>
                <img
                  src={item.basket.photo}
                  alt={item.basket.title}
                  className="w-12 h-12 object-cover mr-2"
                />
              </Link>
              <div className="text-left flex-grow ml-2">
                <p className="text-sm">{item.basket.title}</p>
                <p className="text-gray-500 text-xs">
                  ${item.basket.discountedPrice}
                </p>
                <div className="text-xs  text-gray-500">
                  <p>
                    Pick-up: {formatDate(item.basket.pickupStartTime)}{" "}
                    {formatDateTwo(item.basket.pickupStartTime)} to{" "}
                    {formatDateTwo(item.basket.pickupEndTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-grow"></div>
                <button
                  className="w-4 h-4 mb-2"
                  onClick={() => {
                    deleteBasket(item.basket.id);
                  }}
                >
                  <img src="/bin.png" alt="bin" />
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
      <p>Your total price is ${totalPrice}</p>
      {cartItems.data && cartItems.data.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-[#F59F50] text-white py-2 px-4 rounded-full"
            onClick={() => pay()}
          >
            Checkout
          </button>
        </div>
      )}
    </>
  );
}
