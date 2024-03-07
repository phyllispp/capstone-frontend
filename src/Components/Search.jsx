import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BASE_URL } from "./Constant";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Search() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);

  const fetcher = async (url) => (await axios.get(url)).data;

  // retrieve all sellers
  const sellers = useQuery({
    queryKey: ["sellers", selectedCategoryId],
    queryFn: () =>
      fetcher(`${BASE_URL}/category/${selectedCategoryId}/sellers`),
    enabled: !!selectedCategoryId,
  });
  // maybe only show the sellers who have baskets?

  // change categoryId with button click
  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  console.log(sellers.data);

  return (
    <>
      <button onClick={() => handleCategoryClick(1)}>Bakery</button>
      <button onClick={() => handleCategoryClick(2)}>Restaurant</button>
      <button onClick={() => handleCategoryClick(3)}>Supermarket</button>

      {sellers?.data?.map((seller) => (
        <div key={seller.id}>
          <p>{seller.name}</p>
          <ul>
            {seller.baskets?.map((basket) => (
              <div
                key={basket.id}
                className="flex items-center p-4 bg-white shadow rounded mb-4"
              >
                <Link to={`/search/basket/${basket.id}`}>
                  <img
                    src={basket.photo}
                    alt={basket.title}
                    className="w-20 h-20 object-cover mr-4"
                  />
                </Link>
                <div>
                  <h2 className="font-bold text-lg">{basket.title}</h2>
                  <p className="text-gray-500">{basket.price}</p>
                  <p className="text-gray-500">{basket.stock} left</p>
                  <p className="text-gray-500">${basket.originalPrice}</p>
                  <p className="text-gray-500">${basket.discountedPrice}</p>
                </div>
              </div>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
