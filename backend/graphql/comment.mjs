import  {
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    description: 'This represents a comment for a document',
    fields: () => ({
        _id: { type: GraphQLString },
        author: { type: GraphQLString},
        content: { type:GraphQLString }
    })
});

export default CommentType;