"use client";

import {
  PlayingCard,
  Variant,
} from "@/components/cardsBoxes/playingCard/playingCard";
import { useState } from "react";
import { Job as TypeJob } from "@subbiesnap/types/job";
import { DisplayInfo } from "@/components/jobs/displayInfo";
import {
  HydrationBoundary,
  dehydrate,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { jobsQueryOptions } from "./query";
import { getQueryClient } from "../get-query-client";
import Error from "@/components/error/error";

export default function Jobs() {
  const queryClient = getQueryClient();
  const { data, error } = useSuspenseQuery(jobsQueryOptions);

  const [displayedJob, setDisplayedJob] = useState<TypeJob>(data[0]);

  const suit: Variant[] = ["heart", "diamond", "club", "spade"];

  if (error) {
    return <Error error={error.message} />;
  }

  if (data) {
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex justify-center">
          <div className="w-10/12 border-black border-x flex">
            <div className="w-1/3 p-3 my-10 h-[1080px] overflow-y-scroll mx-10 border border-black shadow-md shadow-black rounded-2xl ">
              {data.map((job, index) => {
                return (
                  <div
                    onClick={() => setDisplayedJob(job)}
                    style={{ zIndex: index }}
                    className=" relative [&:not(:first-child)]:-mt-[350px]  duration-200 transition ease-in-out delay-100 hover:scale-105 peer peer-hover:translate-y-72 "
                  >
                    {/* [&:nth-child(2)]:-mt-[50px] */}
                    <PlayingCard
                      className="w-full"
                      variant={suit[job.id % 4]}
                      key={index}
                    >
                      <div>
                        <div className="w-4/5 ml-auto grid cols-2 rows-2   ">
                          <h3 className="text-xl font-semibold tracking-tight capitalize mt-2 mb-1 col-start-1 ">
                            {job.title}
                          </h3>

                          {job.compensationValueMin && (
                            <div className="text-gray-600 col-start-1">
                              <span>£{job.compensationValueMin}</span>
                              {job.compensationValueMax && (
                                <span> To {job.compensationValueMax}</span>
                              )}
                              <span>/{job.compensationSuffix}</span>
                            </div>
                          )}
                          <span className="text-sm text-center text-gray-600 row-start-2 col-start-2 ">
                            {job.location}
                          </span>
                        </div>
                        <div className="mx-5">
                          <span className="text-xs text-gray-600 ">
                            {job.startsAt.toString().slice(4, 15)}
                            {job.endsAt &&
                              " To " + job.endsAt.toString().slice(4, 15)}
                          </span>

                          <p className="mt-3 h-60 leading-snug text-ellipsis overflow-hidden ">
                            {job.description},{job.description}
                          </p>
                        </div>
                      </div>
                    </PlayingCard>
                  </div>
                );
              })}
            </div>
            <div className="w-0 border-black border h-full mx-3"></div>
            <div className="my-10 mx-5 border-black border w-3/4 rounded-md ">
              <DisplayInfo job={displayedJob} />
            </div>
          </div>
        </div>
      </HydrationBoundary>
    );
  }

  return <p>Loading...</p>;
}
//peer-first:translate-y-72
