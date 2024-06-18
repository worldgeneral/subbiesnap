import { PrimaryButton } from "@/components/buttons/primary/primary";
import { ImageLoader } from "@/components/imageLoader/imageLoader";
import underConstruction from "../images/underConstruction.png";

export default function NotFound() {
  return (
    <main>
      <div className="flex justify-center m-5">
        <h2 className="text-5xl">404 Not Found</h2>
      </div>
      <div className="flex justify-center">
        <p className="text-3xl">Could not find requested resource</p>
      </div>
      <div className="flex justify-center">
        <ImageLoader
          src={underConstruction}
          alt="under construction"
          className="w-1/2 "
        />
      </div>
    </main>
  );
}
