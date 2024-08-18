'use client'

import { useState } from "react";
import Item from '@/app/ui/dashboard/Item'


export default function Page() {
    const [showAdd, setShowAdd] = useState(false)
    // actual data base don't include <select>, added afterwards.
    const [exist, setExist] = useState([
        {
            id: "111",
            name: "tomato can",
            quantity: 2,
            select: false

        },
        {
            id: "222",
            name: "meat ball",
            quantity: 2,
            select: false

        }
    ])
    const [want, setWant] = useState([
        {
            id: "1131",
            name: "sugar",
            quantity: 2,
            select: false

        },
        {
            id: "2225",
            name: "milk",
            quantity: 2,
            select: false

        }
    ])


    const moveItemToWant = () => {
        const selected = exist.filter((i) => i.select)
        setExist(exist.filter((i) => !i.select));
        setWant([...want, ...selected.map(item => ({ ...item, select: false }))]);
        console.log(selected)
    };

    const moveItemToExist = () => {
        const selected = want.filter((i) => i.select)
        setWant(want.filter((i) => !i.select));
        setExist([...exist, ...selected.map(item => ({ ...item, select: false }))]);
    };

    const selectExists = (id: string) => {
        setExist(
            exist.map((item) =>
                item.id === id ? { ...item, select: !item.select } : item
            )
        );
        console.log(exist)
    }

    const selectWant = (id: string) => {
        setWant(
            want.map((item) =>
                item.id === id ? { ...item, select: !item.select } : item
            )
        );
    }

    const addItem = () => {
        setShowAdd(!showAdd)
    }
    const deleteSelect = () => {

    }
    const saveChange = () => {

    }
    return <div>
        <div className="flex justify-between mb-4">
            <button className="bg-btn border-black  hover:bg-black hover:text-white" onClick={addItem}>Add Item</button>
            <div className="">
                <button className="bg-btn btn-red" onClick={deleteSelect}>Delete</button>
                <button className="bg-btn btn-green" onClick={saveChange}>Save</button>
            </div>
        </div>
        {showAdd && <AddItem cancelAdd={addItem} /> }
        <div className="flex w-full my-10">
            <div className="flex-1">
                <h1 className="text-center text-lg font-bold">Exist</h1>
                <ul className="border border-solid border-black/30 rounded-r-sm px-4 py-2 min-h-80">
                    {
                        exist.map((item: ItemData) => {
                            return <Item key={item.id} item={item} selects={selectExists} />
                        })
                    }
                </ul>
            </div>
            <div id="move-btns" className="flex flex-col justify-center">
                <button className="sm-btn" onClick={moveItemToWant}> {">"} </button>
                <button className="sm-btn" onClick={moveItemToExist}> {"<"} </button>
            </div>
            <div className="flex-1">
                <h1 className="text-center text-lg font-bold">WANT</h1>
                <ul className="border border-solid border-black/30 rounded-r-sm px-4 py-2 min-h-80">
                    {
                        want.map((item: ItemData) => {
                            return <Item key={item.id} item={item} selects={selectWant} />
                        })
                    }
                </ul>
            </div>
        </div>;
    </div>
}


function AddItem({cancelAdd}:any) {
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState<number>(0)
    const [type, setType] = useState('exist')
    function sendItem(e:any)
    {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        
        const formData = new FormData(form);
    
        // You can pass formData as a fetch body directly:
        // fetch('/some-api', { method: form.method, body: formData });
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson.quantity);
    }

    return <form method="post" onSubmit={sendItem} className="w-4/5 m-[auto] border border-gray-600 rounded-md pt-10 pb-4 px-10">
        <div className="flex">
            <div className="mx-2">
                <label htmlFor="name" className="block">Name</label>
                <input type="text" name="name" className="sm-input"></input>
            </div>
            <div className="mx-2">
                <label htmlFor="quantity" className="block">Quantity</label>
                <input type="number" name="quantity" className="sm-input w-20"></input>
            </div>
            <div className="mx-2">
                <legend className="block mb-1">
                    Type
                </legend>
                <div className="flex">
                    <div className="mx-1">
                        <input type="radio" name="type" className="mr-1" defaultChecked></input>
                        <label htmlFor="exist">EXIST</label>
                    </div>
                    <div>
                        <input type="radio" name="type" className="mx-1"></input>
                        <label htmlFor="want">WANT</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-right">
            <button className="bg-btn btn-green py-1" type="submit">Confirm</button>
            <button className="bg-btn btn-red py-1" onClick={cancelAdd} type="button">Cancel</button>
        </div>
    </form>
}