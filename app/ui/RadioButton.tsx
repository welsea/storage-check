export default function RadioButton(props:any) {
    const {value,selectedValue,onChange}=props
    return (
        <label className={`radio-button ${selectedValue === value ? 'selected' : ''}`}>
            <input
                type="radio"
                value={value}
                checked={selectedValue === value}
                onChange={onChange}
            />
            {(value as string).toUpperCase()}
        </label>
    );
};