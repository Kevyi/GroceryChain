import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import products from "./Product"; // Importing static product data

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TrendyPage() {
    // Mock trending data
    const trendingData = [
        { id: "002", title: "Apple", sales: 120 },
        { id: "006", title: "Broccoli", sales: 100 },
        { id: "019", title: "Strawberries", sales: 90 },
        { id: "023", title: "Cauliflower", sales: 85 },
        { id: "031", title: "Chicken", sales: 75 },
    ];

    const [productStock, setProductStock] = useState(
        products.reduce((acc, product) => {
            acc[product.id] = 100; // Default stock for each product
            return acc;
        }, {})
    );

    const lowStockThreshold = 20; // Define threshold for low stock

    const handleRestock = (productId) => {
        setProductStock((prevStock) => ({
            ...prevStock,
            [productId]: prevStock[productId] + 50,
        }));
        alert(`Restocked 50 units for product ID: ${productId}`);
    };

    // Chart data for trending items
    const barChartData = {
        labels: trendingData.map((item) => item.title),
        datasets: [
            {
                label: "Sales",
                data: trendingData.map((item) => item.sales),
                backgroundColor: [
                    "#4BC0C0",
                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#9966FF",
                ],
                borderColor: [
                    "#4BC0C0",
                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#9966FF",
                ],
                borderWidth: 2,
                hoverBackgroundColor: [
                    "#4BC0C0CC",
                    "#36A2EBCC",
                    "#FF6384CC",
                    "#FFCE56CC",
                    "#9966FFCC",
                ],
            },
        ],
    };

    // Find low-stock items
    const lowStockItems = trendingData.filter((item) => productStock[item.id] < lowStockThreshold);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#333" }}>Trending Items Overview</h1>

            {/* Bar Chart for Trending Items */}
            <div style={{ width: "70%", margin: "auto", marginBottom: "40px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>Top Trending Items</h2>
                <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            </div>

            {/* Low Stock Alert */}
            <div style={{ width: "80%", margin: "auto", marginBottom: "40px", textAlign: "center" }}>
                <h2 style={{ marginBottom: "20px", color: "#D9534F" }}>Low Stock Alert</h2>
                {lowStockItems.length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {lowStockItems.map((item) => (
                            <li
                                key={item.id}
                                style={{
                                    backgroundColor: "#F8D7DA",
                                    color: "#721C24",
                                    marginBottom: "10px",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                            >
                                {item.title} is running low: {productStock[item.id]} units left!
                                <button
                                    onClick={() => handleRestock(item.id)}
                                    style={{
                                        marginLeft: "20px",
                                        backgroundColor: "#D9534F",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 10px",
                                        borderRadius: "3px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Restock
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: "#155724", backgroundColor: "#D4EDDA", padding: "10px", borderRadius: "5px" }}>
                        All items are sufficiently stocked!
                    </p>
                )}
            </div>

            {/* Restock Table */}
            <div style={{ width: "90%", margin: "auto", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>Inventory Management</h2>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f1f1f1" }}>
                            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Product</th>
                            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Stock</th>
                            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trendingData.map((item) => {
                            const product = products.find((p) => p.id === item.id);
                            return (
                                <tr key={item.id}>
                                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{product.title}</td>
                                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>{productStock[item.id]} units</td>
                                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                                        <button
                                            onClick={() => handleRestock(item.id)}
                                            style={{
                                                backgroundColor: "#4CAF50",
                                                color: "white",
                                                border: "none",
                                                padding: "10px 15px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
