import axios from 'axios'
import React, { useRef } from 'react'

function SignUp({SignUpStatus,setSignUpStatus,LoginStatus,setLoginStatus}) {
    let UserName = useRef()
    let UserEmail = useRef()
    let CreatePassword = useRef()
    let ConfirmPassword = useRef()
    let Address = useRef()
    let PinCode = useRef()
    let City = useRef()

    

    const SignUpUser = (CreatePassword,ConfirmPassword) =>{

        if(CreatePassword.current.value === ConfirmPassword.current.value){



            var myData = {CustName:UserName.current.value,Email:UserEmail.current.value,Password:ConfirmPassword.current.value,Address:Address.current.value,PinCode:PinCode.current.value,City:City.current.value}


            
            axios.post("https://cafebmscebackend.onrender.com/api/Customer/SignUp",myData)
            .then(response=>{

                alert("Data inserted")

            })
            .catch(err=>{
                console.log(err)
            })

        }
        else    
            alert("No Match Between Confirm and Create Password")
    }
        

    

    const BackToLogin = ()=>{

         setSignUpStatus(false)
         setLoginStatus(true)
    
    }


  return (
    <div>
        <div style={{boxShadow:'0 .28vw .57vw 0 rgba(0, 0, 0, 0.2), 0 .42vw 1.42vw 0 rgba(0, 0, 0, 0.19) ',height:'auto',width:'600px',marginLeft:'300px',marginTop:'100px',padding:'50px'}}>
            <h3 style={{fontSize:'3rem'}}>SignUp</h3>
            <input style={{width:'400px',height:'40px'}} autoFocus ref = {UserName} type='text' className='form-control m-3' placeholder='Enter UserName' />
            <input style={{width:'400px',height:'40px'}} ref = {UserEmail} type='text' className='form-control m-3'  placeholder='Enter Email' />
            <input style={{width:'400px',height:'40px'}} autoFocus ref = {CreatePassword} type='password' className='form-control m-3' placeholder='Create New Password' />
            <input style={{width:'400px',height:'40px'}} ref = {ConfirmPassword} type='password' className='form-control m-3'  placeholder='Confirm Password' />
            <input style={{width:'400px',height:'40px'}} ref = {Address} type='text' className='form-control m-3'  placeholder='Address' />
            <input style={{width:'400px',height:'40px'}} ref = {PinCode} type='text' className='form-control m-3'  placeholder='PinCode' />
            <input style={{width:'400px',height:'40px'}} ref = {City} type='text' className='form-control m-3'  placeholder='City' />
            <button onClick={()=>SignUpUser(CreatePassword,ConfirmPassword)}  className='btn btn-warning m-3' >SignUp</button>
            <button onClick={BackToLogin}  className='btn btn-danger m-3' >Back</button> 
        </div>
    </div>
  )
}

export default SignUp
