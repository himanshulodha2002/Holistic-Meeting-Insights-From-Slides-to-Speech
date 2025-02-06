"use client"; // Required for using state and effects in App Router

import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage("Message sent successfully!");
        setFormData({ email: "", phone: "", message: "" });
      } else {
        setResponseMessage("Error sending message. Please try again.");
      }
    } catch (error) {
      setResponseMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center my-24">
        <div className="bg-slate-600 bg-opacity-35 shadow-lg rounded-lg p-6 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-slate-600 bg-opacity-35"
                placeholder="Your email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-200"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-slate-600 bg-opacity-35"
                placeholder="Your phone number"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-200"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-slate-600 bg-opacity-35"
                placeholder="Your message"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
          {responseMessage && (
            <p className="text-center mt-2 text-sm text-white">
              {responseMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
