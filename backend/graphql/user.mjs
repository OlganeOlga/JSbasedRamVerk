import  {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import SharedDockType from './shareddock.mjs'

import DockType from "./dock.mjs";

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLString },
        documents: {
            type: new GraphQLList(DockType),
            resolve: (user) => {
                return user.documents || [];
            }
        },
        // sharedDocuments: {
        //     type: new GraphQLList(SharedDockType),  // Corrected type definition
        //     resolve: (user) => {
        //         return user.sharedDocuments ||[];
        //     }
        //}
    })
})

export default UserType;