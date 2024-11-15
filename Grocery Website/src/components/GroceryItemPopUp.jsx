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

        if(!localStorage.getItem('items')){
            localStorage.setItem('items', '{}');
        }

        let items = JSON.parse(localStorage.getItem('items'));

        //Current a JSON object, set/add item thorugh this:

        //Sets item to amount, Ex apple : 5 for 5 apples.
        items['itemName'] = 5;

        //parses json object back into a string and set.
        localStorage.setItem('items', JSON.stringify(items));

        //clears localstorage, used for testing.
        localStorage.clear();


        //also calls onClose() method to close the component.
        onClose();
    };


    return(<>
    
        <div className = {styles["popup-overlay"]}>
            
            <div className = {styles["popup-content"]}>
                <button className = {styles["close-button"]} onClick = {onClose}>
                    X
                </button>

                <div className = {styles["left-side"]}>
                    <div className = {styles["temp-box"]}>
                        place Image here
                    </div>
                    <h2 style={{ margin: '0px 10px 10px', fontSize: '24px' }}>Description</h2>
                    <div className = {styles["description"]}>
                        This is a scrollable description thing. Can be scrolled if description is too long
                        but provbaby will never be that long.
                        

                        description
                    </div>

                </div>
                
                <div className = {styles["verticalLine"]}></div>

                <div className = {styles["right-side"]}>
                    <h1>Details</h1>

                    <div className = {styles['details']}>
                        <div>Name</div>
                        <div>Price</div>
                        <div>Weight</div>
                        <div>Availability</div>
                    </div>
                    

                    <div className={styles["quantity"]}>
                        <p>Quantity:   </p>
                        <input 
                            className={styles["value"]} 
                            value={count} 
                        />
                        <div className={styles["counterBox"]}>
                            <button onClick={increment}><FaChevronUp /></button>
                            <button onClick={decrement}><FaChevronDown /></button> 
                        </div>
                    </div>

                    <button type = "submit" className = {styles["add-button"]} onClick = {updateData}>Add</button>
                    
                </div>


            </div>
            
        </div>
       
    
    </>)

}
