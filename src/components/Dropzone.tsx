import { message } from "antd";
import React from "react";
import { uploadAsset } from "../utils";

type Props = {
  onDrop: (image: string) => void;
};

function Dropzone({ onDrop }: Props) {
  const [loading, setLoading] = React.useState(false);
  const onChange = (e: any) => {
    if (!e.target.files[0]) return;
    setLoading(true);
    const file = e.target.files[0];
    uploadAsset(file)
      .then((url) => {
        setLoading(false);
        if (url) {
          onDrop(url);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        message.error("Upload failed, try again");
      });
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
          {loading ? "Uploading..." : "Drop an image here"}
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
