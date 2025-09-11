import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaSquareXTwitter, FaInstagram } from "react-icons/fa6";

const Navbar = () => {
  return (
    <nav className="mb-20 flex items-center justify-between py-2">
      <div className="flex flex-shrink-0 items-center">
        <div className="font-bold text-4xl">T</div>
      </div>
      <div className="flex items-center m-8 justify-center gap-4 text-2xl mr-0">
        <a
          target="_blank"
          href="https://www.linkedin.com/in/thu-yain-soe-b49a2b242/"
        >
          <FaLinkedin className=" text-2xl hover:text-blue-500 cursor-pointer" />
        </a>
        <a target="_blank" href="https://github.com/thuyainsoe">
          <FaGithub className=" text-2xl hover:text-gray-500 cursor-pointer" />
        </a>

        <a target="_blank" href="https://www.instagram.com/tys_ivii/">
          <FaInstagram className=" text-2xl hover:text-pink-500 cursor-pointer" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
