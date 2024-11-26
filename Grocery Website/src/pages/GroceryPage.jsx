import React, { useState, useEffect } from 'react';
import GroceryTable from "../components/GroceryItemTable.jsx"
import styles from "../styles/grocery.module.css"
export default function GroceryPage(){


    const [groceryItems, setGroceryItems] = useState([]);

//Use .filter


            //Store Items inside the localstorage!!!! 
                //Find out how to use it if not.

                //Auto runs on webpage start.

                //Ran twice for some reason;
                useEffect(() => {
                    const fetchItems = async () => {
                         try{
                            const response = await fetch("http://localhost:8080/grocery-page/groceryItems");

                            if(!response.ok){
                                console.error('Error, reponse not ok');
                                return;
                            }

                            const data = await response.json();
                            
                            // console.log(data.results);
                            
                            //Displayed by name, so img has to match name.
                            //Sets an array of objects which each object is the product.
                            setGroceryItems(data.results);
                         }  
                         catch(error){
                            console.error('Error: ' + error);
                         }
                        
                        

                    };
                    fetchItems();
                  }, [] );
                  //Empty [] above is the dependency array, useEffect runs once if empty or runs everytime a variable in array is updated.


            const test = () => {
                //If nothing is checked, show everything. Else filter.
                    

                //Query database to get category. If multiple, query to get category && otherCategory etc.
                    

                //This function should be ran everytime a checkbox is clicked or updated.

            }          



            //Include a reset all checkbox.
    return (

        <>
        <p><strong>Welcome to the Grocery page User! Some random stuff.</strong></p>
        
        <div className = {styles["page"]}>
            <div className = {styles["column"]}>
                    <form id = {styles["category"]} onChange = {test}>
                        <fieldset>
                            <legend>Category Selector</legend>
                            <div className = {styles["category-item"]}>
                                <input type="checkbox" id="scales" name="scales"/>
                                <label for="scales">Scales</label>
                            </div>
                            <div className = {styles["category-item"]}>
                                <input type="checkbox" id="scales" name="scales"/>
                                <label for="scales">Scales</label>
                            </div>
                            <div className = {styles["category-item"]}>
                                <input type="checkbox" id="scales" name="scales"/>
                                <label for="scales">Scales</label>
                            </div>
                            <div className = {styles["category-item"]}>
                                <input type="checkbox" id="scales" name="scales"/>
                                <label for="scales">Scales</label>
                            </div>
                            <div className = {styles["category-item"]}>
                                <input type="checkbox" id="scales" name="scales"/>
                                <label for="scales">Scales</label>
                            </div>

                            {/*Include a reset all checkbox. */}
                        </fieldset>
                    </form>
            </div>

            <div id = {styles["main"]}>

                    <GroceryTable groceryItems={groceryItems}></GroceryTable>
                
                
            </div>
        </div>
        

        </>

    )
}