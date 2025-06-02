
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useAuthContext } from "../../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadingVal,setLoadingVal] = useState(0)

  // const { loading, login } = useLogin();
  const navigate = useNavigate();
  const{ setAuthUser} = useAuthContext();

  const handleSubmit = async (e) => {

    setLoadingVal(1)
    e.preventDefault();
    try {



			const res = await fetch("https://cafebmscebackend.onrender.com/api/auth/login", {
				method: "POST",
        credentials:"include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});


			

      if (res.status === 200) {

        setTimeout(()=>{
          setLoadingVal(0)
        },500)
        
        const data = await res.json();
        
        
        // Store the token in the context and in cookies
        setAuthUser(data.token); // Store the token in the context
  
        // Optionally, store it in cookies for persistence across sessions
        document.cookie = `jwt=${data.token}; path=/; max-age=3600; Secure; HttpOnly; SameSite=Strict`;
  
        toast.success('Logged In Successfully!');
        navigate("/"); // Navigate to the home page after login
      }

      if(res.status === 400){
        setLoadingVal(0)
        toast.error("Invalid username or password");
      } 
			
    
		} catch (error) {
			toast.error(error.message);
      setLoadingVal(0)
		}
    
  };

  return (
  <div className="flex flex-col items-center justify-center min-h-screen px-4">
  {loadingVal ? (
    <div className="fixed top-5 z-50 p-3 rounded-lg shadow-lg bg-white flex items-center gap-2">
      <div className="text-lg text-black font-medium">Loading</div>
      <PulseLoader color="#e50914" size={10} />
    </div>
  ) : null}

  <div className="w-full max-w-md bg-white text-black flex flex-col gap-8 justify-center items-center rounded-2xl shadow-2xl p-10 border border-gray-200">
    <div className="flex flex-col gap-1 items-center text-center">
      <h2 className="text-3xl font-extrabold">
        Welcome back to <span className="text-[#e50914]">Cafe BMSCE</span>
      </h2>
      <p className="text-sm text-gray-500 font-medium">Namma Canteen</p>
    </div>

	<form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8">
  {/* Email */}
  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-2">
    <span className="text-gray-600 mr-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-envelope">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
      </svg>
    </span>
    <input
      type="text"
      placeholder="Enter your Gmail"
      className="flex-1 bg-transparent text-black text-sm sm:text-base outline-none"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
  </div>

  {/* Password */}
  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-2">
    <span className="text-gray-600 mr-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-key">
        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/>
        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
      </svg>
    </span>
    <input
      type="password"
      placeholder="Enter your Password"
      className="flex-1 bg-transparent text-black text-sm sm:text-base outline-none"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>

  {/* Forgot Link */}
  <div className="text-right text-sm">
    <Link to="/forgot-password" className="text-[#e50914] font-semibold hover:underline">
      Forgot Password?
    </Link>
  </div>

  {/* Login Button */}
  <button
    type="submit"
    className="w-full bg-[#e50914] hover:bg-red-700 transition-all p-3 rounded-xl font-semibold text-white text-base sm:text-lg"
  >
    Login
  </button>

  <p className="text-center text-sm text-gray-600">
    Don't have an account?{" "}
    <Link to="/signup" className="text-[#e50914] font-bold hover:underline">
      Sign Up
    </Link>
  </p>
</form>


//     <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8">
//   {/* Email */}
//   <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50">
//     <div className="px-4 py-3 text-gray-600">
//       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-envelope">
//         <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
//       </svg>
//     </div>
//     <input
//       type="text"
//       placeholder="Enter your Gmail"
//       className=" text-black outline-none rounded-r-xl text-sm sm:text-base"
//       value={username}
//       onChange={(e) => setUsername(e.target.value)}
//     />
//   </div>

//   {/* Password */}
//   <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50">
//     <div className="px-4 py-3 text-gray-600">
//       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-key">
//         <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/>
//         <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
//       </svg>
//     </div>
//     <input
//       type="password"
//       placeholder="Enter your Password"
//       className="  text-black outline-none rounded-r-xl text-sm sm:text-base"
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//     />
//   </div>

//   {/* Forgot Link */}
//   <div className="text-right text-sm">
//     <Link to="/forgot-password" className="text-[#e50914] font-semibold hover:underline">
//       Forgot Password?
//     </Link>
//   </div>

//   {/* Login Button */}
//   <button
//     className="w-full bg-[#e50914] hover:bg-red-700 transition-all p-3 rounded-xl font-semibold text-white text-base sm:text-lg"
//   >
//     Login
//   </button>

//   <p className="text-center text-sm text-gray-600">
//     Don't have an account?{" "}
//     <Link to="/signup" className="text-[#e50914] font-bold hover:underline">
//       Sign Up
//     </Link>
//   </p>
// </form>


    <Toaster />
  </div>
</div>

  );
};

export default Login;

