import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Posts from "./components/Posts";
import "bootstrap/dist/css/bootstrap.min.css";

const client = new ApolloClient({
  uri: "https://graphqlzero.almansi.me/api",
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  

  return (
    <ApolloProvider client={client}>
      <Posts userId={1} />
    </ApolloProvider>
  );
};

export default App;
