import React, { useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'


function Login({LoginStatus,setLoginStatus,SignUpStatus,setSignUpStatus,ConfirmedLogin,setConfirmLogin}) {
    let login = useRef("")
    let Pwd = useRef("")

   
    const authenticate=()=>{

        var CustomerData = {Login:login.current.value}
        axios.post("https://cafebmscebackend.onrender.com/api/Customer/Login",CustomerData)
        .then(response=>{

            console.log(response.data)
            if(response.data[0].MobileNumber === login.current.value && Pwd.current.value === response.data[0].Password){

                
                alert("Welcome "+login.current.value)
                setLoginStatus(false)
                setSignUpStatus(false)
                setConfirmLogin(true)
            }
            else{

                alert("Access Denied")
            }

        })
        .catch(err=>{

            console.log(err)
            alert("Access Denied")
        })
        
    }

    const SignUp = () =>{

        setSignUpStatus(true)
        setLoginStatus(false)
    }

  return (
    <div>
        <div style={{boxShadow:'0 .28vw .57vw 0 rgba(0, 0, 0, 0.2), 0 .42vw 1.42vw 0 rgba(0, 0, 0, 0.19) ',height:'500px',width:'600px',marginLeft:'300px',marginTop:'100px',padding:'50px'}}>
            <h3 style={{fontSize:'3rem'}}>Login</h3>
            <input autoFocus style={{width:'400px',height:'40px'}}  ref = {login} type='text' className='form-control m-3' placeholder='UserName' />
            <input style={{width:'400px',height:'40px'}} ref = {Pwd} type='password' className='form-control m-3'  placeholder='Password' />
            <button onClick={authenticate}  className='btn btn-danger m-3' >Login</button>
            <button onClick={SignUp}  className='btn btn-warning m-3' >SignUp</button>
        </div>
    </div>
  )
}
export default Login
