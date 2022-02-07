import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { selectUser } from '../../features/userSlice';
import db from '../../firebase';
import "./eventdetails.css"

const  Eventdetails=({products})=> {
    
  let history = useHistory();
    const {id } = useParams()
    const user = useSelector(selectUser);
    const [loading,setLoading]=useState(false);
    const [productdetails,setProductdetails]=useState();
    console.log(productdetails)
    useEffect(() => {
        const id = window.location.pathname.split("/");
        if(products && id.length>2){   
            Object.entries(products).forEach(([productId,productData]) =>{
if(productId===id[2]){
    setProductdetails(productData)
}
            })
 }
       }, [products,id])
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
                alert(`An error occured: ${error.message}`);
            }
            if(sessionId){
                const stripe = await loadStripe(
                    "pk_test_51KPNMzSIUM6znhH9DetovZKYWjQtiR6qLzf68TBpYZDrEaaE28cd26Abhy6e0ztXkF4kDVhsrOZvWE3W1uDsn0eQ00z6nTqaes"
                     )
                stripe.redirectToCheckout({sessionId});
                setLoading(false)
            }
        })
    };

  return         <LoadingOverlay
  active={loading}
     spinner={<ClipLoader color="red" />}
><div className='eventdetails'>
  
      <div className="details_div">

<div className="details_sub main">
<h1>{productdetails && productdetails.name}</h1>
    <div className="image_div">
        <img alt="details_page_img" src={productdetails ? productdetails.images[0]:""}></img>
    </div>
    <div className="sub_details_div">
        <p>{productdetails && productdetails.description}</p>
        <br></br>
        <p>Head - {productdetails && productdetails.stripe_metadata_Head}</p>
        <p>Sub Head - {productdetails && productdetails.stripe_metadata_Subhead}</p>
        <br></br>
        <button   onClick={() =>{user?loadCheckout(productdetails.prices.priceId):history.push('/login')}} >Book ticket</button>
        <br></br>
        <h1>Rules and Regulations</h1>
        <br></br>
<div dangerouslySetInnerHTML={{__html:productdetails&& productdetails.stripe_metadata_rules}}></div>
    </div>
</div>

<div className="details_sub second">
<h3 className='related'>Related events</h3>
    {        Object.entries(products).map(([productId,productData]) =>{
        return(
    
                 <div
                 key={productId}
                  className="events_component events_component1">
                     <div className="events_com_sub container events_com_sub1">
                      {productData.images.length!==0 &&  <img  className="image" alt='event_image' src={productData.images[0]}></img>}
                      <Link   to={`/eventdetails/${productId}`} >                    <div class="overlay">
    <div class="text">View details</div>
  </div></Link>


                      </div>
                      <div className="events_com_sub two events_com_sub1 two1">
                      <h5>{productData.name}</h5>
                         <h6>{productData.description}</h6>
                         <div className="two_flex two_flex1">
                             <Link  className='events_com_button events_com_button1' to={`/eventdetails/${productId}`} ><p>View Details</p></Link>
                         <button onClick={() => {user?loadCheckout(productdetails.prices.priceId):history.push('/login')}} className='events_com_button events_com_button1 black'>Book ticket</button>
                         </div>
                      
                      </div>

                       
                    
                 </div>

    )})}
</div>
      </div>
  </div>
</LoadingOverlay>
}

export default Eventdetails;
