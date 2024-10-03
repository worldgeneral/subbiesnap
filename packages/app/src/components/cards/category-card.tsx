type Props = {
  category: string;
  jobs: number;
};

export default function CategoryCard(props: Props) {
  return (
    <div className="group p-4 rounded-md shadow dark:shadow-gray-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-all duration-500">
      <h5 className="text-lg font-semibold group-hover:text-white">
        {props.category}
      </h5>
      <span className="block text-slate-400 group-hover:text-white/50 text-sm mt-1">
        {props.jobs} Jobs Available
      </span>
      <div className="mt-2">
        <a
          href="job-grid-one.html"
          className="text-indigo-600 dark:text-white/80 group-hover:text-white font-medium"
        >
          Explore Jobs <i className="uil uil-arrow-right" />
        </a>
      </div>
    </div>
  );
}
