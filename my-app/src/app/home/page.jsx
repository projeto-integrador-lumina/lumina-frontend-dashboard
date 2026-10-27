"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

//assets
import Profile from "@/assets/10.jpg";
import User from "@/assets/icons/user.svg";
import Acerto from "@/assets/icons/acerto.svg";
import Clock from "@/assets/icons/clock.svg";
import Navbar from "@/components/Navbar";


const Home = () => {
    return (

  <div className="flex min-h-screen bg-gray-50">

      <Sidebar></Sidebar>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40">
            <Navbar></Navbar>
        </header>

        <main className="flex flex-col gap-6 bg-fundo px-4 py-5 font-jakarta text-text sm:px-6 lg:px-8">

          <section className="flex items-center justify-between lg:hidden">
            <div>
              <p className="text-sm text-text/70 sm:text-base">Olá,</p>
              <p className="text-xl font-semibold sm:text-2xl">
                Natasha
              </p>
            </div>

            <div className="h-14 w-14 overflow-hidden rounded-2xl shadow-md sm:h-16 sm:w-16">
              <img src={Profile.src || Profile} className="h-full w-full object-cover" alt="Foto de perfil" />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
            <Link href="/pacientes"
              className="group cursor-pointer rounded-3xl bg-white p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <p className="text-sm text-text/60 md:text-base">
                    Pacientes Cadastrados
                  </p>
                  <p className="text-[10px] text-text/60 md:text-[12px]">
                    geral
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold text-salmao lg:text-5xl">
                    8
                  </p>

                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-salmao/10 transition group-hover:bg-salmao/20">
                    <img src={User.src || User} alt="" className="w-8" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/relatorios/acertos"
              className="group cursor-pointer rounded-3xl bg-white p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <p className="text-sm text-text/60 md:text-base">
                    Média de Acertos
                  </p>
                  <p className="text-[10px] text-text/60 md:text-[12px]">
                    geral
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold text-salmao lg:text-5xl">
                    47,5%
                  </p>

                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-turquesa/10 transition group-hover:bg-turquesa/20">
                    <img src={Acerto.src || Acerto} alt="" className="w-8" />
                  </div>
                </div>
              </div>
            </Link>

            <a href="/relatorios/atividade"
              className="group cursor-pointer rounded-3xl bg-white p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <p className="text-sm text-text/60 md:text-base">
                    Tempo Médio de Prática
                  </p>
                  <p className="text-[10px] text-text/60 md:text-[12px]">
                    geral
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold text-salmao lg:text-5xl">
                    37min
                  </p>

                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-roxo/10 transition group-hover:bg-roxo/20">
                    <img src={Clock.src || Clock} alt="" className="w-8" />
                  </div>
                </div>
              </div>
            </a>

            <Link href="/pacientes"
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-salmao to-salmao/80 p-5 text-white shadow-lg transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl sm:col-span-2 xl:col-span-2">

              <div className="flex h-full flex-col justify-between gap-5">

                <div>
                  <p className="text-sm text-white/70 md:text-base">
                    Pacientes Inativos
                  </p>
                </div>

                <div className="flex items-end justify-between">

                  <div className="flex items-center gap-4">

                    <p className="text-5xl font-bold">
                    </p>

                    <div className="flex items-center">


                        <div
                          className="relative <%= index > 0 ? '-ml-4' : '' %> h-12 w-12 md:h-14 md:w-14 overflow-hidden rounded-full border-2 border-salmao shadow-md">

                          <img src={Profile.src || Profile}
                            className="h-full w-full object-cover" alt=""/>

                        </div>

                    </div>

                  </div>

                  <div
                    className="rounded-2xl bg-white/10 px-4 py-2 text-sm backdrop-blur-sm transition group-hover:bg-white/20">
                    Requer atenção
                  </div>

                </div>

              </div>
            </Link>
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
            <div className="rounded-3xl bg-white p-5 shadow-lg xl:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold lg:text-xl">
                    Atividade Diária
                  </p>

                  <p className="text-sm text-text/60">
                    em minutos
                  </p>
                </div>

                <Link href="/relatorios/atividade"
                  className="rounded-full bg-salmao/10 px-4 py-2 text-sm font-medium text-salmao transition hover:bg-salmao hover:text-white">
                  Ver relatório
                </Link>
              </div>

              <div className="mt-6 flex h-72 sm:h-80">
                <canvas id="graficoHomeAtividade"></canvas>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-lg xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold lg:text-xl">Calendário</p>
                  <p className="text-sm text-text/60">sessões e atividades</p>
                </div>
              </div>

              <div className="mt-5 h-80 w-full overflow-hidden rounded-2xl bg-roxo/5 px-12 py-8">
                <div id="calendar" className="h-full w-full"></div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="grid gap-2">
                <p className="text-lg font-semibold lg:text-xl">
                  Pacientes
                </p>
              </div>

              <Link href="/pacientes"
                className="rounded-full bg-salmao px-4 py-2 text-sm font-medium text-white transition hover:bg-salmao/80">
                Ver todos
              </Link>
            </div>

            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[650px]">

                <div
                  className="grid grid-cols-[40px_60px_2fr_1fr_1fr] items-center border-b border-text/10 pb-4 text-sm font-semibold text-text/60">
                  <span></span>
                  <span></span>
                  <span>Nome</span>
                  <span>Nível</span>
                  <span>Status</span>
                </div>

                  <Link href="/pacientes/<%= paciente.id %>"
                    className="grid grid-cols-[40px_60px_2fr_1fr_1fr] items-center border-b border-text/5 py-4 text-sm transition hover:bg-gray-50">

                    <span className="font-semibold">
                    </span>

                    <span>
                      <img src="<%= paciente.foto_perfil || '/imgs/profile.jpg' %>"
                        className="h-10 w-10 rounded-full object-cover" />
                    </span>

                    <span className="font-medium">
                    </span>

                    <span>
                      Nível
                    </span>

                    <span>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Ativo
                        </span>

                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                            Inativo
                          </span>

                    </span>

                  </Link>

              </div>
            </div>
          </section>
        </main>
      </div>
  </div>

    )
}

export default Home;