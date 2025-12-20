import { ShoppingCart, Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const searchProducts = (e: string) => {
    setSearchQuery(e);
  };
  const token = localStorage.getItem("auth");
  const isLoggiedIn = !!token;
  return (
    <header>
      <div
        className="d-flex mx-auto justify-content-around align-items-center"
        style={{ background: "rgb(6 91 217 / 23%)", padding: "8px" }}
      >
        {/* Logo */}
        <Link to="/" className={styles.title}>
          shopify
        </Link>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search products"
            className={styles["search-input"]}
            onChange={(e) => {
              searchProducts(e.target.value);
            }}
            value={searchQuery}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
          />
          <button
            onClick={() =>
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              paddingLeft: "5px",
            }}
          >
            <Search />
          </button>
        </div>
        {/* Navigation */}
        <nav className={styles.nav}>
          <Link to="/products" className={styles.products}>
            Products
          </Link>
          <Link to="/categories" className={styles.categories}>
            Categories
          </Link>
        </nav>

        {/* Actions */}
        <div style={{ display: "inline-flex" }}>
          <Link to="/cart" className={styles["cart-avatar"]}>
            <ShoppingCart />
            <span className={styles.number}>2</span>
          </Link>

          <div>
            {isLoggiedIn ? (
              <img src="/public/kyo.jfif" className={styles.avatar}></img>
            ) : (
              <button className={styles["user-avatar"]}>
                <User />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
