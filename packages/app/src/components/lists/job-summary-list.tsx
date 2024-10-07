export default function JobSummaryList({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid grid-cols-1 mt-8 gap-[30px]">{children}</div>;
}
