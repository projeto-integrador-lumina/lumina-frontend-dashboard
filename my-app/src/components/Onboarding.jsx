"use client";
import React from "react";

//assets
import Logo from "@/assets/logo/logo-variante-turquesa.svg";
import Relatorio from "@/assets/icons/relatorio.svg";
import Gestao from "@/assets/icons/gestao.svg";
import Seguranca from "@/assets/icons/seguranca.svg";

const Onboarding = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-salmao min-h-52 md:min-h-72 xl:min-h-screen xl:flex-1 xl:gap-16 px-6 py-8">
      <div className="hidden xl:flex flex-col xl:gap-3 text-center">
        <p className="text-3xl md:text-5xl font-bold text-white">
          Olá, bem-vindo ao
        </p>
        <p className="text-3xl md:text-5xl font-bold text-white">
          Painel Administrativo
        </p>
      </div>

      <img
        src={Logo.src || Logo}
        alt="logotipo"
        className="mt-6 w-44 md:w-64 xl:mt-0 xl:w-96"
      />

      <div className="hidden xl:grid grid-cols-3 gap-10 2xl:gap-20 text-white pt-10">
        <div className="flex gap-4 items-center">
          <img src={Gestao.src || Gestao} alt="" className="w-10" />
          <p>
            Gestão completa <br />
            dos pacientes
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <img src={Relatorio.src || Relatorio} alt="" className="w-10" />
          <p>
            Relatórios e <br />
            Indicadores
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <img src={Seguranca.src || Seguranca} alt="" className="w-10" />
          <p>
            Segurança e <br />
            privacidade
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
