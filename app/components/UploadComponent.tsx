import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

const UploadComponent: React.FC<{
  onUploadComplete: (url: string) => void;
}> = ({ onUploadComplete }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const result = loadEvent.target?.result;
          if (typeof result === "string") {
            // Call the onUploadComplete prop with the new image URL
            onUploadComplete(result);
          }
        };
        reader.readAsDataURL(file);

        // Upload file logic goes here (e.g., upload to S3)
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`inline-flex flex-col items-center py-3 px-3 rounded-lg border-[3px] border-dashed ${
        isDragActive ? "border-primary bg-base-200" : "border-base-300"
      } cursor-pointer`}
    >
      <input {...getInputProps()} />
      <FontAwesomeIcon icon={faCloudArrowUp} className="text-lg" />
      <div className="mt-2">
        <span className="text-primary font-semibold">Click to Upload</span> or
        drag and drop
      </div>
      <p className="text-sm mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
    </div>
  );
};

export default UploadComponent;
