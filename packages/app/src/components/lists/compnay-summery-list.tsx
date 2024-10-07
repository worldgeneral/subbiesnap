export default function CompanySummaryList({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
      {children}
    </div>
  );
}
