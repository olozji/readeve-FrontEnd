'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavBar from "@/app/components/NavBar";
import BookLayoutItem from "../BookLayoutItem";

export interface PropType {
  params: {
    id: string;
    searchParams: {};
  };
}

const Detail = (props: PropType) => {
  const [bookId, setBookId] = useState<string>(props.params.id);

  // 라우터를 사용하여 props.params.id 감지
  const router = useRouter();
  useEffect(() => {
    setBookId(router.query.id as string);
  }, [router.query.id]);

  return (
    <>
      <NavBar />
      <BookLayoutItem id={bookId} />
    </>
  );
};

export default Detail;
