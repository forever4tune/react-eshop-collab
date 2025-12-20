import React, { useState, useMemo } from "react";
import { productsData } from "../data/products";
import ProductCard from "../components/ProductCard";
import styles from "../styles/product.module.css";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

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

  // Sort products by selected criteria
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

  // Infinite scroll: show a slice and load more on intersection
  const { visibleItems, sentinelRef, hasMore } = useInfiniteScroll(
    sortedProducts,
    12
  );

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
          {/** Use infinite-scroll to display a subset and lazy-load more */}
          {visibleItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className={styles.noProducts}>
            <p>No products found in this category.</p>
          </div>
        )}
        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef as React.RefObject<HTMLDivElement>} style={{ height: 1 }} />
        {hasMore && (
          <p style={{ textAlign: "center", padding: "1rem 0" }}>
            Loading more...
          </p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
