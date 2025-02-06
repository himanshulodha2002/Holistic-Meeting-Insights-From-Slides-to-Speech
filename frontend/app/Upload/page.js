"use client";
import React, { useState, useRef } from "react";

function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    video: null,
    meetingName: "",
    dateTime: "",
    topic: "",
    duration: "",
    host: "",
    attendees: "",
    otherInfo: "",
  });

  const [selectedFileName, setSelectedFileName] = useState(""); // State to store selected file name
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setSelectedFileName(files[0]?.name || ""); // Update file name state
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true); // Start showing "Uploading..."

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch("http://localhost:8000/process/", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          video: null,
          meetingName: "",
          dateTime: "",
          topic: "",
          duration: "",
          host: "",
          attendees: "",
          otherInfo: "",
        });
        setSelectedFileName(""); // Reset file name after submission
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }

    setIsUploading(false); // Reset button text after submission
  };

  return (
    <div className="max-w-[80%] mx-auto bg-gray-100 bg-opacity-5 p-6 rounded-lg shadow-md my-10">
      <h1 className="text-4xl font-bold text-center text-white mb-4">
        Submit Your Details
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap">
        {/* Left Side: Video Upload and Submit Button */}
        <div className="w-full md:w-1/2 pr-2 ">
          <div className="mb-4 sticky top-20 ">
            <div>
              <label className="block text-gray-100 text-lg ml-4">
                Upload Video
              </label>
              <div className="bg-gray-100 bg-opacity-15 w-full h-64 mt-1 p-2 border-slate-700 rounded flex items-center justify-center relative rounded-2xl">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="shadow-2xl inline-flex items-center px-5 py-4 text-base font-medium text-center text-white bg-gray-800 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-800 transform transition-transform duration-200 hover:translate-y-[-2px]"
                >
                  {selectedFileName ? selectedFileName : "Choose File"}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isUploading} // Disable button while uploading
            className="shadow-2xl inline-flex justify-center items-center w-full px-5 py-4 text-base font-medium text-center text-white bg-gray-800 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-800 transform transition-transform duration-200 hover:translate-y-[-2px] w-[80%] sticky top-[25rem]"
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>

        {/* Right Side: Form Fields */}
        <div className="w-[90%] md:w-1/2 pl-2">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Meeting Name", name: "meetingName", type: "text" },
            { label: "Date & Time", name: "dateTime", type: "datetime-local" },
            { label: "Topic", name: "topic", type: "text" },
            { label: "Duration", name: "duration", type: "text" },
            { label: "Host", name: "host", type: "text" },
            { label: "Attendees", name: "attendees", type: "text" },
            { label: "Other Info", name: "otherInfo", type: "text" },
          ].map(({ label, name, type }) => (
            <div className="p-4" key={name}>
              <label className="block text-gray-100 mb-2">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full mt-1 p-2 border-slate-700 rounded bg-gray-100 bg-opacity-15 rounded-xl"
                required
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default HomePage;
