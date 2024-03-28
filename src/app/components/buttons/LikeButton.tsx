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
  const [likeCount, setLikeCount] = useState()
  const [likeState, setLikeState] = useState()
  const postLike = async () => {
    try {
      const response = await axios.post(
        `https://api.bookeverywhere.site/api/review/${reviewId}/likes?socialId=${socialId}`,
      )
    } catch (error) {
      console.log(error)
    }
  }
  const deleteLike = async () => {
    try {
      const response = await axios.delete(
        `https://api.bookeverywhere.site/api/review/${reviewId}/likes?socialId=${socialId}`,
      )
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

  return (
    <div className="flex items-center">
      {likeState ? (
        <IconButton
          aria-label="like"
          style={{ color: '#E57C65' }}
          onClick={deleteLike}
        >
          <FavoriteIcon />
        </IconButton>
      ) : (
        <IconButton
          aria-label="like"
          style={{ color: 'black' }}
          onClick={postLike}
        >
          <FavoriteIcon />
        </IconButton>
      )}

      <div>{likeCount}</div>
    </div>
  )
}
export default LikeButton
