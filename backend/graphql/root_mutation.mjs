import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLSchema } from 'graphql';
import bcrypt from 'bcryptjs';
import userFu from './../docs/users.mjs';
import docFu from './../docs/remoteDocs.mjs'
import { User } from '../routes/auth_user.mjs';
import DockType from './dock.mjs';

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields:() => ({
    deleteUser: {
        type: GraphQLBoolean, // Boolean response type for success or failure
        description: 'Delete a user after verifying the password',
        args: {
            username: { type: GraphQLString },
            password: { type: GraphQLString }
        },
        async resolve(parent, { username, password }) {
            try {
            // Get user details from database
            const user = await userFu.getUser(username);
            if (!user) {
                throw new Error('Invalid username or password');
            }

            // Check if the password matches
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid username or password');
            }

            // Delete user if password matches
            const deleteResponse = await userFu.deleteUser(username);
            return deleteResponse.deletedCount > 0; // Return true if deletion was successful
            } catch (error) {
            console.error("Error during user deletion:", error);
            throw new Error('User deletion failed', error);
            }
        }
        },

        createUser: {
            type: GraphQLBoolean, // Boolean response type for success or failure
            description: 'Create a user',
            args: {
                username: {type: GraphQLString},
                password: { type: GraphQLString}
            },
            async resolve(parent, { username, password }) {
                try {
                // Check if the user already exists
                const existingUser = await userFu.getUser(username);

                // If the user already exists, return a 409 Conflict status with a descriptive message
                if (existingUser) {
                    return false;
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // If the user does not exist, create a new user
                const newUser = new User({
                    username,
                    password: hashedPassword,
                });

                // Save the user to the database
                const saveResponse = await userFu.createUser(newUser);
                // Return success response
                return true;

            } catch (error) {
                // Handle any server or database errors
                console.error("Error in graphql registration:", error);
                throw new Error("Error in graphql registration:", error);
            
            }
        }
    },
    addDoc: {
        type: GraphQLBoolean, // Boolean response type for success or failure
        description: 'Create a user',
        args: {
            username: {type: GraphQLString},
        },
        async resolve(parent, { username }) {
            try {
                const result = await docFu.newDocument(username);
                if(result.acknowledged){ return true;}
                return false
            } catch (error) {
                throw new Error('Error updating document by root_motatio', error );
            }
        }
    },

    updateDoc: { 
        type: DockType,
        description: 'Change a documnt',  
        args: {
            username: { type: GraphQLString },
            inputid: { type: GraphQLString },
            title: { type: GraphQLString },
            content: { type: GraphQLString },
        },
        async resolve(parent, { username, inputid, title, content}) {
            
            try {
            console.log("at updateDoc, args: ", username)

                // Perform the update in MongoDB
                const result = await docFu.updateDocument( username, 
                                                            inputid,
                                                            title,
                                                            content);

                if (!result.modifiedCount) {
                    throw new Error("Document not found or update failed.");
                }
                return {
                    _id: inputid,
                    title:title,
                    content:content
                };
            } catch (error) {
                console.error("Error updating user document:", error);
                throw new Error("Failed to update user document.");
            }
    }},

    shareDoc: {
        type: GraphQLBoolean,
        description: "a dokument of another user that are shared with this user",
        args: {
            owner: {type: GraphQLString}, // owner of the document
            adress: {type: GraphQLString}, // the name of use that can reach document
            docid: {type: GraphQLString} // _id of document
        },
        resolve: async function(parent, args) {
            try {
                const result = await docFu.shareDoc(args.owner, args.docid, args.adress);
                if(result.acknowledged) {
                    return true;
                };
                return false;
            } catch (error) {
                console.log("error in /share: ", error);
                throw new Error(`error in /share: ${error}`);
            }
        }
    },

    //WITH SOCKET
    // Inside your RootMutationType definition
commentDoc: {
    type: GraphQLBoolean,
    description: "Add a comment to an owned document or a shared document",
    args: {
      owner: { type: GraphQLString }, // owner of the document
      docid: { type: GraphQLString }, // _id of document
      author: { type: GraphQLString }, // the name of user that can comment document
      content: { type: GraphQLString }, // the content of comment
    },
    resolve: async function(parent, args, context) {
      try {
        console.log("in graphql /commentDoc, try to add comments");
        const result = await docFu.commentDoc(args.owner, args.docid.toString(), args.author, args.content);
        
        // Emit the new comment to the specific room using Socket.IO
        context.socket.to(args.docid).emit("newComment", {
          docid: args.docid,
          author: args.author,
          content: args.content
        });
  
        if (result.acknowledged && result.modifiedCount > 0) {
          return true;
        }
        return false;
      } catch (error) {
        console.log("error in /comment: ", error);
        throw new Error(`error in /comment: ${error}`);
      }
    }
  },
    deleteDoc: {
        type: GraphQLBoolean,
        description: "Remove document",
        args: {
            id: {type: GraphQLString}, // _id of document
            username: {type: GraphQLString}, // owner of the document
        },
        resolve: async function(parent, args) {
            try {
                console.log("int graphql /deleteDoc")
                const result = await docFu.removeDocument(args.id, args.username);
                if(result. acknowledged) {
                    return true;
                };
                return false;
            } catch (error) {
                console.log("error in /comment: ", error);
                throw new Error(`error in /comment: ${error}`);
            }
        }
    },
    
})
})


export default RootMutationType;
