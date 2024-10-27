import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
} from 'graphql';

import UserType from './user.mjs';
import DockType from './dock.mjs';
import SharedDockType from './shareddock.mjs';

//import userFu from './../models/users.mjs';
import userFu from './../models/users.mjs';
import docFu from './../docs/remoteDocs.mjs'

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            description: "a list of users",
            resolve: async function name() {
                return await userFu.getAll();
            }
        },
        user: {
            type: UserType,
            description: "a user, an object",
            args: {
                username: {type: GraphQLString}
            },
            resolve: async function(parent, args) {
                let users = await userFu.getAll();
                return users.find(user => user.username === args.username);
            }
        },

        userDocs: {
            type: new GraphQLList(DockType),
            description: "a list with dokuments of a users",
            args: {
                username: {type: GraphQLString},
            },
            resolve: async function(parent, args) {
                let users = await userFu.getAll();
                let user = users.find(user => user.username === args.username);
                if(user){
                    return user.documents;
                }
                throw new Error("user does not exists");
            }
        },

        userDoc: {
            type: DockType,
            description: "a dokument of a users",
            args: {
                username: {type: GraphQLString},
                docid: {type: GraphQLString}
            },
            resolve: async function(parent, args) {
                let users = await userFu.getAll();
                let user = users.find(user => user.username === args.username);
                if(user){
                    return user.documents.find(doc => doc.docid === args.docid);
                }
                throw new Error("document does not exists");
            }
        },

        sharedWithUser: {
            type: new GraphQLList(SharedDockType),
            description: "a list with dokuments of other users that are shared with this user",
            args: {
                username: {type: GraphQLString}
            },
            resolve: async function(parent, args) {
                const username = args.username;
                try {
                    const documents = await docFu.getShared(username);
            
                    //return fout status if no shared documents
                    if (!documents || documents.length === 0) {
                        return []; // Return 404 if no documents found
                    }
                    return documents ;
                } catch (error) {
                    console.log("error in route graphql shared/username: ", error);
                    throw new Error("error in route graphql shared/username: ", error);
                }
            }
        },

        // commentDocumnt: {
        //     type: new GraphQLList(SharedDockType),
        //     description: "a list with dokuments of other users that are shared with this user",
        //     args: {
        //         username: {type: GraphQLString}
        //     },
        //     resolve: async function(parent, args) {
        //         const username = args.username;
        //         try {
        //             const documents = await docFu.getShared(username);
            
        //             //return fout status if no shared documents
        //             if (!documents || documents.length === 0) {
        //                 return []; // Return 404 if no documents found
        //             }
        //             return documents ;
        //         } catch (error) {
        //             console.log("error in route graphql shared/username: ", error);
        //             throw new Error("error in route graphql shared/username: ", error);
        //         }
        //     }
        // },
    }),
});

export default RootQueryType;
