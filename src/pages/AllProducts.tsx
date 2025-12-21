import React, { useState, useMemo, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import styles from "../styles/product.module.css";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  original: number;
  originalPrice: number;
  reviews: number;
};

type ApiProduct = {
  id: number;
  title?: string;
  name?: string;
  price: number;
  discountPercentage?: number;
  thumbnail?: string;
  images?: string[];
  rating?: number;
  category?: string;
  brand?: string;
};

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchProducts = async () => {
      try {
        const url = `https://dummyjson.com/products?limit=100`;
        const res = await fetch(url, { signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        const list = (data.products || data).map((p: ApiProduct) => {
          const price: number = Number(p.price ?? 0);
          const discount: number = Number(p.discountPercentage ?? 0);
          const original =
            discount && discount < 100
              ? Number((price / (1 - discount / 100)).toFixed(2))
              : Number((price * 1.2).toFixed(2));

          return {
            id: Number(p.id),
            name: String(p.title ?? p.name ?? "Untitled"),
            price,
            image: String((p.thumbnail || (p.images && p.images[0])) ?? ""),
            rating: Number(p.rating ?? 0),
            category: String(p.category ?? p.brand ?? "uncategorized"),
            original,
            originalPrice: original,
            reviews: 0,
          } as Product;
        });
        setProducts(list);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Fetch aborted");
        }
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, []);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  // Sort products by selected criteria
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === "Price: Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Rating: Low to High") {
      sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "Rating: High to Low") {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  // Get unique categories
  const categories = ["All", ...new Set(products.map((p) => p.category))];

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
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Rating: Low to High">Rating: Low to High</option>
              <option value="Rating: High to Low">Rating: High to Low</option>
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
        <div
          ref={sentinelRef as React.RefObject<HTMLDivElement>}
          style={{ height: 1 }}
        />
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
