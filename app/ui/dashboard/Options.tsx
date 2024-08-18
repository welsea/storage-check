'use client'
import { useState } from "react";
import RadioButton from "../RadioButton";
import '@/app/ui/global.css'
export default function Options(props: any) {
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


