import styles from "./componentsStyle/groceryTable.module.css"
import GroceryItemBox from "./GroceryItemBox.jsx"
//This will hold the groceryItemBoxes in a table. 

//Should take an array of groceryItems

        //The {} usually means an object, but here it means object destructuring.
            //Don't have to do this and get one object as argument and access values inside through paramName.value to be selected;
        export default function GroceryItemTable({groceryItems}){
            return(<>
            
                <div className = {styles["grocery-table"]}>
                    {/*Maps each object inside groceryItems array*/}
                    {groceryItems.map((groceryItem, index) => (
                        <GroceryItemBox
                        key={index}
                        groceryItem={groceryItem}
                        />
                    ))}
                </div>
            </>)
        }