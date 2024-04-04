import { getCompany } from "./db/companies.js";
import { createJob, getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }
      return job;
    },
    company: async (_root, { companyId }) => {
      let company = await getCompany(companyId);
      if (!company) {
        throw notFoundError("No Company found with id " + companyId);
      }
      return company;
    },
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: async (_root, { input: { title, description } }, user) => {
      if (!user) {
        throw notAuthorizedError("Unauthorized");
      }

      const {companyId} = user;
      return createJob({title, description, companyId})
    },
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toISODate(job.createdAt),
  },
};

const notFoundError = (message) => {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
};

const notAuthorizedError = (message) => {
  return new GraphQLError(message, {
    extensions: { code: "NOT_Authorized" },
  });
};


const toISODate = (value) => value.slice(0, "dd-mm-yyyy".length);
