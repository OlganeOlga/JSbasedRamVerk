export default interface Document {
    _id: string;
    owner: string;
    title: string;
    content: string;
    allowd_users: [string];
    comments:[Comment]
};


export default interface User {
    username: string;
    password: string;
    documents: [Document];
};

export default interface CommentInterface {
    author: string;
    content: string;
}

  
