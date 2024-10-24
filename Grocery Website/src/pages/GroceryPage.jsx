import GroceryTable from "../components/GroceryItemTable.jsx"
import styles from "../styles/grocery.module.css"
export default function GroceryPage(){


    const temp = [
        {name : "apple", image : "Input Image", weight : "Input Weight", description : "Random description b"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b"},
        {name : "banana", image : "Input Image dsadas", weight : "Input Weight", description : "Random description b"}
    ]


    return (

        <>

        <p><strong>Welcome to the Grocery page User! Some random stuff.</strong></p>
        
        <div className = {styles["page"]}>
            <div className = {styles["column"]}>
                    This is where the column for the submission will be.
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