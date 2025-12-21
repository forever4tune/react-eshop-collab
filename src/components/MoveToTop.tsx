import { useState, useEffect } from "react";
import styles from "../styles/moveToTop.module.css";

const MoveToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          className={styles.moveToTopBtn}
          onClick={scrollToTop}
          aria-label="Move to top"
          title="Back to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default MoveToTop;
