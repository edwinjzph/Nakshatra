import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import db from '../../firebase';
import { Link } from "react-router-dom";
import "./events.css"
import LoadingOverlay from 'react-loading-overlay';
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Events =({products}) =>  {
  let history = useHistory();
    const user = useSelector(selectUser);
    const [loading,setLoading]=useState(false);
        const loadCheckout = async (priceId) => {
            setLoading(true)
          const docRef =await db
          .collection("customers")
          .doc(user.uid)
          .collection("checkout_sessions")
          .add({
            mode: "payment",     
              price: priceId,
                success_url: window.location.origin,
                   cancel_url: window.location.origin,
              });
          docRef.onSnapshot(async(snap) => {
              const{ error,sessionId} =snap.data();
              if(error){
                setLoading(false)
                  alert(`An error occured: ${error.message}`);
              }
              if(sessionId){
                  const stripe = await loadStripe(
                      "pk_test_51KPNMzSIUM6znhH9DetovZKYWjQtiR6qLzf68TBpYZDrEaaE28cd26Abhy6e0ztXkF4kDVhsrOZvWE3W1uDsn0eQ00z6nTqaes"
                       )
                  stripe.redirectToCheckout({sessionId}).then(
                    setLoading(false)
                  )
                
              }
          })
      };
     console.log(products);
  return   <LoadingOverlay
  active={loading}
     spinner={<ClipLoader color="red" />}
><div  className='events'>
<h1>Events</h1>
{Object.entries(products).map(([productId,productData]) =>{
                return(

                    <div
                    key={productId}
                     className="events_component">
                        <div className="events_com_sub container">
                            
                         {productData.images.length!==0 &&  <img  className="image" alt='event_image' src={productData.images[0]}></img>}
                         <Link   to={`/eventdetails/${productId}`} >                    <div class="overlay">
    <div class="text">View details</div>
  </div></Link>
     
  

                         </div>
                         <div className="events_com_sub two">
                         <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                            <div className="two_flex">
                                <Link  className='events_com_button' to={`/eventdetails/${productId}`} ><p>View Details</p></Link>
                            <button onClick={() => {user?loadCheckout(productData.prices.priceId):history.push('/login')}} className='events_com_button black'>Book ticket</button>
                            </div>
                         
                         </div>

                          
                       
                    </div>
                )
            })}
  </div>
  </LoadingOverlay> 
}

export default Events;
