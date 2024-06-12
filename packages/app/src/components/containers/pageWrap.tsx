export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1400px] max-auto min-h-screen flex flex-col ">
      {children}
    </div>
  );
}
