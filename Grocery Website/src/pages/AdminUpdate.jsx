import React, { useState, useEffect } from 'react';
import styles from "../styles/Admin.module.css";
import products from './Product'; // Static product data
import { FaFilter } from 'react-icons/fa';

export default function AdminUpdate() {
  const [groceryItems, setGroceryItems] = useState([]); // Combined static and dynamic data
  const [quantities, setQuantities] = useState({}); // Dynamic stock counts
  const [counts, setCounts] = useState({}); // Dynamic stock counts
  const [selectedFilters, setSelectedFilters] = useState({
    All: true,
    Fruit: false,
    Vegetable: false,
    Meat: false,
    Organic: false,
    Other: false,
  });
  const [sortOption, setSortOption] = useState('id-asc');

  useEffect(() => {
    // Function to fetch the backend data
    const fetchStockData = () => {
      fetch("http://localhost:3000/storage", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            const backendData = data.data;
  
            // Merge backend quantities with static product data
            const mergedProducts = products.map((product) => {
              const backendProduct = backendData.find(
                (item) => item.product_id === product.id // Match product by ID
              );
              return {
                ...product,
                count: backendProduct ? backendProduct.quantity : 0, // Use backend count or default to 0
              };
            });
  
            setGroceryItems(mergedProducts);
  
            // Update the counts state
            const initialCounts = mergedProducts.reduce((acc, product) => {
              acc[product.id] = product.count; // Use backend count
              return acc;
            }, {});
            setCounts(initialCounts);
          } else {
            console.error("Failed to fetch product data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        });
    };
  
    // Initial fetch
    fetchStockData();
  
    // Set up polling to fetch data every 5 seconds
    const intervalId = setInterval(fetchStockData, 1000); // Poll every 5 seconds
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
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
      default:
        return items;
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filter === "All") {
        Object.keys(updatedFilters).forEach((key) => (updatedFilters[key] = key === "All"));
      } else {
        updatedFilters[filter] = !prevFilters[filter];
        updatedFilters.All = false;

        const allUnchecked = Object.values(updatedFilters).every((value) => !value);
        if (allUnchecked) {
          updatedFilters.All = true;
        }
      }

      return updatedFilters;
    });
  };

  const filterProducts = () => {
    // Get active filters (excluding "All")
    const activeFilters = Object.keys(selectedFilters).filter(
      (filter) => selectedFilters[filter] && filter !== "All"
    );
  
    // If "All" is selected or no filters are active, return all products
    if (selectedFilters.All || activeFilters.length === 0) {
      return groceryItems;
    }
  
    // Map filter keys to product attributes
    const filterMapping = {
      Fruit: (product) => !product.isVegetable && !product.isOther && !product.isMeat,
      Vegetable: (product) => product.isVegetable,
      Meat: (product) => product.isMeat,
      Other: (product) => product.isOther,
    };
  
    // Check if Organic is selected
    const isOrganicFilterActive = selectedFilters.Organic;
  
    // Filter products based on active filters
    return groceryItems.filter((product) => {
      const matchesCategory = activeFilters
        .filter((filter) => filter !== "Organic") // Exclude Organic from categories
        .some((filter) => filterMapping[filter](product));
  
      // If Organic is active, also check for organic condition
      const matchesOrganic = isOrganicFilterActive ? product.isOrganic : true;
  
      return matchesCategory && matchesOrganic;
    });
  };

  const incrementQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decrementQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  };
  const updateStockInDatabase = async (productId) => {
    const product = groceryItems.find((item) => item.id === productId);
    const updatedQuantity = quantities[productId];
  
    if (!product) {
      alert("Product not found!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/storage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId, // Ensure `product_id` matches backend expectations
          quantity: updatedQuantity,
          count: product.count + updatedQuantity, // Add new quantity to current stock
        }),
      });
  
      const data = await response.json();
      if (data.status === "success") {
        // Update the stock count in the frontend
        setGroceryItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId
                    ? { ...item, count: item.count + updatedQuantity } // Update count
                    : item
            )
        );

        // Reset the input field for the updated product
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: 0,
        }));

        alert(data.message || "Stock updated successfully!");
    } else {
        alert(`Error: ${data.message}`);
    }
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock.");
    }
  };
  
  
  return (
    <div className={styles["page"]}>
      <div className={styles["header"]}>
        <p className={styles["welcome-message"]}>
          <strong>Manage Inventory</strong>
        </p>
        <div className={styles["sort-container"]}>
          <label htmlFor="sort">Sort By:</label>
          <select id="sort" value={sortOption} onChange={handleSortChange}>
            <option value="id-asc">ID (Ascending)</option>
            <option value="id-desc">ID (Descending)</option>
            <option value="alphabetical-asc">Alphabetical (A to Z)</option>
            <option value="alphabetical-desc">Alphabetical (Z to A)</option>
            <option value="cost-asc">Cost (Cheapest to Most Expensive)</option>
            <option value="cost-desc">Cost (Most Expensive to Cheapest)</option>
          </select>
        </div>
      </div>

      <div className={styles["content-container"]}>
        <div className={styles["filter-container"]}>
          <div className={styles["filter-header"]}>
            <FaFilter className={styles["filter-icon"]} />
            <h3 className={styles["filter-title"]}>Filter Products</h3>
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
                <img
                  src={product.image}
                  alt={product.title}
                  className={styles["product-image"]}
                />
              </div>
              <h3 className={styles["product-title"]}>{product.title}</h3>
              <p className={styles["product-price"]}>Price: ${product.price.toFixed(2)}</p>
              <p className={styles["product-weight"]}>Weight: {product.weight} lb</p>
              <p className={styles["product-stock"]}>Stock: {counts[product.id] || 0}</p>

              <div className={styles["quantity-selector"]}>
                <button
                  onClick={() => decrementQuantity(product.id)}
                  className={styles["quantity-button"]}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantities[product.id] || 0}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [product.id]: Math.max(0, parseInt(e.target.value) || 0),
                    }))
                  }
                  className={styles["quantity-input"]}
                />
                <button
                  onClick={() => incrementQuantity(product.id)}
                  className={styles["quantity-button"]}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => updateStockInDatabase(product.id)}
                className={styles["update-stock-button"]}
              >
                Update Stock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
