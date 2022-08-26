import { message } from "antd";
import React from "react";

type Props = {
  onDrop: (image: string) => void;
};

function Dropzone({ onDrop }: Props) {
  const onChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);
        fetch(
          `https://api.imgbb.com/1/upload?key=ee7c137fe267b7629568e66f73617e87`,
          {
            method: "POST",
            body: formData,
          }
        )
          .then((response) => response.json())
          .then(({ data }) => resolve(data.url))
          .catch(() => reject("Upload failed"));
      })
        .then((url) => {
          onDrop(url);
        })
        .catch(() => {
          message.error("Upload failed");
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
