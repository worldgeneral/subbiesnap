export default function CategoriesList({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
      {children}
    </div>
  );
}
