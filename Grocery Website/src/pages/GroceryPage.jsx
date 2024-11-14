import React, { useState, useEffect } from 'react';
import styles from "../styles/grocery.module.css";
import products from './Product';
import Description from './Description';
import indicator from './Indicator';
import { FaFilter } from 'react-icons/fa';

export default function GroceryPage() {
    const [groceryItems, setGroceryItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        All: true,
        Fruit: false,
        Vegetable: false,
        Organic: false,
        Other: false,
    });
    const [sortOption, setSortOption] = useState('id-asc');

    useEffect(() => {
        setGroceryItems(products);

        const initialQuantities = products.reduce((acc, product) => {
            acc[product.id] = 1;
            return acc;
        }, {});
        setQuantities(initialQuantities);

        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);
    }, []);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const sortProducts = (items) => {
        switch (sortOption) {
            case 'id-asc':
                return [...items].sort((a, b) => a.id - b.id);
            case 'id-desc':
                return [...items].sort((a, b) => b.id - a.id);
            case 'alphabetical-asc':
                return [...items].sort((a, b) => a.title.localeCompare(b.title));
            case 'alphabetical-desc':
                return [...items].sort((a, b) => b.title.localeCompare(a.title));
            case 'cost-asc':
                return [...items].sort((a, b) => a.price - b.price);
            case 'cost-desc':
                return [...items].sort((a, b) => b.price - a.price);
            case 'weight-asc':
                return [...items].sort((a, b) => a.weight - b.weight);
            case 'weight-desc':
                return [...items].sort((a, b) => b.weight - a.weight);
            default:
                return items;
        }
    };

    const openModal = (productId) => {
        setSelectedProductId(productId);
    };

    const closeModal = () => {
        setSelectedProductId(null);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };

            if (filter === "All") {
                Object.keys(updatedFilters).forEach(key => updatedFilters[key] = (key === "All"));
            } else {
                updatedFilters[filter] = !prevFilters[filter];
                updatedFilters.All = false;

                const allUnchecked = !updatedFilters.Fruit && !updatedFilters.Vegetable && !updatedFilters.Organic && !updatedFilters.Other;
                if (allUnchecked) {
                    updatedFilters.All = true;
                }
            }

            return updatedFilters;
        });
    };

    const filterProducts = () => {
        const filters = Object.keys(selectedFilters).filter(filter => selectedFilters[filter] && filter !== "All");

        if (selectedFilters.All || filters.length === 0) {
            return groceryItems;
        }

        return groceryItems.filter(product => {
            // Define each filter condition
            const isFruit = !product.isVegetable && !product.isOther;
            const isVegetable = product.isVegetable;
            const isOrganic = product.isOrganic;
            const isOther = product.isOther;
    
            let match = true;
    
            // Check combinations of selected filters
            if (selectedFilters.Fruit && selectedFilters.Vegetable && selectedFilters.Organic && selectedFilters.Other) {
                // Display items that are organic and fall into either fruit, vegetable, or other categories
                match = (isFruit || isVegetable || isOther) && isOrganic;
            } else if (selectedFilters.Fruit && selectedFilters.Vegetable && selectedFilters.Organic) {
                // Display organic fruits and vegetables
                match = (isFruit || isVegetable) && isOrganic;
            } else if (selectedFilters.Fruit && selectedFilters.Organic && selectedFilters.Other) {
                // Display organic fruits and other items
                match = (isFruit || isOther) && isOrganic;
            } else if (selectedFilters.Vegetable && selectedFilters.Organic && selectedFilters.Other) {
                // Display organic vegetables and other items
                match = (isVegetable || isOther) && isOrganic;
            } else if (selectedFilters.Fruit && selectedFilters.Vegetable && selectedFilters.Other) {
                // Display fruits, vegetables, and other items (without organic requirement)
                match = isFruit || isVegetable || isOther;
            } else if (selectedFilters.Fruit && selectedFilters.Vegetable) {
                // Display fruits and vegetables (without organic requirement)
                match = isFruit || isVegetable;
            } else if (selectedFilters.Fruit && selectedFilters.Organic) {
                // Display organic fruits
                match = isFruit && isOrganic;
            } else if (selectedFilters.Vegetable && selectedFilters.Organic) {
                // Display organic vegetables
                match = isVegetable && isOrganic;
            } else if (selectedFilters.Other && selectedFilters.Organic) {
                // Display organic items in the "other" category
                match = isOther && isOrganic;
            } else if (selectedFilters.Fruit && selectedFilters.Other) {
                // Display fruits and "other" types
                match = isFruit || isOther;
            } else if (selectedFilters.Vegetable && selectedFilters.Other) {
                // Display vegetables and "other" types
                match = isVegetable || isOther;
            } else {
                // Apply individual filters if only one is selected
                if (selectedFilters.Fruit) {
                    match = isFruit;
                }
                if (selectedFilters.Vegetable) {
                    match = isVegetable;
                }
                if (selectedFilters.Organic) {
                    match = isOrganic;
                }
                if (selectedFilters.Other) {
                    match = isOther;
                }
            }
    
            return match;
        });

    };

    const incrementQuantity = (productId) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 1) + 1
        }));
    };

    const decrementQuantity = (productId) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: Math.max(1, (prevQuantities[productId] || 1) - 1)
        }));
    };

    const handleAddToCart = (product) => {
        const quantityToAdd = quantities[product.id] || 1;

        setCartItems((prevCartItems) => {
            const updatedCart = prevCartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + quantityToAdd }
                    : item
            );

            const itemExists = updatedCart.some(item => item.id === product.id);

            if (!itemExists) {
                updatedCart.push({ ...product, quantity: quantityToAdd });
            }

            localStorage.setItem('cartItems', JSON.stringify(updatedCart));
            return updatedCart;
        });

        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [product.id]: 1,
        }));

        alert(`${quantityToAdd}x ${product.title} has been added to your shopping cart!`);
    };

    return (
        <div className={styles["page"]}>
            <div className={styles["header"]}>
                <p className={styles["welcome-message"]}><strong>Welcome to the Grocery page User! Here are our available products.</strong></p>

                <div className={styles["sort-container"]}>
                    <label htmlFor="sort">Sort By:</label>
                    <select id="sort" value={sortOption} onChange={handleSortChange}>
                        <option value="id-asc">ID (Ascending)</option>
                        <option value="id-desc">ID (Descending)</option>
                        <option value="alphabetical-asc">Alphabetical (A to Z)</option>
                        <option value="alphabetical-desc">Alphabetical (Z to A)</option>
                        <option value="cost-asc">Cost (Cheapest to Most Expensive)</option>
                        <option value="cost-desc">Cost (Most Expensive to Cheapest)</option>
                        <option value="weight-asc">Weight (Lightest to Heaviest)</option>
                        <option value="weight-desc">Weight (Heaviest to Lightest)</option>
                    </select>
                </div>
            </div>

            <div className={styles["content-container"]}>
                <div className={styles["filter-container"]}>
                    <div className={styles["filter-header"]}>
                        <FaFilter className={styles["filter-icon"]} />
                        <h3 className={styles["filter-title"]}>Filtered Product</h3>
                    </div>
                    {["All", "Fruit", "Vegetable", "Organic", "Other"].map((filter) => (
                        <label key={filter} className={styles["filter-checkbox"]}>
                            <input
                                type="checkbox"
                                checked={selectedFilters[filter]}
                                onChange={() => handleFilterChange(filter)}
                            />
                            {filter}
                        </label>
                    ))}
                </div>

                <div className={styles["product-grid"]}>
                    {sortProducts(filterProducts()).map((product) => (
                        <div key={product.id} className={styles["product-card"]}>
                            <div className={styles["image-container"]}>
                                {product.isOrganic && (
                                    <img
                                        src={indicator[0].image}
                                        alt="Organic Symbol"
                                        className={styles["organic-symbol"]}
                                    />
                                )}
                                {product.isVegetable && (
                                    <img
                                        src={indicator[1].image}
                                        alt="Vegetable Symbol"
                                        className={product.isOrganic ? styles["vegetable-symbol-below"] : styles["organic-symbol"]}
                                    />
                                )}
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className={styles["product-image"]}
                                    onClick={() => openModal(product.id)}
                                />
                            </div>
                            <h3 className={styles["product-title"]}>{product.title}</h3>
                            <p className={styles["product-price"]}>Price: ${product.price.toFixed(2)}</p>
                            <p className={styles["product-weight"]}>Weight: {product.weight} lb</p>

                            <div className={styles["quantity-selector"]}>
                                <button onClick={() => decrementQuantity(product.id)} className={styles["quantity-button"]}>-</button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantities[product.id] || 1}
                                    onChange={(e) => setQuantities({
                                        ...quantities,
                                        [product.id]: Math.max(1, parseInt(e.target.value) || 1)
                                    })}
                                    className={styles["quantity-input"]}
                                />
                                <button onClick={() => incrementQuantity(product.id)} className={styles["quantity-button"]}>+</button>
                            </div>

                            <button onClick={() => handleAddToCart(product)} className={styles["add-to-cart-button"]}>
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {selectedProductId && (
                <Description
                    productId={selectedProductId}
                    onClose={closeModal}
                    quantity={quantities[selectedProductId]}
                    incrementQuantity={() => incrementQuantity(selectedProductId)}
                    decrementQuantity={() => decrementQuantity(selectedProductId)}
                    handleAddToCart={() => handleAddToCart(groceryItems.find(item => item.id === selectedProductId))}
                />
            )}
        </div>
    );
}
