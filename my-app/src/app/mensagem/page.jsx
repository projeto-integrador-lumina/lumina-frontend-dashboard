"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

// assets
import Profile from "@/assets/10.jpg";

const Mensagem = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40">
            <Navbar />
          </header>

          <main
            className="text-text font-jakarta text-sm p-4 md:p-8 flex flex-col gap-4"
            style={{ height: "calc(100vh - 64px)" }}
          >
            <div className="hidden lg:block px-2">
              <p>
                Home / <a className="text-salmao font-semibold">Mensagens</a>
              </p>
            </div>

            <div className="flex gap-4 flex-1 min-h-0">
              {/* Lista de Conversas (Sidebar) */}
              <div className="w-72 xl:w-80 bg-white shadow-lg rounded-xl flex flex-col min-h-0 shrink-0">
                <div className="p-4 border-b border-text/10 flex flex-col gap-3">
                  <p className="font-semibold text-base">Conversas</p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="w-full pl-9 pr-4 py-2 border border-text/20 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-turquesa"
                    />
                    <svg
                      className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text/30"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-text/5">
                  <div className="flex items-center gap-3 px-4 py-3 bg-turquesa/10 border-l-4 border-turquesa cursor-pointer">
                    <div className="relative shrink-0">
                      <img
                        src={Profile.src || Profile}
                        alt="Foto do perfil"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-1">
                        <p className="font-semibold text-sm truncate">
                          Ana Paula Silva
                        </p>
                        <span className="text-[10px] text-text/40 shrink-0">
                          14:32
                        </span>
                      </div>
                      <p className="text-xs text-text/50 truncate">
                        Boa tarde! Tenho uma dúvida...
                      </p>
                    </div>
                    <span className="w-5 h-5 bg-salmao text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                      2
                    </span>
                  </div>
                </div>
              </div>

              {/* Área do Chat */}
              <div className="flex-1 bg-white shadow-lg rounded-xl flex flex-col min-h-0">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-text/10">
                  <img
                    src={Profile.src || Profile}
                    alt="Foto do contato"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Ana Paula Silva</p>
                    <p className="text-xs text-green-400">Online agora</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
                  <div className="flex justify-center">
                    <span className="text-[11px] text-text/30 bg-gray-50 px-3 py-1 rounded-full border border-text/10">
                      Hoje
                    </span>
                  </div>

                  {/* Mensagem Recebida */}
                  <div className="flex gap-2 items-end max-w-[70%]">
                    <img
                      src={Profile.src || Profile}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                    />
                    <div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                        <p className="text-sm leading-relaxed">
                          Boa tarde! Tenho uma dúvida sobre os exercícios do /r/
                          que o Pedro está fazendo no jogo.
                        </p>
                      </div>
                      <p className="text-[10px] text-text/30 mt-1 ml-1">
                        14:30
                      </p>
                    </div>
                  </div>

                  {/* Mensagem Recebida */}
                  <div className="flex gap-2 items-end max-w-[70%]">
                    <img
                      src={Profile.src || Profile}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                    />
                    <div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                        <p className="text-sm leading-relaxed">
                          Ele está tendo dificuldade com a posição final. É
                          normal nessa fase?
                        </p>
                      </div>
                      <p className="text-[10px] text-text/30 mt-1 ml-1">
                        14:32
                      </p>
                    </div>
                  </div>

                  {/* Mensagem Enviada */}
                  <div className="flex gap-2 items-end justify-end max-w-[70%] self-end">
                    <div>
                      <div className="bg-turquesa/20 rounded-2xl rounded-br-sm px-4 py-2.5">
                        <p className="text-sm leading-relaxed">
                          Boa tarde! Sim, é completamente normal. O /r/ em
                          posição final costuma ser o mais desafiador para essa
                          faixa etária.
                        </p>
                      </div>
                      <p className="text-[10px] text-text/30 mt-1 text-right mr-1">
                        14:35
                      </p>
                    </div>
                  </div>

                  {/* Mensagem Enviada */}
                  <div className="flex gap-2 items-end justify-end max-w-[70%] self-end">
                    <div>
                      <div className="bg-turquesa/20 rounded-2xl rounded-br-sm px-4 py-2.5">
                        <p className="text-sm leading-relaxed">
                          Continue incentivando ele a praticar pelo app pelo
                          menos 15 minutos por dia. Os jogos de posição final já
                          foram ativados para ele essa semana! 🎮
                        </p>
                      </div>
                      <p className="text-[10px] text-text/30 mt-1 text-right mr-1">
                        14:36
                      </p>
                    </div>
                  </div>

                  {/* Mensagem Recebida */}
                  <div className="flex gap-2 items-end max-w-[70%]">
                    <img
                      src={Profile.src || Profile}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                    />
                    <div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                        <p className="text-sm leading-relaxed">
                          Perfeito, obrigada pela explicação! Vou incentivar ele
                          sim 😊
                        </p>
                      </div>
                      <p className="text-[10px] text-text/30 mt-1 ml-1">
                        14:38
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input de Envio de Mensagem */}
                <div className="px-4 py-4 border-t border-text/10">
                  <div className="flex items-center gap-2 bg-gray-50 border border-text/15 rounded-2xl px-4 py-2">
                    <input
                      type="text"
                      placeholder="Digite uma mensagem..."
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                    <button className="p-2 bg-salmao rounded-xl hover:bg-salmao/80 transition shrink-0 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 fill-white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Mensagem;