import styles from "../styles/home.module.css"

export default function Home(){


    const footerText = "Testing2131231.";
return (
    <>    
    <div id = {styles["main"]}>

    
        <div className = {styles["header"]}>
            <h1 style={{fontSize: "100px", margin : 0, textAlign:"center"}}><b>Grocery Store</b></h1>
            <iframe src="" title="description" style = {{height:"60vh"}}></iframe>
        </div>

        <div className = {"footer"}>

            <p>This is the footer with Overflow capabilities</p>
            <p>{footerText}</p>
            <p>{footerText}</p>
            <p>{footerText}</p>
            <p>{footerText}</p>
            <p>{footerText}</p>


        </div>
    </div>  
    </>
)
}