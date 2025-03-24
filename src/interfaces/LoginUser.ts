import { User } from "./User";

export interface LoginUser {
    email: string,
    password: string,
}

export interface LoginResponse {
    errors?: string[];
    user?: User;
}