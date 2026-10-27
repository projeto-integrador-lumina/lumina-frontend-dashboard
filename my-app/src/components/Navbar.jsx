"use client";
import React from "react";

//assets
import Menu from "@/assets/icons/icon-menu-salmao.svg";
import Pesquisar from "@/assets/icons/icon-search.svg";
import Notificacao from "@/assets/icons/icon-notif.svg";

const Navbar = () => {
  return (
    <div className="bg-white shadow-lg h-20 lg:h-25 xl:h-25 flex justify-between lg:justify-end items-center px-10 text-text font-jakarta">
      <div className="flex flex-col lg:hidden">
        <button
          id="menu-toggle"
          className="transition-all active:scale-95 cursor-pointer"
        >
          <img src={Menu.src || Menu} className="w-7 h-auto" alt="Menu"></img>
        </button>
      </div>
      <div className="w-full px-2 hidden items-center lg:block">
        <h1 className="xl:text-xl xl:font-semibold">Painel Administrativo</h1>
        <p className="text-sm" id="data-atual">
          Hora
        </p>
      </div>
      <div className="flex gap-7">
        <div
          id="fundo-pesquisar"
          className="flex items-center bg-white rounded-full transition-all duration-300 px-2 lg:hidden"
        ></div>
        <div className="flex items-center">
          <input
            id="input-pesquisar"
            type="text"
            placeholder="Pesquisar..."
            className="w-0 opacity-0 transition-all duration-300 focus:outline-none text-sm bg-transparent border-none p-0 text-gray-700 lg:w-100 lg:opacity-100"
          ></input>
          <button id="btn-pesquisar">
            <img
              src={Pesquisar.src || Pesquisar}
              className="w-5 h-auto"
              alt="Pesquisar"
              id="notif"
            ></img>
          </button>
        </div>
        <img
          src={Notificacao.src || Notificacao}
          className="w-5 h-auto"
          alt="Notificação"
          id="notif"
        ></img>
      </div>
    </div>
  );
};

export default Navbar;
