import React from "react";
import { Link } from "react-router-dom";

import { RiKakaoTalkLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  const scrolltoTop = () => {
    window.scrollTo({ top: 0, behavior: smooth });
  };

  return (
    <div>
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* //영역별(회사소개 빠른링크 연락처 소셜 미디어 ) */}
            <div>
              <h3 className="text-xl font-bold mb-4">회사소개</h3>
              <p className="text-gray-300">
                저희 회사는 최고 서비스 제공합니다{" "}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">빠른링크</h3>
              {/* //순서없는 태그이므로 ul태그 사용  */}
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    onClick={scrolltoTop}
                    className="hover:text-white transition-colors"
                  >
                    홈
                  </Link>
                </li>

                <li>
                  <Link
                    to="/about"
                    onClick={scrolltoTop}
                    className="hover:text-white transition-colors"
                  >
                    회사정보
                  </Link>
                </li>

                <li>
                  <Link
                    to="/leadership"
                    onClick={scrolltoTop}
                    className="hover:text-white transition-colors"
                  >
                    임원소개
                  </Link>
                </li>

                <li>
                  <Link
                    to="/board"
                    onClick={scrolltoTop}
                    className="hover:text-white transition-colors"
                  >
                    업무게시판
                  </Link>
                </li>
                <li>
                  <Link
                    to="/our-service"
                    onClick={scrolltoTop}
                    className="hover:text-white transition-colors"
                  >
                    제공기술
                  </Link>
                </li>

                <li>
                  <Link
                    to="/contact"
                    onClick={scrolltoTop}
                    className="hover:text-white transition-colors"
                  >
                    문의하기
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">연락처</h3>
              <ul className="space-y-2 text-gray-400">
                <li>서울특별시 서대문구</li>
                <li>대현동 123번지 </li>
                <li>전화: 010-6666</li>
                <li> 이메일: info@example.com</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">소셜 미디어</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <RiKakaoTalkLine />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <CiLinkedin />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaXTwitter />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 pb-8  text-center text-gray-400">
          <p>&copy; 2026 ABC Company. All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
