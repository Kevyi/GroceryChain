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

          const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
          setCartItems(savedCartItems);
        }
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Parse query parameters from the URL
    const searchQuery = urlParams.get("search"); // Extract the "search" parameter

    // Log the search query
    console.log("Search Query from URL:", searchQuery);

    if (searchQuery) {
        // Filter grocery items based on the search query
        const filteredItems = products.filter((product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Log the filtered items
        console.log("Filtered Items:", filteredItems);

        setGroceryItems(filteredItems); // Update the state with filtered items
    } else {
        // If no search query, show all products
        console.log("No Search Query, showing all products.");
        setGroceryItems(products);
    }
}, [location.search]); // Re-run this effect whenever the URL's search parameter changes

  
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
    // Get active filters (excluding "All")
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

    // Map filter keys to product attributes
    const filterMapping = {
        Fruit: (product) => !product.isVegetable && !product.isOther && !product.isMeat,
        Vegetable: (product) => product.isVegetable,
        Meat: (product) => product.isMeat,
        Other: (product) => product.isOther,
    };

    // Check if Organic is selected
    const isOrganicFilterActive = selectedFilters.Organic;

    // Filter products based on active filters and search
    return searchedItems.filter((product) => {
        const matchesCategory = activeFilters
            .filter((filter) => filter !== "Organic") // Exclude Organic from categories
            .some((filter) => filterMapping[filter](product));

        // If Organic is active, also check for organic condition
        const matchesOrganic = isOrganicFilterActive ? product.isOrganic : true;

        return matchesCategory && matchesOrganic;
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

  const updateQuantityManually = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: quantity === "" ? "" : parseInt(quantity, 10),
    }));
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