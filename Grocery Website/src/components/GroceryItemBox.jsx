import React, { useState } from 'react';
import styles from "./componentsStyle/groceryItem.module.css"

//Individual box for grocery item, should take parameters for each item.
        //Objects are items, functions are items.

        //Takes an object/dictionary that holds all the values for a grocery item ie. Weight, name, etc.


function PopUp({onClose}){

    return(<>
    
        <div onClick = {onClose}>Hellow this is bob</div>
        <button onClick = {onClose}></button>
    
    </>)

}


export default function GroceryItemBox({groceryItem}){


    const [isOpen, setIsOpen] = useState(false);

    const handleExpand = () => {
        setIsOpen(true);
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    
    //Grocery item contains values: name, image, weight, description 
    return(<>

        {/*String Template can allow multiple classNames
        
                Do something that expands the box when clicked.
        */}
         <div className = {styles["box"]} onClick={handleExpand}>

            <div className = {styles["image"]}> 
                {groceryItem.image}
            </div>

            <p><strong>{groceryItem.name}</strong></p>

            <div>
            {groceryItem.description}
            </div>

            <div>
            {groceryItem.price}
            </div>

            {isOpen && ( <PopUp onClose={handleClose} /> )}

        </div>  
    
    </>)

}