import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Rating from "@mui/material/Rating";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import styles from "../styles/singleProduct.module.css";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  originalPrice: number;
  reviews: number;
  description?: string;
  images?: string[];
  brand?: string;
  stock?: number;
};

const SingleProduct = () => {
  const { productID } = useParams<{ productID: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  type Review = {
    id?: string | number;
    author?: string;
    rating?: number;
    date?: string;
    title?: string;
    body?: string;
    comment?: string;
    message?: string;
    user?: string;
    username?: string;
    subject?: string;
    rate?: number;
  };
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const allUrl = "https://dummyjson.com/products?limit=100";
        const detailUrl = `https://dummyjson.com/products/${productID}`;

        const [allRes, detailRes] = await Promise.all([
          fetch(allUrl, { signal }),
          fetch(detailUrl, { signal }),
        ]);

        if (!allRes.ok) throw new Error(`Products list HTTP ${allRes.status}`);
        if (!detailRes.ok) throw new Error(`Product HTTP ${detailRes.status}`);

        const allData = await allRes.json();
        const detailData = await detailRes.json();

        const items = (allData.products || allData) as Array<
          Record<string, unknown>
        >;
        const list = items.map((p) => {
          const price: number = Number((p["price"] as number) ?? 0);
          const discount: number = Number(
            (p["discountPercentage"] as number) ?? 0
          );
          const original =
            discount && discount < 100
              ? Number((price / (1 - discount / 100)).toFixed(2))
              : Number((price * 1.2).toFixed(2));

          return {
            id: Number(p["id"] as number),
            name: String(((p["title"] ?? p["name"]) as string) ?? "Untitled"),
            price,
            image: String(
              ((p["thumbnail"] ??
                (Array.isArray(p["images"])
                  ? (p["images"] as unknown[])[0]
                  : undefined)) as string) ?? ""
            ),
            rating: Number((p["rating"] as number) ?? 0),
            category: String(
              ((p["category"] ?? p["brand"]) as string) ?? "uncategorized"
            ),
            originalPrice: original,
            reviews: Array.isArray(p["reviews"])
              ? (p["reviews"] as Array<unknown>).length
              : 0,
          } as Product;
        });

        setAllProducts(list);

        const price: number = Number(detailData.price ?? 0);
        const discount: number = Number(detailData.discountPercentage ?? 0);
        const original =
          discount && discount < 100
            ? Number((price / (1 - discount / 100)).toFixed(2))
            : Number((price * 1.2).toFixed(2));

        const prod: Product = {
          id: Number(detailData.id),
          name: String(detailData.title ?? detailData.name ?? "Untitled"),
          price,
          image: String(
            (detailData.thumbnail ||
              (detailData.images && detailData.images[0])) ??
              ""
          ),
          rating: Number(detailData.rating ?? 0),
          category: String(
            detailData.category ?? detailData.brand ?? "uncategorized"
          ),
          originalPrice: original,
          reviews: Array.isArray(detailData.reviews)
            ? detailData.reviews.length
            : Number(detailData.reviews ?? 0) || 0,
          description: String(detailData.description ?? ""),
          images: Array.isArray(detailData.images)
            ? detailData.images
            : undefined,
          brand: detailData.brand ?? undefined,
          stock: Number(detailData.stock ?? 0),
        };

        setProduct(prod);

        let reviewsList: Review[] = [];
        try {
          const reviewsRes = await fetch(
            `https://dummyjson.com/products/${productID}/reviews`,
            { signal }
          );
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            const maybe = (reviewsData &&
              (reviewsData.reviews ?? reviewsData)) as
              | Array<Record<string, unknown>>
              | undefined;
            if (Array.isArray(maybe)) {
              reviewsList = maybe.map((r) => ({
                id: r["id"] as unknown as string | number,
                author: (r["author"] ?? r["user"] ?? r["username"]) as string,
                rating: Number(r["rating"] ?? r["rate"] ?? 0),
                date: (r["date"] ?? r["postedAt"]) as string,
                title: (r["title"] ?? r["subject"]) as string,
                body: (r["body"] ?? r["comment"] ?? r["message"]) as string,
              }));
            }
          }
        } catch {
          // ignore and fallback
        }

        if (
          !reviewsList.length &&
          Array.isArray((detailData as Record<string, unknown>)["reviews"])
        ) {
          reviewsList = (
            (detailData as Record<string, unknown>)["reviews"] as Array<
              Record<string, unknown>
            >
          ).map((r) => ({
            id: r["id"] as unknown as string | number,
            author: (r["author"] ?? r["user"] ?? r["username"]) as string,
            rating: Number(r["rating"] ?? r["rate"] ?? 0),
            date: (r["date"] ?? r["postedAt"]) as string,
            title: (r["title"] ?? r["subject"]) as string,
            body: (r["body"] ?? r["comment"] ?? r["message"]) as string,
          }));
        }

        if (!reviewsList.length) {
          reviewsList = [
            {
              id: `r-${prod.id}-1`,
              author: "Verified Buyer",
              rating: prod.rating,
              date: new Date().toISOString().slice(0, 10),
              title: "Customer feedback",
              body: detailData.description
                ? String(detailData.description).slice(0, 140)
                : "Good product.",
            },
          ];
        }

        setProductReviews(reviewsList);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to load product"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [productID]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <h2>{error || "Product not found"}</h2>
        <button onClick={() => navigate("/products")}>Back to Products</button>
      </div>
    );
  }

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const images =
    product.images && product.images.length ? product.images : [product.image];

  const similarProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const handleAddToCart = () => {
    navigate("/cart");
  };

  return (
    <div className={styles.singleProductContainer}>
      <div className={styles.productDetailsSection}>
        <div className={styles.imageGalleryColumn}>
          <div className={styles.mainImageWrapper}>
            <img
              src={images[selectedImage]}
              alt={product.name}
              className={styles.mainImage}
            />
            {discountPercent > 0 && (
              <div className={styles.discountBadge}>{discountPercent}% OFF</div>
            )}
          </div>

          <div className={styles.thumbnailGallery}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${
                  selectedImage === index ? styles.activeThumbnail : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`View ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.productDetailsColumn}>
          <div className={styles.productMeta}>
            <span className={styles.category}>{product.category}</span>
            <span className={styles.brand}>{product.brand ?? ""}</span>
          </div>

          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.ratingSection}>
            <Rating
              value={product.rating}
              readOnly
              precision={0.5}
              size="medium"
            />
            <span className={styles.ratingText}>
              {product.rating} ({productReviews.length} reviews)
            </span>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.priceWrapper}>
              <span className={styles.originalPrice}>
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className={styles.currentPrice}>
                ${product.price.toFixed(2)}
              </span>
              <span className={styles.discountPercentage}>
                {discountPercent}% OFF
              </span>
            </div>
          </div>

          <div className={styles.productDetailsInfo}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Brand:</span>
              <span className={styles.detailValue}>{product.brand ?? "-"}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Category:</span>
              <span className={styles.detailValue}>{product.category}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Stock Status:</span>
              <span className={`${styles.detailValue} ${styles.inStock}`}>
                {product.stock && product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of stock"}
              </span>
            </div>
          </div>

          <div className={styles.description}>
            <h3>Product Description</h3>
            <p>{product.description ?? "No description available."}</p>
          </div>

          <div className={styles.actionButtonsGroup}>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              <ShoppingCartIcon />
              <span>Add to Cart</span>
            </button>
            <button
              className={styles.recommendBtn}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              <span>{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
            </button>
          </div>
        </div>

        <div className={styles.reviewsColumn}>
          <div className={styles.reviewsHeader}>
            <h3>Customer Reviews</h3>
            <span className={styles.reviewCount}>
              {productReviews.length} reviews
            </span>
          </div>

          <div className={styles.reviewsList}>
            {productReviews.map((review, idx: number) => (
              <div key={review.id ?? idx} className={styles.reviewItem}>
                <div className={styles.reviewTop}>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>
                      {review.author ?? "Customer"}
                    </span>
                    <span className={styles.reviewDate}>
                      {review.date ?? ""}
                    </span>
                  </div>
                  <Rating
                    value={Number(review.rating ?? product.rating)}
                    readOnly
                    size="small"
                  />
                </div>
                <h4 className={styles.reviewTitle}>{review.title ?? ""}</h4>
                <p className={styles.reviewComment}>
                  {review.body ?? review.comment ?? review.message ?? ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.similarProductsSection}>
        <h2 className={styles.similarProductsTitle}>
          Similar Products in {product.category}
        </h2>
        <div className={styles.similarProductsGrid}>
          {similarProducts.slice(0, 4).map((similarProduct) => (
            <ProductCard key={similarProduct.id} product={similarProduct} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
