import styles from "../styles/home.module.css"

export default function Home(){

return (
    <>    
    <div id = {styles["main"]}>

    
        <div className = {styles["header"]}>
            <h1 style={{fontSize: "50px", margin : 0, textAlign:"center"}}>
                Good Eats
            </h1>
            <iframe src="" title="description" style = {{height:"60vh"}}></iframe>
        </div>

        <div className = {styles["footer"]}>

            <a href = "https://github.com/Kevyi/GroceryChain" >Contributions @ https://github.com/Kevyi/GroceryChain </a>

        </div>
    </div>  
    </>
)
}