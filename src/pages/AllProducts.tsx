import React, { useState, useMemo } from "react";
import { productsData } from "../data/products";
import ProductCard from "../components/ProductCard";
import styles from "./product.module.css";

const AllProducts: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"default" | "price" | "rating">(
    "default"
  );

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return productsData;
    return productsData.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === "price") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  // Get unique categories
  const categories = ["All", ...new Set(productsData.map((p) => p.category))];

  return (
    <div className={styles.productsContainer}>
      <div className="container py-4">
        {/* Filters and Sorting */}
        <div className={styles.filterSortWrapper}>
          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Category:</label>
            <select
              className={styles.filterDropdown}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.sortSection}>
            <label className={styles.sortLabel}>Sort By:</label>
            <select
              className={styles.sortDropdown}
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "default" | "price" | "rating")
              }
            >
              <option value="default">Default</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div>
            <p className={styles.resultCount}>
              Showing {sortedProducts.length} products
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className={styles.noProducts}>
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
