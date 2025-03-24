import "./EditProfile.css"

import { uploads } from "../../utils/config";

import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
// Redux
import {profile, resetMessage, updateProfile} from "../../slices/userSlice";

import Message from "../../components/Message";
import { AppDispatch } from "../../store";
import { RootState } from "../../store";
import { User } from "../../interfaces/User";


const EditProfile = () => {

  const dispatch = useDispatch<AppDispatch>();

  const { user, message, error, loading } = useSelector((state: RootState) => state.user);

  // states

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profileImage, setImageProfile] = useState<File | string>("");
  const [bio, setBio] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<File | string>("");

  // load user data
  useEffect(() => {
    dispatch(profile())
  }, [dispatch]);

  useEffect(() => {
    if(user){
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setBio(user.bio ?? "");
    }

  }, [user]);

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // adicionar o user data para o estado

    // Criar o objeto userData baseado nos dados do formulário
    const userData: Partial<User> = {
        name,
        email,
        password,
    };

    if (profileImage) {
        userData.profileImage = profileImage as string;
    }

    if (bio) {
        userData.bio = bio;
    }

    if (password) {
        userData.password = password;
    }

    // Criar um FormData para enviar ao backend
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined) {
            formData.append(key, value);
        }
    });

    // Dispatch para atualizar o perfil
    await dispatch(updateProfile(formData));

    // Resetar mensagem de sucesso após 2 segundos
    setTimeout(() => {
        dispatch(resetMessage());
    }, 2000);
  };


  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Obtém o primeiro arquivo
  
      setPreviewImage(file); // Mostra uma prévia da imagem
      setImageProfile(file); // Armazena o arquivo no estado
    }
  };
  
  return (
    <div id="edit-profile">
      <h2>Edite seus dados</h2>
      <p className="subtitle">Adiione uma imagem de perfil e conte mais sobre você!</p>
      {(user && (user.profileImage || previewImage)) && (
        <img className="profile-image"
        src={previewImage instanceof File ? URL.createObjectURL(previewImage) : `${uploads}/users/${user.profileImage}`}
        alt={user.name}
        />
      
      )}
      <form onSubmit={handleSubmit} >
        <input type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} value={name || ""} />
        <input type="email" placeholder="Email" disabled value={email || ""} />
        <label >
          <span>Imagem do Perfil:</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label >
          <span>Bio: </span>
          <input type="text" placeholder="Descrição do perfil" onChange={(e) => setBio(e.target.value)} value={bio || ""} />
        </label>
        <label >
          <span>Quer alterar sua senha? </span>
          <input type="password" placeholder="Digite sua nova senha" onChange={(e) => setPassword(e.target.value)} value={password || ""} />
        </label>
        {!loading && <input type="submit" value="Atualizar" />}
        {loading && <input type="submit" value="Aguarde..." disabled/>}
        {typeof error === "string" && <Message msg={error} type="error" />}  
        {typeof message === "string" && <Message msg={message} type="success" />}
      </form>
    </div>
  )
}

export default EditProfile         