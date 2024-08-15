import React, { InputHTMLAttributes } from "react";
import { NumericFormat } from "react-number-format";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  isCurrency?: boolean;
  defaultValue?: any;
  name?: any;
  isOptional?: boolean;
  onChange?: any;
  maxNumber?: any;
  minNumber?: any;
  onValueChange?: any;
};

export default function Input(props: Props) {
  const { label, isCurrency, defaultValue, name, isOptional, onChange, maxNumber, onValueChange, minNumber } = props;
  return (
    <div className="my-2 flex flex-col w-full">
      {label && (
        <label htmlFor={label} className="text-gray-500">
          {label}{" "}
          {isOptional && (
            <strong className="text-xs text-orange-500">(Optional)</strong>
          )}
        </label>
      )}
      {isCurrency ? (
        <NumericFormat
          className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6"
          defaultValue={defaultValue}
          onChange={onChange}
          onValueChange={onValueChange}
          min={minNumber}
          name={name}
          id={name}
          thousandSeparator="."
          decimalSeparator=","
          placeholder="0"
          isAllowed={maxNumber}
          allowNegative={false}
        />
      ) : (
        <input
          id={label}
          {...props}
          className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6"
        />
      )}
    </div>
  );
}
