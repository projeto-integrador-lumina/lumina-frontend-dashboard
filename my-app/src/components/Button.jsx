"use client";
import React from "react";

const Button = ({ type = "submit", color = 'bg-salmao', colorHover = 'hover:bg-turquesa', textColor = 'text-white', textColorHover, id, label, onClick, border, borderColor }) => {
  return (
    <>
      <button
        type={type} id={id} onClick={onClick}
        className={`p-3 md:p-4 md:text-lg rounded-full ${color} ${textColor} ${colorHover} ${border} ${borderColor} ${textColorHover} transition-colors text-center block cursor-pointer`}
      >
        {label}
      </button>
    </>
  );
};

export default Button;
