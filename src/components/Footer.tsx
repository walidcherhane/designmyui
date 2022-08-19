import React from "react";
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
function Footer() {
  return (
    <div className="fixed z-50 bottom-0 font-light inset-x-0 border-t bg-white p-4   ">
      <div className="container mx-auto flex  gap-2 w-full items-center justify-center sm:justify-between">
        Design my ui - UI design inspirations
        <a
            href="https://github.com/walidcherhane/design_my_ui"
            target="_blank"
            rel="noreferrer"
            className="order-first sm:order-none"
          >
            <FaGithub />
          </a>
        <div className=" items-center gap-2 hidden sm:flex">
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
  );
}

export default Footer;
