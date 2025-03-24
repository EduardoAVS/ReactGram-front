import { api, requestConfig } from "../utils/config";
import { User } from "../interfaces/User";
import { RegisterResponse } from "../interfaces/RegisterResponse";
import { LoginUser } from "../interfaces/LoginUser";

// Register an user
const Register = async (data: User): Promise<RegisterResponse> => {
    const config = requestConfig("POST", data);

    try {
        const res = await fetch(api + "/users/register", config);
        const responseData = await res.json(); // Converte para JSON
        
        if (!res.ok) {
            return { errors: [responseData.message || "Erro ao registrar usuário."] };
        }

        // Se não houver erro, salva apenas os dados do usuário (não os erros)
        if (responseData && responseData.token) {
            localStorage.setItem("user", JSON.stringify(responseData));
            
            return { user: responseData }; // Retorna somente o usuário
        }

        return { errors: ["Erro inesperado ao registrar."] };
    } catch (error) {
        return { errors: ["Erro ao registrar usuário."] };
    }
};

const Logout = () => {
    localStorage.removeItem("user");
}

const Login = async (data: LoginUser) => {
    const config = requestConfig("POST", data);
    
    try {
        const res = await fetch(api + "/users/login", config);
        const responseData = await res.json();

        // Se não houver erro, salva apenas os dados do usuário (não os erros)
        if (responseData && responseData.token) {
            localStorage.setItem("user", JSON.stringify(responseData));
            
            return { user: responseData }; // Retorna somente o usuário
        }

        return { errors: ["Erro inesperado ao registrar."] };

    } catch (error) {
        return { errors: ["Erro ao logar usuário."] };
    }
};


// Exportando authService
const authService = {
    Register,
    Logout,
    Login,
};

export default authService;
