"use client";
import React, { useState, useEffect } from "react";

import Menu from "@/assets/icons/icon-menu-salmao.svg";
import Pesquisar from "@/assets/icons/icon-search.svg";
import Notificacao from "@/assets/icons/icon-notif.svg";

const Navbar = ({ onToggleMenu }) => {
  const [dataHora, setDataHora] = useState("");

  useEffect(() => {
    const atualizarDataHora = () => {
      const agora = new Date();
      const opcoes = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      setDataHora(agora.toLocaleDateString("pt-BR", opcoes));
    };

    atualizarDataHora();
    const interval = setInterval(atualizarDataHora, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow-lg h-20 lg:h-25 xl:h-25 flex justify-between lg:justify-end items-center px-10 text-text font-jakarta">
      <div className="flex flex-col lg:hidden">
        <button
          type="button"
          onClick={onToggleMenu}
          className="transition-all active:scale-95 cursor-pointer"
        >
          <img src={Menu.src || Menu} className="w-7 h-auto" alt="Menu" />
        </button>
      </div>

      <div className="w-full px-2 hidden items-center lg:block">
        <h1 className="xl:text-xl xl:font-semibold">Painel Administrativo</h1>
        <p className="text-sm capitalize text-text/60">
          {dataHora}
        </p>
      </div>

      <div className="flex gap-7 items-center">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-0 opacity-0 transition-all duration-300 focus:outline-none text-sm bg-transparent border-none p-0 text-gray-700 lg:w-80 lg:opacity-100"
          />
          <button type="button" className="cursor-pointer">
            <img
              src={Pesquisar.src || Pesquisar}
              className="w-5 h-auto"
              alt="Pesquisar"
            />
          </button>
        </div>

        <button type="button" className="cursor-pointer">
          <img
            src={Notificacao.src || Notificacao}
            className="w-5 h-auto"
            alt="Notificação"
          />
        </button>
      </div>
    </div>
  );
};

export default Navbar;