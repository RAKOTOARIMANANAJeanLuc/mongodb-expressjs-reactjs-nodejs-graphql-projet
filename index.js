const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const port = 3001;
const app = express();

app.use(bodyParser.json());

app.use("/graphql", graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.4kvyfru.mongodb.net/${process.env.MONGO_DB}`)
    .then(() => {
        app.listen(port, () => {
            console.log("Connecté au port : " + port);
        });
    })
    .catch(err => console.error(err));
