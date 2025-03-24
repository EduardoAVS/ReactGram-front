import "./Photo.css"

import { uploads }  from "../../utils/config";

import Message from "../../components/Message";
import PhotoItem from "../../components/PhotoItem";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import { useParams } from "react-router-dom";

import { comment, getPhoto, like, resetMessage } from "../../slices/photoSlice";

import { AppDispatch, RootState } from "../../store";
import LikeContainer from "../../components/LikeContainer";
import { Photo as IPhoto } from "../../interfaces/Photo";
import { User } from "../../interfaces/User";

const Photo = () => {
    const { id } = useParams();

    const dispatch = useDispatch<AppDispatch>();

    const { photo, loading, error, message } = useSelector((state: RootState) => state.photo)
    const userState = useSelector((state: RootState) => state.user);
    const user = userState.user as User;

    // comentários

    const [commentText, setCommentText] = useState<string>("");

    // load photo data

    useEffect(() => {
        dispatch(getPhoto(id as string))
    }, [dispatch, id]);

    const resetComponentMessage = () => {
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    }
    

    const handleLike = () => {
        if(photo){
            dispatch(like(photo._id as string));
            resetComponentMessage();  
        }
        
    }

    const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const commentData = {
            comment: commentText,
            photoId: photo?._id as string,
        }
        dispatch(comment(commentData));

        setCommentText("");

        resetComponentMessage(); 
    }

    if(loading) {
         return <p>Carregando...</p>
    }

  return (
    <div id="photo" >
        <PhotoItem photo={photo} />
        <LikeContainer photo={photo as IPhoto} user={user} handleLike={handleLike} />
        <div className="message-container">
            {error && <Message msg={error as string} type='error' /> }
            {message && <Message msg={message} type="success"  />}
        </div>
        <div className="comments">
            <>
                <h3>Comentários: ({photo?.comments.length}) </h3>
                <form onSubmit={handleComment} >
                    <input type="text" placeholder="Insira seu comentário... " onChange={(e) => setCommentText(e.target.value)} value={commentText || ""} />
                    <input type="submit" value="Enviar" />
                </form>
                {photo && photo.comments.length === 0 && <p>Não há comentários...</p> }
                {photo?.comments.map((comment) => (
                    <div className="comment" key={comment.comment} >
                        <div className="author">
                            {comment.userImage && (
                                <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName} />

                            )}
                            <Link to={`/users/${comment.userId}`} >
                                <p>{comment.userName}: </p>
                            </Link>
                            <p className = "comment-content">{comment.comment} </p>
                        </div>
                    </div>
                ))}
            </>
            
        </div>
    </div>
  )
}

export default Photo