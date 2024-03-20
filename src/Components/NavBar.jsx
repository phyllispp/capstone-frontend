import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-[#9EB97D]">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5"
          onClick={() => navigate("/home")} // Navigate to Home
        >
          <img src="/home.png" alt="home" className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5"
          onClick={() => navigate("/search")} // Navigate to Search
        >
          <img src="/search.png" alt="search" className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5"
          onClick={() => navigate("/cart")} // Navigate to Cart
        >
          <img src="/cart.png" alt="cart" className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5"
          onClick={() => navigate("/profile")} // Navigate to Profile
        >
          <img src="/profile.png" alt="profile" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
