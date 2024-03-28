'use client'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface LikeBtnType {
  reviewId: number
  socialId?: number
}

function LikeButton({ reviewId, socialId }: LikeBtnType) {
  const [likeCount, setLikeCount] = useState<any>()
  const [likeState, setLikeState] = useState<any>()
  const postLike = async () => {
    try {
      const response = await axios.post(
        `https://api.bookeverywhere.site/api/review/${reviewId}/likes?socialId=${socialId}`,
      )
      setLikeCount(likeCount! + 1)
      setLikeState(true)
    } catch (error) {
      console.log(error)
    }
  }
  const deleteLike = async () => {
    try {
      const response = await axios.delete(
        `https://api.bookeverywhere.site/api/review/${reviewId}/likes?socialId=${socialId}`,
      )
      setLikeCount(likeCount-1)
      setLikeState(false)
    } catch (error) {
      console.log(error)
    }
  }

  const getReview = async () => {
    try {
      const response = await axios.get(
        `https://api.bookeverywhere.site/api/review/${reviewId}?socialId=${socialId}`,
      )
      const data = response.data.data
      setLikeCount(data.likeCount)
      setLikeState(data.likeState)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (socialId) {
      getReview()
    }
  }, [socialId])

  const handlePostLike = (e:any) => {
    e.stopPropagation()
    postLike()
  }
  const handleDeleteLike = (e:any) => {
    e.stopPropagation()
    deleteLike()
  }

  return (
    <div className="flex items-center z-50">
      {likeState ? (
        <IconButton
          aria-label="like"
          style={{ color: '#E57C65' }}
          onClick={(e)=>handleDeleteLike(e)}
        >
          <FavoriteIcon />
        </IconButton>
      ) : (
        <IconButton
          aria-label="like"
          style={{ color: 'black' }}
          onClick={(e)=>handlePostLike(e)}
        >
          <FavoriteIcon />
        </IconButton>
      )}

      <div>{likeCount}</div>
    </div>
  )
}
export default LikeButton
