import { message } from "antd";
import React from "react";
import { getBase64 } from "../utils";

type Props = {
  onDrop: (image: string) => void;
};

function Dropzone({ onDrop }: Props) {
  const onChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      getBase64(file, (url) => {
        onDrop(url);
      });
    } else {
      message.error("Failed to upload, try again");
    }
  };
  return (
    <div className="flex flex-col">
      <label
        htmlFor="dropzone-file"
        className="mx-auto flex w-full max-w-lg cursor-pointer flex-col items-center rounded-lg border border-dashed border-gray-400 bg-white p-6 text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <h2 className="mt-4 text-xl font-medium tracking-wide text-gray-700">
          Image File
        </h2>

        <p className="mt-2 tracking-wide text-gray-500">
          Upload an SVG, PNG, JPG or GIF image
        </p>

        <input
          id="dropzone-file"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onChange}
        />
      </label>
    </div>
  );
}

export default Dropzone;
