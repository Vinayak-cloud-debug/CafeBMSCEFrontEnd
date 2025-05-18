


import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import GenderCheckbox from "./GenderCheckBox";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  
  const [gmailVerified, setGmailVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [gmailValue, setGmailValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [genOtp, setGenOtp] = useState("");

  const navigate = useNavigate();
  const {setAuthUser} = useAuthContext();

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const verifyOtp = () => {
    if (otpValue === genOtp) {
      toast.success("OTP Verified");
      setOtpVerified(true);
    } else {
      toast.error("Invalid OTP");
      setOtpVerified(false);
      setGmailVerified(false);
    }
  };

  const verifyGmail = async (e) => {

    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9000/api/auth/Verify-Gmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ GmailValue: gmailValue }),
      });

      const data = await response.json();
      if (data.otp) {
        setGenOtp(data.otp);
        toast.success("OTP sent successfully!");
        setGmailVerified(true);
      } else {
        toast.error(data.error || "Invalid OTP.");
      }
    } catch (error) {
      toast.error("Failed to verify OTP. " + error.message);
    }
  };


  const handleSubmit = async (e) => {



    e.preventDefault();
    try {

      var fullName = inputs.fullName
      var username = inputs.username
      var password = inputs.password
      var confirmPassword = inputs.confirmPassword
      var gender = inputs.gender


			const res = await fetch("http://localhost:9000/api/auth/signup", {
				method: "POST",
        credentials:"include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

      setAuthUser(data.token);
      navigate("/");
			toast.success('Signed Up Successfully !')
		} catch (error) {

			toast.error(error.message);
		} 

    

  };



  return (

    <div className="flex items-center bg-orange-50 justify-center min-h-screen">
  <form onSubmit={handleSubmit} className="w-full max-w-xl px-6 py-10">
    {!gmailVerified ? (
      <div className="bg-white rounded-3xl border border-gray-200 text-gray-800 p-8 shadow-2xl flex flex-col gap-6">
        <h2 className="text-4xl font-bold text-center text-gray-900">Verify Gmail</h2>

        <div className="flex items-center border border-gray-300 rounded-full bg-white focus-within:ring-2 focus-within:ring-red-500">
          <div className="px-4 py-3 rounded-l-full border-r border-gray-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-700" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1z" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="Enter your Gmail"
            className="flex-1 px-4 py-3 bg-white text-gray-800 outline-none rounded-r-full"
            value={gmailValue}
            onChange={(e) => setGmailValue(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={verifyGmail}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-all"
        >
          Verify Gmail
        </button>

        <Link to="/login" className="text-center text-red-500 hover:text-red-700">Back to Login</Link>
      </div>
    ) : !otpVerified ? (
      <div className="bg-white rounded-3xl border border-gray-200 text-gray-800 p-8 shadow-2xl flex flex-col gap-6">
        <h2 className="text-4xl font-bold text-center">Verify OTP</h2>

        <label className="text-sm text-gray-600">OTP</label>
        <div className="flex items-center border border-gray-300 rounded-full bg-white focus-within:ring-2 focus-within:ring-red-500">
          <div className="px-4 py-3 rounded-l-full border-r border-gray-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-gray-700" viewBox="0 0 16 16">
              <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Enter OTP"
            className="flex-1 px-4 py-3 bg-white text-gray-800 outline-none rounded-r-full"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={verifyOtp}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-all"
        >
          Confirm OTP
        </button>

        <Link to="/login" className="text-center text-red-500 hover:text-red-700">Back to Login</Link>
      </div>
    ) : (
      <div className="bg-white rounded-3xl border border-gray-200 text-gray-800 p-8 shadow-2xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-gray-900">Sign Up</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-5 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500"
          value={inputs.fullName}
          onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-5 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500"
          value={inputs.username}
          onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-5 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500"
          value={inputs.password}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-5 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500"
          value={inputs.confirmPassword}
          onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
        />

        <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-all"
        >
          Sign Up
        </button>

        <Link to="/login" className="text-center text-red-500 hover:text-red-700">
          Already have an account?
        </Link>
      </div>
    )}
  </form>
  <Toaster />
</div>

  );
};

export default SignUp;
