import { useQuery } from "@apollo/client";
import { CompanyByIDQuery } from "./queries";

export const useCompanyData = (companyId) => {
  let { loading, data, error } = useQuery(CompanyByIDQuery, {
    variables: {
      companyId,
    },
  });

  return { loading, data, error };
};
