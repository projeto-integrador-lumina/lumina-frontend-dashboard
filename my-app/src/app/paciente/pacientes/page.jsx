"use client";
import React from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ListaPaciente from "@/components/ListaPaciente";

//assets
import Profile from "@/assets/profile.png";
import Add from "@/assets/icons/add.svg";
import Filtrar from "@/assets/icons/filtrar.svg";
import Back from "@/assets/icons/back.svg";

const Pacientes = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar></Sidebar>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40">
          <Navbar></Navbar>
        </header>

        <main className="text-text font-jakarta text-sm p-4 md:p-8 flex flex-col gap-4">
          <div className="hidden lg:block px-2">
            <p>
              Home / <a className="text-salmao font-semibold">Pacientes</a>
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/paciente/cadastro"
              className="px-4 py-3 bg-white shadow-lg rounded-xl flex items-center gap-2"
            >
              <img src={Add.src || Add}className="w-5" />
              <p className="sm:hidden">Cadastrar</p>
              <p className="hidden sm:block">Cadastrar Paciente</p>
            </Link>
            <a
              href=""
              className="px-4 py-3 bg-white shadow-lg rounded-xl flex items-center gap-2"
            >
              <img src={Filtrar.src || Filtrar} className="w-5" />
              <p>Filtrar</p>
            </a>

            <a
              href="/home"
              className="self-end sm:self-auto flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
            >
              <img src={Back.src || Back} alt="voltar" className="w-5" />
            </a>
          </div>
          {/*
          <div
            id="sucesso"
            className="bg-red-500 text-white px-4 py-3 rounded-lg mb-4"
          ></div>
          <div
            id="sucesso"
            className="bg-green-500 text-white px-4 py-3 rounded-lg mb-4"
          ></div>

          <div
            id="sucesso"
            className="bg-green-500 text-white px-4 py-3 rounded-lg mb-4"
          ></div>
          */}

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[3fr_1fr_1fr] xl:grid-cols-[3fr_1fr_1fr_1fr] font-semibold text-sm md:text-base border-b border-text/15 px-4 md:px-8 py-5">
              <span>Paciente</span>
              <span>Nível</span>
              <span className="hidden xl:block">Status</span>
              <span>Ações</span>
            </div>

            <ListaPaciente
              imagem={Profile.src || Profile}
              nome="Pedro "
              sobrenome="Henrique"
              nivel="1"
              status="Em andamento"
            ></ListaPaciente>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-8 py-5">
              <span className="text-text/50 text-xs md:text-sm">
                Mostrando pacientes
              </span>

              <div className="flex gap-1.5">
                <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-gray-200 opacity-30 cursor-not-allowed text-base">
                  &#8249;
                </button>
                <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-salmao bg-salmao text-white font-medium text-sm">
                  1
                </button>
                <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-turquesa hover:text-turquesa hover:bg-turquesa/10 transition text-sm">
                  2
                </button>
                <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-turquesa hover:text-turquesa hover:bg-turquesa/10 transition text-sm hidden sm:flex">
                  3
                </button>
                <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-turquesa hover:text-turquesa hover:bg-turquesa/10 transition text-sm hidden sm:flex">
                  4
                </button>
                <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-turquesa hover:text-turquesa hover:bg-turquesa/10 transition text-sm hidden sm:flex">
                  5
                </button>
                <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-turquesa hover:text-turquesa hover:bg-turquesa/10 transition text-base">
                  &#8250;
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pacientes;
