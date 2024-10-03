import JobBanner from "@/components/cards/job-banner";
import { Company, Job } from "../../../types/dist";
import CategoryCard from "@/components/cards/category-card";
import CompanyCard from "@/components/cards/company-card";

export default function () {
  return (
    <>
      <>
        <section
          className="py-36 lg:py-72 lg:pb-0 md:pb-8 w-full table relative bg-[url('/images/hero/bg3.jpg')] bg-center bg-cover"
          id="home"
        >
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="container relative">
            <div className="grid lg:grid-cols-12 mt-10 md:grid-cols-2 gap-[30px]">
              <div className="lg:col-span-7 lg:me-6">
                <h4 className="text-white lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5 font-bold">
                  Find a new job and <br />
                  build career
                </h4>
                <p className="text-white/70 text-lg max-w-xl">
                  Find Jobs, Employment &amp; Career Opportunities. Some of the
                  companies we've helped recruit excellent applicants over the
                  years.
                </p>
                <div className="grid grid-cols-1" id="reserve-form">
                  <div className="mt-8">
                    <div className="bg-white dark:bg-slate-900 border-0 shadow rounded p-3">
                      <form action="#">
                        <div className="registration-form text-dark text-start">
                          <div className="grid md:grid-cols-12 grid-cols-1 md:gap-0 gap-6">
                            <div className="lg:col-span-8 md:col-span-7">
                              <div className="filter-search-form relative filter-border">
                                <i className="uil uil-briefcase-alt icons" />
                                <input
                                  name="name"
                                  type="text"
                                  id="job-keyword"
                                  className="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0"
                                  placeholder="Search your Keywords"
                                />
                              </div>
                            </div>
                            <div className="lg:col-span-4 md:col-span-5">
                              <input
                                type="submit"
                                id="search"
                                name="search"
                                style={{ height: 60 }}
                                className="btn bg-indigo-600 hover:bg-emerald-700 border-indigo-600 hover:border-emerald-700 text-white searchbtn submit-btn w-full"
                                defaultValue="Search"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-white/70">
                    <span className="text-white">Popular Searches :</span>{" "}
                    Designer, Developer, Web, IOS, PHP Senior Engineer
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5 mt-8 md:mt-0">
                <div className="relative z-2">
                  <div className="p-3 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900">
                    <img
                      src="/images/hero.jpg"
                      className="shadow-md rounded-md"
                      alt=""
                    />
                  </div>
                  <div className="absolute bottom-2/4 translate-y-2/4 start-0 end-0 text-center">
                    <a
                      href="#!"
                      data-type="youtube"
                      data-id="S_CGed6E610"
                      className="lightbox size-20 rounded-full shadow-md dark:shadow-gray-800 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-indigo-600"
                    >
                      <i className="mdi mdi-play inline-flex items-center justify-center text-2xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="relative">
          <div className="shape overflow-hidden text-white dark:text-slate-900 rtl:-scale-x-[1]">
            <svg
              viewBox="0 0 2880 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M720 125L2160 0H2880V250H0V125H720Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <section className="relative md:py-24 py-16">
          <div className="container">
            <div className="relative grid md:grid-cols-3 grid-cols-1 items-center gap-[30px] z-1">
              <div className="counter-box text-center">
                <h1 className="lg:text-5xl text-4xl font-semibold mb-2 dark:text-white">
                  <span className="counter-value" data-target={1548}>
                    1010
                  </span>
                  K+
                </h1>
                <h5 className="counter-head text-sm font-semibold text-slate-400 uppercase">
                  Job Fulfillment
                </h5>
              </div>
              <div className="counter-box text-center">
                <h1 className="lg:text-5xl text-4xl font-semibold mb-2 dark:text-white">
                  <span className="counter-value" data-target={25}>
                    2
                  </span>
                  +
                </h1>
                <h5 className="counter-head text-sm font-semibold text-slate-400 uppercase">
                  Branches
                </h5>
              </div>
              <div className="counter-box text-center">
                <h1 className="lg:text-5xl text-4xl font-semibold mb-2 dark:text-white">
                  <span className="counter-value" data-target={9}>
                    0
                  </span>
                  +
                </h1>
                <h5 className="counter-head text-sm font-semibold text-slate-400 uppercase">
                  Years Experience
                </h5>
              </div>
            </div>
          </div>
          <div className="container md:mt-24 mt-16">
            <div className="grid grid-cols-1 pb-8 text-center">
              <h3 className="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
                Popular Jobs
              </h3>
              <p className="text-slate-400 max-w-xl mx-auto">
                Search all the open positions on the web. Get your own
                personalized salary estimate. Read reviews on over 30000+
                companies worldwide.
              </p>
            </div>
            <div className="grid grid-cols-1 mt-8 gap-[30px]">
              {jobs.map((job) => {
                return (
                  <JobBanner
                    companyId={job.companyId}
                    compensationSuffix={job.compensationSuffix}
                    compensationValueMin={job.compensationValueMin}
                    startsAt={job.startsAt}
                    location={job.location}
                    title={job.title}
                    description={job.description}
                    id={job.id}
                    compensationValueMax={job.compensationValueMax}
                    fulfilledAt={job.fulfilledAt}
                    endsAt={job.endsAt}
                  />
                );
              })}
            </div>
            <div className="grid md:grid-cols-1 grid-cols-1 mt-8">
              <div className="md:col-span-12 text-center">
                <a
                  href="job-grid-two.html"
                  className="btn btn-link text-slate-400 hover:text-indigo-600 after:bg-indigo-600 duration-500 ease-in-out"
                >
                  See More Jobs{" "}
                  <i className="uil uil-arrow-right align-middle" />
                </a>
              </div>
            </div>
          </div>
          <div className="container md:mt-24 mt-16">
            <div className="grid md:grid-cols-12 grid-cols-1 pb-8 items-end">
              <div className="lg:col-span-8 md:col-span-6 md:text-start text-center">
                <h3 className="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
                  Browse by Categories
                </h3>
                <p className="text-slate-400 max-w-xl">
                  Search your career opportunity with our categories
                </p>
              </div>
              <div className="lg:col-span-4 md:col-span-6 md:text-end hidden md:block">
                <a
                  href=""
                  className="btn btn-link text-slate-400 hover:text-indigo-600 after:bg-indigo-600 duration-500 ease-in-out"
                >
                  All Categories{" "}
                  <i className="uil uil-arrow-right align-middle" />
                </a>
              </div>
            </div>
            <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
              {categories.map((cat, index) => {
                return <CategoryCard category={cat} jobs={290} key={index} />;
              })}
            </div>
            <div className="grid md:grid-cols-12 grid-cols-1 md:hidden mt-8">
              <div className="md:col-span-12 text-center">
                <a
                  href=""
                  className="btn btn-link text-slate-400 hover:text-indigo-600 after:bg-indigo-600 duration-500 ease-in-out"
                >
                  All Categories{" "}
                  <i className="uil uil-arrow-right align-middle" />
                </a>
              </div>
            </div>
          </div>
          <div className="container md:mt-24 mt-16">
            <div className="grid grid-cols-1 pb-8 text-center">
              <h3 className="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
                Find Best Companies
              </h3>
              <p className="text-slate-400 max-w-xl mx-auto">
                Search all the open positions on the web. Get your own
                personalized salary estimate. Read reviews on over 30000+
                companies worldwide.
              </p>
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
              {companies.map((comp) => {
                return (
                  <CompanyCard company={comp} totalJobs={10} key={comp.id} />
                );
              })}
            </div>
            <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
              <div className="md:col-span-12 text-center">
                <a
                  href=""
                  className="btn btn-link text-slate-400 hover:text-indigo-600 after:bg-indigo-600 duration-500 ease-in-out"
                >
                  See More Companies{" "}
                  <i className="uil uil-arrow-right align-middle" />
                </a>
              </div>
            </div>
          </div>
        </section>
        <a
          href="#"
          id="back-to-top"
          className="back-to-top fixed hidden text-lg rounded-full z-10 bottom-5 end-5 size-9 text-center bg-indigo-600 text-white justify-center items-center"
        >
          <i className="uil uil-arrow-up" />
        </a>
      </>
    </>
  );
}

