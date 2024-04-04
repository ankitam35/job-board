import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompanyByID } from "../lib/graphql/queries";
import JobList from "../components/JobList";
import { useCompanyData } from "../lib/graphql/hooks";

function CompanyPage() {
  const { companyId } = useParams();
  // const [company, setCompany] = useState();
  let { loading, data, error } = useCompanyData(companyId);

  if (loading) return <div>Loading...</div>;

  if (error) return <div className="has-text-danger">Data unavailable</div>;

  let { company } = data;

  // useEffect(() => {
  //   getCompanyByID(companyId).then(setCompany);
  // }, [companyId]);

  return (
    <>
      {company && (
        <div>
          <h1 className="title">{company.name}</h1>
          <div className="box">{company.description}</div>
          <h2 className="title is-5">Jobs at {company.name}</h2>
          <JobList jobs={company.jobs} />
        </div>
      )}
    </>
  );
}

export default CompanyPage;
