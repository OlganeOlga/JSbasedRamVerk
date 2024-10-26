import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLScalarType,
    graphql,
    GraphQLList
} from 'graphql';
import CommentType from './comment.mjs';

const SharedDockType = new GraphQLObjectType({
    name: 'Object',
    description: 'Represents a document shared with sertain, contains owner name',
    fields: () => ({
        owner: { type: GraphQLString},
        _id: { type: GraphQLString },
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        comments: {type: GraphQLList(CommentType)}
    })
});

export default SharedDockType;