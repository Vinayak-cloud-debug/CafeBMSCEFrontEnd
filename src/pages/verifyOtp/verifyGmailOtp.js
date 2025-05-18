import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";



const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    try {
      var email = localStorage.getItem("email");

      const response = await fetch("http://localhost:9000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok || data.output) {
        toast.success("Verified OTP successfully! Redirecting...");
        setTimeout(() => navigate("/reset-password"), 2000);
      } else {
        setMessage(data.error || "Invalid OTP.");
      }
    } catch (error) {
      setMessage("Failed to verify OTP. " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#090707]">
      <div className="bg-[#030109] flex flex-col gap-5 border border-gray-700 h-[600px]  shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-md text-center transform transition-all ">
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Verify your OTP
        </h1>
        
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5 self-center">
                          <label className="text-sm font-medium self-start text-gray-300 mb-1">OTP</label>

                          <div className="flex items-center w-80 border border-gray-600 rounded-3xl bg-[#0F0C0C] focus-within:ring-2 focus-within:ring-green-500">
                            {/* Left Icon Div */}
                            <div className="bg-[#030109] px-4 py-3 rounded-l-3xl border-r border-gray-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-key" viewBox="0 0 16 16">
                              <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/>
                              <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                            </svg>
                            </div>

                            {/* Input Field */}
                            <input
                              type="password"
                              placeholder="Enter OTP"
                              className="flex-1 p-3 bg-[#030109] text-white outline-none  rounded-r-3xl"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                            />
                          </div>
            
            </div>

            <button
                className="w-80 self-center bg-[#0A1CB9]  font-sans hover:bg-[#02AB32] transition-all p-3 rounded-3xl font-semibold text-white flex items-center justify-center"
              onClick={handleVerifyOtp}>
                Receive OTP
            </button>

            <Link
              to="/SignUp"
              className="text-[#0A1CB1] font-semibold"
            >
              Back to Verify Gmail
            </Link>
        </div>


        {message && (
          <p className="mt-4 text-red-500 text-sm font-semibold">{message}</p>
        )}

        <Toaster />
      </div>
    </div>
  );
};

export default VerifyOtp;