const jobs: Job[] = [
  {
    endsAt: new Date(),
    fulfilledAt: null,
    compensationValueMin: 20,
    companyId: 1,
    compensationValueMax: 200,
    compensationSuffix: "PH",
    title: "Web Designer",
    id: 10,

    startsAt: new Date(),
    location: "Australia",
    description: "$4,000 - $4,500",
  },
  {
    endsAt: new Date(),
    fulfilledAt: null,
    compensationValueMin: 20,
    companyId: 1,
    compensationValueMax: 200,
    compensationSuffix: "PH",
    title: "Marketing Director",
    id: 10,

    startsAt: new Date(),
    location: "USA",
    description: "$4,000 - $4,500",
  },
  {
    endsAt: new Date(),
    fulfilledAt: null,
    compensationValueMin: 20,
    companyId: 1,
    compensationValueMax: 200,
    compensationSuffix: "PH",
    title: "App Developer",
    id: 10,

    startsAt: new Date(),
    location: "China",
    description: "$4,000 - $4,500",
  },
  {
    endsAt: new Date(),
    fulfilledAt: null,
    compensationValueMin: 20,
    companyId: 1,
    compensationValueMax: 200,
    compensationSuffix: "PH",
    title: "Product Designer",
    id: 10,

    startsAt: new Date(),
    location: "Dubai",
    description: "$4,000 - $4,500",
  },
  {
    endsAt: new Date(),
    fulfilledAt: null,
    compensationValueMin: 20,
    companyId: 1,
    compensationValueMax: 200,
    compensationSuffix: "PH",
    title: "C++ Developer",
    id: 10,

    startsAt: new Date(),
    location: "India",
    description: "$4,000 - $4,500",
  },
  {
    endsAt: new Date(),
    fulfilledAt: null,
    compensationValueMin: 20,
    companyId: 1,
    compensationValueMax: 200,
    compensationSuffix: "PH",
    title: "Php Developer",
    id: 10,

    startsAt: new Date(),
    location: "Pakistan",
    description: "$4,000 - $4,500",
  },
];

