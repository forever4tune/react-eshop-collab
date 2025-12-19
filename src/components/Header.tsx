import { ShoppingCart, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { useState } from "react";

export default function Header() {
  const [searchKey, setSearchKey] = useState<string>("");
  const searchProducts = (e: string) => {
    setSearchKey(e);
  };
  const [isLoggiedIn, setIsLoggedIn] = useState<boolean>(false);
  const token = localStorage.getItem("auth");
  if (token) setIsLoggedIn(true);
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

        {/* Navigation */}
        <nav style={{ fontSize: "1.2em" }}>
          <Link to="/AllProducts" className={styles.products}>
            Products
          </Link>
          <Link to="/AllCategories" className={styles.categories}>
            Categories
          </Link>
        </nav>

        {/* Search */}
        <div>
          <Search />
          <input
            type="text"
            placeholder="Search products"
            className={styles["search-input"]}
            onChange={(e) => {
              searchProducts(e.target.value);
            }}
            value={searchKey}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "inline-flex" }}>
          <button className="relative">
            <ShoppingCart />
            <span className={styles.number}>2</span>
          </button>

          <div>
            {isLoggiedIn ? (
              <img src="/public/kyo.jfif" className="avatar"></img>
            ) : (
              <button>
                <User />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
