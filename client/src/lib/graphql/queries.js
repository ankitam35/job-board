import { getAccessToken } from "../auth";
import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
// import { GraphQLClient } from "graphql-request";

// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return { Authorization: "Bearer " + accessToken };
//     }
//     return {};
//   },
// });

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  uri: "http://localhost:9000/graphql",
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

// Fragments
const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;

export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      id
      date
      title
      company {
        id
        name
      }
      description
    }
  }
`;

export const getJobs = async () => {
  const query = gql`
    query {
      jobs {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `;

  // const { jobs } = await client.request(query);

  const {
    data: { jobs },
  } = await apolloClient.query({ query, fetchPolicy: "network-only" });
  return jobs;
};

export const getJobByID = async (id) => {
  // const { job } = await client.request(query, { id });

  const {
    data: { job },
  } = await apolloClient.query({ query: jobByIdQuery, variables: { id } });

  return job;
};

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;


export const createJob = async (title, description) => {
  //   const { job } = await client.request(mutation, {
  //     input: { title, description },
  //   });

  const {
    data: { job },
  } = await apolloClient.mutate({
    mutation: createJobMutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });

  return job;
};

export const CompanyByIDQuery = gql`
  query CompanyByID($companyId: ID!) {
    company(companyId: $companyId) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`;

export const getCompanyByID = async (companyId) => {
  // const { company } = await client.request(query, { companyId });

  const {
    data: { company },
  } = await apolloClient.query({
    query: CompanyByIDQuery,
    variables: { companyId },
  });

  return company;
};
