import { FolderCheckIcon, FolderUpIcon, UploadCloudIcon } from "lucide-react";
import React, { useRef } from "react";

interface Props {
  label: string;
  onChange: any;
  name: string;
  defaultValue: any;
  image: any;
}

export default function FileUpload(props: Props) {
  const { label, onChange, name, defaultValue, image } = props;
  const uploadRef = useRef<any>(null);
  return (
    <div>
      <label htmlFor={label} className="text-gray-500">
        {label}
      </label>
      <button
        id={label}
        type="button"
        onClick={() => {
          uploadRef.current.click();
        }}
        className="border rounded w-full h-[200px] flex justify-center items-center"
      >
        {image ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <FolderCheckIcon className="w-10 h-10 text-green-500" />
            <a href={image?.preview} target="_blank" className="font-semibold text-green-500" >Berhasil Upload</a>
          </div>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center">
            <FolderUpIcon className="w-10 h-10 text-blue-500" />
            <p>Upload Disini</p>
            <a href={image?.preview} target="_blank">Lihat</a>
          </div>
        )}
      </button>
      <input
        type="file"
        ref={uploadRef}
        onChange={onChange}
        className="hidden"
        name={name}
        accept="image/*"
      />
    </div>
  );
}
