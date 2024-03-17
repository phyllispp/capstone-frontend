export default function AuthPage() {
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
      <button
        type="submit"
        className="px-4 py-2 mt-2 text-sm font-medium text-white bg-[#F59F50] rounded-full"
      >
        Explore
      </button>
    </>
  );
}
