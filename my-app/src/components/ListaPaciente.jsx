"use client";
import React from "react";
import Link from "next/link";

//assets
import Eye from "@/assets/icons/eye.svg";
import Editar from "@/assets/icons/editar.svg";
import Excluir from "@/assets/icons/excluir.svg";

const ListaPaciente = ({ imagem, nome, sobrenome, nivel, status }) => {
  return (
    <>
      <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[3fr_1fr_1fr] xl:grid-cols-[3fr_1fr_1fr_1fr] items-center px-4 md:px-8 py-4 md:py-5 border-b border-text/5 hover:bg-text/5 transition text-sm md:text-base">
        <span className="flex gap-2 md:gap-3 items-center min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
            <img
              src={imagem}
              className="w-full h-full object-cover"
              alt="Foto do paciente"
            />
          </div>
          <p className="truncate">
            {nome}
            <span className="hidden sm:inline">{sobrenome}</span>
          </p>
        </span>

        <span className="text-text/70">Nível {nivel}</span>

        <span className="hidden xl:block text-text/70">{status}</span>

        <span className="flex gap-1.5 md:gap-2">
          <Link
            href="#"
            className="p-2 md:p-3 bg-amarelo hover:bg-amarelo/75 rounded-lg transition sm:flex items-center justify-center"
          >
            <img src={Eye.src || Eye} className="w-3 md:w-4" />
          </Link>
          <Link
            href="/paciente/alterar"
            className="p-2 md:p-3 bg-turquesa hover:bg-turquesa/75 rounded-lg transition flex items-center justify-center"
          >
            <img src={Editar.src || Editar} className="w-3 md:w-4" />
          </Link>
          <Link
            href="/paciente/excluir"
            className="p-2 md:p-3 bg-salmao hover:bg-salmao/75 rounded-lg transition flex items-center justify-center"
          >
            <img src={Excluir.src || Excluir}className="w-3 md:w-4" />
          </Link>
        </span>
      </div>
    </>
  );
};

export default ListaPaciente;
