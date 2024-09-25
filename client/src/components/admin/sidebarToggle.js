import React, { useState, useEffect, useRef } from "react";
import { Collapse } from "bootstrap"; // Đảm bảo rằng bạn đã cài đặt bootstrap và bootstrap's JS

const SidebarToggle = () => {
  const [isSidebarToggled, setIsSidebarToggled] = useState(true);
  const sidebarToggleRef = useRef(null);

  useEffect(() => {
    const toggleSidebar = () => {
      setIsSidebarToggled((prevState) => !prevState);
    };

    const sidebarToggleElement = sidebarToggleRef.current;

    if (sidebarToggleElement) {
      sidebarToggleElement.addEventListener("click", toggleSidebar);
    }

    return () => {
      if (sidebarToggleElement) {
        sidebarToggleElement.removeEventListener("click", toggleSidebar);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        document
          .querySelectorAll(".sidebar .collapse")
          .forEach((collapseElement) => {
            const bsCollapse = new Collapse(collapseElement, { toggle: false });
            bsCollapse.hide();
          });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isSidebarToggled) {
      document.body.classList.add("sidebar-toggled");
      document.querySelector(".sidebar").classList.add("toggled");
      document
        .querySelectorAll(".sidebar .collapse")
        .forEach((collapseElement) => {
          const bsCollapse = new Collapse(collapseElement, { toggle: false });
          bsCollapse.hide();
        });
    } else {
      document.body.classList.remove("sidebar-toggled");
      document.querySelector(".sidebar").classList.remove("toggled");
    }
  }, [isSidebarToggled]);

  return (
    <div className="text-center d-none d-md-inline">
      <button
        className="rounded-circle border-0"
        id="sidebarToggle"
        ref={sidebarToggleRef}
      ></button>
    </div>
  );
};

export default SidebarToggle;
