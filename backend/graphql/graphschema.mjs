import {GraphQLSchema} from "graphql";
import RootQueryType from "./root.mjs";
//import RootMutationType from "./root_mutation.mjs";

const schema = new GraphQLSchema({
    query: RootQueryType,
    //mutation: RootMutationType
  });

export default schema;