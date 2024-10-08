import "../styles/home.css"

export default function Home(){


    const footerText = "Testing.";
return (
    <>    
    <div className = "homeMain">

    
        <div className = {"header"}>
            <h1 style={{fontSize: "100px", margin : 0}}><b>Grocery Store</b></h1>
            <div><p>Testing12345</p></div>
        </div>

        <div className = {"footer"}>

            <p>{footerText}</p>
        </div>
    </div>  
    </>
)
}