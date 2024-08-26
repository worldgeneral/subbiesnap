import copyRight from "../../images/copyright.svg";

export function CopyRightFooter() {
  return (
    <footer className="h-10 bg-slate-950 text-white flex justify-center mt-auto">
      <div className="flex flex-row items-center w-1/2 justify-between">
        <div className="flex flex-row">
          Copyright &copy; All Rights Reserved
        </div>
        <span>SubbieSnap</span>
        <span>Maintained by Matthew Harrison</span>
      </div>
    </footer>
  );
}
