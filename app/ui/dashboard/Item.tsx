import { useState } from "react";
interface ItemProps {
  id: string;
  name: string;
}




export default function Item({ item, selects }: ItemData & any) {
  const [checked, setChecked] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleCheck = () => {
    setChecked(!checked)
    selects(item.id)
  };

  const increaseQuantity = () => setQuantity(quantity + 1);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <li className="flex items-center justify-between py-2 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={item.id}
          checked={checked}
          onChange={handleCheck}
          className="mr-3"
        />
        <label htmlFor={item.id} className="text-lg font-medium">
          {item.name}
        </label>
      </div>
      <div className="flex items-center">
        <button
          onClick={decreaseQuantity}
          disabled={quantity === 1}
          className={`${quantity === 1 ? "bg-gray-300" : "bg-blue-500"
            } text-white py-1 px-2 rounded-lg disabled:opacity-50`}
        >
          -
        </button>
        <span className="mx-3 text-lg">{quantity}</span>
        <button
          onClick={increaseQuantity}
          className="bg-blue-500 text-white py-1 px-2 rounded-lg"
        >
          +
        </button>
      </div>
    </li>
  );
};
