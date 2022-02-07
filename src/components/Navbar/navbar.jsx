import React, { useState } from 'react';
import "./navbar.scss"
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems"
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';


const Navbar=()=> {
    const user = useSelector(selectUser);
    const[clicked,setClicked]=useState(false);
  return   <div className="navigation">

<input type="checkbox" readOnly checked={clicked} onClick={() => {setClicked(!clicked)}} className="navigation__checkbox" id="navi-toggle"></input>

<label htmlFor="navi-toggle" className="navigation__button">
    <span className="navigation__icon">&nbsp;</span>
</label>

<div className="navigation__background">&nbsp;</div>

<nav className="navigation__nav">
    <ul className="navigation__list">
            {MenuItems.map((item, index) => {
                return (
                   
                   
                    <li  key={index}  className="navigation__item">

                        <Link  key={index} onClick={() => {clicked && setClicked(!clicked)}} to={clicked && (item.title==="Sign in" && user?"/myaccount":item.url)} className="navigation__link">
                        <p key={index}>{item.title==="Sign in" && user?"My Account":item.title}</p>
                        </Link>
                     
                        </li>
                    
             
                )

        })}
    
        </ul>
</nav>

 
</div>
}

export  default Navbar;


