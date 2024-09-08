import Locations from "../ui/dashboard/locations";
import { fetchLocation,fetchCategory } from "@/app/lib/data";

import '@/app/ui/global.css'
export default async function Layout({ children }: { children: React.ReactNode }) {
  const cabins = await fetchLocation();
  const categories = await fetchCategory()
  return (
    <div>
      <div className="text-center text-3xl font-bold pt-6">
        The Resource Record
      </div>
      <Locations cabins={cabins} categories={categories} />

      <hr className="m-4" />
      <div className="flex-grow w-9/12 md:overflow-y-auto m-[auto]">
        {children}</div>
    </div>
  );
}