import React, { useRef } from 'react';
import products from '../pages/Product.jsx';
import styles from './componentsStyle/carousel.module.css';

export default function Carousel() {
    const limitedProducts = [...products.slice(0,8)];
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        const scrollAmount = 120 + 20; // Item width + gap
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    };

    const scrollRight = () => {
        const scrollAmount = 120 + 20; // Item width + gap
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className={styles.carouselWrapper}>
            <button className={`${styles.carouselButton} ${styles.left}`} onClick={scrollLeft}>
                &#8592;
            </button>
            <div className={styles.carousel} ref={carouselRef}>
                {limitedProducts.map((product, index) => (
                    <div key={index} className={styles.carouselItem}>
                        <img src={product.image} alt={product.title} className={styles.productImage} />
                        <h3 className={styles.productTitle}>{product.title}</h3>
                        <p className={styles.productWeight}>{product.weight} lb</p>
                    </div>
                ))}
            </div>
            <button className={`${styles.carouselButton} ${styles.right}`} onClick={scrollRight}>
                &#8594;
            </button>
        </div>
    );
}
