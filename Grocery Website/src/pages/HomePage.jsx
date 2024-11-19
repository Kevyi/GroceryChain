import styles from "../styles/home.module.css";
import Carousel from "../components/Carousel.jsx";
import WelcomeImage from "./WelcomeImage";

export default function Home() {
  const handleNavigation = (filter) => {
    // Check if the filter is "all" and navigate to the basic grocery page
    if (filter === "all") {
      window.location.href = "/grocery-page"; // Basic grocery page
    } else {
      window.location.href = `/grocery-page?filter=${filter}`; // Other filters with the filter query parameter
    }
  };

  return (
    <>
      <div id={styles["main"]}>
        {/* Hero Section */}
        <section className={styles["hero-section"]}>
          <div className={styles["image-container"]}>
            <img
              src={WelcomeImage[0].image} // Dynamic image from WelcomeImage array
              alt="Fresh groceries"
              className={styles["hero-image"]}
            />
            <div className={styles["text-overlay"]}>
              <h1 className={styles["title"]}>Make healthy life with fresh grocery</h1>
              <p className={styles["subtitle"]}>
                Get the best quality and most delicious grocery food in the world. You can get them all using our website.
              </p>
              <a href="/grocery-page" className={styles["shop-now-button"]}>
                Shop Now
              </a>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className={styles["filter-section"]}>
          <div className={styles["filter-container"]}>
            {[
              { id: "all", name: "All", image: WelcomeImage[1].image },
              { id: "fruit", name: "Fruit", image: WelcomeImage[2].image },
              { id: "vegetable", name: "Vegetable", image: "HomeImage/Vegetable.jpg" },
              { id: "meat", name: "Meat", image: "HomeImage/Meat.jpg" },
              { id: "other", name: "Other", image: "HomeImage/Other.jpg" },
            ].map((filter) => (
              <div
                key={filter.id}
                className={styles["filter-item"]}
                onClick={() => handleNavigation(filter.id)}
              >
                <img
                  src={filter.image}
                  alt={filter.name}
                  className={styles["filter-image"]}
                />
                <p>{filter.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Carousel Section */}
        <section className={styles["center-carousel"]}>
          <h2 className={styles["section-title"]}>Top Categories</h2>
          <Carousel />
        </section>

        {/* Footer Section */}
        <footer className={styles["footer"]}>
          <a
            href="https://github.com/Kevyi/GroceryChain"
            target="_blank"
            rel="noopener noreferrer"
            className={styles["footer-link"]}>
            Contributions @ GitHub: GroceryChain
          </a>
        </footer>
      </div>
    </>
  );
}
