import { Job } from "@subbiesnap/types/job";
type Props = {
  job: Job;
};

export function DisplayInfo(props: Props) {
  return (
    <div>
      <div className="">
        <h3 className="">{props.job.title}</h3>

        {props.job.compensationValueMin && (
          <div className="">
            <span>£{props.job.compensationValueMin}</span>
            {props.job.compensationValueMax && (
              <span> To {props.job.compensationValueMax}</span>
            )}
            <span>/{props.job.compensationSuffix}</span>
          </div>
        )}
        <span className="">{props.job.location}</span>
      </div>
      <div className="">
        <span className="">
          {props.job.startsAt.toString().slice(4, 15)}
          {props.job.endsAt &&
            " To " + props.job.endsAt.toString().slice(4, 15)}
        </span>

        <p className="">
          {props.job.description},{props.job.description}
        </p>
      </div>
    </div>
  );
}
