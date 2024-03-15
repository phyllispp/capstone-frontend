import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./Constant";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatDate } from "./dateUtils";

export default function Home() {
  const fetcher = async (url) => (await axios.get(url)).data;
  const queryClient = useQueryClient();

  // retrieve feed data
  const feeds = useQuery({
    queryKey: ["feeds"],
    queryFn: () => fetcher(`${BASE_URL}/feed`),
  });
  console.log("feeds", feeds, feeds.data);

  // retrieve seller data for feed (name and logo)

  // like function
  const handleLike = async (feedId) => {
    console.log(`${feedId}: liked`);
    const updatedFeeds = feeds.data.map((feed) => {
      if (feed.id === feedId) {
        return {
          ...feed,
          likes: feed.likes ? feed.likes + 1 : 1,
        };
      }
      return feed;
    });

    // update state and re-render
    queryClient.setQueryData(["feeds"], updatedFeeds);
  };

  // DOES NOT WORK YET
  // retrieve comments from local storage
  const [comments, setComments] = useState(() => {
    const storedComments = localStorage.getItem("comments");
    return storedComments ? JSON.parse(storedComments) : {};
  });

  // save comments to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  // comment function
  const handleComment = (feedId) => {
    console.log(`${feedId}: commented`);
    // Create a new comment object
    const newComment = {
      id: Date.now(), // generate a unique identifier for the comment
      userId: "user1", // replace with the actual user ID
      content: comments[feedId],
    };

    // Find the feed in the data array
    const updatedFeeds = feeds.data.map((feed) => {
      if (feed.id === feedId) {
        // Add the new comment to the comments array
        return {
          ...feed,
          comments: [...(feed.comments || []), newComment],
        };
      }
      return feed;
    });

    // Update the state and re-render
    queryClient.setQueryData(["feeds"], updatedFeeds);

    // Clear the comment input
    setComments((prevComments) => ({
      ...prevComments,
      [feedId]: "",
    }));
  };

  const handleInputChange = (event, feedId) => {
    setComments((prevComments) => ({
      ...prevComments,
      [feedId]: event.target.value,
    }));
  };

  const handleDeleteComment = (feedId, commentId) => {
    // Find the feed in the data array
    const updatedFeeds = feeds.data.map((feed) => {
      if (feed.id === feedId) {
        // Filter out the comment with the given commentId
        const updatedComments = feed.comments.filter(
          (comment) => comment.id !== commentId
        );

        // Update the comments array of the feed
        return {
          ...feed,
          comments: updatedComments,
        };
      }
      return feed;
    });

    // Update the state and re-render
    queryClient.setQueryData(["feeds"], updatedFeeds);
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
      {/* favorites */}
      {/* make favorites button scrollable */}
      <Link to={`/favorites`}>
        <button className="fixed top-8 right-8 p-2">
          <img src="favorites.png" alt="favorites" className="h-8 w-8" />
        </button>
      </Link>
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
                {feed.likes || 0} Likes
              </p>
            </div>
          </div>
          {/* render users comment */}
          <p className="text-[#9EB97D] text-sm font-semibold text-left mt-2">
            Comments:
          </p>
          <div>
            {feed.comments &&
              feed.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-center justify-between"
                >
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
            onSubmit={(e) => {
              e.preventDefault();
              handleComment(feed.id);
            }}
            className="flex items-center"
          >
            <input
              type="text"
              value={comments[feed.id] || ""}
              onChange={(e) => handleInputChange(e, feed.id)}
              placeholder="Write a comment..."
              className="border border-gray-300 rounded-md p-1 mt-2 flex-grow mr-2 text-sm"
              style={{ width: "10rem" }}
            />
            <button
              type="submit"
              className="bg-[#F59F50] py-1 px-3 rounded-md flex items-center"
              style={{ width: "3rem", height: "2rem", marginTop: "0.4rem" }}
            >
              <img src="send.png" alt="send" className="h-6 w-6" />
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
