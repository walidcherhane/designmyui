import React, { useRef } from "react";
import { FaGithub } from "react-icons/fa";
import useHideOnScroll from "../Hooks/useHideOnScroll";
function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  useHideOnScroll((diff) => {
    ref.current!.style.transform = `translateY(${diff}px)`;
  }, ref);
  return (
    <>
      {
        <div
          ref={ref}
          className="fixed inset-x-0 bottom-0 z-50 border-t bg-white p-4 font-light transition   "
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
        </div>
      }
    </>
  );
}

export default Footer;
