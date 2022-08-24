import { useScroll } from "ahooks";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { FaTwitter, FaGithub } from "react-icons/fa";
function Footer() {
  const [isVisible, setIsVisible] = React.useState(true);
  const scroll = useScroll();
  const [y, setY] = useState(scroll?.top);
  const handleNavigation = useCallback(() => {
    if (y && scroll?.top) {
      if (y > scroll?.top) {
        // up
        setIsVisible(true);
      } else if (y < scroll?.top) {
        // down
        setIsVisible(false);
      }
    }
    setY(scroll?.top);
  }, [y, scroll?.top]);

  useEffect(() => {
    window.addEventListener("scroll", handleNavigation);

    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);
  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          initial={{ bottom: "-100%" }}
          animate={{ bottom: 0 }}
          exit={{ bottom: "-100%" }}
          transition={{
            duration: 0.5,
            ease: "linear",
          }}
          className="fixed inset-x-0 bottom-0 z-50 border-t bg-white p-4 font-light   "
        >
          <div className="container mx-auto flex  w-full items-center justify-center gap-2 sm:justify-between">
            Design my ui - UI design inspirations
            <a
              href="https://github.com/walidcherhane/designmyui"
              target="_blank"
              rel="noreferrer"
              className="order-first sm:order-none"
            >
              <FaGithub />
            </a>
            <div className=" hidden items-center gap-2 sm:flex">
              Developed by{" "}
              <a
                href="https://twitter.com/cherhane_walid"
                target="_blank"
                rel="noreferrer"
              >
                @cherhane_walid
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Footer;
