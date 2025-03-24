import { User } from "./User";

export interface AuthState {
    user: User| null;
    error: string | boolean| null; 
    success: boolean;
    loading: boolean;
}