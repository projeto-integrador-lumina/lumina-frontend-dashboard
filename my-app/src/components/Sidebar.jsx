"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

//assets
import Menu from "@/assets/icons/icon-menu-salmao.svg";
import Profile from "@/assets/profile.png";
import Home from "@/assets/icons/icon-home.svg";
import Usuario from "@/assets/icons/icon-usuario.svg";
import Grafico from "@/assets/icons/icon-grafico.svg";
import Exercicio from "@/assets/icons/exercicios.svg";
import Chat from "@/assets/icons/chat.svg";
import Perfil from "@/assets/icons/perfil.svg";
import Config from "@/assets/icons/icon-config.svg";
import Sair from "@/assets/icons/icon-exit.svg";

const Sidebar = () => {
  return (
    <>
      <div
        id="sidebar-overlay"
        className="fixed inset-0 z-40 hidden bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
      ></div>

      <aside
        id="sidebar"
        className="fixed inset-y-0 left-0 z-50 flex h-screen w-4/5 max-w-[280px] -translate-x-full flex-col bg-salmao shadow-2xl transition-transform duration-300 ease-in-out sm:w-72 lg:sticky lg:top-0 lg:w-[260px] lg:translate-x-0 lg:shadow-none"
      >
        <div className="flex justify-end px-5 pt-5 lg:hidden">
          <button
            type="button"
            id="menu-close"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
          >
            <img src={Menu.src || Menu} className="w-6" alt="Fechar menu" />
          </button>
        </div>

        <div className="px-5 pt-6 pb-4">
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={Profile.src || Profile}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-turquesa/70"
                  alt="Foto de perfil"
                />

                <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-turquesa ring-2 ring-salmao"></span>
              </div>

              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold text-white">
                  Natasha
                </p>

                <span className="rounded-full bg-turquesa/20 px-2 py-0.5 text-[11px] text-white ring-1 ring-turquesa/40">
                  Administrador
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-widest text-white/50">
            Menu
          </p>

          <ul className="flex flex-col gap-1 text-white">
            <li>
              <Link
                href="/home"
                className="flex items-center gap-3 rounded-xl px-3.5 py-[12px] text-[15px] font-medium text-white/75 transition-all duration-150 hover:bg-white/10 hover:pl-[18px] hover:text-white"
              >
                <img src={Home.src || Home} className="w-5 shrink-0" alt="" />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                href="/paciente/pacientes"
                className="flex items-center gap-3 rounded-xl px-3.5 py-[12px] text-[15px] font-medium text-white/75 transition-all duration-150 hover:bg-white/10 hover:pl-[18px] hover:text-white"
              >
                <img
                  src={Usuario.src || Usuario}
                  className="w-5 shrink-0"
                  alt=""
                />
                <span>Pacientes</span>
              </Link>
            </li>

            <li>
              <Link
                href="/relatorios"
                className="flex items-center gap-3 rounded-xl px-3.5 py-[12px] text-[15px] font-medium text-white/75 transition-all duration-150 hover:bg-white/10 hover:pl-[18px] hover:text-white"
              >
                <img
                  src={Grafico.src || Grafico}
                  className="w-5 shrink-0"
                  alt=""
                />
                <span>Relatórios</span>
              </Link>
            </li>

            <li>
              <Link
                href="/atividade"
                className="flex items-center gap-3 rounded-xl px-3.5 py-[12px] text-[15px] font-medium text-white/75 transition-all duration-150 hover:bg-white/10 hover:pl-[18px] hover:text-white"
              >
                <img
                  src={Exercicio.src || Exercicio}
                  className="w-5 shrink-0"
                  alt=""
                />
                <span>Atividades</span>
              </Link>
            </li>

            <li>
              <Link
                href="/mensagens"
                className="flex items-center gap-3 rounded-xl px-3.5 py-[12px] text-[15px] font-medium text-white/75 transition-all duration-150 hover:bg-white/10 hover:pl-[18px] hover:text-white"
              >
                <img src={Chat.src || Chat} className="w-5 shrink-0" alt="" />
                <span>Mensagens</span>
              </Link>
            </li>
          </ul>

          <p className="px-3 pb-1 pt-4 text-[10px] font-medium uppercase tracking-widest text-white/50">
            Conta
          </p>

          <ul className="flex flex-col gap-1 text-white">
            <li>
              <Link
                href="/perfil"
                className="flex items-center gap-3 rounded-xl px-3.5 py-[12px] text-[15px] font-medium text-white/75 transition-all duration-150 hover:bg-white/10 hover:pl-[18px] hover:text-white"
              >
                <img
                  src={Perfil.src || Perfil}
                  className="w-5 shrink-0"
                  alt=""
                />
                <span>Perfil</span>
              </Link>
            </li>

            <li>
              <Link
                href="/configuracoes"
                className="flex items-center gap-3 rounded-xl px-3.5 py-[12px] text-[15px] font-medium text-white/75 transition-all duration-150 hover:bg-white/10 hover:pl-[18px] hover:text-white"
              >
                <img
                  src={Config.src || Config}
                  className="w-5 shrink-0"
                  alt=""
                />
                <span>Configurações</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="px-3 pb-5">
          <div className="mb-3 h-px bg-white/20"></div>

          <Link
            href="/logout"
            className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 text-[15px] font-medium text-white/70 transition-all hover:border-white/25 hover:bg-white/15 hover:text-white"
          >
            <img src={Sair.src || Sair} className="w-5 shrink-0" alt="" />
            <span>Sair</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
