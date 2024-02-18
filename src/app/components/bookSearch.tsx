import { bookState } from '@/store/writeAtoms';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
interface BookType{
  title: string,
  thumbnail:string
}

export const BookSearch = () => {
  const [bookName, setBookName] = useState<string>('');
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [documents, setDocuments] = useState<any>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [bookInfo, setBookInfo] = useRecoilState(bookState);

  useEffect(() => {
    if (!bookName) return; // 빈 검색어인 경우 API 호출하지 않음
    callAPI();
  }, [page]); // 페이지가 변경될 때마다 호출
  useEffect(() => {
    console.log(selectedBook);
  },[selectedBook])

  const callAPI = async () => {
    const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${bookName}&page=${page}&size=10`;
    const config = {
      headers: { Authorization: `KakaoAK 4a3294385b3e838f9f020a39fe8c04e3` },
    };
    try {
      setBookInfo({});
      const result = await axios.get(url, config);
      setDocuments(result.data.documents);
      const total = result.data.meta.pageable_count;
      setLast(Math.ceil(total / 10));
      setModalOpen(true); // API 호출 후 모달 열기
      console.log(documents)
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission behavior
      onSubmit(e); // Trigger search when Enter key is pressed
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
      let selectedBookInfo = {
        title: selectedBook.title,
        thumbnail:selectedBook.thumbnail
      }
      setBookInfo(selectedBookInfo)
      console.log(bookInfo)

    }
    setModalOpen(false);
  };
  const handleBookClick = (data: any) => {
    let copy = data;
    setSelectedBook(copy);
  };

  return (
    <div>
      <input
        className="border-slate-400 rounded-md bg-slate-200"
        type="text"
        placeholder=""
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
        onKeyDown={handleKeyDown} 
      />
      <button className='px-2 rounded-lg border-2 border-slate-400'onClick={onSubmit} >검색</button>
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={closeOnOverlayClick}
        >
          <div className="bg-white p-8 rounded-lg">
            <span className="absolute top-4 right-4 text-gray-600 cursor-pointer" onClick={closeModal}>
              &times;
            </span>
            <div className="grid grid-rows-2 grid-flow-col">
            {documents.map((d: any, i: number) => (
              <div
                className={`justify-items-center${selectedBook && selectedBook.title === d.title ? 'rounded-lg border-4 border-blue-500' : 'rounded-lg border-4 border-transparent'}`}
                key={i}
                onClick={() => handleBookClick(d)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
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
              <p>선택된 책: {selectedBook&&selectedBook.title}</p>
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

