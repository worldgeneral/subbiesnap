"use client";

import { PlayingCard } from "@/components/cardsBoxes/playingCard/playingCard";
import { Variant } from "@/components/cardsBoxes/playingCard/playingCard";
import { DisplayInfo } from "@/components/jobs/displayInfo";
import { Job as TypeJob } from "../../../../types/job/types";
import { useMemo, useState } from "react";
import { randomBetween } from "@/utils/randomBetween";

const tempJob: TypeJob = {
  id: 1,
  companyId: 1,
  title: "job",
  endsAt: new Date("December 17, 2025 03:24:00"),
  compensationSuffix: "PH",
  compensationValueMin: 10,
  compensationValueMax: null,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
  startsAt: new Date("December 17, 2024 03:24:00"),
  location: "Stoke-On-Trent",
  fulfilledAt: null,
};
const tempJob2: TypeJob = {
  id: 1,
  companyId: 1,
  title: "jobs",
  endsAt: new Date("December 17, 2025 03:24:00"),
  compensationSuffix: "PH",
  compensationValueMin: 10,
  compensationValueMax: null,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
  startsAt: new Date("December 17, 2024 03:24:00"),
  location: "Stoke-On-Trent",
  fulfilledAt: null,
};

export default function Job() {
  const [displayedJob, setDisplayedJob] = useState(tempJob);

  const suit: Variant[] = ["heart", "diamond", "club", "spade"];

  return (
    <main className="">
      <div className="flex justify-center">
        <div className="w-10/12 border-black border-x flex">
          <div className="w-1/3 p-3 my-10 h-[1080px] overflow-y-scroll mx-10 border border-black shadow-md shadow-black rounded-2xl ">
            {tempJobs.map((job, index) => {
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
                          {tempJob.title}
                        </h3>

                        {tempJob.compensationValueMin && (
                          <div className="text-gray-600 col-start-1">
                            <span>£{tempJob.compensationValueMin}</span>
                            {tempJob.compensationValueMax && (
                              <span> To {tempJob.compensationValueMax}</span>
                            )}
                            <span>/{tempJob.compensationSuffix}</span>
                          </div>
                        )}
                        <span className="text-sm text-center text-gray-600 row-start-2 col-start-2 ">
                          {tempJob.location}
                        </span>
                      </div>
                      <div className="mx-5">
                        <span className="text-xs text-gray-600 ">
                          {tempJob.startsAt.toString().slice(4, 15)}
                          {tempJob.endsAt &&
                            " To " + tempJob.endsAt.toString().slice(4, 15)}
                        </span>

                        <p className="mt-3 h-60 leading-snug text-ellipsis overflow-hidden ">
                          {tempJob.description},{tempJob.description}
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
    </main>
  );
}
//peer-first:translate-y-72

const tempJobs = [
  {
    id: 135,
    companyId: 1,
    title: "job1",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 132789,
    companyId: 1,
    title: "job2",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 1876,
    companyId: 1,
    title: "job3",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 1124,
    companyId: 1,
    title: "job4",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 11,
    companyId: 1,
    title: "job5",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 981,
    companyId: 1,
    title: "job6",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 71,
    companyId: 1,
    title: "job7",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 2341,
    companyId: 1,
    title: "job8",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 91,
    companyId: 1,
    title: "job9",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 1231,
    companyId: 1,
    title: "job10",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 6521,
    companyId: 1,
    title: "job11",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 451,
    companyId: 1,
    title: "job12",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
  {
    id: 761,
    companyId: 1,
    title: "job13",
    endsAt: new Date("December 17, 2025 03:24:00"),
    compensationSuffix: "PH",
    compensationValueMin: 10,
    compensationValueMax: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta molestiae qui corrupti quibusdam dicta illo illum quas voluptate excepturi tenetur accusamus, debitis consequuntur expedita distinctio! Esse sed tempore explicabo suscipit!",
    startsAt: new Date("December 17, 2024 03:24:00"),
    location: "Stoke-On-Trent",
    fulfilledAt: null,
  },
];
