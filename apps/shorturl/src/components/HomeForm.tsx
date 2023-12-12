// components/Form.tsx
import React, { useState, ChangeEvent } from "react";
import "./styles/HomeForm.css";

interface FormProps {
  onGenerate: (data: {
    originalUrl: string;
    title: string;
    description: string;
    expiring: string;
  }) => void;
  loading:boolean;
}
// const getTodayDate=() => {
//   const today = new Date();
//   const year = today.getFullYear()+1;
//   const month = (today.getMonth() + 1).toString().padStart(2, "0");
//   const day = today.getDate().toString().padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }
const HomeForm: React.FC<FormProps> = ({ onGenerate,loading }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiring, setExpiring] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleGenerate = () => {
    // Validate the input
    if (!originalUrl) {
      setErrorMessage("Original URL is required");

      // Clear error message after 2 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);

      return;
    }

    // Check if the starting and expiring dates have a minimum difference of 24 hours
    const startTimestamp = new Date().getTime();
    const expireTimestamp = new Date(expiring).getTime();

    if (expireTimestamp - startTimestamp < 24 * 60 * 60 * 1000) {
      setErrorMessage(
        "The difference between starting and expiring dates must be at least 24 hours"
      );
      // Clear error message after 2 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);

      return;
    }

    // Clear error message
    setErrorMessage("");

    // Assuming here that you have a function passed as a prop to handle the generate action
    onGenerate({
      originalUrl,
      title,
      description,
      expiring,
    });

    // Reset form data
    setOriginalUrl("");
    setTitle("");
    setDescription("");
    setExpiring("");
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    switch (id) {
      case "originalUrl":
        setOriginalUrl(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "expiring":
        setExpiring(value);
        break;
      default:
        break;
    }
  };
  return (
    <div className="w-full h-[100vh] md:h-[80vh] flex justify-center items-center">
      <div className="w-full md:w-9/12 lg:w-5/12 shadow-lg p-4 md:p-8 bg-white rounded-2xl border border-gray-200 m-2 md:m-0">
        <div className="w-full grid grid-cols-2 gap-3">
          <div className="w-full text-center text-2xl font-medium col-span-2">
            <h1 className="text-blue-600">Create Your Short Url</h1>
          </div>
          <div className="w-full text-center text-md text-red-500 font-medium col-span-2">
            <span>{errorMessage?`Error: ${errorMessage}`:''}</span>
          </div>
          <div className="flex flex-col col-span-2 gap-1">
            <label className="relative text-md" htmlFor="originalUrl">
              <span>Original Url:</span>
              <span className="absolute right-[-2] top-0 text-red-500 text-xs">
                &#9733;
              </span>
            </label>
            <input
              className="p-2 bg-gray-100 rounded-md focus:outline-gray-300 text-sm text-gray-800"
              id="originalUrl"
              type="text"
              required={true}
              value={originalUrl}
              onChange={handleInputChange}
              placeholder="e.g: http://example.com/very/long?url"
            />
          </div>
          <div className="flex flex-col col-span-2 md:col-span-1 gap-1">
            <label className="relative text-md" htmlFor="title">
              Title (Optional):
            </label>
            <input
              className="p-2 bg-gray-100 rounded-md focus:outline-gray-300 text-sm text-gray-800"
              id="title"
              placeholder="e.g: Example Url"
              type="text"
              value={title}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col col-span-2 md:col-span-1 gap-1">
            <label className="relative text-md" htmlFor="expiring">
              Expiring Date (Optional):
            </label>
            <input
              className="p-2 bg-gray-100 rounded-md focus:outline-gray-300 text-sm text-gray-800"
              id="expiring"
              type="date"
              value={expiring}
              placeholder={"e.g: 22/3/2024"}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col col-span-2 gap-1">
            <label className="relative text-md" htmlFor="description">
              Description (Optional):
            </label>
            <textarea
              rows={4}
              className="p-2 bg-gray-100 rounded-md focus:outline-gray-300 text-sm text-gray-800"
              id="description"
              placeholder="i.e URL description..."
              value={description}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end items-center">
          <button
            className="px-2 py-2 bg-blue-600 hover:bg-blue-900 text-white rounded-md font-medium"
            type="button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading?'Loading...':'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomeForm;
