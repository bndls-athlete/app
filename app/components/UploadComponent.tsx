"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

const UploadComponent: React.FC<{
  onUploadComplete: (url: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
}> = ({ onUploadComplete, file, setFile }) => {
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        setError("File is too large or not an acceptable image format");
        setFile(null);
      } else {
        const file = acceptedFiles[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
            const result = loadEvent.target?.result;
            if (typeof result === "string") {
              onUploadComplete(result);
            }
          };
          reader.readAsDataURL(file);
          setFile(file);
          setError("");
        }
      }
    },
    [onUploadComplete, setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 500 * 1024, // 500KB
    accept: {
      "image/svg+xml": [".svg"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`inline-flex flex-col items-center py-4 px-4 rounded-lg border-2 border-dashed ${
        isDragActive ? "border-primary bg-base-200" : "border-base-300"
      } cursor-pointer`}
    >
      <input {...getInputProps()} />
      <FontAwesomeIcon
        icon={faCloudUploadAlt}
        className="w-6 h-6 text-primary"
      />
      <div className="mt-2 text-sm font-medium text-gray-700">
        <span className="text-primary">Click to upload</span> or drag and drop
      </div>
      <p className="text-xs mt-1" style={{ color: error ? "red" : "gray" }}>
        {error || "SVG, PNG, JPG or GIF (max. 500KB)"}
      </p>
    </div>
  );
};

export default UploadComponent;
