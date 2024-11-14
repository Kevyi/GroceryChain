import styles from "./componentsStyle/cartItem.module.css";
import logo from "../assets/react.svg";
import { IoBagHandle } from "react-icons/io5";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import React, { useState } from 'react';

export default function CartItem() {
    const [count, setCount] = useState(1); // Start with count as 1

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    return (
        <div id={styles["item"]}> 
            <div className={styles["container1"]}> 
                <div className={styles["image"]}> 
                    <img src=""/>
                </div>
                <div className={styles["details"]}>
                    <div className={styles["productName"]}>Product Name</div>
                    <div className={styles["description"]}>
                        Description
                    </div>
                </div>
            </div>
            
            <div className={styles["container2"]}>
                <div className={styles["amount"]}>
                    <div className={styles["price"]}>${(count * 0.00).toFixed(2)}</div>
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
                    <button>Delete</button>
                </div>
                <div className={styles["bagIcon"]}><IoBagHandle /></div>
            </div>
        </div>
    );
}
