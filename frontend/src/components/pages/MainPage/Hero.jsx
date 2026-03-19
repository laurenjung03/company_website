import React from "react";
import HeroImage from "../../../assets/Image1.jpg";

function Hero() {
  return (
    <div className="relative min-h-[110vh] bg-gradient-to-b from-gray-50 to-white pb-0">
      <div className="container mx-auto px-4  sm:px-6 lg:px-8 py-28 lg:py-44">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* //제목과 버튼들 */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl  2xl:text-7xl font-bold text-gray-900 leading-tight mb-6 lg:mb-12 ">
              태양광 설비 전문가와 함께
              <span className="block text-blue-600 mt-2 lg:mt-6">
                미래를 만들어갑니다
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 font-semibold mb-8 max-w-2xl mx-auto">
              안전하고 효육적인 태양광 설비 설치부터 유지보수까지 전문기술이
              함께합니다
            </p>
            {/* //버튼 추가영역 */}
            <div className="flex gap-4 ">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold shadow-xl hover:shadow-xl">
                상담 신청하기
              </button>
              <button className="px-8 py-4 bg-white  text-bg-blue-600  border-blue-300  rounded-lg hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold shadow-xl hover:shadow-xl">
                더 알아보기
              </button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-2xl lg:max-w-none">
            <div>
              <img
                src={HeroImage}
                className="relative rounded-2xl shadow-2xl w-full object-cover transform hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      {/* //설치완료, 고객만족도섹션  */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: "1200+", label: "설치완료" },
            { number: "98%", label: "고객만족도" },
            { number: "15년+", label: "업계경력" },
            { number: "24/7", label: "기술지원" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stat.number}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;
