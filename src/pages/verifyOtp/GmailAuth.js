import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const GmailAuth = () => {

  const navigate = useNavigate();

    const [otp,setotp] = useState('')

const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
     
        const UserData = JSON.stringify(localStorage.getItem("UserData"))
        const GmailOtp = localStorage.getItem("GmailOtp")

        console.log({ GmailOtp, otp, UserData });

                  
          if (!GmailOtp) {
            console.log("Missing GmailOtp!");
            toast.error("Missing Gmail OTP ")
            return;
          }

        
      const response = await fetch('http://localhost:3000/api/auth/GmailVerify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({GmailOtp,otp,UserData}),
      });

      setTimeout(()=>{

      },1000)

      const data = await response.json();
      console.log("Otp: "+data.otp)
      if (response.ok ) {
        toast.success("Verified OTP successfully ! ... redirecting to Home")
        localStorage.setItem("test",true)
        setTimeout(() => navigate('/home'), 2000);
      } else {
        toast.error(data.error || 'Invalid OTP.');
      }
    } catch (error) {
        toast.error('Failed to verify OTP.'+error.message);
    }
  };


  return (
    <div className="flex flex-col bg-orange-50 items-center">
      <h1 className="text-2xl font-semibold">Verify OTP from Gmail</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        className="input input-bordered w-full max-w-md"
        value={otp}
        onChange={(e) => setotp(e.target.value)}
      />
      <button className="btn mt-4" onClick={handleVerifyOtp}>
        Verify OTP
      </button>

      
      <Toaster/>
    </div>
  );
};

export default GmailAuth;
