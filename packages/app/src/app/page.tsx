import { Button } from "@/components/buttons/main/button";
import { InfoCard } from "@/components/cards-boxes/info-card";
import Image from "next/image";
import { CardWithIcon } from "@/components/cards-boxes/card-with-icon";
import { PlayingCard } from "@/components/cards-boxes/playing-card/playing-card";
import { Card1 } from "@/components/cards-boxes/card-1";

export default function Home() {
  const roles = [
    "Electrician",
    "Handy man",
    "Plumber",
    "Chippy",
    "Plaster",
    "Boarder",
    "welder",
  ];

  return (
    <main className="bg-topography bg-repeat	">
      <div className="flex justify-center flex-col">
        <div className="w-full h-96 bg-construction-cartoon bg-cover bg-center">
          <div className="h-full bg-gradient-to-r from-black/90 from-0%  to-30%">
            <div className="relative top-10 left-10 z-10 bg-white/75 w-fit p-3 shadow-md rounded-md	">
              <h1 className="text-5xl tracking-tight">Welcome to SubbieSnap</h1>
              <span className="text-2xl pl-5">
                Remove the hassle of agencies.
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-10/12 relative bottom-10 bg-white p-10 shadow-md rounded-b-md ">
            <h2 className="mb-2 text-3xl">Search for your next job</h2>
            <form className="border-2">
              <input type="text" placeholder="Search here" />
            </form>
            <h3 className="my-3 text-lg">Popular roles</h3>
            <div className="flex flex-wrap w-10/12">
              {roles.map((role, index) => {
                return (
                  <Button
                    variation="primary"
                    key={index}
                    className="m-1"
                    link={`/${role}`}
                    buttonText={role}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <div className="flex flex-wrap w-11/12">
          <div className="w-full md:w-1/3 p-5">
            <PlayingCard variant="heart" className="">
              <div className="relative w-10/12 h-full">
                <h3 className="absolute top-[20%] text-2xl font-semibold text-center">
                  Sign up to find your next job
                </h3>
                <p className="absolute top-[40%] text-lg text-center">
                  Sign up and browse our jobs, we are sure that you'll find what
                  you are looking for.
                </p>
                <Button
                  className="absolute bottom-[20%]"
                  link="/auth/signup"
                  buttonText="Signup"
                  variation="secondary"
                />
              </div>
            </PlayingCard>
          </div>
          <div className="w-full md:w-1/3 p-5">
            <PlayingCard variant="club" className="">
              <div className="relative w-10/12 h-full">
                <h3 className="absolute top-[20%] text-2xl font-semibold text-center">
                  Cut out the middle man and post your job
                </h3>
                <p className="absolute top-[40%] text-lg text-center"></p>
                <Button
                  className="absolute bottom-[20%]"
                  link="/jobs"
                  buttonText="Post a job"
                  variation="secondary"
                />
              </div>
            </PlayingCard>
          </div>
          <div className="w-full md:w-1/3 p-5">
            <PlayingCard variant="diamond" className="">
              <div className="relative w-10/12 h-full">
                <h3 className="absolute top-[20%] text-2xl font-semibold text-center">
                  Leave a review for your past jobs
                </h3>
                <p className="absolute top-[40%] text-lg text-center">
                  Sigh up and browse our jobs, we are sure that you'll find what
                  you are looking for.
                </p>
                <Button
                  className="absolute bottom-[20%]"
                  link="/review"
                  buttonText="Review"
                  variation="secondary"
                />
              </div>
            </PlayingCard>
          </div>
        </div>
      </div>

      <div className="  my-10 pt-20 bg-gray-50 text-black border-y border-black shadow-md">
        <div className="pb-20  ">
          <div className="flex justify-center">
            <h2 className="text-4xl font-bold text-center w-10/12 mb-10">
              Why use Subbiesnap
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-5 w-10/12 ">
              <CardWithIcon
                className=" content-between"
                image={{
                  src: "/images/main-page/construction-worker.svg",
                  alt: "construction worker icon",
                  width: 80,
                  height: 80,
                }}
                header="Built for the industry"
                text="Subbiesnap was build for solo traders to help find companies
                  wanting your time"
              />
              <CardWithIcon
                className=""
                image={{
                  src: "/images/main-page/flat-mouse.svg",
                  alt: "hand snapping fingers",
                  width: 80,
                  height: 80,
                }}
                header="Simple and easy"
                text="Simple and easy to use, you'll be set in a few clicks"
              />

              <CardWithIcon
                className=""
                image={{
                  src: "/images/main-page/gps-tag.svg",
                  alt: "gps tag",
                  width: 80,
                  height: 80,
                }}
                header="Get new job notifications"
                text="We can provide you with the lasted jobs in your area"
              />

              <CardWithIcon
                className=""
                image={{
                  src: "/images/main-page/star.svg",
                  alt: "",
                  width: 80,
                  height: 80,
                }}
                header="Review and rate"
                text="Subbiesnap allows you to leave a review and be reviewed"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-20  flex justify-center">
        <div className="w-10/12 ">
          <div className="mb-5">
            <h2 className="mb-5 text-4xl font-bold">How SubbieSnap works</h2>
            <p className=" text-xl ">Less time looking for job</p>
            <p className="text-xl">More time earing money</p>
          </div>

          <div className="grid grid-rows-3">
            <div className="grid grid-cols-12">
              <Card1
                className="col-start-1 col-span-5"
                image={{
                  src: "/images/main-page/search-icon.svg",
                  alt: "search icon",
                  width: 60,
                  height: 60,
                }}
                step="one"
                heading="browse for your next job"
                text="search all of our jobs in a few clicks."
              />
            </div>

            <div className="grid grid-cols-12">
              <Image
                className=" col-start-2  place-self-center"
                src="/images/main-page/twisted-arrow-blue-icon.svg"
                alt="arrow pointing right"
                width={100}
                height={100}
              />
              <Card1
                className="col-start-4 col-span-5"
                image={{
                  src: "/images/main-page/personal-information-icon.svg",
                  alt: "personal information icon",
                  width: 60,
                  height: 60,
                }}
                step="two"
                heading="Apply for a job"
                text="Instantly apply with your custom profile or send your CV."
              />
              <Image
                className="col-start-10 rotate-90 place-self-center"
                src="/images/main-page/twisted-arrow-right-blue-icon.svg"
                alt="arrow pointing right"
                width={100}
                height={100}
              />
            </div>
            <div className="grid grid-cols-12">
              <Card1
                className="col-end-12 col-span-5"
                image={{
                  src: "/images/main-page/excellence-honor-icon.svg",
                  alt: "excellence honor icon",
                  width: 60,
                  height: 60,
                }}
                step="Three"
                heading="Browse for your next job"
                text="Search all of our jobs in a few clicks."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center bg-white">
        <div className="w-full h-[450px] bg-cartoon-construction-sky-line bg-cover bg-top bg-no-repeat"></div>
      </div>
    </main>
  );
}