const categories = [
  "Human Resource",
  "IT & Networking",
  "Sales & Marketing",
  "Accounting",
  "Delivery Boy",
  "Data Science",
  "Project Manager",
  "Engineering",
  "Help Center",
  "Full Stack Developer",
];

const companies: Company[] = [
  {
    id: 10,
    avgRating: 5,
    timesRated: 10,
    name: "Spotify",
    blurb: "Digital Marketing Solutions for Tomorrow",
    logo: null,
  },
  {
    id: 10,
    avgRating: 5,
    timesRated: 10,
    name: "Facebook",
    blurb: "Digital Marketing Solutions for Tomorrow",
    logo: null,
  },
  {
    id: 10,
    avgRating: 5,
    timesRated: 10,
    name: "Google",
    blurb: "Digital Marketing Solutions for Tomorrow",
    logo: null,
  },
  {
    id: 10,
    avgRating: 5,
    timesRated: 10,
    name: "Android",
    blurb: "Digital Marketing Solutions for Tomorrow",
    logo: null,
  },
  {
    id: 10,
    avgRating: 5,
    timesRated: 10,
    name: "Lenovo",
    blurb: "Digital Marketing Solutions for Tomorrow",
    logo: null,
  },
  {
    id: 10,
    avgRating: 5,
    timesRated: 10,
    name: "Shreethemes",
    blurb: "Digital Marketing Solutions for Tomorrow",
    logo: null,
  },
  {
    id: 10,
    avgRating: 5,
    timesRated: 10,
    name: "Skype",
    blurb: "Digital Marketing Solutions for Tomorrow",
    logo: null,
  },
  {
    id: 10,
    avgRating: 5,
    timesRated: 10,
    name: "Snapchat",
    blurb: "Digital Marketing Solutions for Tomorrow",
    logo: null,
  },
];
