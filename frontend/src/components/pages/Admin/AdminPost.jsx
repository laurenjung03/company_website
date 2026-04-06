import React from "react";

function AdminPost() {
  const dummyPosts = [
    {
      _id: "1",
      title: "첫 번째 게시글",
      content: "이것은 첫 번째 게시글 내용입니다.",
      views: 123,
      fileUrl: ["https://example.com/file1.pdf"],
      createdAt: "2023-12-01T12:00:00Z",
      updatedAt: "2023-12-02T15:30:00Z",
    },
    {
      _id: "2",
      title: "두 번째 게시글",
      content: "두 번째 게시글 내용입니다.",
      views: 456,
      fileUrl: [
        "https://example.com/file2.pdf",
        "https://example.com/file3.pdf",
      ],
      createdAt: "2023-12-03T10:00:00Z",
      updatedAt: "2023-12-03T18:45:00Z",
    },
    {
      _id: "3",
      title: "세 번째 게시글",
      content: "세 번째 게시글 내용입니다.",
      views: 789,
      fileUrl: [],
      createdAt: "2023-12-05T09:00:00Z",
      updatedAt: "2023-12-05T14:30:00Z",
    },
  ];

  return (
    <div>
      <div className="p-4 mx-auto max-w-1700px">
        <h1 className="text-4xl font-bold mt-6 mb-4">게시글관리 </h1>

        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex w-full md:w-auto gap-2">
            <select className="border rounded px-2 py-2 text-base">
              <option value="name">제목</option>
              <option value="email">글내용</option>
            </select>
            <div className="flex-1 md:w-80">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="w-full border rounded px-3 py-2 text-base"
              />
            </div>
          </div>
          <a
            href="#"
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
          >
            추가하기
          </a>
        </div>

        <div className="mb-4">
          <div className="text-lg font-bold text-gray-600">총 0개의 문의</div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full shadow-md rounded-lg overflow-hidden text-sm lg:text-lg font-bold">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">번호</th>
                <th className="px-4 py-3 text-left">제목</th>
                <th className="px-4 py-3 text-left">내용</th>
                <th className="px-4 py-3 text-left">조회수</th>
                <th className="px-4 py-3 text-center">파일</th>
                <th className="px-4 py-3 text-left">작성일</th>
                <th className="px-4 py-3 text-left">수정일</th>
                <th className="px-4 py-3 text-left">관리</th>
              </tr>
            </thead>
            <tbody>
              {dummyPosts.map((item, index) => (
                <tr key={item._id} className="border-b text-sm">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {item.content}
                  </td>
                  <td className="px-4 py-3">{item.views}</td>
                  <td className="px-4 py-3 text-center">
                    {item.fileUrl.length > 0 ? (
                      item.fileUrl.map((url, index) => (
                        <button
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md"
                        >
                          파일{index + 1}
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-500"> 없음 </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end space-x-2">
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

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {dummyPosts.map((item, index) => (
            <div key={item._id} className="p-4 border rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <span className="text-gray-500 text-sm">#{index + 1}</span>
              </div>
              <p className="text-gray-600 mb-4">{item.content}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.fileUrl.length > 0 ? (
                  item.fileUrl.map((url, index) => (
                    <button
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md"
                    >
                      파일{index + 1}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-500">파일없음</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <div>
                  <div>조회수: {item.views}</div>
                  <div>작성일:{new Date(item.createdAt).toLocaleString()}</div>
                  <div>수정일: {new Date(item.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
                    수정
                  </button>
                  <button className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600">
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPost;
