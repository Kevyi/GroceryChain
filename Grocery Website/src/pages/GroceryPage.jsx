import React, { useState, useEffect } from 'react';
import styles from "../styles/grocery.module.css";
import products from './Product';
import Description from './Description';
import indicator from './Indicator';
import { FaFilter } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';  // Import useLocation from react-router-dom to get URL query parameters

export default function GroceryPage({ updateCartCount }) {
  const [groceryItems, setGroceryItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    All: true,
    Fruit: false,
    Vegetable: false,
    Meat: false, 
    Organic: false,
    Other: false,
  });
  const [sortOption, setSortOption] = useState('id-asc');
  
  const location = useLocation(); // Use the location hook to access URL parameters
  
  // This effect will run whenever the URL changes (e.g., when the filter is updated in the URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Get query parameters from the URL
    const filter = urlParams.get("filter");  // Extract the 'filter' parameter from the URL
    
    // Initialize filters based on the URL parameter
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      
      if (filter) {
        // Reset all filters to false, then set the selected one to true
        Object.keys(updatedFilters).forEach(key => updatedFilters[key] = false);
        if (filter === "fruit") {
          updatedFilters.Fruit = true;
        } else if (filter === "vegetable") {
          updatedFilters.Vegetable = true;
        } else if (filter === "meat") {
            updatedFilters.Meat = true;
        } else if (filter === "organic") {
          updatedFilters.Organic = true;
        } else if (filter === "other") {
          updatedFilters.Other = true;
        }
        updatedFilters.All = false; // Make sure "All" is not selected when a filter is applied
      } else {
        updatedFilters.All = true; // Default to "All" when no filter is applied
      }

      return updatedFilters;
    });

    // Set products and quantities
    setGroceryItems(products);

    const initialQuantities = products.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {});
    setQuantities(initialQuantities);

    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);
  }, [location.search]);  // Depend on location.search to re-run this effect when the query changes

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

        const allUnchecked = !updatedFilters.Fruit && !updatedFilters.Vegetable && !updatedFilters.Meat&&!updatedFilters.Organic && !updatedFilters.Other;
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
      const isFruit = !product.isVegetable && !product.isOther;
      const isVegetable = product.isVegetable;
      const isMeat = product.isMeat;
      const isOrganic = product.isOrganic;
      const isOther = product.isOther;
  
      let match = true;
  
      if (selectedFilters.Fruit && selectedFilters.Vegetable && selectedFilters.Organic && selectedFilters.Other) {
        match = (isFruit || isVegetable || isOther) && isOrganic;
      } else if (selectedFilters.Fruit && selectedFilters.Vegetable && selectedFilters.Organic) {
        match = (isFruit || isVegetable) && isOrganic;
      } else if (selectedFilters.Fruit && selectedFilters.Organic && selectedFilters.Other) {
        match = (isFruit || isOther) && isOrganic;
      } else if (selectedFilters.Vegetable && selectedFilters.Organic && selectedFilters.Other) {
        match = (isVegetable || isOther) && isOrganic;
      } else if (selectedFilters.Fruit && selectedFilters.Vegetable && selectedFilters.Other) {
        match = isFruit || isVegetable || isOther;
      } else if (selectedFilters.Fruit && selectedFilters.Vegetable) {
        match = isFruit || isVegetable;
      } else if (selectedFilters.Fruit && selectedFilters.Organic) {
        match = isFruit && isOrganic;
      } else if (selectedFilters.Vegetable && selectedFilters.Organic) {
        match = isVegetable && isOrganic;
      } else if (selectedFilters.Other && selectedFilters.Organic) {
        match = isOther && isOrganic;
      } else if (selectedFilters.Fruit && selectedFilters.Other) {
        match = isFruit || isOther;
      } else if (selectedFilters.Vegetable && selectedFilters.Other) {
        match = isVegetable || isOther;
    } else if (selectedFilters.Fruit && selectedFilters.Meat) {
        match = isFruit || isMeat;
    } else if (selectedFilters.Vegetable && selectedFilters.Meat) {
        match = isVegetable || isMeat;
    } else if (selectedFilters.Fruit && selectedFilters.Vegetable && selectedFilters.Meat) {
        match = isFruit || isVegetable || isMeat;
    } else if (selectedFilters.Other && selectedFilters.Meat) {
        match = isOther || isMeat;
    } else if (selectedFilters.Fruit && selectedFilters.Other && selectedFilters.Meat) {
        match = isFruit || isOther || isMeat;
    } else if (selectedFilters.Vegetable && selectedFilters.Other && selectedFilters.Meat) {
        match = isVegetable || isOther || isMeat;
    } else if (selectedFilters.Fruit && selectedFilters.Vegetable && selectedFilters.Other && selectedFilters.Meat) {
        match = isFruit || isVegetable || isOther || isMeat;
    } else if (selectedFilters.Meat && selectedFilters.Organic) {
        match = isMeat && isOrganic;
    } else if (selectedFilters.Fruit && selectedFilters.Meat && selectedFilters.Organic) {
        match = (isFruit || isMeat) && isOrganic;
    } else if (selectedFilters.Vegetable && selectedFilters.Meat && selectedFilters.Organic) {
        match = (isVegetable || isMeat) && isOrganic;
    } else if (selectedFilters.Other && selectedFilters.Meat && selectedFilters.Organic) {
        match = (isOther || isMeat) && isOrganic;
    } else if (selectedFilters.Fruit && selectedFilters.Vegetable && selectedFilters.Meat && selectedFilters.Organic) {
        match = (isFruit || isVegetable || isMeat) && isOrganic;
    } else if (selectedFilters.Fruit && selectedFilters.Other && selectedFilters.Meat && selectedFilters.Organic) {
        match = (isFruit || isOther || isMeat) && isOrganic;
    } else if (selectedFilters.Vegetable && selectedFilters.Other && selectedFilters.Meat && selectedFilters.Organic) {
        match = (isVegetable || isOther || isMeat) && isOrganic;
      } else {
        if (selectedFilters.Fruit) match = isFruit;
        if (selectedFilters.Vegetable) match = isVegetable;
        if (selectedFilters.Meat) match = isMeat;
        if (selectedFilters.Organic) match = isOrganic;
        if (selectedFilters.Other) match = isOther;
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
      updateCartCount();  // Call updateCartCount after updating the cart
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
                    {["All", "Fruit", "Vegetable", "Meat", "Organic", "Other"].map((filter) => (
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
