import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      //[] 이렇게 괄호로 넣어야지만 , 변수값이 key로 들어감
    });
    console.log(formData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", formData, {
        withCredentials: true,
      });

      /**localstorage 저장 */
      localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        navigate("/admin/posts");
      }
    } catch (error) {
      const errorMessage =
        error.response.data.message || "로그인에 실패했습니다";
      //user.js에 이렇게 --> 해놨기 떄문에: console.log("서버 오류발생했습니다", error.message);
      const remainingAttempts = error.response.data.remainingAttempts;
      //어떻게 저렇게 쓰는건지
      setError({ message: errorMessage, remainingAttempts: remainingAttempts });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full p-10 space-y-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-semibold text-gray-900">
            관리자 로그인
          </h2>
          <p className="mt-2 text-center text-lg text-gray-600">
            관리자 전용 페이지입니다
          </p>
          <form className="mt-8 mb-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 ">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-md text-gray-700"
                >
                  아이디
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="관리자아이디"
                  className="mt-1 px-2 block w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-md text-gray-700"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="관리자 비밀번호"
                  className="mt-1 px-2 block w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-base font-bold text-center">
                {typeof error === "string" ? error : error.message}
                {error.remainingAttempts !== undefined && (
                  <div className="mt-1">
                    남은 시도횟수:{error.remainingAttempts}
                  </div>
                )}
              </div>
            )}
            <button
              type="submit"
              className="w-full items-center px-4 py-3 border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-md"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
