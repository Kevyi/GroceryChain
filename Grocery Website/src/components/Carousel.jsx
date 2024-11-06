import React, { useRef } from 'react';
import styles from './componentsStyle/carousel.module.css';


export default function Carousel(){

    const items = [
        {name: 'Kroger® Non-Drowsy DayTime', quantity: '24 ct' },
        {name: 'Kroger® Daytime/NiteTime', quantity: '48 ct' },
        {name: 'Halls Relief Cherry Cough Drops', quantity: '80 ct' },
        {name: 'Ricola Cough Suppressant', quantity: '19 ct' },
        {name: 'Kroger® NightTime Cold', quantity: '24 ct' },
        {name: 'Ricola Cough Suppressant', quantity: '21 ct' },
        {name: 'Kroger® Maximum Strength', quantity: '24 ct' },
        {name: 'Kroger® Maximum Strength', quantity: '24 ct' },
        {name: 'Kroger® Maximum Strength', quantity: '24 ct' },
        
        // Add more items as needed
      ];
      
      
        const carouselRef = useRef(null);
     
      
        const scrollLeft = () => {
          carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        };
      
        const scrollRight = () => {
          carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        };
      
    return(<>
    
    

      <div className={styles["carousel-wrapper"]}>
        <button className= {styles["carousel-button left"]} onClick={scrollLeft}>
          &#8592;
        </button>

        <div className={styles["carousel"]} ref={carouselRef}>

          {items.map((item, index) => (
            <div key={index} className={styles["carousel-item"]}>
              <p>{item.name}</p>
              <p>{item.quantity}</p>
        
            </div>
          ))}

        </div>
        
        <button className= {styles["carousel-button right"]} onClick={scrollRight}>
          &#8594;
        </button>
      </div>

    
    
    </>)
}