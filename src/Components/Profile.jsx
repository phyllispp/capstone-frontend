import { useQuery } from "@tanstack/react-query";
import { BASE_URL, LOGOUT_URL } from "./Constant";
import { formatDateTwo } from "./dateUtilsTwo";
import { formatDate } from "./dateOnlyUtils";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile({ userId, axiosAuth }) {
  const { logout } = useAuth0();
  const fetcher = async (url) => (await axiosAuth.get(url)).data;

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
                      {formatDate(item.basket.pickupStartTime)}{" "}
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
      <button
        onClick={() => logout({ logoutParams: { returnTo: LOGOUT_URL } })}
        className="px-4 py-2 mt-2 text-sm font-medium text-white bg-[#F59F50]
        rounded-full"
      >
        Log Out
      </button>
    </div>
  );
}
