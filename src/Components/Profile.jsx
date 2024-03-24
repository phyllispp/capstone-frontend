import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import { formatDateTwo } from "./dateUtilsTwo";
import { formatDate } from "./dateOnlyUtils";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile({ userId, axiosAuth }) {
  const { logout } = useAuth0();
  const fetcher = async (url) => (await axiosAuth.get(url)).data;
  console.log(userId);

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
        orders?.data?.orders?.map((order) => (
          <div
            key={order.id}
            className=" p-2 ml-2 bg-white shadow rounded mb-2"
          >
            <div className="flex items-center">
              <img
                src="/location.png"
                alt="location"
                className="w-4 h-4 mb-2 mr-2"
              />
              <p className="text-sm mb-2 text-left">
                {order?.orderedItems[0].basket.seller.address}
              </p>
            </div>

            <ul>
              {order?.orderedItems?.map((item) => (
                <div key={item.id} className="flex items-center mb-1">
                  <img
                    src={item.basket.photo}
                    alt={item.basket.photo}
                    className="w-12 h-12 object-cover mr-2"
                  />
                  <div className="text-xs">
                    <p className="mb-1 text-left text-sm">
                      {item.basket.title}
                    </p>
                    <p className="mb-1 text-left text-gray-500">
                      Pick-up: {formatDate(item.basket.pickupStartTime)}{" "}
                      {formatDateTwo(item.basket.pickupStartTime)} to{" "}
                      {formatDateTwo(item.basket.pickupEndTime)}
                    </p>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        ))
      )}
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
        className="px-4 py-2 mt-2 text-sm font-medium text-white bg-[#F59F50]
        rounded-full"
      >
        Log Out
      </button>
    </div>
  );
}
