import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import axios from "axios";

export default function Profile({ userId }) {
  const fetcher = async (url) => (await axios.get(url)).data;

  //retrieve all orders
  //for each order, show food title, photo, stock(that the user has bought)pickupstarttime, endtime, seller address
  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetcher(`${BASE_URL}/order/${userId}`),
  });

  console.log(orders.data);

  return (
    <div>
      {orders.isLoading ? (
        <p>Loading...</p>
      ) : orders.isError ? (
        <p>Error loading orders</p>
      ) : (
        orders?.data?.map((order) => (
          <div key={order.id}>
            <ul>
              {order?.orderedItems?.map((item) => (
                <div key={item.id}>
                  <p>{item.basket.title}</p>
                </div>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
