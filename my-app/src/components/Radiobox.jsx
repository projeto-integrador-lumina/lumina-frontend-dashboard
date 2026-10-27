"use client";
import React from "react";

const Radiobox = ({ label, value, name, checked, onChange, required = false }) => {
  return (
    <div>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-text">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked} // controla se este radio está marcado
          onChange={onChange}
          required={required}
          className="w-5 h-5 accent-salmao focus:ring-0 cursor-pointer"
        />
        <span>{label}</span>
      </label>
    </div>
  );
};

export default Radiobox;