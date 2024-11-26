import React, { useState } from 'react';
import styles from "./componentsStyle/popUp.module.css"

import { IoBagHandle } from "react-icons/io5";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";

export default function PopUp({onClose, groceryItem}){

    //Local storage only stores string, so have to stringify
        //Will be used to store data in cart! NEVER DELETE items KEY PAIR VALUE, just set it to none for nothing.

    const [count, setCount] = useState(1); // Start with count as 1

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const updateData = () => {

        if(!localStorage.getItem('cartItems')){
            localStorage.setItem('cartItems', '{}');
        }

        let items = JSON.parse(localStorage.getItem('cartItems'));

        //Current a JSON object, set/add item thorugh this:

        //Sets item to amount, Ex apple : 5 for 5 apples. If item is already added, add more to it.
        const itemName = groceryItem.name;
        if(itemName in items){
            items[itemName] = items[itemName] + count;
        }
        else{
            items[itemName] = count;
        }

        
        
        

        //parses json object back into a string and set.
        localStorage.setItem('cartItems', JSON.stringify(items));

        console.log("Done");

        //also calls onClose() method to close the component.
        onClose();
    };



    const groceryItemImg = "/productImages/" + groceryItem.name.toLowerCase() + ".jpg";

    return(<>
    
        <div className = {styles["popup-overlay"]}>
            
            <div className = {styles["popup-content"]}>
                <button className = {styles["close-button"]} onClick = {onClose}>
                    X
                </button>

                <div className = {styles["left-side"]}>
                    <div className = {styles["temp-box"]}>

                        <img src = {groceryItemImg}></img>

                    </div>
                    <h2 style={{ margin: '0px 10px 10px', fontSize: '24px' }}>Description</h2>
                    <div className = {styles["description"]}>
                        
                        {groceryItem.description}

                       
                    </div>

                </div>
                
                <div className = {styles["verticalLine"]}></div>

                <div className = {styles["right-side"]}>
                    <h1>Details</h1>

                    <div className = {styles['details']}>
                        
                        <div>
                            <h2>Name: {groceryItem.name}</h2>
                        </div>

                        <div>
                            <strong>Price: {groceryItem.price}</strong>
                        </div>

                        <div>
                            Weight: {groceryItem.weight}
                        </div>
                        <div>
                            Stock: {groceryItem.stock}
                        </div>
                    </div>
                    

                    <div className={styles["quantity"]}>
                        <p>Quantity:   </p>
                        <input 
                            className={styles["value"]} 
                            value={count} 
                        />
                        <div className={styles["counterBox"]}>
                            <button className = {styles["upDownButton"]} onClick={increment}><FaChevronUp /></button>
                            <button className = {styles["upDownButton"]} onClick={decrement}><FaChevronDown /></button> 
                        </div>
                    </div>

                    <button type = "submit" className = {styles["add-button"]} onClick = {updateData}>Add To Cart</button>
                    
                </div>


            </div>
            
        </div>
       
    
    </>)

}
