import "./Search.css";

import { useQuery } from "../../hooks/useQuery";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";

import { like, resetMessage, searchPhotos } from "../../slices/photoSlice";
import { Photo } from "../../interfaces/Photo";

const Search = () => {
    const query = useQuery();
    const search = query.get("q")

    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.user);
    const {photos, loading} = useSelector((state: RootState) => state.photo);

    const resetComponentMessage = () => {
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    }

    useEffect(() => {
        if (search && search.trim() !== "") {
            dispatch(searchPhotos(search));
        }
    }, [dispatch, search])

    const handleLike = (photo: Photo) => {
        dispatch(like(photo._id!));

        resetComponentMessage();
    }

    if(loading) {
        return <p>Carregando...</p>
   }

  return (
    <div id="search">
        <h2>Você está buscando por: {search}</h2>
        {photos && photos.map((photo) => (
             <div key={photo._id}>
                <PhotoItem photo={photo} />
                <LikeContainer photo={photo} user={user!} handleLike={handleLike} />
                <Link className="btn" to={`/photos/${photo._id}`} >Ver mais</Link>
           </div>
        ))}
        {photos && photos.length === 0 && (
            <h4 className="no-photos">
            Não foram encontrados resultados para a sua busca...
            </h4>
        )}

    </div>
  )
}

export default Search