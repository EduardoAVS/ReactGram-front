import { Photo } from "./Photo";

export interface PhotoState {
    photos: Photo[],
    photo: Photo | null,
    error: string | boolean | null,
    success: boolean,
    loading: boolean,
    message: string | null,
}