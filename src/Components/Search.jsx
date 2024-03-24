import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { BASE_URL } from "./Constant";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Search() {
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const MAX_DISTANCE = 20;
  const [distance, setDistance] = useState(MAX_DISTANCE);

  const fetcher = async (url, userLocation) => {
    const { latitude, longitude } = userLocation;
    const fullUrl = `${url}?latitude=${latitude}&longitude=${longitude}`;
    return (await axios.get(fullUrl)).data;
  };

  // retrieve all sellers
  const sellers = useQuery({
    queryKey: ["sellers", selectedCategoryId, userLocation],
    queryFn: () =>
      fetcher(
        `${BASE_URL}/category/${selectedCategoryId}/sellers`,
        userLocation
      ),
    enabled:
      !!selectedCategoryId &&
      userLocation.latitude !== null &&
      userLocation.longitude !== null,
  });

  // filter sellers by distance
  const filteredSellers = sellers?.data?.filter(
    (store) =>
      distance === MAX_DISTANCE ||
      (store.distance / 1000).toFixed(1) <= distance
  );

  // get the user's location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log(userLocation);
        });
      }
    };
    getLocation();
  }, []);

  return (
    <>
      <div className="flex justify-around">
        {/* bakery, restaurant and supermarket button */}
        <button
          onClick={() => {
            setSelectedCategoryId(1);
          }}
          className=" bg-[#EFEEDE] py-6 px-5 rounded-md flex flex-col items-center w-24 h-24 text-xs font-medium text-[#F59F50] focus:bg-[#F59F50] focus:text-[#EFEEDE] focus:outline-none "
        >
          <img src="bakery.png" alt="bakery" className="h-8 w-8" />
          <span className="mt-2">Bakery</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategoryId(2);
          }}
          className=" bg-[#EFEEDE] py-6 px-5 rounded-md flex flex-col items-center w-24 h-24 text-xs font-medium text-[#F59F50] focus:bg-[#F59F50] focus:text-[#EFEEDE] focus:outline-none"
        >
          <img src="restaurant.png" alt="restaurant" className="h-8 w-8" />
          <span className="mt-2">Restaurant</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategoryId(3);
          }}
          className=" bg-[#EFEEDE] py-6 px-5 rounded-md flex flex-col items-center w-24 h-24 text-xs font-medium text-[#F59F50] focus:bg-[#F59F50] focus:text-[#EFEEDE] focus:outline-none"
        >
          <img src="supermarket.png" alt="supermarket" className="h-8 w-8" />
          <span className="mt-2">Supermarket</span>
        </button>
      </div>
      {/* range slider */}

      <div className="flex justify-center items-center py-4">
        <label htmlFor="distance" className="mr-2 text-xs">
          Distance:
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={distance}
          onChange={(e) => setDistance(parseInt(e.target.value))}
          className="w-64"
        />
        <span className="ml-2 text-xs">{distance} km</span>
      </div>

      {/* sellers */}
      {filteredSellers?.map((seller) => (
        <div key={seller.id}>
          <Link to={`/search/seller/${seller.id}`}>
            <div className="flex items-center p-2">
              <img
                src={seller.photo}
                alt="Seller Photo"
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <p className="text-sm font-semibold">{seller.name}</p>
              <p className="text-xs font-light mx-4">
                {(seller.distance / 1000).toFixed(1)} km away
              </p>
            </div>
          </Link>
          {/* food listing */}
          <ul>
            {seller.baskets?.map((basket) => (
              <div
                key={basket.id}
                className="flex items-start p-2 ml-2 bg-white shadow rounded mb-2"
              >
                <Link to={`/search/basket/${basket.id}`}>
                  <img
                    src={basket.photo}
                    alt={basket.title}
                    className="w-12 h-12 object-cover mr-2"
                  />
                </Link>
                <div className="flex flex-col flex-grow">
                  <p className="text-sm text-left">{basket.title}</p>
                  <p className="text-gray-500 text-xs">{basket.price}</p>
                  <div className="flex justify-between">
                    <p className="text-gray-500 text-xs">{basket.stock} left</p>
                    <div>
                      <p className="text-gray-500 line-through text-xs">
                        ${basket.originalPrice}
                      </p>
                      <p className="text-gray-500 text-xs">
                        ${basket.discountedPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
