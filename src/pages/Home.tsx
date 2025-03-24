import "./Home.css";

import LikeContainer from "../components/LikeContainer";
import PhotoItem from "../components/PhotoItem";
import { Link } from "react-router-dom";

// hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllPhotos, like, resetMessage } from "../slices/photoSlice";
import { AppDispatch, RootState  } from "../store";
import { Photo } from "../interfaces/Photo";


const Home = ()=> {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { photos, loading} = useSelector((state: RootState) => state.photo);

  const resetComponentMessage = () => {
      setTimeout(() => {
          dispatch(resetMessage());
      }, 2000);
  }

  useEffect(() => {

    dispatch(getAllPhotos());

  }, [dispatch]);

  const handleLike = (photo: Photo) => {
    
    dispatch(like(photo._id as string));
    resetComponentMessage();  
    
  }

  if(loading) {
    return <p>Carregando...</p>
  }

  return (

    <div id="home">
      {photos && photos.map((photo) => (
        <div key={photo._id}>
          <PhotoItem photo={photo} />
          <LikeContainer photo={photo} user={user!} handleLike={handleLike} />
          <Link className="btn" to={`/photos/${photo._id}`} >Ver mais</Link>
        </div>
      ))}

      {photos && photos.length === 0 && (
        <h4 className="no-photos">
          Ainda não há fotos publicadas, <Link to={`/users/${user!._id}`} >clique aqui</Link>
        </h4>
      )}

    </div>
  )
}

export default Home