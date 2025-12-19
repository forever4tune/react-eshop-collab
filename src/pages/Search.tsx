import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productsData from "../data.json";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const getCategoryFromName = (name: string) => {
  const m = name.match(/^[a-zA-Z]+/);
  return m ? m[0].toLowerCase() : "other";
};

const normalizeImage = (img: string) => img.replace(/^\/public/, "");

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const initialQuery = params.get("q") || "";

  const [query, setQuery] = useState<string>(initialQuery);
  const [sort, setSort] = useState<string>("default");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const products: Product[] = productsData as Product[];

  const computed = useMemo(() => {
    // augment products with rating and original price
    return products.map((p) => {
      const rating = (p.id % 5) + 1; // 1-5
      const original = Number((p.price * 1.2).toFixed(2));
      const discounted = Number(p.price.toFixed(2));
      const category = getCategoryFromName(p.name);
      return { ...p, rating, original, discounted, category };
    });
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = computed.filter((p) => {
      return (
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });

    switch (sort) {
      case "price-asc":
        list = list.sort((a, b) => a.discounted - b.discounted);
        break;
      case "price-desc":
        list = list.sort((a, b) => b.discounted - a.discounted);
        break;
      case "rating-asc":
        list = list.sort((a, b) => a.rating - b.rating);
        break;
      case "rating-desc":
        list = list.sort((a, b) => b.rating - a.rating);
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
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            right: "-42%",
            width: "20%;",
          }}
        >
          <label style={{ marginRight: 8 }}>Sort:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((p) => (
          <div
            key={p.id}
            style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}
          >
            <div
              onClick={() => navigate(`/product/${p.id}`)}
              style={{
                textAlign: "center",
                marginBottom: 8,
                cursor: "pointer",
              }}
            >
              <img
                src={normalizeImage(p.image)}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            </div>

            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
              {p.category}
            </div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{p.name}</div>

            <div style={{ color: "#f5a623", marginBottom: 6 }}>
              {Array.from({ length: p.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#999",
                  marginRight: 8,
                }}
              >
                ${p.original}
              </span>
              <span style={{ fontWeight: 700 }}>${p.discounted}</span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => navigate(`/cart`)}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  background: "#0660d9",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Add to cart
              </button>
              <button
                onClick={() => navigate(`/product/${p.id}`)}
                style={{
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
