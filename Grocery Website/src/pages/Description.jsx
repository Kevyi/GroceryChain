import React, { useState, useEffect } from "react";
import styles from "../styles/description.module.css";

const productDetailsMap = {
    "001": {
        title: "Coconut",
        detailedDescription: "A fresh, organic coconut perfect for cooking or eating raw. Rich in vitamins and minerals.",
        specifications: {
            origin: "Thailand",
            size: "Medium",
            organic: "Yes",
            type: "Fruit",
            
        },
        price: "$2.50",
        weight: "1 lb",
        image: "images/Coconut.jpeg"
    },
    "002": {
        title: "Apple",
        detailedDescription: "A juicy, organic apple that's perfect for snacking and baking. Full of antioxidants and fiber.",
        specifications: {
            variety: "Fuji",
            origin: "USA",
            organic: "Yes",
            type: "Fruit",
            
        },
        price: "$1.00",
        weight: "0.33 lb",
        image: "images/Apple.jpeg"
    },
    "003": {
    title: "Honeycrisp Apple",
    detailedDescription: "Experience the perfect balance of sweetness and crispness with our organic Honeycrisp apple.",
    specifications: {
        variety: "Honeycrisp",
        origin: "USA",
        organic: "No",
        type: "Fruit",
       
    },
    price: "$1.50",
    weight: "0.33 lb",
    image: "images/apples_honeycrisp.png"   
    },
    "004": {
        title: "Banana",
        detailedDescription: "A sweet and nutritious organic banana, perfect for a quick snack or smoothie.",
        specifications: {
            origin: "Ecuador",
            size: "Medium",
            organic: "Yes",
            type: "Fruit",
            
        },
        price: "$0.25",
        weight: "0.25 lb",
        image: "images/banana.jpeg"
    },
    "005": {
        title: "Watermelon",
        detailedDescription: "A large, organic watermelon that's juicy and refreshing. Perfect for summer days.",
        specifications: {
            origin: "USA",
            size: "Large",
            organic: "Yes",
            type: "Fruit",
          
        },
        price: "$6.00",
        weight: "10 lbs",
        image: "images/Watermelon.jpg"
    },
    "006": {
        title: "Broccoli",
        detailedDescription: "Organic broccoli, a healthy vegetable loaded with nutrients and antioxidants.",
        specifications: {
            origin: "USA",
            size: "1 lb Bunch",
            organic: "Yes",
            type: "Vegetable",
            
        },
        price: "$1.50",
        weight: "1 lb",
        image: "images/Broccoli.jpg"
    },
    "007": {
        title: "Tomato",
        detailedDescription: "Organic tomatoes, fresh and perfect for salads, sandwiches, and cooking.",
        specifications: {
            variety: "Roma",
            origin: "USA",
            organic: "Yes",
            type: "Vegetable",
          
        },
        price: "$1.20",
        weight: "0.33 lb",
        image: "images/Tomato.jpg"
    },
    "008": {
        title: "Cucumber",
        detailedDescription: "A fresh and organic cucumber, great for salads and snacks.",
        specifications: {
            origin: "Mexico",
            size: "Medium",
            organic: "Yes",
            type: "Vegetable",
            
        },
        price: "$0.89",
        weight: "0.5 lb",
        image: "images/Cucumber.jpg"
    },
    "009": {
        title: "Orange",
        detailedDescription: "Fresh and juicy oranges, a great source of vitamin C and antioxidants.",
        specifications: {
            variety: "Navel",
            origin: "Florida, USA",
            organic: "No",
            type: "Fruit",
           
        },
        price: "$0.60",
        weight: "0.4 lb",
        image: "images/Orange.jpg"
    },
    "010": {
        title: "Pineapple",
        detailedDescription: "A sweet, tropical pineapple that’s perfect for smoothies and desserts.",
        specifications: {
            origin: "Costa Rica",
            size: "Large",
            organic: "Yes",
            type: "Fruit",
            
        },
        price: "$3.50",
        weight: "2.5 lbs",
        image: "images/Pineapple.jpg"
    },
    "011": {
        title: "Carrot",
        detailedDescription: "Crunchy organic carrots, great for snacking and cooking.",
        specifications: {
            origin: "USA",
            size: "Medium",
            organic: "Yes",
            type: "Vegetable",
           
        },
        price: "$1.10",
        weight: "0.25 lb",
        image: "images/Carrot.jpg"
    },
    "012": {
        title: "Potato",
        detailedDescription: "Non-organic potatoes, perfect for baking, mashing, or frying.",
        specifications: {
            origin: "Idaho, USA",
            size: "Medium",
            organic: "No",
            type: "Vegetable",
            
        },
        price: "$0.50",
        weight: "0.5 lb",
        image: "images/Potato.jpg"
    },
    "013": {
        title: "Blueberries",
        detailedDescription: "Organic blueberries, packed with antioxidants and nutrients.",
        specifications: {
            origin: "Canada",
            size: "Pint",
            organic: "Yes",
            type: "Fruit",
           
        },
        price: "$4.00",
        weight: "0.2 lb",
        image: "images/Blueberries.jpg"
    },
    "014": {
        title: "Almonds",
        detailedDescription: "Raw, unsalted almonds, a great source of protein and healthy fats.",
        specifications: {
            origin: "California, USA",
            size: "1/2 lb Bag",
            organic: "No",
            type: "Nut",
            
        },
        price: "$7.50",
        weight: "0.5 lb",
        image: "images/Almonds.jpg"
    },
    "015": {
        title: "Spinach",
        detailedDescription: "Fresh organic spinach, full of vitamins and perfect for salads.",
        specifications: {
            origin: "USA",
            size: "Bunch",
            organic: "Yes",
            type: "Vegetable",
            
        },
        price: "$1.99",
        weight: "0.3 lb",
        image: "images/Spinach.jpg"
    },
    "016": {
        title: "Peach",
        detailedDescription: "Juicy and organic peaches, a delicious treat for summer.",
        specifications: {
            origin: "Georgia, USA",
            size: "Medium",
            organic: "Yes",
            type: "Fruit",
           
        },
        price: "$1.25",
        weight: "0.33 lb",
        image: "images/Peach.jpg"
    },
    "017": {
        title: "Mango",
        detailedDescription: "Tropical, sweet mangoes, perfect for smoothies or snacking.",
        specifications: {
            origin: "Mexico",
            size: "Large",
            organic: "No",
            type: "Fruit",
            
        },
        price: "$1.50",
        weight: "0.5 lb",
        image: "images/Mango.jpg"
    },
    "018": {
        title: "Onion",
        detailedDescription: "Fresh organic onions, essential for cooking and seasoning.",
        specifications: {
            origin: "USA",
            size: "Medium",
            organic: "Yes",
            type: "Vegetable",
           
        },
        price: "$0.60",
        weight: "0.5 lb",
        image: "images/Onion.jpg"
    },
    "019": {
        title: "Strawberries",
        detailedDescription: "Organic strawberries, juicy and full of flavor, great for desserts and snacking.",
        specifications: {
            origin: "California, USA",
            size: "1 lb Pack",
            organic: "Yes",
            type: "Fruit",
          
        },
        price: "$3.99",
        weight: "0.4 lb",
        image: "images/Strawberries.jpg"
    },
    "020": {
        title: "Bell Pepper",
        detailedDescription: "Crispy organic bell pepper, adds color and flavor to your dishes.",
        specifications: {
            variety: "Red",
            origin: "Mexico",
            organic: "Yes",
            type: "Vegetable",
            
        },
        price: "$1.00",
        weight: "0.4 lb",
        image: "images/BellPepper.jpg"
    },
    
    "021": {
        title: "Avocado",
        detailedDescription: "Creamy and nutrient-rich organic avocado, perfect for salads, sandwiches, and smoothies.",
        specifications: {
            origin: "Mexico",
            size: "Large",
            organic: "Yes",
            type: "Fruit",
            
        },
        price: "$1.80",
        weight: "0.5 lb",
        image: "images/Avocado.jpg"
    },
    "022": {
        title: "Grapes",
        detailedDescription: "Sweet and juicy organic grapes, packed with antioxidants and vitamins.",
        specifications: {
            variety: "Red Seedless",
            origin: "California, USA",
            organic: "Yes",
            type: "Fruit",
            
        },
        price: "$2.50",
        weight: "0.6 lb",
        image: "images/Grapes.jpg"
    },
    "023": {
        title: "Cauliflower",
        detailedDescription: "Organic cauliflower, fresh and nutritious. Perfect for roasting, steaming, or as a rice substitute.",
        specifications: {
            origin: "USA",
            size: "1 lb Head",
            organic: "Yes",
            type: "Vegetable",
           
        },
        price: "$1.25",
        weight: "1 lb",
        image: "images/Cauliflower.jpg"
    },
    "024": {
        title: "Beetroot",
        detailedDescription: "Fresh organic beetroot, rich in nutrients and antioxidants. Perfect for salads and juices.",
        specifications: {
            origin: "USA",
            size: "Medium",
            organic: "Yes",
            type: "Vegetable",
           
        },
        price: "$1.30",
        weight: "0.7 lb",
        image: "images/Beetroot.jpg"
    },
    "025": {
        title: "Zucchini",
        detailedDescription: "A fresh and organic zucchini, ideal for stir-fries, grilling, or as a pasta substitute.",
        specifications: {
            origin: "Mexico",
            size: "Medium",
            organic: "Yes",
            type: "Vegetable",
           
        },
        price: "$0.90",
        weight: "0.5 lb",
        image: "images/Zucchini.jpg"
    },
    "026": {
        title: "Walnuts",
        detailedDescription: "Raw walnuts, a rich source of omega-3 fatty acids, perfect for snacking and baking.",
        specifications: {
            origin: "California, USA",
            size: "1/2 lb Bag",
            organic: "No",
            type: "Nut",
            
        },
        price: "$6.50",
        weight: "0.4 lb",
        image: "images/Walnuts.jpg"
    },
    "027": {
        title: "Blackberries",
        detailedDescription: "Juicy organic blackberries, a delightful treat packed with vitamins and antioxidants.",
        specifications: {
            origin: "Oregon, USA",
            size: "Pint",
            organic: "Yes",
            type: "Fruit",
        },
        price: "$4.20",
        weight: "0.3 lb",
        image: "images/Blackberries.jpg"
    },
    "028": {
        title: "Garlic",
        detailedDescription: "Fresh organic garlic, an essential ingredient for adding flavor to any dish.",
        specifications: {
            origin: "USA",
            size: "Bulb",
            organic: "Yes",
            type: "Vegetable",
        },
        price: "$0.99",
        weight: "0.2 lb",
        image: "images/Garlic.jpg"
    },
    "029": {
        title: "Pumpkin",
        detailedDescription: "A large organic pumpkin, perfect for roasting, soups, and festive decorations.",
        specifications: {
            origin: "USA",
            size: "5 lbs",
            organic: "Yes",
            type: "Vegetable",
        },
        price: "$3.75",
        weight: "5 lbs",
        image: "images/Pumpkin.jpg"
    },
    "030": {
        title: "Chia Seeds",
        detailedDescription: "Nutritious chia seeds, ideal for smoothies and baking, packed with fiber and omega-3.",
        specifications: {
            origin: "Peru",
            size: "8 oz Bag",
            organic: "Yes",
            type: "Seed",
        },
        price: "$5.00",
        weight: "0.5 lb",
        image: "images/ChiaSeeds.jpg"
    },

    "031": {
    title: "Chicken",
    detailedDescription: "Fresh and tender chicken meat, perfect for grilling, roasting, or frying. A high-protein option, ideal for a healthy meal. Carefully selected for its quality and flavor, making it a versatile addition to any dish.",
    specifications: {
      variety: "Broiler",
      origin: "USA",
      organic: "No",
      type: "Meat",
    },
    price: "$5.00",
    weight: "1.5 lb",
    image: "images/chicken.jpg"  // Add the actual path to the chicken image
  },

    // Add more details for other products using their IDs
};

