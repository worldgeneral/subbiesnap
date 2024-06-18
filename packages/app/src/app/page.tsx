import { ImageLoader } from "@/components/imageLoader/imageLoader";
import { PrimaryButton } from "@/components/buttons/primary/primary";
import { SecondaryButton } from "@/components/buttons/secondary/secondary";
import cartoonBuildings from "../../public/cartoonBuildings.svg";

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
  const aboutUs = ["contractors", "contractors"];
  return (
    <main className="">
      <div className="flex justify-center flex-col">
        <div className="w-full h-96 bg-constructionCartoon bg-cover bg-center">
          <div className="h-full bg-gradient-to-r from-black/90 from-0%  to-30%">
            <div className="relative top-10 left-10 z-10 bg-white/75 w-fit p-3 shadow-md rounded-md	">
              <h1 className=" text-5xl">Welcome to SubbieSnap</h1>
              <span className="text-2xl pl-5">
                Remove the hassle of agencies.
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className=" relative bottom-10 bg-white p-10 shadow-md rounded-b-md ">
            <h2 className=" ml-20 mb-2 text-3xl">Search for your next job</h2>
            <form className="ml-20">
              <input type="text" placeholder="Search here" />
            </form>
            <h3 className="ml-20 my-3">Popular roles</h3>
            <div className="flex flex-wrap w-10/12 ml-20">
              {roles.map((role) => {
                return (
                  <PrimaryButton
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
      <div className="w-full  flex justify-center">
        <div className="flex justify-between">
          <div className="w-1/2">
            <h2 className="text-3xl">
              Cut out the middle man and post your job
            </h2>
          </div>
          <div className="w-1/2">
            <SecondaryButton
              className=""
              link="/companies"
              buttonText="Post a job"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl w-1/2">
              Explore what SubbieSnap can do for you
            </h2>
          </div>
          <div>
            <div className="flex flex-wrap w-1/2">
              {aboutUs.map((page) => {
                return <PrimaryButton link={`/${page}`} buttonText={page} />;
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <ImageLoader
          className=""
          src={cartoonBuildings}
          alt="buildings with a crane"
        />
      </div>
    </main>
  );
}
