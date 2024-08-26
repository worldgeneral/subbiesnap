import Image from "next/image";

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
        <Image
          src="/images/not-found/under-construction.png"
          alt="under construction"
          width={1000}
          height={1000}
        />
      </div>
    </main>
  );
}
