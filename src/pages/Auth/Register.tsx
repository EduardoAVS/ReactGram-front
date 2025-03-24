import "./Auth.css";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import  { register, reset } from "../../slices/authSlice"
import { AppDispatch, RootState } from "../../store";
import Message from "../../components/Message";


const Register = () => {
const [name, setName] = useState<string>("");
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");
const [confirmPassword, setConfirmPassword] = useState<string>("");

const dispatch = useDispatch<AppDispatch>();

// useSelect extraí o estado do Slice
const auth = useSelector((state: RootState) => state.auth);
const { loading, error } = auth;



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword
    };

    console.log(user);
    dispatch(register(user));

  }

  // Clean all auth states

  useEffect(() => {
    dispatch(reset());
  }, [dispatch])

  return (
    <div id="register">
      <h2>ReactGram</h2>
      <p className="subtitle">
        Cadastre-se para ver as fotos dos seus amigos!
      </p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} value={name || ""} />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email || ""}/>
        <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password || ""}/>
        <input type="password" placeholder="Confirme a senha" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword || ""} />
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled/>}
        {typeof error === "string" && <Message msg={error} type="error" />} 
      </form>
      <p>Já tem conta? <Link to="/login" >Clique aqui</Link> </p>
    </div>
  )
}

export default Register