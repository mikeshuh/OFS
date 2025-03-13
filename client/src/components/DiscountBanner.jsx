import discountImage from "../assets/discount.png";

function DiscountBanner() {
  return (
    <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-full my-2 mx-auto w-4/5 max-w-[750px] shadow-md h-[80px] relative">
      {/* Discount Image */}
      <img
        src={discountImage}
        alt="Discount"
        className="h-[90px] relative left-5 -top-2"
      />

      {/* Text Container */}
      <div className="flex flex-1 items-center justify-center gap-5">
        {/* Left Column: 10% OFF / With First Order */}
        <div className="flex flex-col items-center flex-1 text-center text-[10px] font-bold">
          <span className="text-[24px] font-bold text-black">10% OFF</span>
          <br />
          <span className="text-[15px] text-gray-600">With First Order</span>
        </div>

        {/* Right Column: Code */}
        <div className="flex items-center justify-center flex-1 text-center">
          <span className="text-[30px] text-red-600 font-bold">Code: WELCOME</span>
        </div>
      </div>

      {/* Claim Button */}
      <button
        onClick={() => alert("Discount claimed!")}
        className="bg-white text-red-600 border-2 border-red-600 font-bold py-2 px-5 rounded-full text-[16px] cursor-pointer transition-all duration-300 hover:bg-red-600 hover:text-white ml-2"
      >
        Claim NOW!!!
      </button>
    </div>
  );
}

export default DiscountBanner;
