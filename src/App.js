import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Switch,Route } from 'react-router-dom';
import './App.css';
import MetaTags from 'react-meta-tags';
import {useDispatch, useSelector} from "react-redux"
import Events from './components/events/events';
import Header from './components/header/header';
import {login,logout, selectUser} from "./features/userSlice"
import Navbar from './components/Navbar/navbar';
import Signup from './components/signup/signup';
import db, { auth } from './firebase';
import {int,out, selectsub} from "./features/subSlice"
import Myaccount from './components/myaccount/myaccount';
import Eventdetails from './components/eventdetails/eventdetails';
import Spinner from './components/Spinner';
import ScrollToTop from './components/Scroll';
function App() {
  const user = useSelector(selectUser);
  const address=useSelector(selectsub)
  const dispatch = useDispatch();
  const [products,setProducts]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(() =>{
    setLoading(true)
    db.collection("products")
    .where("active","==",true)
    .get()
     .then((querySnapshot) =>{
        const products= {};
        querySnapshot.forEach(async productDoc =>{
            products[productDoc.id] =productDoc.data();
            const priceSnap = await productDoc.ref.collection("prices").get();
            priceSnap.docs.forEach((price) => {
                products[productDoc.id].prices ={
                    priceId: price.id,
                    priceData: price.data(),
                }
            })
     
        })
        setProducts(products);
        setLoading(false)
    })
        },[]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth =>{
      if(userAuth){
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email
        }));
        
      }else{
        dispatch(logout());
          dispatch(out())
      }
    });

    return () =>{
      unsubscribe();
    }
  },[dispatch])
  useEffect(() => {
    if(user!==null){
    db.collection('customers')
     .doc(user && user.uid).get('user1')
     .then(querySnapshop =>{
       if(querySnapshop.exists){
        dispatch(int({
          userdetails:querySnapshop.data().user1,}
        ))
       }else{

       }   
     }) 
    }
   }, [dispatch,user])

   
 console.log(user,address)
 if (loading) {
  return   <Spinner />
}
  return (
    <BrowserRouter>
    <ScrollToTop/>
  <div className="app">
  <MetaTags>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    </MetaTags>
  </div>
     <Navbar/>
  
      <Switch>
      <Route exact path="/">
  
      <Header/>
</Route>
      <Route exact path= "/events">
<Events products={products}/>
</Route>
<Route exact path= "/login">
<Signup/>
</Route>
<Route exact path="/myaccount">
  <Myaccount/>
</Route>
<Route exact path="/eventdetails/:id">
  <Eventdetails products={products}/>
</Route>
      </Switch>
    </BrowserRouter>
    

  );
}

export default App;
