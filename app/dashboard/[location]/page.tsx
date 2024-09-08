import { fetchCategory } from "@/app/lib/data"
export default async function Page() {
    const categories = await fetchCategory()
    return <div>
        {categories.map((item: any,index) => {
            return <div key={index}>{item.category_name}</div>
        })}
    </div>
}