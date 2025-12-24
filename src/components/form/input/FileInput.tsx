import { FC, useRef, useState } from "react";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { AttachFileRounded } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

interface FileInputProps {
  id?: string;
  name?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  iconOnly?: boolean;

  resetKey?: string | number;
}

const FileInput: FC<FileInputProps> = ({
  id,
  name = "image",
  className = "",
  onChange,
  accept = "image/*",
  iconOnly = false,
  resetKey

}) => {
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [nameFile, setnameFile] = useState<FileList | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File | null): boolean => {
    if (!file) {
      setError("File is required");
      return false;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    const allowsPdf = accept.includes("application/pdf");
    const allowsImage = accept.includes("image/");

    if ((isPdf && !allowsPdf) || (isImage && !allowsImage) || (!isPdf && !isImage)) {
      setError("Only allowed file types are: " + accept);
      return false;
    }

    // Specific image validation
    if (isImage) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedImageTypes.includes(file.type)) {
        setError("Only JPG, JPEG, PNG images are allowed!");
        return false;
      }
    }

    if (file.size > maxSizeInBytes) {
      setError("File size must be less than 1MB!");
      return false;
    }

    setError("");
    return true;
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setnameFile(event.target.files);

    if (validateFile(file)) {
      setFileName(file!.name);
      onChange?.(event);
    } else {
      setFileName("");
      if (event.target) event.target.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;

    if (validateFile(file)) {
      setFileName(file!.name);

      const dt = new DataTransfer();
      dt.items.add(file!);
      if (inputRef.current) {
        inputRef.current.files = dt.files;

        const syntheticEvent = {
          ...event,
          target: inputRef.current,
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        onChange?.(syntheticEvent);
      }
    }
    setIsDragOver(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <Tooltip title="Attach files" placement="left" arrow>
      <div className="relative">
        <input
          type="file"
          id={id}
          name={name}
          accept={accept}
          onChange={handleFileChange}
          ref={inputRef}
          className={`hidden ${className}`}
          multiple
        />
        {iconOnly ? (
          <label htmlFor={id} className="cursor-pointer text-blue-600 hover:text-blue-800">
            <AttachFileRounded fontSize="medium" />
          </label>
        ) : (
          <label
            htmlFor={id}
            className={`cursor-pointer text-gray-400 hover:text-gray-600 flex items-center gap-2 border-b-1 border-gray-300 px-2 py-1 min-w-[400px] ${isDragOver ? "border-blue-500 bg-blue-100" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {fileName ? (
              <span className="text-sm text-gray-500 font-medium">{fileName}</span>
            ) : (
              <>
                <span>Drag & Drop or Click to Upload</span>
                <AddPhotoAlternateIcon />
              </>
            )}
          </label>
        )}


        {error ? (
          <p className="mt-1.5 text-xs text-red-600">{error}</p>
        ) : fileName ? (
          <p className="mt-1.5 text-xs text-gray-500 font-medium">
            {/* Selected File:{" "} */}
            {nameFile &&
              Array.from(nameFile).map((file, index) => (
                <span key={index}>{file.name},&nbsp; </span>
              ))}
          </p>
        ) : (
          <p className="mt-1 text-xs text-gray-400 italic">
            * File size should be up to 1 MB
          </p>
        )}
      </div>
    </Tooltip>
  );
};

export default FileInput;
