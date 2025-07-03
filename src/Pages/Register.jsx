import React, { useState } from "react";
import axios from "axios";

import { ID } from "appwrite";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    aadharnumber: "",
  });
 

  const [qrval, setQrval] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting with:", formData);


    // 2. Construct Google Form URL with prefilled data (your existing logic)
    const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfZtumeav3JdAN_488eiX1ksf2UNKPtyWHygQnpoilmn6pEGA/viewform?usp=pp_url";
    const formUrl = `${baseUrl}&entry.1042576285=${encodeURIComponent(formData.name)}&entry.1183227138=${encodeURIComponent(formData.age)}&entry.1349039500=${encodeURIComponent(formData.gender)}&entry.2081151646=${encodeURIComponent(formData.contact)}&entry.205146591=${encodeURIComponent(formData.address)}`;

    // 3. Call your backend to generate QR code
    const response = await axios.post("http://127.0.0.1:5000/submit", { url: formUrl });

    setQrval(response.data.qr_url);

    setMessage("Patient QR code generated successfully!");
  } catch (error) {
    console.error("Error during registration:", error);
    setMessage(error.message || "Failed to register user.");
  }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-neutral-800 ">
      {/* Navbar */}
      <nav className="w-full bg-green-700 text-white py-1">
        <div className="flex justify-center items-center">
          <h1 className="text-2xl">DocuHealth</h1>
        </div>
      </nav>

      <div className="flex flex-col items-center w-full max-w-xl flex-grow overflow-hidden">
        {/* Patient Registration Form */}
        <div className="bg-neutral-800 p-3 rounded-lg shadow-lg w-full border-2 border-green-700 m-4">
          <h2 className="text-2xl text-green-700 font-bold mb-3 text-center">
            Patient Registration
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded"
              required
            />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded resize-none"
              required
              rows={3}
            ></textarea>
            <textarea
              name="aadharnumber"
              placeholder="Aadhar Number"
              value={formData.aadharnumber}
              onChange={handleChange}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded resize-none"
              rows={2}
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-black hover:border-green-700"
            >
              Register Patient
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-red-500 break-words">{message}</p>
          )}
        </div>

        {/* Show QR Code Image if it exists */}
        {qrval && (
          <div className="mt-4 w-full max-w-md">
            <h3 className="text-center text-xl text-green-700">Generated QR Code:</h3>
            <img
              src={qrval}
              alt="Generated QR Code"
              className="mx-auto mt-2 w-full max-w-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}


export default Register;
