import styles from "../styles/home.module.css"
import Carousel from "../components/Carousel.jsx"

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

        <div className = {styles["center-carousel"]}>
            <h2>Fall Wellness Essentials</h2>
            <Carousel></Carousel>
        </div>
         
        
        <div className = {styles["footer"]}>

            <a href = "https://github.com/Kevyi/GroceryChain" >Contributions @ https://github.com/Kevyi/GroceryChain </a>

        </div>
    </div>  
    </>
)
}