"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

//assets

const Configuracoes = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar></Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40">
            <Navbar />
          </header>

          <main className="flex flex-col gap-6 bg-fundo px-4 py-5 font-jakarta text-text sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm text-text/60">
                  Home /
                  <span className="text-salmao font-semibold">
                    Configurações
                  </span>
                </p>

                <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
                  Configurações
                </h1>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
                <div className="mb-6">
                  <p className="text-lg font-semibold">
                    Preferências do sistema
                  </p>

                  <p className="text-sm text-text/60">
                    Ajuste o funcionamento geral do painel.
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                    <div>
                      <p className="font-medium">Modo escuro</p>
                      <p className="text-sm text-text/60">
                        Altera o tema do painel
                      </p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-turquesa"></div>
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                    <div>
                      <p className="font-medium">Notificações</p>
                      <p className="text-sm text-text/60">
                        Receber alertas do sistema
                      </p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-turquesa"></div>
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                    <div>
                      <p className="font-medium">Backup automático</p>
                      <p className="text-sm text-text/60">
                        Salvar dados automaticamente
                      </p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-turquesa"></div>
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                    <div>
                      <p className="font-medium">Sessão automática</p>
                      <p className="text-sm text-text/60">Manter login ativo</p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-turquesa"></div>
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
                <div className="mb-6">
                  <p className="text-lg font-semibold">Preferências clínicas</p>

                  <p className="text-sm text-text/60">
                    Configurações relacionadas aos pacientes.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1">
                    <label>Idioma do painel</label>

                    <select className="rounded-3xl border border-text/20 px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-turquesa">
                      <option>Português</option>
                      <option>English</option>
                      <option>Español</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label>Tempo padrão das atividades</label>

                    <select className="rounded-3xl border border-text/20 px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-turquesa">
                      <option>15 minutos</option>
                      <option selected>30 minutos</option>
                      <option>45 minutos</option>
                      <option>60 minutos</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label>Nível inicial padrão</label>

                    <select className="rounded-3xl border border-text/20 px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-turquesa">
                      <option>Nível 1</option>
                      <option selected>Nível 2</option>
                      <option>Nível 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label>Formato de relatórios</label>

                    <select className="rounded-3xl border border-text/20 px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-turquesa">
                      <option selected>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full rounded-xl bg-turquesa px-6 py-3 font-medium text-white transition hover:bg-turquesa/80 sm:w-auto"
                    >
                      Salvar configurações
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
              <div className="mb-6">
                <p className="text-lg font-semibold">Segurança</p>

                <p className="text-sm text-text/60">
                  Ajustes relacionados à segurança da conta.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button className="flex items-center justify-between rounded-2xl border border-text/10 bg-gray-50 p-5 transition hover:bg-gray-100">
                  <div className="text-left">
                    <p className="font-medium">Alterar senha</p>
                    <p className="text-sm text-text/60">
                      Atualize sua senha de acesso
                    </p>
                  </div>

                  <span className="text-xl text-text/40">›</span>
                </button>

                <button className="flex items-center justify-between rounded-2xl border border-text/10 bg-gray-50 p-5 transition hover:bg-gray-100">
                  <div className="text-left">
                    <p className="font-medium">Autenticação em 2 fatores</p>
                    <p className="text-sm text-text/60">
                      Mais segurança para o painel
                    </p>
                  </div>

                  <span className="text-xl text-text/40">›</span>
                </button>

                <button className="flex items-center justify-between rounded-2xl border border-text/10 bg-gray-50 p-5 transition hover:bg-gray-100">
                  <div className="text-left">
                    <p className="font-medium">Sessões conectadas</p>
                    <p className="text-sm text-text/60">
                      Gerencie dispositivos ativos
                    </p>
                  </div>

                  <span className="text-xl text-text/40">›</span>
                </button>

                <button className="flex items-center justify-between rounded-2xl border border-text/10 bg-gray-50 p-5 transition hover:bg-gray-100">
                  <div className="text-left">
                    <p className="font-medium">Logs do sistema</p>
                    <p className="text-sm text-text/60">Histórico de acessos</p>
                  </div>

                  <span className="text-xl text-text/40">›</span>
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-red-700">
                    Zona de perigo
                  </p>

                  <p className="mt-1 max-w-3xl text-sm text-red-600">
                    Ao excluir sua conta, todos os acessos administrativos serão
                    removidos permanentemente.
                  </p>
                </div>
                <button
                  type="button"
                  onclick="document.getElementById('modalExcluirConta').classNameList.remove('hidden'); document.getElementById('modalExcluirConta').classNameList.add('flex');"
                  className="w-full rounded-xl bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-600 sm:w-auto"
                >
                  Excluir conta
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
      <div
        id="modalExcluirConta"
        className="fixed inset-0 z-[999] hidden items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      >
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-fadeIn">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
            <span className="text-2xl font-bold text-red-600">!</span>
          </div>

          <p className="text-xl font-semibold text-text">Excluir conta?</p>

          <p className="mt-2 text-sm leading-relaxed text-text/60">
            Essa ação é irreversível e removerá permanentemente seu acesso ao
            sistema.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onclick="document.getElementById('modalExcluirConta').classNameList.add('hidden'); document.getElementById('modalExcluirConta').classNameList.remove('flex');"
              className="rounded-xl border border-text/20 px-5 py-3 font-medium transition hover:bg-gray-50"
            >
              Cancelar
            </button>

            <form action="/usuario/desativar" method="POST">
              <button
                type="submit"
                className="w-full rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600 sm:w-auto"
              >
                Sim, excluir
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuracoes;
