import { User } from "./User";

export interface AuthUser extends User{
    token: string;
}