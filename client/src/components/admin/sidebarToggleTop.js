import React, { useState, useEffect } from "react";
import $ from "jquery";

const SidebarToggleTop = () => {
  const [isSidebarToggled, setIsSidebarToggled] = useState(true);

  useEffect(() => {
    const toggleSidebar = () => {
      setIsSidebarToggled((prevState) => !prevState);
    };

    const sidebarToggleTopElement = document.getElementById("sidebarToggleTop");
    if (sidebarToggleTopElement) {
      sidebarToggleTopElement.addEventListener("click", toggleSidebar);
    }

    return () => {
      if (sidebarToggleTopElement) {
        sidebarToggleTopElement.removeEventListener("click", toggleSidebar);
      }
    };
  }, []);

  useEffect(() => {
    if (isSidebarToggled) {
      document.body.classList.add("sidebar-toggled");
      const sidebarElement = document.querySelector(".sidebar");
      if (sidebarElement) {
        sidebarElement.classList.add("toggled");
        const collapses = sidebarElement.querySelectorAll(".collapse");
        collapses.forEach((collapse) => {
          $(collapse).collapse("hide");
        });
      }
    } else {
      document.body.classList.remove("sidebar-toggled");
      const sidebarElement = document.querySelector(".sidebar");
      if (sidebarElement) {
        sidebarElement.classList.remove("toggled");
      }
    }
  }, [isSidebarToggled]);

  return (
    <button
      id="sidebarToggleTop"
      className="btn btn-link d-md-none rounded-circle mr-3"
    >
      <i className="fa fa-bars"></i>
    </button>
  );
};

export default SidebarToggleTop;
