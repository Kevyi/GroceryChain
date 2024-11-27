import React, { useState, useEffect } from 'react';
import GroceryTable from "../components/GroceryItemTable.jsx"
import styles from "../styles/grocery.module.css"
export default function GroceryPage(){


    const [groceryItems, setGroceryItems] = useState([]);
    const [categories, setCategories] = useState({
                dairy: false, 
                fruit: false, 
                vegetable : false, 
                grain : false, 
                meat : false,
            });
    let allGroceryItems;

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
                            allGroceryItems = data.results;
                         }  
                         catch(error){
                            console.error('Error: ' + error);
                         }
                        
                        

                    };
                    fetchItems();

                    //Whenever category changes, update the states.



                  }, [categories] );
                  //Empty [] above is the dependency array, useEffect runs once if empty or runs everytime a variable in array is updated.


                const categoryChange = (e) =>{
                    const { name, checked } = e.target;
                    setUserInfo({ ...userInfo, [name]:  checked, });
                };       


                function categorize(){
                    //changes the state groceryItem using allgroceryitems array.
                    return;
                }




            //Include a reset all checkbox.
    return (

        <>
        <p><strong>Welcome to the Grocery page User! Some random stuff.</strong></p>
        
        <div className = {styles["page"]}>
            <div className = {styles["column"]}>
                    <form className = {styles["category"]} onChange = {categoryChange}>
                        <fieldset>
                            <legend>
                                <strong style = {{fontSize: "20px"}}>Category Selector</strong>
                            </legend>
                            <div className = {styles["category-item"]}>
                                <label for="dairy">Dairy</label>
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    type="checkbox" 
                                    name="dairy"/>
                                
                            </div>
                            <div className = {styles["category-item"]}>
                                <label for="fruit">Fruits</label>
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    type="checkbox" 
                                    name="fruit"/>
                                
                            </div>
                            <div className = {styles["category-item"]}>
                                <label for="vegetable">Vegetables</label>    
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    type="checkbox" 
                                    name="vegetable"/>
                                
                            </div>
                            <div className = {styles["category-item"]}>
                                <label for="grain">Grains</label>
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    type="checkbox" 
                                    name="grain"/>
                                
                            </div>
                            <div className = {styles["category-item"]}>
                                <label for="meat">Meat</label>
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    type="checkbox" 
                                    name="meat"/>

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