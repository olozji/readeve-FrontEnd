import Link from "next/link";
import { useEffect, useState } from "react";

export const BookLayout = () => {

    const [documents, setDocuments] = useState<any[]>([]);
  
    useEffect(() => {
        const storedData = localStorage.getItem('allDataInfo');

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const onlyBookData = parsedData.filter((data:any,idx:number) => {
            return (
            parsedData.findIndex((data1:any) => {
              return data.book.isbn === data1.book.isbn
            }) === idx
          )
          })
            setDocuments(onlyBookData);
        }
    }, []);

    return (
        <div className="grid grid-cols-3 ">
        {documents.map((d: any, i: number) => (
        
              <Link key={i} href={`/detail/${d.book && d.book.isbn ? d.book.isbn.replace(" ","") : ""}`}>
              <div
                className={`justify-items-center rounded-lg border-4 border-transparent`}
                key={i}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <img
                  src={d.book.thumbnail ? d.book.thumbnail : 'http://via.placeholder.com/120X150'}
                  alt="책 표지"
                  className="mb-2 rounded"
                />
                <div className="p-4">{d.book.title}</div>
              </div>
              </Link>
            ))}
          </div>
    )
}