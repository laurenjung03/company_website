import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AdminContacts() {
  //전체 문의글 관리->useState사용
  //contacts안에- id, name, emailm phone,status 존재
  const [contacts, setContacts] = useState([]);

  //**필터링, 검색기능 구현-> 각각 useState */
  const [searchTerm, setSearchTerm] = useState(""); //검색어 내용
  const [searchType, setSearchType] = useState("name"); //검색필터
  const [statusFilter, setStatusFilter] = useState("all"); //상태 필터

  //페이지 네이션 관련
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  //3.모달 관련 state
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //api 통신하고 unmount될떄, 정리작업할수있는 hook(이벤트 발생할때마다 불리는 hook)
  useEffect(() => {
    const fetchContacts = async () => {
      //여기에는 예전에 했던것처럼 const response를 해줄필요가 없다 왜죠? 그냥 불러온 문의글을 띄워주는 역할만 하니까?
      // 그리고 api통신할떄 프론트에서는 의례적으로 백에 정보 요청해서 받을떄 const response를 쓰는가?
      try {
        const response = await axios.get("http://localhost:3000/api/contact", {
          withCredentials: true,
        });
        setContacts(response.data);
      } catch (error) {
        console.log("문의글 가져오기 실패", error);
      }
    };
    //함수 끝난뒤에 fetchContacts를 자동으로 호출할수있도록
    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // 1. 선택된 필터 타입에 해당하는 값 꺼내기
      //    예: searchType="name" → contact["name"] = //lauren, 홍길동2,홍길동,lauren 햄스터터,햄스터
      const value = contact[searchType].toLowerCase() || "";

      // 2. 그 값이 검색어를 포함하는지 확인
      //    "홍길동".includes("홍") → true
      const matchesSearch = value.includes(searchTerm.toLowerCase());

      // 3. 상태 필터 확인
      //    "all"이면 전부 통과, 아니면 상태값이 일치하는 것만
      const matchesStatus =
        statusFilter === "all" || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchType, searchTerm, statusFilter]);

  console.log(filteredContacts);

  //페이지네이션
  const totalPages = Math.ceil(filteredContacts.length / pageSize);

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  //3)수정/삭제 버튼 모달관련
  const handleEdit = (contact) => {
    setSelectedContact(contact); //지금 수정하려고하는 문의글 내용으로 업데이트
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/contact/${selectedContact._id}`,
        { status: newStatus },
        { withCredentials: true },
      );
      //아래는 왜하는겨? 여기서 contacts.map하면 name,email,phone 속성들을 도는건가?
      setContacts(
        contacts.map((contact) =>
          contact._id === selectedContact._id
            ? { ...contact, status: newStatus }
            : contact,
        ),
      );

      setIsModalOpen(false);
      Swal.fire("수정완료!", "상태가 성공적으로 수정됐습니다", "success");
    } catch (error) {
      console.log("수정실패:", error);
      Swal.fire("오류발생!", "상태변경에 실패했습니다", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/contact/${id}`, {
          withCredentials: true,
        });
        setContacts(contacts.filter((contact) => contact._id !== id));
        Swal.fire("삭제완료!", "상태가 성공적으로 수정되었습니다", "success");
      } catch (error) {
        console.log("삭제실패", error);
        Swal.fire("삭제실패", "삭제실패", "error");
      }
    }
  };
  return (
    <div className="p-8 mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold mt-6 mb-4">문의관리</h1>
      {contacts.length === 0 ? (
        <div className="text-center py-8 rounded-lg shadow">
          <p className="text-2xl font-bold text-gray-800">
            문의사항이 없습니다
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex w-full md:w-auto gap-2">
              <select
                className="border rounded px-2 py-2 text-base"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded px-3 py-2 text-base"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
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
              <select
                className="border rounded px-3 py-2"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[10, 25, , 50, 100].map((size) => (
                  <option key={size} value={size}>{`${size}개`}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-lg font-bold text-gray-600">
              총 {filteredContacts.length}개의 문의
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full shadow-md rounded-lg overflow-hidden text-sm lg:text-lg font-bold">
              <colgroup>
                <col className="w=[8%]" />
                <col className="w=[12%]" />
                <col className="w=[20%]" />
                <col className="w=[15%]" />
                <col className="w=[25%]" />
                <col className="w=[10%]" />
                <col className="w=[10%]" />
              </colgroup>
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
                {paginatedContacts.map((item, index) => (
                  <tr key={item._id} className="border-b">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.phone}</td>
                    <td className="px-4 py-3">{item.message}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          item.status === "pending"
                            ? "bg-blue-300 text-blue-800"
                            : item.status === "in progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-200 text-green-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
                          onClick={() => handleEdit(item)}
                        >
                          수정
                        </button>
                        <button
                          className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600  whitespace-nowrap "
                          onClick={() => handleDelete(item._id)}
                        >
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
            {paginatedContacts.map((item, index) => (
              <div key={item._id} className="p-4 border rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold">
                    #{(currentPage - 1) * pageSize + index + 1}
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        item.status === "pending"
                          ? "bg-blue-200 text-blue-800"
                          : item.status === "in progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div>이름:{item.name}</div>
                <div>이메일:{item.email}</div>
                <div>휴대폰:{item.phone}</div>
                <div>내용:{item.message}</div>

                <div className="mt-5 flex justify-end space-x-2">
                  <button
                    className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleEdit(item)}
                  >
                    수정
                  </button>
                  <button
                    className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(item._id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center space-x-2 text-lg font-bold">
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              이전
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </button>
          </div>
        </>
      )}

      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">문의 상태 수정</h2>
            <div className="mb-4">
              <p className="font-medium mb-2">
                현재상태:{" "}
                {selectedContact.status === "in progress"
                  ? "진행중"
                  : selectedContact.status === "pending"
                    ? "대기중"
                    : "완료"}
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleStatusUpdate("pending")}
                  className="w-full px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
                >
                  대기중
                </button>
                <button
                  onClick={() => handleStatusUpdate("in progress")}
                  className="w-full px-4 py-2 bg-yellow-200 rounded hover:bg-b-yellow-300"
                >
                  진행중
                </button>
                <button
                  onClick={() => handleStatusUpdate("complete")}
                  className="w-full px-4 py-2 bg-green-200 rounded hover:bg-green-300"
                >
                  완료
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContacts;
