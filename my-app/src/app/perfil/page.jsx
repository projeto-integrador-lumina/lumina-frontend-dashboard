"use client";
import React from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

//assets
import Profile from "@/assets/profile.png";
import Back from "@/assets/icons/back.svg";

const Perfil = () => {
  return (
    <>
      <div className="flex min-h-screen bg-[#f6f7fb]">
        <Sidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-40">
            <Navbar />
          </header>

          <main className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8 xl:p-10 font-jakarta text-text">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/50">
                  Home /
                  <span className="font-semibold text-salmao">Perfil</span>
                </p>
              </div>

              <a
                href="/home"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100"
              >
                <img src={Back.src || Back} alt="" className="w-5" />
              </a>
            </div>

            <section className="overflow-hidden rounded-[34px] bg-white shadow-sm border border-gray-100">
              <div className="h-20 bg-gradient-to-r from-salmao to-[#F2A39C] sm:h-30"></div>

              <div className="px-5 pb-8 sm:px-8 lg:px-10">
                <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
                    <div className="relative">
                      <div className="h-32 w-32 overflow-hidden rounded-full border-[5px] border-white bg-white shadow-xl sm:h-36 sm:w-36">
                        <img
                          src={Profile.src || Profile}
                          alt="Foto do perfil"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white bg-green-400"></span>
                    </div>

                    <div className="flex flex-col gap-2 pb-4 text-center sm:text-left p-4 ">
                      <h2 className="text-3xl font-bold text-text xl:text-white sm:text-4xl">
                        Natasha
                      </h2>

                      <p className="mt-2 text-base text-text/60">
                        Fonoaudiólogo • Painel Administrativo Lolá
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                        <span className="rounded-full bg-salmao/10 px-4 py-2 text-sm font-medium text-salmao">
                          CRFa 77322847
                        </span>

                        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                          Conta ativa
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href="/perfil/editar"
                      className="rounded-2xl bg-salmao px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e56f66]"
                    >
                      Editar Perfil
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.6fr_1fr]">
              <div className="flex flex-col gap-6">
                <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                  <div className="gap-5 p-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Informações pessoais
                      </h3>

                      <p className="mt-1 text-sm text-text/50">
                        Dados principais da conta profissional
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="rounded-3xl bg-[#f8f9fc] p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                        Nome completo
                      </p>

                      <p className="mt-4 text-lg font-semibold text-gray-800">
                        Natasha Pedroso
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#f8f9fc] p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                        Email
                      </p>

                      <p className="mt-4 break-all text-lg font-semibold text-gray-800">
                        natasha@email.com
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#f8f9fc] p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                        Telefone
                      </p>

                      <p className="mt-4 text-lg font-semibold text-gray-800">
                        13999999999
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#f8f9fc] p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                        CRFa
                      </p>

                      <p className="mt-4 text-lg font-semibold text-gray-800">
                        839248392
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Sobre o perfil
                    </h3>

                    <p className="mt-1 text-sm text-text/50">
                      Resumo geral da atuação profissional
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="rounded-3xl bg-[#f8f9fc] p-6 text-center">
                      <p className="text-sm text-text/50">Pacientes ativos</p>

                      <p className="mt-3 text-4xl font-bold text-salmao">6</p>
                    </div>

                    <div className="rounded-3xl bg-[#f8f9fc] p-6 text-center">
                      <p className="text-sm text-text/50">
                        Relatórios emitidos
                      </p>

                      <p className="mt-3 text-4xl font-bold text-salmao">42</p>
                    </div>

                    <div className="rounded-3xl bg-[#f8f9fc] p-6 text-center">
                      <p className="text-sm text-text/50">
                        Tempo na plataforma
                      </p>

                      <p className="mt-3 text-4xl font-bold text-salmao">2a</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Conta
                    </h3>

                    <p className="mt-1 text-sm text-text/50">
                      Informações do acesso ao sistema
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="rounded-3xl bg-[#f8f9fc] p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                        Tipo de conta
                      </p>

                      <p className="mt-4 text-lg font-semibold text-gray-800">
                        Fonoaudiólogo
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#f8f9fc] p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                        Status da conta
                      </p>

                      <div className="py-6">
                        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                          Conta ativa
                        </span>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#f8f9fc] p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                        Último acesso
                      </p>

                      <p className="mt-4 text-lg font-semibold text-gray-800">
                        Hoje às 19:42
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Perfil;
