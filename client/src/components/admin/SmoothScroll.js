import React, { useEffect } from "react";
import $ from "jquery";

const SmoothScroll = () => {
  useEffect(() => {
    const handleSmoothScroll = () => {
      const sidebarElement = document.querySelector('body.fixed-nav .sidebar');
      if (sidebarElement) {
        $(sidebarElement).on('mousewheel DOMMouseScroll wheel', function(e) {
          if ($(window).width() > 768) {
            var e0 = e.originalEvent,
              delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
          }
        });
      }

      return () => {
        if (sidebarElement) {
          $(sidebarElement).off('mousewheel DOMMouseScroll wheel');
        }
      };
    };

    handleSmoothScroll();
  }, []);

  return null; // Component này không render gì cả
};

export default SmoothScroll;
