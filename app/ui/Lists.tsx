import { useState } from "react";
import Image from "next/image";
import eg2 from "../../public/eg2.jpg"
import RadioButton from "./RadioButton";
// import Banner from "../components/Banner";
// import List from "../components/List";
// import Log from "../components/Log";´
export default function Lists() {
    const cabins = ["Jelsa", "Hønefoss"]
    const types = ["food", "bed sheets", "others"]
    return (
        <div className="w-9/12 m-[auto]">
            <div className="text-center text-3xl font-bold pt-6">
                The Resource Record
            </div>
            <div className="selections pt-16">
                <Options data={cabins} name="Cabins" />
                <Options data={types} name="Resources" />
            </div>
            <div className="flex">
                <div className="text-right">lated updated by: njål</div>
            </div>
        </div>
    );
}

function Options(props: any) {
    const { data, name } = props
    const [selectedValue, setSelectedValue] = useState('');

    const handleRadioChange = (e: any) => {
        setSelectedValue(e.target.value);
    };

    return (
        <div className="radio-buttons">
            <span className="mr-4">{name}</span>
            {
                data.map((item: string, index: number) => {
                    return (
                        <RadioButton
                            label={item}
                            value={item}
                            key={item + index}
                            selectedValue={selectedValue}
                            onChange={handleRadioChange}
                        />
                    )
                })
            }
        </div>
    );
}


