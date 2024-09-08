"use client"
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Category, Location } from "@/app/lib/definitions";
export default function Locations({ cabins, categories }: { cabins: any, categories: any }) {
    const searchParams = useSearchParams()
    const cabin = searchParams.get('id')
    const category = searchParams.get('category')

    function handleCabin(value: string) {
        console.log(value)
    }

    function handleCategory(value:string) {
        console.log(value)
    }

    return (
        <div className="w-7/12 m-[auto] pt-10">
            <div className="flex">
                <div>
                    Cabins: &nbsp;
                </div>
                <div className="flex ">
                    {cabins.map((item: Location, index: number) => (
                        <div key={"cabin"+index} className="mr-1">
                            <input name="cabin" type="radio" key={item.location_id} id={item.location_name} value={item.location_id} onChange={(e) => handleCabin(e.target.value)} />
                            <label htmlFor={item.location_name}>{item.location_name}</label>
                        </div>
                    ))}
                </div>
            </div>


            <div className="flex mt-5">
                <div>
                    Resource: &nbsp;
                </div>
                <div className="flex">
                    {categories.map((item: Category,index:number) => (
                        <div key={"cate-"+index} className="mr-1">
                            <input name="category" type="radio" value={item.category_id} id={item.category_name} onChange={(e) => handleCategory(e.target.value)} />
                            <label htmlFor={item.category_name}>{item.category_name}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
