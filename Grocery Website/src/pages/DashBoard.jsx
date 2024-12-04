import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import axios from "axios";
import styles from "../styles/Dashboard.module.css"; // Import CSS module

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function DashboardPage() {
    const [trendingItems, setTrendingItems] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [outOfStockItems, setOutOfStockItems] = useState([]);
    const [popularItems, setPopularItems] = useState([]);
    const [totalSpending, setTotalSpending] = useState(0);
    const [totalProductsSold, setTotalProductsSold] = useState(0);

    const lowStockThreshold = 10;

    useEffect(() => {
        fetchProductData();
        fetchPopularItems();
        fetchPurchaseStats();
    }, []);

    const fetchProductData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/storage");
            const products = response.data.data;

            const topTrending = products.sort((a, b) => b.quantity - a.quantity).slice(0, 6);
            const lowStock = products.filter((item) => item.quantity > 0 && item.quantity < lowStockThreshold);
            const outOfStock = products.filter((item) => item.quantity === 0);

            setTrendingItems(topTrending);
            setLowStockItems(lowStock);
            setOutOfStockItems(outOfStock);
        } catch (error) {
            console.error("Error fetching product data:", error.message);
        }
    };

    const fetchPopularItems = () => {
        const popularItemsData = JSON.parse(localStorage.getItem("popularItems")) || {};
        const sortedItems = Object.entries(popularItemsData)
            .map(([title, quantity]) => ({ title, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 6);
        setPopularItems(sortedItems);
    };

    const fetchPurchaseStats = async () => {
        try {
          const response = await axios.get("http://localhost:3000/purchase");
          const purchases = response.data.data;
    
          let totalSpent = 0;
          let productsSold = 0;
    
          purchases.forEach((purchase) => {
            totalSpent += purchase.totalPrice;
            productsSold += purchase.items.reduce((sum, item) => sum + item.quantity, 0);
          });
    
          setTotalSpending(totalSpent);
          setTotalProductsSold(productsSold);
        } catch (error) {
          console.error("Error fetching purchase stats:", error.message);
        }
      };

    const barChartData = {
        labels: trendingItems.map((item) => item.product_name),
        datasets: [
            {
                label: "Count",
                data: trendingItems.map((item) => item.quantity),
                backgroundColor: ["#4BC0C0", "#36A2EB", "#FF6384", "#FFCE56", "#9966FF", "#FFA07A"],
                borderColor: ["#4BC0C0", "#36A2EB", "#FF6384", "#FFCE56", "#9966FF", "#FFA07A"],
                borderWidth: 2,
            },
        ],
    };

    const popularItemsChartData = {
        labels: popularItems.map((item) => item.title),
        datasets: [
            {
                label: "Purchase Count",
                data: popularItems.map((item) => item.quantity),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FFA07A"],
                borderColor: ["#FFFFFF"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>

            {/* Most Purchased Items (Pie Chart) */}
            <section className={styles.section}>
                <h2 className={styles.popularItemsTitle}>Most Purchased Items</h2>
                <div className={styles.chartWrapper}>
                    {popularItems.length > 0 ? (
                        <Pie
                            data={popularItemsChartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top",
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (tooltipItem) {
                                                const data = tooltipItem.dataset.data;
                                                const total = data.reduce((acc, value) => acc + value, 0);
                                                const value = data[tooltipItem.dataIndex];
                                                const percentage = ((value / total) * 100).toFixed(2);
                                                return `${tooltipItem.label}: ${value} (${percentage}%)`;
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p className={styles.noPopularItemsMessage}>
                            No purchases recorded yet.
                        </p>
                    )}
                </div>
            </section>

            {/* Most Items in Database */}
            <section className={styles.section}>
                <h2 className={styles.chartTitle}>Most Items in Database</h2>
                <div className={styles.chartWrapper}>
                    <Bar
                        data={barChartData}
                        options={{
                            responsive: true,
                            plugins: { legend: { position: "top" } },
                        }}
                    />
                </div>
            </section>

            {/* Low Stock Alert */}
            <section className={styles.section}>
                <h2 className={styles.lowStockTitle}>Low Stock Alert</h2>
                <div className={styles.tableWrapper}>
                    {lowStockItems.length > 0 ? (
                        <table className={styles.lowStockTable}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Current Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockItems.map((item) => (
                                    <tr key={item.product_id}>
                                        <td>{item.product_name}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className={styles.lowStockMessage}>
                            All items are sufficiently stocked!
                        </p>
                    )}
                </div>
            </section>

            {/* Out of Stock Alert */}
            <section className={styles.section}>
                <h2 className={styles.outOfStockTitle}>Out of Stock</h2>
                <div className={styles.tableWrapper}>
                    {outOfStockItems.length > 0 ? (
                        <table className={styles.outOfStockTable}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outOfStockItems.map((item) => (
                                    <tr key={item.product_id}>
                                        <td>{item.product_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className={styles.outOfStockMessage}>
                            No items are currently out of stock!
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
