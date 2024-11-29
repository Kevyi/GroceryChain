import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import GroceryTable from "../components/GroceryItemTable.jsx";
import styles from "../styles/grocery.module.css";

export default function GroceryPage() {
  const [groceryItems, setGroceryItems] = useState([]); 
  const [categories, setCategories] = useState({
    Dairy: false,
    Fruit: false,
    Vegetable: false,
    Grain: false,
    Meat: false,
    Nut: false,
  });

  const location = useLocation(); 

  
  const categoryChange = (e) => {
    const { name, checked } = e.target;
    setCategories((prevCategories) => ({
      ...prevCategories,
      [name]: checked,
    }));
  };

  
  const resetCategory = () => {
    setCategories({
      Dairy: false,
      Fruit: false,
      Vegetable: false,
      Grain: false,
      Meat: false,
      Nut: false,
    });
  };


  const buildQueryString = () => {
    const params = new URLSearchParams();

    
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      params.append("query", query);
    }

 
    const selectedCategories = Object.entries(categories)
      .filter(([key, value]) => value)
      .map(([key]) => key.toLowerCase()); 

    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","));
    }

    return params.toString();
  };


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const queryString = buildQueryString();
        const response = await fetch(
          `http://localhost:8080/grocery-page/groceryItems?${queryString}`
        );
        if (!response.ok) {
          console.error("Error fetching items:", response.statusText);
          return;
        }

        const data = await response.json();
        setGroceryItems(data.results); 
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [categories, location.search]); 

  return (
    <>
      <p>
        <strong>
          Welcome to the Grocery page! Search and filter your groceries.
        </strong>
      </p>

      <div className={styles["page"]}>
        {/* Category Filters */}
        <div className={styles["column"]}>
          <form className={styles["category"]}>
            <fieldset>
              <legend>
                <strong style={{ fontSize: "20px" }}>Category Selector</strong>
              </legend>
              {Object.keys(categories).map((category) => (
                <div className={styles["category-item"]} key={category}>
                  <label htmlFor={category.toLowerCase()}>{category}</label>
                  <input
                    className={styles["category-checkbox"]}
                    type="checkbox"
                    name={category}
                    checked={categories[category]}
                    onChange={categoryChange}
                  />
                </div>
              ))}
              <button
                type="button"
                className={styles["reset-category-button"]}
                onClick={resetCategory}
              >
                Reset
              </button>
            </fieldset>
          </form>
        </div>

        {/* Grocery Items */}
        <div id={styles["main"]}>
          {groceryItems.length > 0 ? (
            <GroceryTable groceryItems={groceryItems} />
          ) : (
            <p>No products found. Try another search or adjust your filters!</p>
          )}
        </div>
      </div>
    </>
  );
}
