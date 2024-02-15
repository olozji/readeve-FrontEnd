import axios from 'axios';
import { useEffect, useState } from 'react';

export const BookSearch = () => {
  const [bookName, setBookName] = useState<string>('');
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [documents, setDocuments] = useState<any>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');

  useEffect(() => {
    if (!bookName) return; // 빈 검색어인 경우 API 호출하지 않음
    callAPI();
  }, [page]); // 페이지가 변경될 때마다 호출

  const callAPI = async () => {
    const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${bookName}&page=${page}`;
    const config = {
      headers: { Authorization: `KakaoAK 4a3294385b3e838f9f020a39fe8c04e3` },
    };
    try {
      const result = await axios.get(url, config);
      setDocuments(result.data.documents);
      const total = result.data.meta.pageable_count;
      setLast(Math.ceil(total / 10));
      setModalOpen(true); // API 호출 후 모달 열기
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 제출 이벤트 방지
    setPage(1); // 새로운 검색을 위해 페이지를 1로 초기화
    callAPI();
  };

  const nextPage = (e:any) => {
    e.preventDefault(); 
    setPage((prevPage) => Math.min(last, prevPage + 1));
  };

  const prevPage = (e:any) => {
    e.preventDefault(); 
    setPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeOnOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      setModalOpen(false);
    }
  };
  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      // 여기서 선택된 책을 처리하거나 추가 동작을 수행할 수 있습니다.
      console.log('사용자가 선택한 책:', selectedBook);
    }
    setModalOpen(false);
  };
  const handleBookClick = (title: string) => {
    setSelectedBook(title);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="검색어"
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
      />
      <button onClick={onSubmit}>검색</button>
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={closeOnOverlayClick}
        >
          <div className="bg-white p-8 rounded-lg">
            <span className="absolute top-4 right-4 text-gray-600 cursor-pointer" onClick={closeModal}>
              &times;
            </span>
            <div className="grid grid-rows-2 grid-flow-col gap-" >
              {documents.map((d: any) => (
                <div className={`${selectedBook === d.title ? 'rounded-lg border-4 border-blue-500' : 'rounded-lg border-4 border-transparent'}`} key={d.title} onClick ={()=>{handleBookClick(d.title)}} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <img
                    src={d.thumbnail ? d.thumbnail : 'http://via.placeholder.com/120X150'}
                    alt="책 표지"
                    className="mb-2 rounded"
                  />
                  <div className="p-4">{d.title}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={prevPage} className="px-4 py-2 bg-blue-500 text-white rounded">이전</button>
              <span className="text-lg font-semibold">
                {page}/{last}
              </span>
              <button onClick={nextPage} className="px-4 py-2 bg-blue-500 text-white rounded">다음</button>
            </div>
            <div className="mt-4 text-center">
              <p>선택된 책: {selectedBook}</p>
              <p>선택된 책이 맞습니까?</p>
              <button onClick={() => handleConfirmation(true)} className="px-4 py-2 bg-blue-500 text-white rounded">예</button>
              <button onClick={() => handleConfirmation(false)} className="px-4 py-2 bg-red-500 text-white rounded">아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
