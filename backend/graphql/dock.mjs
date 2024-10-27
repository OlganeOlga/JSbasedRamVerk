import  {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    // GraphQLFloat,
    // GraphQLNonNull
} from 'graphql';

import CommentType from './comment.mjs';

const DockType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
        _id: { type: GraphQLString },
        title: { type: GraphQLString},
        content: { type:GraphQLString },
        comments: { type: GraphQLList(CommentType)},
        allowed_users: { type: new GraphQLList(GraphQLString) }
    })
});

export default DockType;