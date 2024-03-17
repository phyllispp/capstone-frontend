export default function SignUp() {
  return (
    <>
      {/* Title */}
      <div className="text-4xl flex justify-center">
        <div>
          <p className="text-[#E55555] font-bold">Food</p>
        </div>
        <div>
          <p className="text-[#9EB97D] italic">Rescue</p>
        </div>
      </div>

      {/* Logo */}
      <img
        src="logo.png"
        alt="logo"
        className="object-scale-up h-48 w-48 mx-auto my-10"
      />

      {/* Input Form */}
      <form className="flex flex-col items-center">
        <p>Full Name:</p>
        <input
          type="text"
          className="w-full max-w-sm px-4 py-2 my-2 border border-gray-300 rounded-md"
        />
        <p>Email:</p>
        <input
          type="email"
          className="w-full max-w-sm px-4 py-2 my-2 border border-gray-300 rounded-md"
        />
        <p>Password:</p>
        <input
          type="password"
          className="w-full max-w-sm px-4 py-2 my-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="px-4 py-2 mt-2 text-sm font-medium text-white bg-[#F59F50] rounded-full"
        >
          Sign Up
        </button>
        <button type="submit" className="text-sm text-black">
          Already have an account? Sign-in!
        </button>
      </form>
    </>
  );
}
