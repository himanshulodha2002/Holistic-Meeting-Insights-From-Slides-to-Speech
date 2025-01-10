"use client";
import React, { useState } from "react";

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        }); // Reset form
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-100 bg-opacity-5 p-6 rounded-lg shadow-md my-10">
      <h1 className="text-xl font-bold text-center text-white mb-4">
        Submit Your Details
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Video Upload */}
        <div className="mb-4">
          <label className="block text-gray-100">Upload Video</label>
          <div className="bg-gray-100 bg-opacity-15 w-full h-64 mt-1 p-2 border-slate-700 rounded flex items-center justify-center relative">
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Choose File
            </button>
          </div>
        </div>

        {/* Form Fields */}
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
          <div className="mb-4" key={name}>
            <label className="block text-gray-100">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full mt-1 p-2 border-slate-700 rounded bg-gray-100 bg-opacity-15"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default HomePage;
