import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import { formatDate } from "./dateUtils";
import axios from "axios";

export default function Home({ userId, axiosAuth }) {
  const fetcher = async (url) => (await axios.get(url)).data;
  const queryClient = useQueryClient();

  // retrieve feed data
  const feeds = useQuery({
    queryKey: ["feeds"],
    queryFn: () => fetcher(`${BASE_URL}/feed`),
  });
  console.log(feeds.data);

  //post request to like a feed
  const postRequest = async (url, data) => await axiosAuth.post(url, data);
  const { mutate } = useMutation({
    mutationFn: (feedId) =>
      postRequest(`${BASE_URL}/feed/like`, {
        userId: userId,
        feedId: feedId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

  // post request to insert a comment
  const { mutate: commentFeed } = useMutation({
    mutationFn: (formData) =>
      postRequest(`${BASE_URL}/feed/comment`, {
        formData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
  const [comment, setComment] = useState({});
  console.log(comment);

  const handleSubmit = (feedId, e) => {
    e.preventDefault();
    const content = comment[feedId] || "";

    commentFeed({ userId: userId, feedId: feedId, content: content });
    setComment((prev) => ({ ...prev, [feedId]: "" }));
  };

  // delete a comment
  const deleteRequest = async (url, data) => await axiosAuth.delete(url, data);
  const { mutate: deleteFeed } = useMutation({
    mutationFn: ({ feedId, commentId }) =>
      deleteRequest(`${BASE_URL}/feed/${feedId}/comment/${commentId}/delete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* title */}
        <div className="text-4xl flex justify-center text-center">
          <div>
            <p className="text-[#E55555] font-bold">Food</p>
          </div>
          <div>
            <p className="text-[#9EB97D] italic">Rescue</p>
          </div>
        </div>
        {/* favorites
      <Link to={`/favorites`}>
        <button className="fixed top-8 right-8 p-2">
          <img src="favorites.png" alt="favorites" className="h-8 w-8" />
        </button>
      </Link> */}
        {/* feed card */}
        {feeds?.data?.map((feed) => (
          <div
            key={feed.id}
            className="bg-[#EFEEDE] rounded-lg shadow p-4 relative"
          >
            <div className="flex items-center mb-2">
              <img
                src={feed.seller.photo}
                alt="feed"
                className="w-8 h-8 rounded-full object-cover mr-4"
              />
              <p className="text-sm">{feed.seller.name}</p>
            </div>
            {/* render feed photo */}
            <img src={feed.photo} alt="feed" className="w-full mb-4" />
            {/* render feed caption */}
            <p className="text-s font-light text-left mb-2">{feed.content}</p>
            {/* render date and time */}
            <p className="text-gray-500 text-xs font-light text-left mb-2">
              {formatDate(feed.createdAt)}
            </p>
            <div className="flex justify-start">
              {/* render users like */}
              <div className="flex items-center">
                <button
                  onClick={() => {
                    mutate(feed.id);
                  }}
                  className="mr-2"
                >
                  <img src="like.png" alt="like" className="h-8 w-8" />
                </button>
                <p className="text-gray-500 text-sm font-light">
                  {feed.feedLikes.length || 0} Likes
                </p>
              </div>
            </div>
            {/* render users comment */}
            <p className="text-[#9EB97D] text-sm font-semibold text-left mt-2">
              Comments:
            </p>
            <div>
              {feed.feedReviews &&
                feed.feedReviews.map((comment) => (
                  <div key={comment.id} className="flex items-center">
                    <p className="text-sm font-thin text-left">
                      {comment.userId}: {comment.content}
                    </p>
                    <button
                      onClick={() => {
                        deleteFeed({ feedId: feed.id, commentId: comment.id });
                      }}
                      className="text-xs text-[#E55555]"
                      style={{ marginLeft: "auto" }}
                    >
                      x
                    </button>
                  </div>
                ))}
            </div>

            <form
              onSubmit={(e) => handleSubmit(feed.id, e)}
              className="flex items-center"
            >
              <input
                type="text"
                value={comment[feed.id] || ""}
                onChange={(e) => {
                  setComment((prev) => ({
                    ...prev,
                    [feed.id]: e.target.value,
                  }));
                }}
                placeholder="Write a comment..."
                className="border border-gray-300 rounded-md p-1 mt-2 flex-grow mr-2 text-sm"
                style={{ width: "10rem" }}
              />
              <button
                type="submit"
                className="bg-[#F59F50] py-1 px-3 rounded-md flex items-center"
                style={{
                  width: "3rem",
                  height: "2rem",
                  marginTop: "0.4rem",
                }}
              >
                <img src="send.png" alt="send" className="h-6 w-6" />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
