import React from "react";

interface Props {
  options: any[];
  label?: string;
  name: string;
  id: string;
}

interface RadioValue {
  name: string;
  value: any;
  checked: boolean;
  onChange?: () => void;
}

export default function Radio(props: Props) {
  const { options, label, name, id } = props;
  return (
    <div className="mt-2">
      <label htmlFor={id} className="text-gray-500">{label}</label>
      <div className=" flex justify-between border">
        {options?.map((v: RadioValue, i: number) => (
          <div key={i} className="w-full border p-2">
            <input type={'radio'} name={name} value={v.value} defaultChecked={v.checked} onChange={v.onChange} />
            <span className="ml-2">{v.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
