"use client";
import React from "react";

const Input = ({ label, placeholder, type, name, value, onChange }) => {
  return (
    <>
      <label className="text-sm md:text-base font-medium">{label}</label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full p-3 md:p-4 border border-input-gray shadow-sm bg-white rounded-2xl text-sm md:text-base focus:outline-none focus:ring-turquesa focus:ring-1"
      />
    </>
  );
};

export default Input;
