import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import { Link } from "react-router-dom";
import { formatDate } from "./dateUtils";

export default function Home({ userId, axios }) {
  const fetcher = async (url) => (await axios.get(url)).data;
  const queryClient = useQueryClient();

  // retrieve feed data
  const feeds = useQuery({
    queryKey: ["feeds"],
    queryFn: () => fetcher(`${BASE_URL}/feed`),
  });
  console.log(feeds.data);

  //post request to like and unlike a feed
  const postRequest = async (url, data) => await axios.post(url, data);
  const { mutate } = useMutation({
    mutationFn: (feedId) =>
      postRequest(`${BASE_URL}/feed/like`, {
        userId: userId,
        feedId: feedId,
      }),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      if (res.data.action === "liked") {
        queryClient.setQueryData(["feeds"], (oldQueryData) => {
          return oldQueryData.data.map((feed) => {
            if (feed.id === variables.feedId) {
              return {
                ...feed,
                feedLikes: [...feed.feedLikes, res.data.newLike],
              };
            }
          });
        });
      } else if (res.action === "unliked") {
        queryClient.setQueryData(["feeds"], (oldQueryData) => {
          return oldQueryData.data.map((feed) => {
            if (feed.id === variables.feedId) {
              return {
                ...feed,
                feedLikes: feed.feedLikes.filter(
                  (like) => like.id !== res.data.likeId
                ),
              };
            }
          });
        });
      }
    },
  });

  const handleLike = (feedId) => {
    mutate(feedId);
  };

  // post request to insert a comment
  const { mutate: commentFeed } = useMutation({
    mutationFn: (formData) =>
      postRequest(`${BASE_URL}/feed/comment`, {
        formData,
      }),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      queryClient.setQueryData(["feeds"], (oldQueryData) => {
        return oldQueryData.data.map((feed) => {
          if (feed.id === variables.feedId) {
            return {
              ...feed,
              feedReviews: [...feed.feedReviews, res.data.newComment],
            };
          }
        });
      });
    },
  });
  const [comment, setComment] = useState({});
  console.log(comment);

  const handleCommentChange = (feedId, value) => {
    setComment((prev) => ({ ...prev, [feedId]: value }));
  };

  const handleSubmit = (feedId, e) => {
    e.preventDefault();
    const content = comment[feedId] || "";

    commentFeed({ userId: userId, feedId: feedId, content: content });
    setComment((prev) => ({ ...prev, [feedId]: "" }));
  };

  // delete a comment
  const putRequest = async (url, data) => await axios.put(url, data);
  const { mutate: deleteFeed } = useMutation({
    mutationFn: (formData) =>
      putRequest(`${BASE_URL}/feed/comment/delete`, formData),
    onSuccess: () => {
      feeds.refetch();
      // queryClient.invalidateQueries({ queryKey: ["feeds"] });
      // queryClient.setQueryData(["feeds"], (oldQueryData) => {
      //   console.log(variables);
      //   console.log(variables.commentId);
      //   return oldQueryData.data.map((feed) => {
      //     return {
      //       ...feed,
      //       feedReviews: feed.feedReviews.filter(
      //         (comment) => comment.id !== variables.commentId
      //       ),
      //     };
      //   });
      // });
    },
  });

  const handleDeleteComment = (feedId, commentId) => {
    deleteFeed({ feedId: feedId, commentId: commentId });
    console.log(commentId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* title */}
      <div className="text-4xl flex justify-center">
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
              <button onClick={() => handleLike(feed.id)} className="mr-2">
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
                    onClick={() => handleDeleteComment(feed.id, comment.id)}
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
              onChange={(e) => handleCommentChange(feed.id, e.target.value)}
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
  );
}
