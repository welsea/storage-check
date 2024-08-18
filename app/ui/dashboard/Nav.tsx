import Options from "@/app/ui/dashboard/Options";
export default function Nav() {
    const cabins = ["Jelsa", "Hønefoss"]
    const types = ["food", "bed sheets", "others"]
    return (
        <div className="w-9/12 m-[auto]">
            <div className="selections pt-16">
                <Options data={cabins} name="Cabins" />
                <Options data={types} name="Resources" />
            </div>
        </div>
    );
}