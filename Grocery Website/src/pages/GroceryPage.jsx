import React, { useState, useEffect } from 'react';
import GroceryTable from "../components/GroceryItemTable.jsx"
import styles from "../styles/grocery.module.css"
export default function GroceryPage(){


    const [groceryItems, setGroceryItems] = useState([]);
    const [categories, setCategories] = useState({
                Dairy: false, 
                Fruit: false, 
                Vegetable : false, 
                Grain : false, 
                Meat : false,
                Nut : false,
            });

    //Holds all the grocery items, static.
    let allGroceryItems;
    let temp;




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

                            //Call categorize.
                            allGroceryItems = data.results;
                            
                            

                            //Filters out allGroceryItems and provided all the items to be reset depending on category selector.
                            setGroceryItems(categorize());
                            // setGroceryItems(data.results);
                            
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
                    setCategories({ ...categories, [name]:  checked, });
                };      
                
                const resetCategory = (e) => {
                    setCategories({ Dairy: false, 
                        Fruit: false, 
                        Vegetable : false, 
                        Grain : false, 
                        Meat : false,
                        Nut : false, });

  
                }


                function categorize(){
                    //changes the state groceryItem using allgroceryitems array.

                  

                    //CAP SENSITIVE, first letter cap.
                        //Converts dictionary to array and filter by boolean then by key to get Key's name.
                    const filteredCategories = 
                        Object.entries(categories).filter(([key, value]) => value).map(([key, value]) => key).map(String);



                    //If the category selector has none selected then return all grocery items to be listed.    
                    if(JSON.stringify(filteredCategories) === "[]") return allGroceryItems;    

                    const isSubset =(arr1, arr2) => {
                        return arr1.every(value => arr2.includes(value));
                      }

                    const result = allGroceryItems.filter((groceryItem) =>
                    
                        //CAP SENSITIVE
                        // groceryItem.categories.includes("Vegetable")

                        //Checks by comparing their array values.
                        // JSON.parse(groceryItem.categories).every(value=> JSON.parse(JSON.stringify(filteredCategories)).includes(value))
                        isSubset(JSON.parse(JSON.stringify(filteredCategories)), JSON.parse(groceryItem.categories))
                    );
                    console.log(JSON.parse(allGroceryItems[6].categories));
                    console.log(JSON.parse(JSON.stringify(filteredCategories)));
                    
                    return result;
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
                                    value = {categories.Dairy}
                                    type="checkbox" 
                                    name="dairy"/>
                                
                            </div>
                            <div className = {styles["category-item"]}>
                                <label for="fruit">Fruits</label>
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    value = {categories.Fruit}
                                    type="checkbox" 
                                    name="fruit"/>
                                
                            </div>
                            <div className = {styles["category-item"]}>
                                <label for="vegetable">Vegetables</label>    
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    value = {categories.Vegetable}
                                    type="checkbox" 
                                    name="vegetable"/>
                                
                            </div>
                            <div className = {styles["category-item"]}>
                                <label for="grain">Grains</label>
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    value = {categories.Grain}
                                    type="checkbox" 
                                    name="grain"/>
                                
                            </div>
                            <div className = {styles["category-item"]}>
                                <label for="meat">Meat</label>
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    value = {categories.Meat}
                                    type="checkbox" 
                                    name="meat"/>

                            </div>
                            <div className = {styles["category-item"]}>
                                <label for="nut">Nuts</label>
                                <input 
                                    className = {styles["category-checkbox"]} 
                                    value = {categories.Nut}
                                    type="checkbox" 
                                    name="nut"/>

                            </div>
                            

                            {/*Include a reset all checkbox. */}
                            {/* <button type = "button" className = {styles["reset-category-button"]} onClick = {resetCategory}>Reset</button> */}
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