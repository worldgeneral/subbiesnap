import { Company } from "@subbiesnap/types";

type Props = {
  company: Company;
  totalJobs: number;
};

export default function CompanyCard(props: Props) {
  return (
    <div className="group relative p-6 rounded-md shadow dark:shadow-gray-700 mt-6">
      <div className="size-14 flex items-center justify-center bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-700 rounded-md relative -mt-12">
        <img src="/images/company/spotify.png" className="size-8" alt="" />
      </div>
      <div className="mt-4">
        <a href="" className="text-lg hover:text-indigo-600 font-semibold">
          {props.company.name}
        </a>
        <p className="text-slate-400 mt-2">{props.company.blurb}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
        <span className="text-slate-400">
          <i className="uil uil-map-marker" /> {props.company.avgRating}
        </span>
        <span className="block font-semibold text-indigo-600">
          {props.totalJobs} Jobs
        </span>
      </div>
    </div>
  );
}
