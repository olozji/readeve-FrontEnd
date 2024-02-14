import axios from 'axios';
import { useEffect, useState } from 'react';

export const BookSearch = () => {
  const [bookName, setBookName] = useState<string>('');
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [documents, setDocuments] = useState<any>([]);

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
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 제출 이벤트 방지
    setPage(1); // 새로운 검색을 위해 페이지를 1로 초기화
    callAPI();
  };
  const nextPage = (e: React.FormEvent) => {
    e.preventDefault(); 
    setPage((prevPage) => Math.min(last, prevPage + 1));
  };

  const prevPage = (e: React.FormEvent) => {
    e.preventDefault(); 
    setPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const showSelectedBookName = (title:string) => {
    setBookName(title)
  }
  return (
    <div>
      <input
        type="text"
        placeholder="검색어"
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
      />
      <button onClick={onSubmit}>검색</button>
      <div className="grid grid-rows-2 grid-flow-col gap-">
        {documents.map((d: any) => (
          <div className="" key={d.title} onClick={()=>{showSelectedBookName(d.title)}}>
            <img
              src={d.thumbnail ? d.thumbnail : 'http://via.placeholder.com/120X150'}
              alt="책 표지"
            />
            <div className="ellipsis">{d.title}</div>
          </div>
        ))}
      </div>
      <div>
        <button onClick={prevPage}>이전</button>
        <span style={{ margin: '10px' }}>
          {page}/{last}
        </span>
        <button onClick={nextPage}>다음</button>
      </div>
    </div>
  );
};
