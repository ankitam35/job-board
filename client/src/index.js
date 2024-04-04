import "bulma/css/bulma.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/graphql/queries";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);
