// src/pages/Product.js

const products = [
    {
        id: "001",
        title: "Coconut",
        description: "Fresh and organic coconut",
        image: "images/Coconut.jpeg",
        price: 2.99,
        weight: 1,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "002",
        title: "Apple",
        description: "Fresh and organic apple",
        image: "images/Apple.jpeg",
        price: 0.75,
        weight: 0.33,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "003",
        title: "Honeycrisp Apple",
        description: "Fresh apple",
        image: "images/apples_honeycrisp.png",
        price: 0.70,
        weight: 0.33,
        isOrganic: false,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "004",
        title: "Banana",
        description: "Fresh and organic banana",
        image: "images/banana.jpeg",
        price: 0.25,
        weight: 0.25,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "005",
        title: "Watermelon",
        description: "Fresh and organic watermelon",
        image: "images/Watermelon.jpg",
        price: 6.00,
        weight: 10,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "006",
        title: "Broccoli",
        description: "Fresh and organic broccoli",
        image: "images/Broccoli.jpg",
        price: 1.50,
        weight: 1,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "007",
        title: "Tomato",
        description: "Fresh and organic tomato",
        image: "images/Tomato.jpg",
        price: 1.20,
        weight: 0.33,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Tomatoes are botanically fruits but often categorized as vegetables in culinary contexts
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "008",
        title: "Cucumber",
        description: "Fresh and organic cucumber",
        image: "images/Cucumber.jpg",
        price: 0.89,
        weight: 0.5,
        isOrganic: true,
        isVegetable: true,
        isFruit: true,    // Cucumbers are botanically fruits but often categorized as vegetables
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "009",
        title: "Orange",
        description: "Juicy and fresh orange",
        image: "images/Orange.jpg",
        price: 0.60,
        weight: 0.4,
        isOrganic: false,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "010",
        title: "Pineapple",
        description: "Fresh tropical pineapple",
        image: "images/Pineapple.jpg",
        price: 3.50,
        weight: 2.5,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "011",
        title: "Carrot",
        description: "Crunchy organic carrot",
        image: "images/Carrot.jpg",
        price: 1.10,
        weight: 0.25,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "012",
        title: "Potato",
        description: "Fresh non-organic potato",
        image: "images/Potato.jpg",
        price: 0.50,
        weight: 0.5,
        isOrganic: false,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "013",
        title: "Blueberries",
        description: "Organic blueberries - packed with antioxidants",
        image: "images/Blueberries.jpg",
        price: 4.00,
        weight: 0.2,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "014",
        title: "Almonds",
        description: "Raw, unsalted almonds",
        image: "images/Almonds.jpg",
        price: 7.50,
        weight: 0.5,
        isOrganic: false,
        isVegetable: false,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: true      // Added
    },
    {
        id: "015",
        title: "Spinach",
        description: "Fresh organic spinach",
        image: "images/Spinach.jpg",
        price: 1.99,
        weight: 0.3,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "016",
        title: "Peach",
        description: "Juicy organic peach",
        image: "images/Peach.jpg",
        price: 1.25,
        weight: 0.33,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "017",
        title: "Mango",
        description: "Tropical, sweet mango",
        image: "images/Mango.jpg",
        price: 1.50,
        weight: 0.5,
        isOrganic: false,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "018",
        title: "Onion",
        description: "Fresh organic onion",
        image: "images/Onion.jpg",
        price: 0.60,
        weight: 0.5,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "019",
        title: "Strawberries",
        description: "Fresh organic strawberries",
        image: "images/Strawberries.jpg",
        price: 3.99,
        weight: 0.4,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "020",
        title: "Bell Pepper",
        description: "Crispy organic bell pepper",
        image: "images/BellPepper.jpg",
        price: 1.00,
        weight: 0.4,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "021",
        title: "Avocado",
        description: "Creamy and organic avocado",
        image: "images/Avocado.jpg",
        price: 1.80,
        weight: 0.5,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "022",
        title: "Grapes",
        description: "Sweet grapes",
        image: "images/Grapes.jpg",
        price: 2.50,
        weight: 0.6,
        isOrganic: false,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "023",
        title: "Cauliflower",
        description: "Fresh organic cauliflower",
        image: "images/Cauliflower.jpg",
        price: 1.25,
        weight: 1.0,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "024",
        title: "Beetroot",
        description: "Organic beetroot rich in nutrients",
        image: "images/Beetroot.jpg",
        price: 1.30,
        weight: 0.7,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "025",
        title: "Zucchini",
        description: "Fresh organic zucchini",
        image: "images/Zucchini.jpg",
        price: 0.90,
        weight: 0.5,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "026",
        title: "Walnuts",
        description: "Rich in omega-3, raw walnuts",
        image: "images/Walnuts.jpg",
        price: 6.50,
        weight: 0.4,
        isOrganic: false,
        isVegetable: false,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: true      // Added
    },
    {
        id: "027",
        title: "Blackberries",
        description: "Juicy organic blackberries",
        image: "images/Blackberries.jpg",
        price: 4.20,
        weight: 0.3,
        isOrganic: true,
        isVegetable: false,
        isFruit: true,     // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "028",
        title: "Garlic",
        description: "Organic garlic for added flavor",
        image: "images/Garlic.jpg",
        price: 0.99,
        weight: 0.2,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "029",
        title: "Pumpkin",
        description: "Fresh organic pumpkin",
        image: "images/Pumpkin.jpg",
        price: 3.75,
        weight: 5.0,
        isOrganic: true,
        isVegetable: true,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: false     // Added
    },
    {
        id: "030",
        title: "Chia Seeds",
        description: "Nutritious chia seeds, perfect for smoothies",
        image: "images/ChiaSeeds.jpg",
        price: 5.00,
        weight: 0.5,
        isOrganic: true,
        isVegetable: false,
        isFruit: false,    // Added
        isMeat: false,     // Added
        isOther: true      // Added
    },
  
    {
        id: "031",
        title: "Chicken",
        description: "Fresh and tender chicken meat, perfect for grilling, roasting, or frying. A high-protein option, ideal for a healthy meal. Carefully selected for its quality and flavor.",
        image: "images/chicken.jpg",  // Ensure this path is correct
        price: 5.00,
        weight: 1.5,
        isOrganic: false,  // Change to true if applicable
        isVegetable: false,
        isFruit: false,    // Added
        isMeat: true,      // Added
        isOther: false     // Added
    }
];

export default products;