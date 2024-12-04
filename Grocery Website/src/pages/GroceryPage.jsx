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

  // Fetch grocery data and initialize state
  useEffect(() => {
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

          const mergedProducts = products.map((product) => {
            const backendProduct = backendData.find((item) => item.product_id === product.id);
            return {
              ...product,
              count: backendProduct ? backendProduct.quantity : 0, // Use backend count
            };
          });

          setGroceryItems(mergedProducts);

          const initialQuantities = mergedProducts.reduce((acc, product) => {
            acc[product.id] = 1; // Default quantity for input
            return acc;
          }, {});
          setQuantities(initialQuantities);

          // Safely parse saved cart items
          let savedCartItems;
          try {
            savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            if (!Array.isArray(savedCartItems)) {
              savedCartItems = [];
            }
          } catch (error) {
            console.error("Error parsing cartItems from localStorage:", error);
            savedCartItems = [];
          }

          setCartItems(savedCartItems);
        }
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  // Handle URL search query
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get("search");

    console.log("Search Query from URL:", searchQuery);

    if (searchQuery) {
      const filteredItems = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("Filtered Items:", filteredItems);
      setGroceryItems(filteredItems);
    } else {
      console.log("No Search Query, showing all products.");
      setGroceryItems(products);
    }
  }, [location.search]);

  // Update filters when URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filter = urlParams.get("filter");

    // Update selected filters based on URL parameters
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filter) {
        // Reset all filters to false, then apply the specific filter
        Object.keys(updatedFilters).forEach((key) => (updatedFilters[key] = false));
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
        updatedFilters.All = false; // Ensure "All" is deselected when specific filters are applied
      } else {
        updatedFilters.All = true; // Default to "All" when no filter is applied
      }

      return updatedFilters;
    });
  }, [location.search]);

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle filter option change
  const handleFilterChange = (filter) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filter === "All") {
        Object.keys(updatedFilters).forEach(key => updatedFilters[key] = (key === "All"));
      } else {
        updatedFilters[filter] = !prevFilters[filter];
        updatedFilters.All = false;

        const allUnchecked = !updatedFilters.Fruit && !updatedFilters.Vegetable && !updatedFilters.Meat && !updatedFilters.Organic && !updatedFilters.Other;
        if (allUnchecked) {
          updatedFilters.All = true;
        }
      }

      return updatedFilters;
    });
  };

  // Filter products with AND logic
  const filterProducts = () => {
    const activeFilters = Object.keys(selectedFilters).filter(
      (filter) => selectedFilters[filter] && filter !== "All"
    );

    // Get the search query
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get("search");

    // Filter products by search query if it exists
    const searchedItems = searchQuery
      ? groceryItems.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : groceryItems;

    // If "All" is selected or no filters are active, return search-filtered products
    if (selectedFilters.All || activeFilters.length === 0) {
      return searchedItems;
    }

    // Map filters to product attributes
    const filterMapping = {
      Fruit: (product) => product.isFruit,
      Vegetable: (product) => product.isVegetable,
      Meat: (product) => product.isMeat,
      Organic: (product) => product.isOrganic,
      Other: (product) => product.isOther,
    };

    // Filter products: Ensure all active filters match (AND logic)
    return searchedItems.filter((product) =>
      activeFilters.every((filter) => filterMapping[filter](product))
    );
  };

  // Sorting logic
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

  // Modal handlers
  const openModal = (productId) => {
    setSelectedProductId(productId);
  };

  const closeModal = () => {
    setSelectedProductId(null);
  };

  // Cart handlers
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

    if (product.count < quantityToAdd) {
      alert(`Only ${product.count} units of ${product.title} are available in stock.`);
      return;
    }

    setCartItems((prevCartItems) => {
      const existingItemIndex = prevCartItems.findIndex(item => item.id === product.id);
      let updatedCart;

      if (existingItemIndex !== -1) {
        updatedCart = [...prevCartItems];
        updatedCart[existingItemIndex].quantity += quantityToAdd;
      } else {
        updatedCart = [...prevCartItems, { ...product, quantity: quantityToAdd }];
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

  const updateQuantityManually = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity === "" ? "" : parseInt(quantity, 10),
    }));
  };

  return (
    <div className={styles["page"]}>
      <div className={styles["header"]}>
        <p className={styles["welcome-message"]}>
          <strong>Welcome to the Grocery page User! Here are our available products.</strong>
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
            <option value="weight-asc">Weight (Lightest to Heaviest)</option>
            <option value="weight-desc">Weight (Heaviest to Lightest)</option>
          </select>
        </div>
      </div>

      <div className={styles["content-container"]}>
        <div className={styles["filter-container"]}>
          <div className={styles["filter-header"]}>
            <FaFilter className={styles["filter-icon"]} />
            <h3 className={styles["filter-title"]}>Category Selector</h3>
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
            <div
              key={product.id}
              className={`${styles["product-card"]} ${
                product.count === 0 ? styles["out-of-stock"] : ""
              }`}
              onClick={() => openModal(product.id)} // Allow modal to open regardless of product availability
            >
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
                    className={
                      product.isOrganic
                        ? styles["vegetable-symbol-below"]
                        : styles["organic-symbol"]
                    }
                  />
                )}
                <img
                  src={product.image}
                  alt={product.title}
                  className={styles["product-image"]}
                />
              </div>
              <h3 className={styles["product-title"]}>{product.title}</h3>
              <p className={styles["product-price"]}>
                Price: ${product.price.toFixed(2)}
              </p>
              <p className={styles["product-weight"]}>
                Weight: {product.weight} lb
              </p>

              {product.count === 0 ? ( // If product count is 0, show "Out of Stock"
                <p className={styles["out-of-stock-message"]}>Out of Stock</p>
              ) : (
                <>
                  <div className={styles["quantity-selector"]}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering modal on button click
                        decrementQuantity(product.id);
                      }}
                      className={styles["quantity-button"]}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onClick={(e) => e.stopPropagation()} // Prevent triggering modal on input click
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [product.id]: Math.max(
                            1,
                            parseInt(e.target.value) || 1
                          ),
                        })
                      }
                      className={styles["quantity-input"]}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering modal on button click
                        incrementQuantity(product.id);
                      }}
                      className={styles["quantity-button"]}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering modal on button click
                      handleAddToCart(product);
                    }}
                    className={styles["add-to-cart-button"]}
                  >
                    Add to Cart
                  </button>
                </>
              )}
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
          updateQuantityManually={updateQuantityManually}
        />
      )}
    </div>
  );
}