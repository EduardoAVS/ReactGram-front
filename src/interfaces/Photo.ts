export interface Photo{
    _id?: string 
    image: string,
    title: string,
    likes: string[],
    comments: Comment[],
    userId: string
    userName: string,
}

export interface Comment{
    comment: string;
    userName: string;
    userImage?: string;
    userId: string;
}