import React, { useState, useEffect } from 'react';
import GroceryTable from "../components/GroceryItemTable.jsx"
import styles from "../styles/grocery.module.css"
export default function GroceryPage(){


    const arrayOfItems = [];
    const temp = [
        {name : "apple", image : "Input Image", weight : "Input Weight", description : "Random description b", price : "$10"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b", price : "$10"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b", price : "$10"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b", price : "$10"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b", price : "$10"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b", price : "$10"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b", price : "$10"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b", price : "$10"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b", price : "$10"}
    ]
            //Store Items inside the localstorage!!!! 
                //Find out how to use it if not.



                //Auto runs on webpage start.
                useEffect(() => {
                    const fetchItems = async () => {
                           
                            try {
                              const response = await fetch('http://localhost:8080/groceryItems', {

                                //Methods: Get (Receives Data), Post (Send data to retrieve data), Put (Send data to update), 
                                //Delete(sends data to delete something), Patch (like put but minor)

                                    //This case technically we use method: 'get'. Backend has to follow method type.    

                                method: 'POST',
                                //request body will send a json
                                headers: { 'Content-Type': 'application/json' },

                                //This is shorthand notation of creating an object in JS, {variable} = {variable : "value"}
                                    //JSON.stringify() converts object to string value for easier transportation 
                                        //This case does not need to send back data.

                                    //body: JSON.stringify({ email }),
                              });
                              
                              //Receives data and parses to JS object.
                              const data = await response.json();
                              console.log(data)
                
                              for(let i = 0; i < data.length; i++){
                                //Pushes each food item into global array.
                                arrayOfItems.push(data[i])
                              }

                    
                            } catch (error) {
                              console.error('Error fetching tasks:', error);
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

                {/* <div className = {styles["column"]}>
                    This is where the column for the submission will be.
                </div> */}
                
                <div className = {styles["table"]}>
                    <GroceryTable groceryItems={temp}></GroceryTable>
                </div>
                
            </div>
        </div>
        

        </>

    )
}