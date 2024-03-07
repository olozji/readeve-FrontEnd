'use client'
import NavBar from "@/app/components/NavBar";
import BookLayoutItem from "../BookLayoutItem"
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export interface PropType {
  params: {
    id: string
    searchParams: {}
  }
}

const Detail = (props: PropType) => {
  const session: any = useSession()

  const [myData, setMyData] = useState([])
  const [myPageData,setMyPageData] = useState([])

  const fetchData = async () => {
    if (session.data.user.id) {
      try {
        const response = await axios.get(
          `https://api.bookeverywhere.site/api/data/all/${session.data.user.id}`,
        );
        const data = response.data.data;
        setMyData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    }
  }

  useEffect(() => {
   
      fetchData()

  }, [session])

  useEffect(() => {
    setMyPageData(myData)
  }, [myData])

  return (
    <><NavBar/>
    <BookLayoutItem bookId={props.params.id} propsData={myData}>
      </BookLayoutItem>
      </>
  )
}

export default Detail;