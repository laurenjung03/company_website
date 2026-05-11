import React from "react";
import { useState } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "in progress",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //특정 이벤트 발생시 방지

    try {
      const response = await axios.post("/api/contact", formData);
      if (response.status === 201) {
        alert("문의가 성공적으로 작성됨");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        status: "in progress",
      }); //성공하면 form 내용도 초기화하기
    } catch (error) {
      consoel.log("에러발생", error);
      alert("문의 접수 중 오류가 발생했습니다. 잠시후 다시 시도해주세여");
    }
  };
  return (
    <div className="min-h-screen bg-white py-32 ">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-600 mb-6">
            문의하기
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            태양광 설비 설치부터 유지보수까지, 전무가와 상담하세요. 24시간 내에
            답변드리겠습니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start  ">
          <div>
            <form className="rounded-2xl shadow-xl p-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">이름</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500"
                    placeholder="홍길동"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">이메일</label>
                  <input
                    type="text"
                    name="email"
                    className="w-full p-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500"
                    placeholder="example@gmail.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">전화번호</label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full p-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500"
                    placeholder="010-1111-1111"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">문의내용</label>
                  <textarea
                    className="w-full p-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 h-40"
                    placeholder="문의내용을 적어주세요 "
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <button className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  문의하기
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-12">
                연락처 정보
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: "phone",
                    title: "전화",
                    info: "02-1234-5678",
                    desc: "평일 09:00 - 18:00",
                  },
                  {
                    icon: "envelope",
                    title: "이메일",
                    info: "support@example.com",
                    desc: "24시간 접수 가능",
                  },
                  {
                    icon: "map-marker-alt",
                    title: "주소",
                    info: "서울특별시 강남구 삼성동 123번지",
                    desc: "본사",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="ml-4">
                      <h4 className="text-gray-800 font-semibold">
                        {item.title}
                      </h4>
                      <p className="text-gray-600">{item.info}</p>
                      <p className="text-sm text-gray-500">{item.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25296.8855295889!2d126.95935163955077!3d37.5760111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca37454f683b1%3A0xfa19c5217c6a0bc0!2z6rK967O16raBIOq0ke2ZlOusuA!5e0!3m2!1sko!2skr!4v1773893926286!5m2!1sko!2skr"
                width="100%"
                height="400"
                allowFullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                className="w-full h-100 md:h-150 "
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
