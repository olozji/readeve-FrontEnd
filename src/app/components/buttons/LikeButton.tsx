import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

interface LikeBtnType{
    reviewId:number
}

function LikeButton({ reviewId }: LikeBtnType) {
    const postLike = async () => {
        try {
            const response = await axios.post(
                `https://api.bookeverywhere.site/api/review/${reviewId}/likes`
            )
        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div>
      <IconButton aria-label="like" style={{ color: '#E57C65' }} onClick={postLike}>
        <FavoriteIcon />
      </IconButton>
    </div>
  );
}
export default LikeButton;