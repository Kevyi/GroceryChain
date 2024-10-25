import React, { useState } from 'react';
import styles from "./componentsStyle/groceryItem.module.css"

//Individual box for grocery item, should take parameters for each item.
        //Objects are items, functions are items.

        //Takes an object/dictionary that holds all the values for a grocery item ie. Weight, name, etc.
export default function GroceryItemBox({groceryItem}){

    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    
    //Grocery item contains values: name, image, weight, description 
    return(<>

        {/*String Template can allow multiple classNames
        
                Do something that expands the box when clicked.
        */}
         <div className = {styles["box"]}>
            <div className = {styles["image"]}> 
                {groceryItem.image}
            </div>
            <p><strong>{groceryItem.name}</strong></p>
            <div>
            {groceryItem.description}
            </div>

        </div>  
    
    </>)

}