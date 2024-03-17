import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDateTwo } from "./dateUtilsTwo";

export default function FoodDetail({ userId }) {
  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fetcher = async (url) => (await axios.get(url)).data;

  const baskets = useQuery({
    queryKey: ["basket", `${BASE_URL}/category/${params.basketId}`],
    queryFn: () => fetcher(`${BASE_URL}/category/${params.basketId}`),
  });
  console.log("baskets", baskets, baskets.data);

  // add a basket to cart
  // how about the edge case where the user goes back and wants to add the same item to the basket through food detail?

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
              <p>
                Pick-up: {formatDateTwo(basket.pickupStartTime)} to{" "}
                {formatDateTwo(basket.pickupEndTime)}
              </p>
            </div>
            <div className="text-sm my-2">
              <p className="line-through">${basket.originalPrice}</p>
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
