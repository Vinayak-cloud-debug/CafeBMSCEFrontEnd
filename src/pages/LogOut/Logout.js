import { BiLogOut } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
const Logout = () => {

	const { setAuthUser } = useAuthContext();

	const logOut = async()=>{

	
	try {
            
			
		const res = await fetch("https://cafebmscebackend.onrender.com/api/auth/logout", {
			method: "POST",
			credentials:"include",
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();
		if (data.error) {
			throw new Error(data.error);
		}

		localStorage.removeItem("FullName")
		localStorage.removeItem("EmailId")
		localStorage.removeItem("Gender")


		setAuthUser(null);
		
		
	} catch (error) {
		toast.error(error.message);
	} 
	}

	return (
		<div className='mt-0  '>
			
			<svg xmlns="http://www.w3.org/2000/svg" onClick={logOut} width="26" height="26" fill="currentColor" className="bi bi-box-arrow-left lg:mt-3 mt-2 cursor-pointer text-red-700  " viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
				<path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
			</svg>
			
			
			<Toaster/>
		</div>
	);
};
export default Logout;
