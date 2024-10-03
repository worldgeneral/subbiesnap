import { Job } from "@subbiesnap/types";

export default function JobBanner(props: Job) {
  return (
    <div className="group relative overflow-hidden md:flex justify-between items-center rounded shadow hover:shadow-md dark:shadow-gray-700 transition-all duration-500 p-5">
      <div className="flex items-center">
        <div className="size-14 flex items-center justify-center bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-md">
          <img
            src="/images/company/facebook-logo.png"
            className="size-8"
            alt=""
          />
        </div>
        <a
          href="job-detail-one.html"
          className="text-lg hover:text-indigo-600 font-semibold transition-all duration-500 ms-3 min-w-[180px]"
        >
          {props.title}
        </a>
      </div>
      <div className="md:block flex justify-between md:mt-0 mt-4">
        <span className="block text-slate-400 text-sm md:mt-1 mt-0">
          <i className="uil uil-clock" />{" "}
          {props.startsAt.toDateString() + " " + props.endsAt?.toDateString()}
        </span>
      </div>
      <div className="md:block flex justify-between md:mt-0 mt-2">
        <span className="text-slate-400">
          <i className="uil uil-map-marker" />{" "}
          {props.location ? props.location : "england"}
        </span>
        <span className="block font-semibold md:mt-1 mt-0">
          {props.compensationValueMin +
            " " +
            props.compensationValueMax +
            " " +
            props.compensationSuffix}
        </span>
      </div>
      <div className="md:mt-0 mt-4">
        <a
          href=""
          className="btn btn-icon rounded-full bg-indigo-600/5 hover:bg-indigo-600 border-indigo-600/10 hover:border-indigo-600 text-indigo-600 hover:text-white md:relative absolute top-0 end-0 md:m-0 m-3"
        >
          <i data-feather="bookmark" className="size-4" />
        </a>
        <a
          href="job-apply.html"
          className="btn rounded-md bg-indigo-600 hover:bg-emerald-700 border-indigo-600 hover:border-emerald-700 text-white md:ms-2 w-full md:w-auto"
        >
          Apply Now
        </a>
      </div>
      <span className="w-24 bg-yellow-400 text-white text-center absolute ltr:-rotate-45 rtl:rotate-45 -start-[30px] top-1">
        <i className="uil uil-star" />
      </span>
    </div>
  );
}
