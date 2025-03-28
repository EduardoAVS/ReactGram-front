// API base URL
const api_url = import.meta.env.VITE_API_BASE_URL

export const api: string = `${api_url}/api`;
export const uploads: string = `${api_url}/public/uploads`;

// Tipagem para os métodos HTTP suportados
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Corrigindo a tipagem dos headers para ser compatível com `fetch`
interface RequestHeaders {
    [key: string]: string;
}

// Tipagem da configuração da requisição
interface RequestConfig extends RequestInit {
    method: HttpMethod;
    headers: RequestHeaders;
}

// Função para configurar as requisições HTTP
export const requestConfig = <T>(
    method: HttpMethod,
    data: T | null = null,
    token: string | null = null,
    image: boolean = false
): RequestInit => {
    let config: RequestConfig = {
        method,
        headers: {},
    };

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (method !== "GET") {
        if (image && data instanceof FormData) {
            config.body = data; // Se for imagem, `body` será `FormData`
        } else if (data !== null) {
            config.body = JSON.stringify(data); // Garante que o `body` será um JSON string
            config.headers["Content-Type"] = "application/json";
        }
    }
    return config;
};
