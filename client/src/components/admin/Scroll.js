import React, { useEffect } from "react";
import "./er/css/admin.css";
const ScrollToTop = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollDistance = window.pageYOffset;
      if (scrollDistance > 100) {
        document.querySelector(".scroll-to-top").style.display = "block";
      } else {
        document.querySelector(".scroll-to-top").style.display = "none";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className="btn btn-secondary scroll-to-top"
      onClick={scrollToTop}
      style={{ display: "none" }}
    >
      <i className="fa fa-chevron-up"></i>
    </button>
  );
};

export default ScrollToTop;
