import { User } from "./User";

export interface UserState {
    user: User | null;
    error: string | boolean| null; 
    success: boolean;
    loading: boolean;
    message: string | null;
}