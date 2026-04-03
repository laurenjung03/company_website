import React from "react";
import companyImage from "../../../assets/Image2.jpg";

function About() {
  return (
    <div className="container py-24 mx-auto">
      <div className="relative rounded-2xl max-w-7xl mx-auto overflow-hidden">
        <img
          src={companyImage}
          className=" shadow-md  hover:shadow-xl w-full h-full "
        />
        <div className="absolute inset-0 bg-gradient-to-b from transparent via-transparent to-slate-900"></div>
        <div className="absolute left-10 bottom-10">
          <h2 className="text-3xl text-white font-semibold mb-2">
            ABC Company
          </h2>
          <p className=" text-white">혁신과 신뢰로 글로벌 시장을 선도합니다</p>
        </div>
      </div>

      <div className="mt-16 max-w-4xl mx-auto text-center ">
        <div>
          <h3 className="text-4xl mb-8">회사소개</h3>
          <p className="mb-8">
            ABC Company는 1995년 설립 이래로 전력 변환 장치 및 전력 제어 시스템
            분야에서 혁신적인 솔루션을 제공해온 선도적인 전기 기업입니다. 고효율
            변압기, 전력변환장치(PCS), 무정전전원장치(UPS) 등의 핵심 제품을 개발
            및 생산하며, 신재생 에너지 설비와 스마트 그리드 시스템 구축에도
            앞장서고 있습니다.
          </p>
          <p>
            특히 친환경 에너지 솔루션 분야에서 탁월한 기술력을 인정받아, 국내외
            주요 발전소와 산업시설에 안정적인 전력 공급 시스템을 구축하고
            있습니다. 끊임없는 R&D 투자와 기술 혁신을 통해 에너지 효율화와 전력
            품질 향상에 기여하며, 지속 가능한 미래를 위한 친환경 에너지 솔루션을
            선도하고 있습니다.
          </p>
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 xl:max-w-6xl mx-auto">
        {[
          { title: "혁신", desc: "끊임없는 도전과 혁신으로 미래를 선도합니다" },
          { title: "신뢰", desc: "고객과의 신뢰를 최우선 가치로 삼습니다" },
          { title: "성장", desc: "구성원들의 지속적인 성장을 지원합니다" },
        ].map((item, index) => (
          <div key={index} className="p-6 rounded-xl shadow-2xl text-center">
            <h3 className="text-indigo-600 text-xl mb-6">{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-4xl mt-24 text-center">
        <h2 className="text-4xl font-semibold"> 비전</h2>
        <p className="mt-8 text-xl">
          2030년까지 글로벌 시장을 선도하는 기술 혁신 기업으로 도약해여, <br />
          더 나은 세상을 만드는게 기여하겠습니다
        </p>
      </div>
      <div className="mt-24  ">
        <h2 className="mb-8 text-4xl font-semibold text-center">회사연혁</h2>
        <div className="mx-auto max-w-2xl md:max-w-5xl space-y-12 ">
          {[
            { year: "2023", event: "글로벌 시장 진출" },
            { year: "2022", event: "시리즈 B 투자 유치" },
            { year: "2021", event: "주요 기술 특허 획득" },
            { year: "2020", event: "회사 설립" },
          ].map((item, index) => (
            <div
              key={index}
              className={` flex  items-center gap-12 bg-white ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} `}
            >
              <div className="w-1/2 ">
                <div className="text-center  py-6 border border-gray-200 rounded-xl shadow-lg">
                  <h2 className="text-indigo-600 text-lg font-semibold mb-2">
                    {item.year}
                  </h2>
                  <p>{item.event}</p>
                </div>
              </div>
              <div className=" w-3 h-3 rounded-full bg-indigo-700"></div>
              <div className="w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
