"use client";
import React from "react";

// assets
import SetaBaixo from "@/assets/icons/seta-baixo-salmao.svg";

const Selectbox = ({ label, name, value, onChange, options = [], placeholder = "Selecione uma opção", required = false, className = "",
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border border-text/25 rounded-3xl px-4 py-3 shadow-sm appearance-none bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat focus:outline-none focus:ring-turquesa focus:ring-1 text-sm text-text bg-white cursor-pointer ${className}`}
        style={{ backgroundImage: `url(${SetaBaixo.src || SetaBaixo})` }}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : null}
      </select>
    </div>
  );
};

export default Selectbox;