export default function Description({
    productId,
    onClose,
    quantity,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart,
    updateQuantityManually, // Add this prop for manual updates
}) {
    const [availability, setAvailability] = useState(null); // Tracks dynamic availability
    const productDetails = productDetailsMap[productId];

    useEffect(() => {
        // Fetch dynamic availability based on productId
        const fetchAvailability = async () => {
            try {
                const response = await fetch("http://localhost/Storage.php", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                if (data.status === "success") {
                    const product = data.data.find((item) => item.product_id === productId);
                    if (product) {
                        setAvailability(product.quantity > 0 ? "In Stock" : "Out of Stock");
                    } else {
                        setAvailability("Unknown");
                    }
                } else {
                    setAvailability("Error");
                }
            } catch (error) {
                console.error("Error fetching availability:", error);
                setAvailability("Error");
            }
        };

        fetchAvailability();
    }, [productId]);

    if (!productDetails) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <div className={styles.modalBody}>
                    {/* Left Section: Specifications */}
                    <div className={styles.modalLeft}>
                        <img src={productDetails.image} alt={productDetails.title} className={styles.modalImage} />
                        <h4>Specifications</h4>
                        <p><strong>Origin:</strong> {productDetails.specifications.origin}</p>
                        <p><strong>Variety:</strong> {productDetails.specifications.variety || "N/A"}</p>
                        <p><strong>Size:</strong> {productDetails.specifications.size || "N/A"}</p>
                        <p><strong>Organic:</strong> {productDetails.specifications.organic}</p>
                        <p><strong>Type:</strong> {productDetails.specifications.type}</p>
                    </div>

                    {/* Right Section: Details */}
                    <div className={styles.modalRight}>
                        <h2>{productDetails.title}</h2>
                        <h4>Details</h4>
                        <p><strong>Name:</strong> {productDetails.title}</p>
                        <p><strong>Price:</strong> {productDetails.price}</p>
                        <p><strong>Weight:</strong> {productDetails.weight}</p>

                        {/* Availability */}
                        <p>
                            <strong>Availability:</strong>{" "}
                            <span className={availability === "In Stock" ? styles.inStock : styles.outOfStock}>
                                {availability || "Loading..."}
                            </span>
                        </p>

                        <label><strong>Quantity:</strong></label>
                        <div className={styles.quantitySelector}>
                            <button
                                onClick={() => decrementQuantity(productId)}
                                className={styles.quantityButton}
                                disabled={availability !== "In Stock"} // Disable if Out of Stock
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => {
                                    const inputQuantity = e.target.value;
                                    if (/^\d*$/.test(inputQuantity)) {
                                        updateQuantityManually(productId, inputQuantity); // Pass to handler
                                    }
                                }}
                                onBlur={(e) => {
                                    const inputQuantity = parseInt(e.target.value, 10);
                                    if (isNaN(inputQuantity) || inputQuantity < 1) {
                                        updateQuantityManually(productId, 1); // Reset to 1 if invalid
                                    }
                                }}
                                className={styles.quantityInput}
                                disabled={availability !== "In Stock"} // Disable if Out of Stock
                            />
                            <button
                                onClick={() => incrementQuantity(productId)}
                                className={styles.quantityButton}
                                disabled={availability !== "In Stock"} // Disable if Out of Stock
                            >
                                +
                            </button>
                        </div>

                        <button
                            className={styles.addToCartButton}
                            onClick={handleAddToCart}
                            disabled={availability !== "In Stock"} // Disable Add if Out of Stock
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Description */}
                <div className={styles.descriptionSection}>
                    <h4>Description</h4>
                    <p className={styles.descriptionText}>{productDetails.detailedDescription}</p>
                </div>
            </div>
        </div>
    );
}

