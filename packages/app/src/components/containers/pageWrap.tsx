export default function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1400px] mx-auto min-h-screen flex flex-col bg-neutral-100">
      {children}
    </div>
  );
}
