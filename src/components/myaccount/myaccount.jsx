import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { auth } from '../../firebase';
import "./myaccount.css"
import { useHistory } from "react-router-dom";

function Myaccount() {
    let history = useHistory();
    const user = useSelector(selectUser);
    useEffect(() => {
        if(user===null){
            history.push("/login")     
 }
      }, [ user,history])
  return <div className='myaccount'>
      <button onClick={() => auth.signOut()}>sign out</button>
  </div>;
}

export default Myaccount;
