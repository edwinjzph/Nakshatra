import React, { useState,useCallback } from 'react';
import "./signup.scss"
import { useHistory } from "react-router-dom";
import { auth, createUserDocument } from '../../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
 const Signup=()=> {
    let history = useHistory();
    const [page, setPage] = useState(1);
    const [login,setLogin] = useState(false)
    const [user, setUser] = useState({
        password: "",
        email: "",
        fullname:"",
        phonenumber:"",
        collagename:"",
        department: "",
        semister:""
      });
      const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
      },[user]);
    const signIn =(e) =>{
    e.preventDefault();
    setLogin(true)
        auth.signInWithEmailAndPassword(
            user.email,
            user.password
    
        ).then((authUser) => {
     setLogin(false)
     history.push("/")
     toast.success("Successfully logined")
                }).catch((error) =>{
                    setLogin(false)
                    toast.error(error.message)
                   
                });}
                const registers =(e) => {
                    e.preventDefault();
                    setLogin(true);
                        auth.createUserWithEmailAndPassword(
                            user.email,
                            user.password
                        ).then((authUser) => {
                            setLogin(false)
                            history.push("/")
                            toast.success("Successfully logined")
                    createUserDocument(authUser.user,user).then(() => {
                       
                                }
                        
                
                    )
                        }).catch((error) =>{
                            setLogin(false)
                        toast.success(error.message)
                        });
                    
                  
                } 
                const forgots =(e) =>{
                    e.preventDefault();
                    setLogin(true);
                    auth.sendPasswordResetEmail(
                        user.email,
                    ).then(() => {
                        setLogin(false)
                        toast.success("Check your mail for reseting password.")
                            }).catch((error) =>{
                                setLogin(false)
                                toast.error(error.message)
                            });
                }
                
  return <div className='Signup_box'>
      <div className="flex_1">
        <h1>Nakshatra</h1>
          {
              page===2 &&
              <div className="signup">
                       <form onSubmit={registers} >
              <h1 >Sign up</h1>
              <input  onChange={handleChange} name='fullname' required={true} value={user.fullname}  type="text" placeholder='Full Name'></input>
              <input  onChange={handleChange} name='email' required={true} value={user.email} type="email" placeholder='Email'></input>
              <input  onChange={handleChange} name='phonenumber' required={true} value={user.phonenumber}   placeholder='Phone Number'></input>
              <input  onChange={handleChange} name='collagename' required={true} value={user.collagename}  type="text" placeholder='Name of the college'></input>
              <input  onChange={handleChange} name='department' required={true} value={user.department}  type="text" placeholder='Department'></input>
              <input onChange={handleChange} name='semister' required={true} value={user.semister} placeholder='Semister'></input>
              <input  onChange={handleChange} name='password' required={true} value={user.password} type="password" placeholder='Password'></input>
              <button  type="submit" disabled={login} >{login?"Please wait":"SIGN UP"}</button>
              </form>
          <h5 className='already_account'>Already have an account ? <span onClick={() => {setPage(1)}}>  Sign in</span></h5>
              </div>
         
          }
  {
      page===1 &&       
      
      <form onSubmit={signIn}>
    <h1 className='sign_in'>Sign in</h1>
      <h5 className='already_account  to_sign_up'>Don't have an account ? <span onClick={() => {setPage(2)}}>  Sign up here</span></h5>
      
      <input   onChange={handleChange} name='email' required={true} value={user.email} type="email" placeholder='Email'></input>
      <input  onChange={handleChange}  name='password'required value={user.password} type="password" placeholder='Password'></input>
      <button  type="submit" disabled={login} >{login?"Please wait":"SIGN IN"}</button>
      <h5 className='forgot_h5' onClick={()=>{setPage(3)}}>Forgot password ?</h5>
    
     </form>
     
  }
    {
      page===3 &&        <form onSubmit={forgots}>
      <h1 className='sign_in'>Forgot your password ?</h1>
      <h5 className='to_sign_up'>We will email you instructions to reset your password.</h5>
      <input   onChange={handleChange} name='email' required={true} value={user.email} type="email" placeholder='Enter your email address'></input>
      <button type="submit" disabled={login}>{login?"Please wait":"SEND"}</button>
      <h5 className='already_account  to_sign_up sign_redirect' >Did you remember your password ?<span onClick={() => {setPage(1)}}> Sign in</span></h5>
      </form>
  }
      </div>
  </div>;
}

export default Signup;
