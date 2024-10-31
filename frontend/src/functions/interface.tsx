export default interface Document {
    _id: string;
    owner: string;
    title: string;
    content: string;
    allowd_users: [string];
    comments:Comment[]
};


export interface User {
    username: string;
    password: string;
    documents: [Document];
};

export interface Comment {
    author: string | null;
    content: string;
}

export interface DocumentUpdateData {
    title: string;
    content: string;
}
