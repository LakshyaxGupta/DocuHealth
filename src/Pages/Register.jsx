import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    aadharnumber: "",
  });

  const [qrval, setQrval] = useState(""); // Store the QR code image URL

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the URL for the Google Form with pre-filled data
    const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfZtumeav3JdAN_488eiX1ksf2UNKPtyWHygQnpoilmn6pEGA/viewform?usp=pp_url";
    const formUrl = `${baseUrl}&entry.1042576285=${encodeURIComponent(formData.name)}&entry.1183227138=${encodeURIComponent(formData.age)}&entry.1349039500=${encodeURIComponent(formData.gender)}&entry.2081151646=${encodeURIComponent(formData.contact)}&entry.205146591=${encodeURIComponent(formData.address)}`;

    // Now generate the QR code with the form URL
    try {
      const response = await axios.post("http://127.0.0.1:5000/submit", { url: formUrl });

      console.log("QR code generated successfully:", response.data);

      // Assuming the backend returns the path to the generated QR image file
      const qrImageUrl = `http://localhost:5000/qrs/${encodeURIComponent(response.data.qr_filename)}`;
      setQrval(qrImageUrl); // Set the QR image URL to state
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center min-h-screen w-full bg-neutral-800">
      {/* Navbar */}
      <nav className="w-full bg-green-700 text-white py-3">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl">DocuHealth</h1>
        </div>
      </nav>

      <div className="flex justify-center items-center h-full">
        {/* Patient Registration Form */}
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-lg border-2 flex justify-center border-green-700 shadow-green-700 shadow-0 m-4 mt-10">
        <div className="w-full">
          <h2 className="text-3xl text-green-700 font-bold mb-6 text-center">
            Patient Registration
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded"
              required
            ></textarea>
            <textarea
              name="aadharnumber"
              placeholder="Aadhar Number"
              value={formData.aadharnumber}
              onChange={handleChange}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-black hover:border-green-700"
            >
              Register Patient
            </button>
          </form>
        </div>
      </div>

      {/* Show QR Code Image if it exists */}
      {qrval && (
        <div className="mt-4">
          <h3 className="text-center text-xl text-green-700">Generated QR Code:</h3>
          <img
            src={qrval}
            alt="Generated QR Code"
            className="mx-auto mt-2 w-1/2"
          />
        </div>
      )}
      </div>
    </div>
  );
}

export default Register;
