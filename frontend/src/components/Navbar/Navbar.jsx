import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { HiX } from "react-icons/hi";

const menuItems = [
  { path: "/", label: "홈" },
  { path: "/about", label: "회사정보" },
  { path: "/leader", label: "임원소개" },
  { path: "/board", label: "업무게시판" },
  { path: "/our-service", label: "제공기술" },
  { path: "/contact", label: "문의하기" },
];

//개별 메뉴 아이템- 개별아이템 마다 path, label,onclick 받기
const MenuItem = ({ path, label, onClick }) => (
  <li>
    <Link
      to={path}
      className="hover:text-blue-600 transition duration-300"
      onClick={onClick}
    >
      {label}
    </Link>
  </li>
);

function Navbar() {
  const [language, setLanguage] = useState("ko");
  const [isOpen, setIsOpen] = useState(false);

  //현재 isOpen 값의 반대로 바꿔주기
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white text-black p-4 shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl  lg:text-2xl lg:ml-12 lg:mr-12 font-bold">
          <a href="/">ABC Company</a>
        </h1>
        <div className="hidden lg:flex lg:flex-1 lg:justify-center font-bold">
          <ul className="flex gap-8 text-lg ">
            {menuItems.map((item) => (
              <MenuItem key={item.path} {...item} />
            ))}
          </ul>
        </div>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
          className="hidden lg:block px-3 py-1 ml-8 border rounded-lg bg-white hover:border-blue-500 transition duration-300 font-bold"
        >
          <option value="ko">한국어</option>
          <option value="en">영어</option>
        </select>

        <button
          className="lg:hidden text-2xl"
          onClick={toggleMenu}
          arial-label="메뉴"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white text-black transform-transition duration-300 ease-in-out z-50 
          ${isOpen ? "translate-x-0" : "translate-x-full"} lg:hidden`}
      >
        {/* //모바일 버전에서 clear nav바 */}
        <div className="p-4 gap-y-4">
          <button className="text-2xl mb-8 float-right" onClick={toggleMenu}>
            <HiX />
          </button>
          <ul className="clear-both space-y-4 pt-8 text-lg">
            {menuItems.map((item) => (
              <MenuItem
                key={item.path}
                {...item}
                onClick={() => {
                  setIsOpen(false); //다른 사이트이동시 패널 닫히도록
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </ul>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-8 w-full px-3 py-1 border rounded-md bg-white hover:border-blue-600 transition duration-300"
          >
            <option value="ko">한국어</option>
            <option value="en">영어</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
//sm md lg xl 2xl
