import React, { useState } from 'react';
import styles from "./componentsStyle/groceryItem.module.css"
import PopUp from "./GroceryItemPopUp.jsx"

//Individual box for grocery item, should take parameters for each item.
        //Objects are items, functions are items.

        //Takes an object/dictionary that holds all the values for a grocery item ie. Weight, name, etc.



export default function GroceryItemBox({groceryItem}){


    const [isOpen, setIsOpen] = useState(false);

    const handleExpand = () => {
        setIsOpen(true);
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    //MUST CONSISTANTLY USE JPG TYPE. //Displayed by name, so img has to match name.
    const groceryItemImg = "/productImages/" + groceryItem.name.toLowerCase() + ".jpg";


    //Grocery item contains values: name, image, weight, description 
    return(<>

        {/*String Template can allow multiple classNames
        
                Do something that expands the box when clicked.
        */}
         <div className = {styles["box"]} onClick={handleExpand}>

            <div className = {styles["image"]}> 
                <img src = {groceryItemImg} alt= {groceryItem.name} ></img>
            </div>

            <p><strong>{groceryItem.name}</strong></p>

            <div className = {styles["price"]}>
                ${groceryItem.price}
            </div>

            <div className = {styles["description"]}>
            {groceryItem.description}
            </div>
        </div>  

        {isOpen && <PopUp onClose = {handleClose} groceryItem = {groceryItem}></PopUp>}
    
    </>)

}