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
  const [isLoading, setIsLoading] = useState(true)
  const [myPageData,setMyPageData] = useState([])

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.bookeverywhere.site/api/data/all/${session.data.user.id}`,
      )
      const data = response.data.data
      setMyData(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
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
    <BookLayoutItem bookId={props.params.id} propsData={myPageData}>
      </BookLayoutItem>
      </>
  )
}

export default Detail;