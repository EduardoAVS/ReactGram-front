import "./PhotoItem.css";
import { Photo } from "../interfaces/Photo";

import { uploads } from "../utils/config";

import { Link } from "react-router-dom";

interface PhotoItemProps {
    photo: Photo | null;  
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo }) => {
    return (
      <div className="photo-item" >
        {photo && photo.image ? (
          <img src={`${uploads}/photos/${photo.image}`} />
        ) : (
            <p>Foto não encontrada.</p> // Mensagem de fallback
        )}

        <h2>{photo && photo.title} </h2>
        {photo && (
            <p className="photo-author" >Publicado por:
                <Link to={`/users/${photo.userId}`} > {photo.userName} </Link>
            </p>  
        )}
        
      </div>
    );
  };

export default PhotoItem