import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

type Product = {
  id: number;
  name: string;
  price: number; // discounted/current price
  image: string;
  rating: number;
  category: string;
  original: number; // original price before discount
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
  reviews: number;
};

const Search = () => {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const qParam = params.get("q") || "";

  const [query, setQuery] = useState<string>(qParam);
  const [sort, setSort] = useState<string>("default");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(qParam);
  }, [qParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = qParam
          ? `https://dummyjson.com/products/search?q=${encodeURIComponent(
              qParam
            )}`
          : `https://dummyjson.com/products?limit=100`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const list = data.products.map((p: ApiProduct) => {
          const price: number = Number(p.price ?? 0);
          const discount: number = Number(p.discountPercentage ?? 0);
          const reviews: number = Array.isArray(p.reviews)
            ? p.reviews.length
            : Number(p.reviews ?? 0);
          const original =
            discount && discount < 100
              ? Number((price / (1 - discount / 100)).toFixed(2))
              : Number((price * 1.2).toFixed(2));

          return {
            id: Number(p.id),
            name: String(p.title ?? p.name ?? "Untitled"),
            price,
            image: String((p.thumbnail || (p.images && p.images[0])) ?? ""),
            rating: p.rating ? Number(p.rating) : 0,
            category: String(p.category ?? p.brand ?? "uncategorized"),
            original,
            originalPrice: original,
            reviews,
          } as Product;
        });

        setProducts(list);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name === "AbortError") return;
          setError(err.message || "Failed to load products");
        } else {
          setError("Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [qParam]);

  const computed = useMemo(() => {
    return products.map((p) => ({ ...p }));
  }, [products]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    let list = computed.filter((p) => {
      return (
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating-asc":
        list = [...list].sort((a, b) => a.rating - b.rating);
        break;
      case "rating-desc":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return list;
  }, [computed, query, sort]);

  return (
    <div
      className="container"
      style={{
        margin: "100px auto",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <label style={{ alignSelf: "center", marginRight: 8 }}>Sort:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
          </select>
        </div>
      </div>

      {loading && <div>Loading products…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Search;
