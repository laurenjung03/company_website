import React from "react";

function AdminContacts() {
  const contacts = [
    {
      id: 1,
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1234-5678",
      message: "상품에 대한 문의입니다.",
      status: "대기중",
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@example.com",
      phone: "010-8765-4321",
      message: "환불 요청합니다.",
      status: "진행중",
    },
    {
      id: 3,
      name: "박철수",
      email: "park@example.com",
      phone: "010-0000-1111",
      message: "연락이 지연되고 있습니다.",
      status: "완료",
    },
  ];

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold mt-6 mb-4">문의관리</h1>
      {/* //필터도구들 만들기 */}

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex w-full md:w-auto gap-2">
          <select className="border rounded px-2 py-2 text-base">
            <option value="name">이름</option>
            <option value="email">이메일</option>
            <option value="phone">전화번호</option>
            <option value="message">문의내용</option>
          </select>
          <div className="flex-1 md:w-80">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-full border rounded px-3 py-2 text-base"
            />
          </div>
          <select className="border rounded px-3 py-2 text-base">
            <option value="all">전체상태</option>
            <option value="pending">대기중</option>
            <option value="in progess">진행중</option>
            <option value="complete">완료</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-base font-bold text-gray-600">
            페이지당 표시:
          </label>
          <select className="border rounded px-3 py-2">
            {[10, 25, , 50, 100].map((size) => (
              <option key={size} value={size}>{`${size}개`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-lg font-bold text-gray-600">총 0개의 문의</div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full shadow-md rounded-lg overflow-hidden text-sm lg:text-lg font-bold">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">번호</th>
              <th className="px-4 py-3 text-left">이름</th>
              <th className="px-4 py-3 text-left">이메일</th>
              <th className="px-4 py-3 text-left">휴대폰</th>
              <th className="px-4 py-3 text-left">내용</th>
              <th className="px-4 py-3 text-left">상태</th>
              <th className="px-4 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-3">{item.id}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3">{item.message}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      item.status === "대기중"
                        ? "bg-blue-200 text-blue-800"
                        : item.status === "진행중"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center space-x-2">
                    <button className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
                      수정
                    </button>
                    <button className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* //모바일버전 카드관리 */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {contacts.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-md">
            <div className="text-lg font-bold">번호:{item.id}</div>
            <div>이름:{item.name}</div>
            <div>이메일:{item.email}</div>
            <div>휴대폰:{item.phone}</div>
            <div>내용:{item.message}</div>
            <div>
              상태:
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  item.status === "대기중"
                    ? "bg-blue-200 text-blue-800"
                    : item.status === "진행중"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="mt-5 flex justify-end space-x-2">
              <button className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
                수정
              </button>
              <button className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600">
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center space-x-2 text-lg font-bold">
        <button className="px-3 py-1 rounded border disabled:opacity-50">
          이전
        </button>
        <span className="px-3 py-1">1/1</span>
        <button className="px-3 py-1 rounded border disabled:opacity-50">
          다음
        </button>
      </div>
    </div>
  );
}

export default AdminContacts;
