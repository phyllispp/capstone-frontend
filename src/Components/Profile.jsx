import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import axios from "axios";
import { formatDateTwo } from "./dateUtilsTwo";

export default function Profile({ userId }) {
  const fetcher = async (url) => (await axios.get(url)).data;

  // retrieve all orders
  //for each order, show food title, photo, stock(that the user has bought)pickupstarttime, endtime, seller address
  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetcher(`${BASE_URL}/order/${userId}`),
  });

  console.log(orders.data);

  return (
    <div>
      <div className="text-2xl flex justify-center mb-4">
        <div>
          <p className="text-[#E55555] font-bold">Food</p>
        </div>
        <div>
          <p className="text-[#9EB97D] italic">Orders</p>
        </div>
      </div>
      {orders.isLoading ? (
        <p>Loading...</p>
      ) : orders.isError ? (
        <p>Error loading orders</p>
      ) : (
        orders?.data?.map((order) => (
          <div
            key={order.id}
            className="flex items-start p-2 ml-2 bg-white shadow rounded mb-2"
          >
            <ul>
              {order?.orderedItems?.map((item) => (
                <div key={item.id} className="flex items-start">
                  <img
                    src={item.basket.photo}
                    alt={item.basket.photo}
                    className="w-12 h-12 object-cover mr-2"
                  />
                  <div className="text-xs">
                    <p className="mb-1 text-left">{item.basket.title}</p>
                    <p className="mb-1 text-left">
                      {formatDateTwo(item.basket.pickupStartTime)} to{" "}
                      {formatDateTwo(item.basket.pickupEndTime)}
                    </p>
                    <p className="text-left">{item.basket.seller.address}</p>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
