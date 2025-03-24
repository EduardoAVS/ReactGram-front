import { User } from "./User";

export interface UpdateProfileResponse {
    user: User;
    errors: string[];
}