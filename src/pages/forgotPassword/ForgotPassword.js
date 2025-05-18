import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Navigation hook

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok || data.output) {
        toast.success("OTP sent successfully! Check your mail.");
        localStorage.setItem("email", email);

        // Redirect to verify-otp page after delay
        setTimeout(() => navigate("/verifyOTP"), 1500);
      } else {
        setMessage(data.error || "Something went wrong.");
        toast.error(data.error || "Failed to send reset link.");
      }
    } catch (error) {
      setMessage("Failed to send password reset link.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-orange-50 px-4">
  <div className="w-full max-w-lg bg-white h-auto justify-center items-center flex flex-col gap-10 text-gray-800 rounded-2xl shadow-xl p-8">
    
    {/* Title */}
    <div className="flex flex-col justify-center items-center gap-2">
      <h2 className="text-3xl font-bold text-center mb-4 tracking-wide text-gray-800">
        Forgot Password?
      </h2>
    </div>

    {/* Gmail Field */}
    <div className="flex flex-col w-full gap-2">
      <label className="text-sm font-medium text-gray-700">Gmail</label>

      <div className="flex items-center w-full border border-gray-300 rounded-3xl bg-white focus-within:ring-2 focus-within:ring-red-500">
        {/* Icon */}
        <div className="bg-gray-100 px-4 py-3 rounded-l-3xl border-r border-gray-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-envelope text-gray-600">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter your Gmail"
          className="flex-1 p-3 bg-white text-gray-800 outline-none rounded-r-3xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </div>

    {/* Reset Button */}
    <button
      className="w-full max-w-xs bg-red-600 hover:bg-red-700 transition-all p-3 rounded-3xl font-semibold text-white mt-2"
      onClick={handleForgotPassword}
    >
      Verify Gmail
    </button>

    {/* Error Message */}
    {message && <p className="text-center text-red-500 mt-4">{message}</p>}

    {/* Link */}
    <div className="flex justify-center mt-4">
      <Link to="/login" className="text-red-600 font-medium hover:underline">
        Back to Login
      </Link>
    </div>
  </div>

  {/* Toast */}
  <Toaster position="top-center" />
</div>

    // <div className="flex items-center justify-center min-h-screen bg-orange-50 px-4">
    //   <div className="w-full max-w-lg bg-[#e7e6e9] h-[600px] justify-center items-center flex flex-col gap-10 text-white rounded-2xl shadow-xl p-8 backdrop-filter backdrop-blur-lg bg-opacity-70">
        
    //     <div className="flex flex-col justify-center items-center gap-2 ">

    //         <h2 className="text-2xl font-semibold text-center mb-8 tracking-wide">
    //           Forgot Password?
    //         </h2>
    //     </div>

    //     {/* Gmail Field */}
    //     <div className="flex flex-col justify-center items-center gap-5">
    //       <label className="text-sm font-medium self-start  text-gray-300 mb-1">Gmail</label>
          
    //       <div className="flex items-center self-start  w-80 border border-gray-600 rounded-3xl bg-[#0F0C0C] focus-within:ring-2 focus-within:ring-green-500">
    //         {/* Left Icon Div */}
    //         <div className="bg-[#030109] px-4 py-3 rounded-l-3xl border-r border-gray-600 flex items-center">
    //           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-envelope text-white">
    //             <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
    //           </svg>
    //         </div>

    //         {/* Input Field */}
    //         <input
    //           type="text"
    //           placeholder="Enter your Gmail"
    //           className="flex-1 p-3 bg-[#030109] text-white outline-none  rounded-r-3xl"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //         />
    //       </div>
    //     </div>


    //     {/* Send Reset Link Button */}
    //     <button
    //         className="w-80 bg-[#0B02FF] self-center font-sans hover:bg-[#02AB32] transition-all p-3 rounded-3xl font-semibold text-white flex items-center justify-center"
    //       onClick={handleForgotPassword}>
    //         Reset Password
    //       </button>

    //     {/* Error Message */}
    //     {message && <p className="text-center text-red-400 mt-4">{message}</p>}

    //     {/* Links Section */}
    //     <div className="flex justify-center mt-6">
    //       <Link
    //         to="/login"
    //         className="text-[#0A1CB1] font-semibold"
    //       >
    //         Back to Login
    //       </Link>
    //     </div>
    //   </div>

    //   {/* Toast Notification */}
    //   <Toaster position="top-center" />
    // </div>
  );
};

export default ForgotPassword;
