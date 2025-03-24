import { Photo } from "../interfaces/Photo";
import { User } from "../interfaces/User";
import "./LikeContainer.css";

import { BsHeart, BsHeartFill } from "react-icons/bs";

type LikeContainerProps = {
    photo: Photo;
    user: User;
    handleLike(photo: Photo): void;
}

const LikeContainer: React.FC<LikeContainerProps> = ({ photo, user, handleLike }) => {
    
    if (!photo) {
        return;
      }

  return (
    <div className="like" >
        {photo.likes && user && (
            <>
                {photo.likes.includes(user._id as string) ? (
                    <BsHeartFill /> 
                ) : (
                    <BsHeart onClick={() => handleLike(photo)} />
                )}
                <p>{photo.likes.length} like(s) </p>
            </>
        )}
    </div>
  )
}

export default LikeContainer