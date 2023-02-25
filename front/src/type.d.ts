export interface AuthorType {
    id: string;
    name: string;
    bio: string;
};
export interface BookType {
    id: string;
    author_id: string;
    title: string;
    pub_year: string;
    genre: string;
};
export interface Error { 
    error: string;
};
export interface MessageResponse {
    message: string;
    token?: string;
};
