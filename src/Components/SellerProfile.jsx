import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function SellerProfile() {
  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fetcher = async (url) => (await axios.get(url)).data;

  const seller = useQuery({
    queryKey: ["seller", `${BASE_URL}/category/seller/${params.sellerId}`],
    queryFn: () => fetcher(`${BASE_URL}/category/seller/${params.sellerId}`),
  });

  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleReviewSubmit = () => {
    // implement logic to submit review to server
    console.log("Review submitted:", reviewText);
    const newReview = {
      id: Date.now(),
      text: reviewText,
    };
    setReviews((prevReviews) => [...prevReviews, newReview]);
    setReviewText("");
  };

  const handleReviewDelete = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
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
      <div className="text-2xl flex justify-center mb-2">
        <div>
          <p className="text-[#E55555] font-bold">Food</p>
        </div>
        <div>
          <p className="text-[#9EB97D] italic">Review</p>
        </div>
      </div>
      {/* seller profile */}
      {seller.data?.map((seller) => (
        <div key={seller.id} className="bg-[#EFEEDE] p-4 shadow rounded mb-4">
          <img
            src={seller.photo}
            alt={seller.title}
            className="object-cover h-48 w-96"
          />
          <div className="text-left">
            <p className="text-lg font-semibold my-2">{seller.name}</p>
            <p className="font-semibold my-1">Address</p>
            <p className="text-sm">{seller.address}</p>
            <p className="font-semibold my-1">Email</p>
            <p className="text-sm">{seller.email}</p>
          </div>
          {/* add to favorites */}
        </div>
      ))}
      {/* review input box */}
      <div className="bg-[#EFEEDE] p-4 shadow rounded mb-4">
        {/* render users reviews */}
        <p className="text-[#9EB97D] text-sm font-semibold text-left mt-2">
          Reviews:
        </p>
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex items-center justify-between mt-2"
          >
            <p className="text-sm text-left">{review.text}</p>
            <button
              onClick={() => handleReviewDelete(review.id)}
              className="text-xs text-[#E55555]"
            >
              x
            </button>
          </div>
        ))}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full h-20 p-2 mt-10 border border-gray-300 rounded"
          placeholder="Write a review..."
        ></textarea>
        <button
          onClick={handleReviewSubmit}
          className="px-4 py-2 mt-2 text-sm font-medium text-white bg-[#F59F50] rounded-full"
        >
          Submit Review
        </button>
      </div>
    </>
  );
}
