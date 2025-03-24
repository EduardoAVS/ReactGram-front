import "./Profile.css";

import { uploads } from "../../utils/config";

import Message from "../../components/Message";

import { Link } from "react-router-dom";

import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

// rooks
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

//redux
import { getUserDetails } from "../../slices/userSlice";
import { RootState } from "../../store";
import { AppDispatch } from "../../store";
import { publishPhoto, resetMessage,  getUserPhotos, deletePhoto, updatePhoto} from "../../slices/photoSlice";
import { Photo } from "../../interfaces/Photo";

const Profile = () => {

    const { id } = useParams();

    const dispatch = useDispatch<AppDispatch>();

    const { user, loading } = useSelector((state: RootState) => state.user)
    const {user: userAuth} = useSelector((state: RootState) => state.auth)
    const { photos, loading: loadingPhoto, message: messagePhoto, error: errorPhoto} = useSelector((state: RootState) => state.photo);

    const [title, setTitle] = useState<string>("");
    const [image, setImage] = useState<File | string>("");
    const [editId, setEditId] = useState<string>("");
    const [editImage, setEditImage] = useState<File | string>("");
    const [editTitle, setEditTitle] = useState<string>("");

    


    // photo
    const newPhotoForm = useRef<HTMLDivElement | null>(null);
    const editPhotoForm = useRef<HTMLDivElement | null>(null);


    // load user data
    useEffect(() => {
        dispatch(getUserDetails(id as string));
        dispatch(getUserPhotos(id as string));
    }, [dispatch, id]);

    const resetComponentMessage = () => {
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]; // Obtém o primeiro arquivo
      
          setImage(file); // Mostra uma prévia da imagem
        }
      };
      

    const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const photoData = {
            title, image
        }

        // Criar um FormData para enviar ao backend
        const formData = new FormData();

        Object.entries(photoData).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });

        await dispatch(publishPhoto(formData));

        setTitle("")

        resetComponentMessage();

    };

    // delete photo
    const handleDelete = async (id: string) => {
        console.log(id);

        await dispatch(deletePhoto(id));
        resetComponentMessage();

    };

    // Show or hide forms

    const hideOrShowForms = () => {
        if(!newPhotoForm.current || !editPhotoForm.current){
            console.log("PhotoForm não existe");
            return;
        }
        newPhotoForm.current.classList.toggle("hide");
        editPhotoForm.current.classList.toggle("hide");
    }

    // Update a photo

    const handleUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const photoData = {
            title: editTitle,
            id: editId,
        }

        await dispatch(updatePhoto(photoData));

        resetComponentMessage();

    }

    // Open edit form
    const handleEdit = (photo: Photo) => {
        
        if(editPhotoForm.current && editPhotoForm.current.classList.contains("hide")){
            hideOrShowForms();
        }

        setEditId(photo._id as string);
        setEditTitle(photo.title);
        setEditImage(photo.image);

    }

    const handleCancelEdit = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        hideOrShowForms();

    }


    if(loading){
        return <p>Carregando...</p>
    }

  return (
    <div id="profile" >
        <div className="profile-header">
            {user && user.profileImage && (
                <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
            )}
            <div className="profile-description">
                <h2>{user && user.name}  </h2>
                <p>{user && user.bio} </p>
            </div>
        </div>
        {userAuth && id === userAuth._id && (
            <>
                <div className="new-photo" ref={newPhotoForm} >
                    <h3>Compartilhe algum momento seu: </h3>
                    <form onSubmit={submitHandle} >
                        <label >
                            <span>Título para a foto: </span>
                            <input type="text" placeholder="Insira um título" onChange={(e) => setTitle(e.target.value)} value={title || ""} /> 
                        </label>
                        <label >
                            <span>Imagem: </span>
                            <input type="file" onChange={handleFile} /> 
                        </label>
                        
                        {!loadingPhoto && <input type="submit" value="Postar" />}
                        
                        {loadingPhoto && <input type="submit" disabled value="Aguarde..." />}
                    </form>
                </div>
                <div className="edit-photo hide" ref={editPhotoForm} >
                    <p>Editando: </p>
                    {editImage && (
                        <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
                    )}
                    <form onSubmit={handleUpdate}>
                        <input type="text" placeholder="Insira o novo título" onChange={(e) => setTitle(e.target.value)} value={title || ""} /> 
                        
                        
                        <input type="submit" value="Atualizar" />

                        <button className="cancel-btn" onClick={handleCancelEdit}>Cancelar edição</button>
                    </form>
                </div>
               
                {errorPhoto && <Message msg={errorPhoto as string} type="error" />}
                {messagePhoto && <Message msg={messagePhoto} type="success" /> }
            </>
        )}
        <div className="user-photos">
            <h2>Fotos publicadas:</h2>
            <div className="photos-container">
                {photos && photos.map((photo) => (
                    <div className="photo" key={photo._id} >
                        {photo.image && (<img src={`${uploads}/photos/${photo.image}`} alt={photo.title}/>) } 
                        {userAuth && id === userAuth._id ? (
                            <div className="actions">
                                <Link to={`/photos/${photo._id}`}  >
                                    <BsFillEyeFill /> 
                                </Link>
                                <BsPencilFill onClick={() => handleEdit(photo)} />
                                <BsXLg onClick={() => handleDelete(photo._id as string)} />
                            </div>
                        ) : (
                        <Link className="btn" to={`/photos/${photo._id}`}  >
                            Ver 
                        </Link>
                        )}
                    </div>
                ))}
                {photos.length === 0 && (<p>Ainda não existem fotos publicadas!</p>) }
            </div>
        </div>
    </div>
  )
}

export default Profile