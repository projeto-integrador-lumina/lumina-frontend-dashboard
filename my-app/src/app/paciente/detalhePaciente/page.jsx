"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import React, { useState } from "react";

//assets
import Editar from "@/assets/icons/editar.svg";
import Excluir from "@/assets/icons/excluir.svg";
import Perfil from "@/assets/icons/perfil.svg";
import Seguranca from "@/assets/icons/seguranca.svg";
import Back from "@/assets/icons/back.svg";
import Profile from "@/assets/profile.png";


const detalhePaciente = () => {
  const [sidebarAberta, setSidebarAberta] = useState(false);


  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarAberta}
          onClose={() => setSidebarAberta(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40">
            <Navbar onToggleMenu={() => setSidebarAberta(!sidebarAberta)} />
          </header>

          <main className="text-text font-jakarta text-sm p-4 md:p-8 flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <p className="hidden lg:block px-2">
                  Home / Pacientes /
                  <span className=" text-salmao font-semibold"></span>
                </p>
              </div>

              <Link
                href="/paciente/pacientes"
                className="self-end sm:self-auto flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
                title="Voltar"
              >
                <img src={Back.src || Back} alt="voltar" className="w-5" />
              </Link>
            </div>

            <div className="w-full flex flex-col gap-6 lg:gap-8">
              <div className="grid gap-6 xl:grid-cols-[3fr_1.2fr]">
                <section className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 lg:p-8">
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div className="flex flex-col items-center text-center gap-2 md:col-span-2 xl:col-span-1 xl:row-span-3 xl:justify-center">
                      <img
                        src={Profile.src || Profile}
                        alt="foto de perfil"
                        className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover shadow-md"
                      />

                      <p className="text-lg sm:text-xl font-semibold">
                        Pedro Henrique
                      </p>

                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs sm:text-sm font-medium">
                        Ativo
                      </span>

                      <p className="text-sm sm:text-base text-text/70">
                        Nível 1
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-text/60">Nome</p>
                      <p className="text-base font-semibold">Pedro Henrique</p>
                    </div>

                    <div>
                      <p className="text-sm text-text/60">Data de Nascimento</p>
                      <p className="text-base font-semibold">07/04/2018</p>
                    </div>

                    <div>
                      <p className="text-sm text-text/60">Idade</p>
                      <p className="text-base font-semibold">8 anos</p>
                    </div>

                    <div className="xl:col-start-2">
                      <p className="text-sm text-text/60">Alvo Atual</p>
                      <p className="text-base font-semibold">/s/</p>
                    </div>

                    <div>
                      <p className="text-sm text-text/60">Cadastrado em</p>
                      <p className="text-base font-semibold">10/11/2026</p>
                    </div>

                    <div>
                      <p className="text-sm text-text/60">Responsável</p>
                      <p className="text-base font-semibold break-words">
                        Ana Paula
                      </p>
                    </div>

                    <div className="xl:col-start-2">
                      <p className="text-sm text-text/60">Contato</p>
                      <p className="text-base font-semibold">13 9999999999</p>
                    </div>

                    <div>
                      <p className="text-sm text-text/60">CPF</p>
                      <p className="text-base font-semibold">444.000.000-02</p>
                    </div>

                    <div>
                      <p className="text-sm text-text/60">Sexo</p>
                      <p className="text-base font-semibold">Masculino</p>
                    </div>

                    <div className="md:col-span-2 xl:col-span-2 xl:col-start-2">
                      <p className="text-sm text-text/60">Endereço</p>
                      <p className="text-base font-semibold break-words">
                        Rua das Flores, 120
                      </p>
                    </div>

                    <div className="md:col-span-2 xl:col-span-4 flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-100">
                      <a
                        href="/pacientes/editar/<%= paciente.id %>"
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-turquesa rounded-xl hover:bg-turquesa/75 transition"
                      >
                        <img src={Editar.src || Editar} className="w-5" />
                        <span className="font-medium">Editar</span>
                      </a>

                      <Link
                        href="#"
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-salmao text-white rounded-xl hover:bg-salmao/75 transition"
                      >
                        <img src={Excluir.src || Excluir} className="w-5" />
                        <span className="font-medium">Excluir</span>
                      </Link>
                    </div>
                  </div>
                </section>

                <aside className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col gap-5 justify-between">
                  <div>
                    <p className="font-semibold text-lg md:text-xl">Notas</p>

                    <ul className="pl-5 flex flex-col gap-2 md:text-base pt-4 text-text/80">
                      <li className="list-disc">
                        Apresentou dificuldades na produção do encontro
                        consonantal na última sessão.
                      </li>
                      <li className="list-disc">
                        Maior dificuldade na consoante /s/.
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row gap-3">
                    <Link
                      href="#"
                      className="flex-1 text-center px-4 py-3 bg-roxo rounded-xl text-white hover:bg-roxo/75 transition"
                    >
                      Ver tudo
                    </Link>

                    <Link
                      href="#"
                      className="flex items-center justify-center px-4 py-3 bg-turquesa rounded-xl hover:bg-turquesa/75 transition"
                    >
                      <img src={Editar.src || Editar} className="w-5" />
                    </Link>
                  </div>
                </aside>
              </div>

              <section className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-2 mb-6">
                  <p className="text-lg md:text-xl font-semibold">
                    Acesso ao Aplicativo
                  </p>

                  <p className="text-sm text-text/60">
                    Credenciais geradas automaticamente para o responsável
                    acessar o jogo.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                    <p className="text-xs uppercase tracking-widest text-text/40 font-semibold">
                      Usuário gerado
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-turquesa">
                        <img src={Perfil.src || Perfil} className="w-5" />
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-text">
                          pedro123
                        </p>

                        <p className="text-sm text-text/50">
                          Login criado automaticamente
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                    <p className="text-xs uppercase tracking-widest text-text/40 font-semibold">
                      Senha
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-salmao">
                          <img
                            src={Seguranca.src || Seguranca}
                            className="w-5"
                          />
                        </div>

                        <div>
                          <p className="text-lg font-semibold tracking-[0.25em] text-text">
                            ••••••••
                          </p>

                          <p className="text-sm text-text/50">
                            Senha protegida
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Gerada
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-turquesa/20 bg-turquesa/5 p-4">
                  <p className="text-sm leading-relaxed text-text/70">
                    Por segurança, a senha do responsável não é exibida no
                    painel administrativo. O sistema gera automaticamente as
                    credenciais de acesso do aplicativo no momento do cadastro
                    do paciente.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
                <div className="bg-white shadow-lg rounded-2xl p-5 lg:p-8 flex flex-col items-center justify-between gap-5 text-center">
                  <p className="text-base font-semibold md:text-xl">
                    Média de Acertos
                  </p>
                  <span className="font-bold text-3xl text-salmao md:text-4xl">
                    68,9%
                  </span>
                  <Link
                    href="/relatorios"
                    className="px-4 py-2 bg-turquesa rounded-xl text-sm md:py-3 md:px-5 hover:bg-turquesa/75 transition"
                  >
                    Ver relatório
                  </Link>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-5 lg:p-8 flex flex-col items-center justify-between gap-5 text-center">
                  <p className="text-base font-semibold md:text-xl">
                    Média de Prática Semanal
                  </p>
                  <span className="font-bold text-3xl text-salmao md:text-4xl">
                    2h52min
                  </span>
                  <Link
                    href="/relatorios"
                    className="px-4 py-2 bg-turquesa rounded-xl text-sm md:py-3 md:px-5 hover:bg-turquesa/75 transition"
                  >
                    Ver relatório
                  </Link>
                </div>

                <div className="sm:col-span-2 bg-white shadow-lg rounded-2xl p-5 lg:p-8 flex flex-col gap-5 min-h-64">
                  <div>
                    <p className="text-lg font-semibold md:text-xl">
                      Desempenho por fonema
                    </p>
                    <p className="text-sm text-text/75">Taxa de Acertos</p>
                  </div>

                  <div className="flex flex-1 items-center justify-center rounded-xl bg-gray-50 text-text/50 h-40">
                    <canvas id="graficoFonemaPerfil"></canvas>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default detalhePaciente;
