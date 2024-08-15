import React, { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  isOptional?: boolean;
};

export default function TextArea(props: Props) {
  const { label, isOptional } = props;
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
      <textarea
        id={label}
        {...props}
        className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6"
      />
    </div>
  );
}
