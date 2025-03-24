import { User } from "./User";

export interface RegisterResponse {
    errors?: string[];
    user?: User;
}