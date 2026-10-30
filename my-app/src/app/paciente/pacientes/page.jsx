"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ListaPaciente from "@/components/ListaPaciente";

import Profile from "@/assets/profile.png";
import Add from "@/assets/icons/add.svg";
import Filtrar from "@/assets/icons/filtrar.svg";
import Back from "@/assets/icons/back.svg";
import axios from "axios";
import { getAxiosConfig } from "@/services/auth";
import { getImageUrl } from "@/utils/page";

const Pacientes = () => {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/pacientes",
          getAxiosConfig(),
        );
        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.pacientes || [];
        setPacientes(dados);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        console.error("Resposta da API:", error.response?.data);
        console.error("Status do erro:", error.response?.status);
      }
    };
    fetchPacientes();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40">
          <Navbar onToggleMenu={() => setSidebarAberta(!sidebarAberta)} />
        </header>

        <main className="text-text font-jakarta text-sm p-4 md:p-8 flex flex-col gap-4">
          <div className="hidden lg:block px-2">
            <p>
              Home /{" "}
              <span className="text-salmao font-semibold">Pacientes</span>
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/paciente/cadastro"
              className="px-4 py-3 bg-white shadow-lg rounded-xl flex items-center gap-2"
            >
              <img src={Add.src || Add} className="w-5" alt="Cadastrar" />
              <p className="sm:hidden">Cadastrar</p>
              <p className="hidden sm:block">Cadastrar Paciente</p>
            </Link>
            <button
              type="button"
              className="px-4 py-3 bg-white shadow-lg rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <img src={Filtrar.src || Filtrar} className="w-5" alt="Filtrar" />
              <p>Filtrar</p>
            </button>

            <Link
              href="/home"
              className="self-end sm:self-auto flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
            >
              <img src={Back.src || Back} alt="Voltar" className="w-5" />
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[3fr_1fr_1fr] xl:grid-cols-[3fr_1fr_1fr_1fr] font-semibold text-sm md:text-base border-b border-text/15 px-4 md:px-8 py-5">
              <span>Paciente</span>
              <span>Nível</span>
              <span className="hidden xl:block">Status</span>
              <span>Ações</span>
            </div>

            {pacientes.length > 0 ? (
              pacientes.map((paciente) => (
                <ListaPaciente
                  id={paciente._id}
                  key={paciente._id || paciente.id}
                  imagem={getImageUrl(paciente.foto_perfil, Profile.src || Profile)}
                  nome={`${paciente.nome} ${paciente.sobrenome}`}
                  nivel={paciente.nivel_gravidade || "N/A"}
                  status={paciente.ativo ? "Em andamento" : "Inativo"}
                />
              ))
            ) : (
              <div className="p-8 text-center text-text/60">
                Nenhum paciente encontrado.
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-8 py-5">
              <span className="text-text/50 text-xs md:text-sm">
                Mostrando {pacientes.length} pacientes
              </span>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-gray-200 opacity-30 cursor-not-allowed text-base"
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-salmao bg-salmao text-white font-medium text-sm"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-turquesa hover:text-turquesa hover:bg-turquesa/10 transition text-base"
                >
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
