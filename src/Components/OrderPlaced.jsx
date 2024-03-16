import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import axios from "axios";

export default function OrderPlaced({ userId }) {
  const navigate = useNavigate();
  const fetcher = async (url) => (await axios.get(url)).data;

  //retrieve latest order info
  const latestOrder = useQuery({
    queryKey: ["latestOrder"],
    queryFn: () => fetcher(`${BASE_URL}/order/latest/${userId}`),
  });
  console.log(latestOrder.data);

  let ghgSavings = 0;

  ghgSavings = latestOrder.data?.orderedItems?.reduce((total, item) => {
    const basket = item.basket;
    return total + item.stock * basket.weightPerUnit * 3.8;
  }, 0);
  console.log(ghgSavings);

  return (
    <>
      <div className="text-2xl flex justify-center">
        <div>
          <p className="text-[#E55555] font-bold">Food</p>
        </div>
        <div>
          <p className="text-[#9EB97D] italic">Detail</p>
        </div>
      </div>
      <div>
        <p className="text-[#AEAEAE] font-bold my-10">Payment Successful!</p>
        <img
          src="logo.png"
          alt="logo"
          className="object-scale-up h-48 w-48 mx-auto my-10"
        />
        <p className="text-[#AEAEAE] font-bold my-10">
          You&apos;ve helped save {ghgSavings} g of GHG emissions!
        </p>
        <button
          onClick={() => navigate(`/`)}
          className="bg-[#F59F50] text-white py-2 px-4 rounded-full"
        >
          {" "}
          Continue
        </button>
      </div>
    </>
  );
}
