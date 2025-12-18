import { ShoppingCart, Search, User } from "lucide-react";
import {Link} from "react-router-dom";
import styles from './header.module.css';

export default function Header() {
  return (
    <header>
      <div className="d-flex mx-auto justify-content-around align-items-center" style={{background:"rgb(6 91 217 / 23%)", padding:"8px"}}>
        {/* Logo */}
        <Link to="/" className={styles.title} >shopify</Link>

        {/* Navigation */}
        <nav style={{fontSize:"1.2em"}}>
          <Link to="/AllProducts" className={styles.products}>Products</Link>
          <Link to="/AllCategories" className={styles.categories} >Categories</Link>
        </nav>

        {/* Search */}
        <div >
          <Search/>
          <input type="text" placeholder="Search products" className={styles["search-input"]} />
        </div>

        {/* Actions */}
        <div>
          <button className="relative">
            <ShoppingCart />
            <span className={styles.number}>2</span>
          </button>

          <button>
            <User />
          </button>
        </div>
      </div>
    </header>
  );
}
