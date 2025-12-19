import React from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../data/products";
import styles from "../pages/product.module.css";
import Rating from "@mui/material/Rating";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className={styles.productCard}>
      <div
        className={styles.imageWrapper}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={styles.productImage}
        />
        {discountPercent > 0 && (
          <div className={styles.discountBadge}>{discountPercent}% OFF</div>
        )}
      </div>

      <div className={styles.productInfo}>
        <p className={styles.category}>{product.category}</p>

        <Link to={`/product/${product.id}`} className={styles.productNameLink}>
          <h5 className={styles.productName}>{product.name}</h5>
        </Link>

        <div className={styles.ratingWrapper}>
          <Rating
            value={product.rating}
            readOnly
            size="small"
            precision={0.5}
          />
          <span className={styles.reviewCount}>({product.reviews})</span>
        </div>

        <div className={styles.priceWrapper}>
          <span className={styles.originalPrice}>
            ${product.originalPrice.toFixed(2)}
          </span>
          <span className={styles.discountPrice}>
            ${product.price.toFixed(2)}
          </span>
        </div>

        <Link to="/cart" className={styles.cartButtonLink}>
          <button className={styles.cartButton}>
            <ShoppingCartIcon
              style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}
            />
            Add to Cart
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
