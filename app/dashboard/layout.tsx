import Nav from "@/app/ui/dashboard/Nav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="text-center text-3xl font-bold pt-6">
        The Resource Record
      </div>
      <Nav />
      <hr className="m-4" />
      <div className="flex-grow w-9/12 md:overflow-y-auto m-[auto]">
        {children}</div>
    </div>
  );
}