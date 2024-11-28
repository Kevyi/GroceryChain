import styles from "./componentsStyle/cartItem.module.css";
import logo from "../assets/react.svg";
import { IoBagHandle } from "react-icons/io5";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import React, { useState, useEffect } from 'react';


export default function CartItem({groceryItem, shopCount}) {
    const [count, setCount] = useState(shopCount); // Start with count as 1
    const [item, setItem] = useState({});
    const [show, setShow] = useState(true);
    const itemName = "empty";


    const increment = () => {
        //Gets last up to date count value and adds
        setCount((prev) => prev + 1);

        //Updates count in shoppingcart localstorage.
        let items = JSON.parse(localStorage.getItem('cartItems'));
        
        if(groceryItem in items){
            items[groceryItem] = count + 1;
        }
        
        localStorage.setItem('cartItems', JSON.stringify(items));
    };

    const decrement = () => {
        //Gets last up to date count value and subtracts
        if (count > 1) {
            setCount((prev) => prev - 1);

            //Updates count in shoppingcart localstorage.
            let items = JSON.parse(localStorage.getItem('cartItems'));
            
            if(groceryItem in items){
                items[groceryItem] = count - 1;
            }
            
            localStorage.setItem('cartItems', JSON.stringify(items));
        }
        
    };

    const deleteItem = () => {

        let items = JSON.parse(localStorage.getItem('cartItems'));


        //Doesn't work as groceryItem is a string, and it's looking for a property.
        //delete items.groceryItem

        //Must access like an array with string.
        delete items[groceryItem]
        
        
        localStorage.setItem('cartItems', JSON.stringify(items));
        setShow(false);

    }

    useEffect(() => {
        const fetchItem = async () => {
             try{
                const response = await fetch("http://localhost:8080/shopping-cart/groceryItems", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      item : groceryItem
                    })
                });

                if(!response.ok){
                    console.error('Error, reponse not ok');
                    return;
                }

                const data = await response.json(); //parses json automatically.

                //Accesses the first object given back, which there is only one.
                //console.log(data.results[0])

                //Accesses results key pair value and returns back an object.
                setItem(data.results[0]);
                //console.log(item)
                setCount(shopCount);
                



                
             }  
             catch(error){
                console.error('Error: ' + error);
             }
            
            

        };
        fetchItem();
      }, [] );



    //Has to be done this way for some reason as states aren't used as valid variables because they are null.
      //So can't really use variables in this way if it's a rendered piece of information.
    const itemImg = "/productImages/" + groceryItem.toLowerCase() + ".jpg";
    

    return (
        <>
        {/* Shows only if it isn't deleted. */}
        {show ? (
                    <div id={styles["item"]}> 
                    <div className={styles["container1"]}> 
                        <div className={styles["image"]}> 
                            <img src={itemImg}/>
                        </div>
                        <div className={styles["details"]}>
                            <div className={styles["productName"]}>{item.name}</div>
        
                            {/* Set max width and height then made description box scrollable. */}
                            <div className={styles["description"]}>
                                {item.description}
                            </div>
                        </div>
                    </div>
                    

                    <div className={styles["container2"]}>
                        <div className={styles["amount"]}>

                            <div className={styles["details"]}>
                                <p className = {styles["total"]}>Total Pounds: </p>
                                {(count * item.weight).toFixed(2)}

                                <p className = {styles["individual"]}>Individual Pounds: 
                                <strong> {item.weight}</strong>
                                </p> 
                            </div>

                            <div className={styles["details"]}>
                                <p className = {styles["total"]}>Total Price: </p> 
                                ${(count * item.price).toFixed(2)}

                                <p className = {styles["individual"]}>Individual Price: 
                                    <strong> {item.price}</strong>
                                </p> 
                            </div>

                            <div className={styles["quantity"]}>Quantity:
                                <input 
                                    className={styles["value"]} 
                                    value={count} 
                                />
                                <div className={styles["counterBox"]}>
                                    <button onClick={increment}><FaChevronUp /></button>
                                    <button onClick={decrement}><FaChevronDown /></button> 
                                </div>
                            </div>
                        </div>
                        

                        <div className={styles["buttons-div"]}>
                            <button className = {styles["delete-button"]} onClick = {deleteItem}>Delete</button>
                        </div>
                        <div className={styles["bagIcon"]}><IoBagHandle /></div>
                    </div>
                </div>
        ) : (
            <div>
            </div>
        )}

    </>
    );
    
}
