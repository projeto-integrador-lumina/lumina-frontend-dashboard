"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getAxiosConfig } from "@/services/auth";
import { getImageUrl } from "@/utils/page";

import Profile from "@/assets/profile.png";
import Back from "@/assets/icons/back.svg";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

const formatarData = (data) => {
  if (!data) return "Não informado";

  const dataFormatada = new Date(data);

  if (Number.isNaN(dataFormatada.getTime())) {
    return "Não informado";
  }

  return dataFormatada.toLocaleDateString("pt-BR");
};

const calcularTempoPlataforma = (data) => {
  if (!data) return "Não informado";

  const inicio = new Date(data);

  if (Number.isNaN(inicio.getTime())) {
    return "Não informado";
  }

  const hoje = new Date();

  let meses =
    (hoje.getFullYear() - inicio.getFullYear()) * 12 +
    (hoje.getMonth() - inicio.getMonth());

  if (hoje.getDate() < inicio.getDate()) {
    meses--;
  }

  meses = Math.max(0, meses);

  if (meses === 0) return "Menos de 1 mês";

  if (meses < 12) {
    return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  }

  const anos = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;

  if (mesesRestantes === 0) {
    return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  }

  return `${anos} ${anos === 1 ? "ano" : "anos"} e ${mesesRestantes} ${
    mesesRestantes === 1 ? "mês" : "meses"
  }`;
};

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [pacientesAtivos, setPacientesAtivos] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    const buscarDados = async () => {
      try {
        setCarregando(true);
        setErro("");

        const response = await axios.get(
          `${API_URL}/fonoaudiologos/me`,
          getAxiosConfig(),
        );

        const dados = response.data.fonoaudiologo;

        if (!dados) {
          throw new Error("Dados do perfil não encontrados.");
        }

        if (ativo) {
          setPerfil(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);

        const mensagem =
          error.response?.data?.error ||
          error.message ||
          "Não foi possível carregar seu perfil.";

        if (ativo) {
          setErro(mensagem);
          toast.error(mensagem);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }

      try {
        const response = await axios.get(
          `${API_URL}/pacientes`,
          getAxiosConfig(),
        );

        const lista = response.data.pacientes;

        if (ativo && Array.isArray(lista)) {
          setPacientesAtivos(
            lista.filter((paciente) => paciente.ativo === true).length,
          );
        }
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    buscarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const nomeCompleto = perfil?.nome || "Não informado";

  const fotoPerfil = perfil?.foto_perfil
    ? getImageUrl(perfil.foto_perfil)
    : Profile.src;

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-40">
          <Navbar />
        </header>

        <main className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8 xl:p-10 font-jakarta text-text">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text/50">
              Home / <span className="font-semibold text-salmao">Perfil</span>
            </p>

            <Link
              href="/home"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100"
              title="Voltar"
            >
              <img src={Back.src || Back} alt="Voltar" className="w-5" />
            </Link>
          </div>

          {carregando && (
            <div className="flex min-h-80 items-center justify-center rounded-[30px] bg-white shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-salmao/20 border-t-salmao" />

                <p className="text-sm text-text/50">Carregando perfil...</p>
              </div>
            </div>
          )}

          {!carregando && erro && (
            <div className="rounded-[30px] border border-red-100 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-red-600">
                Não foi possível carregar o perfil.
              </p>

              <p className="mt-2 text-sm text-text/50">{erro}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-2xl bg-salmao px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando && !erro && perfil && (
            <>
              <section className="overflow-hidden rounded-[34px] border border-gray-100 bg-white shadow-sm">
                <section className="overflow-hidden rounded-[30px] border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <div className="relative h-32 overflow-hidden bg-gradient-to-r from-[#ED8981] via-[#F29B93] to-[#F5B2A9] sm:h-40">
                    <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border-[35px] border-white/10" />
                    <div className="absolute right-32 top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                    <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/10" />
                  </div>

                  <div className="relative px-5 pb-7 sm:px-8 lg:px-10">
                    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:gap-7">
                      <div className="relative z-10 -mt-14 shrink-0 sm:-mt-16">
                        <div className="h-28 w-28 overflow-hidden rounded-full border-[5px] border-white bg-[#f1f2f4] shadow-[0_8px_25px_rgba(0,0,0,0.12)] sm:h-36 sm:w-36">
                          <img
                            src={fotoPerfil || Profile.src}
                            alt={`Foto de ${nomeCompleto}`}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = Profile.src;
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex w-full min-w-0 flex-col items-center gap-4 pt-1 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-2 sm:pt-5 sm:text-left">
                        <div className="min-w-0">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-salmao">
                            Meu perfil
                          </p>

                          <h2 className="break-words text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl lg:text-[34px]">
                            {nomeCompleto}
                          </h2>

                          <p className="mt-2 text-sm text-text/50">
                            Fonoaudiólogo • Painel Administrativo Lolá
                          </p>
                        </div>

                        <Link
                          href="/perfil/alterar"
                          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-salmao px-6 py-3 text-sm font-semibold text-white shadow-[0_5px_15px_rgba(237,137,129,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e77d75] hover:shadow-lg sm:w-auto"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L9 17l-4 1 1-4L16.5 3.5z"
                            />
                          </svg>
                          Editar perfil
                        </Link>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-3 border-t border-gray-100 pt-5 sm:justify-start">
                      <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-[#fff3f1] px-4 py-2.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 shrink-0 text-salmao"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4M12 3l2.5 1.5 3-.2.8 2.9L21 9l-1 3 1 3-2.7 1.8-.8 2.9-3-.2L12 3z"
                          />
                        </svg>

                        <span className="break-all text-xs font-semibold text-[#dd766e] sm:text-sm">
                          CRFa {perfil.crfa || "Não informado"}
                        </span>
                      </div>

                      <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-[#f1faf9] px-4 py-2.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 shrink-0 text-turquesa"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M3 7l9 6 9-6" />
                        </svg>

                        <span className="break-all text-xs font-medium text-gray-600 sm:text-sm">
                          {perfil.email || "Email não informado"}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </section>

              <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.6fr_1fr]">
                <div className="flex flex-col gap-6">
                  <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center justify-between gap-5 p-2">
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

                        <p className="mt-4 break-words text-lg font-semibold text-gray-800">
                          {nomeCompleto}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#f8f9fc] p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                          Email
                        </p>

                        <p className="mt-4 break-all text-lg font-semibold text-gray-800">
                          {perfil.email || "Não informado"}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#f8f9fc] p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                          Telefone
                        </p>

                        <p className="mt-4 text-lg font-semibold text-gray-800">
                          {perfil.telefone || "Não informado"}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#f8f9fc] p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                          CRFa
                        </p>

                        <p className="mt-4 text-lg font-semibold text-gray-800">
                          {perfil.crfa || "Não informado"}
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

                        <p className="mt-3 text-4xl font-bold text-salmao">
                          {pacientesAtivos ?? "—"}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#f8f9fc] p-6 text-center">
                        <p className="text-sm text-text/50">
                          Relatórios emitidos
                        </p>

                        <p className="mt-3 text-4xl font-bold text-salmao">—</p>

                        <p className="mt-2 text-xs text-text/40">
                          Dados indisponíveis
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#f8f9fc] p-6 text-center">
                        <p className="text-sm text-text/50">
                          Tempo na plataforma
                        </p>

                        <p className="mt-3 text-xl font-bold text-salmao">
                          {calcularTempoPlataforma(perfil.createdAt)}
                        </p>
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
                          CRFa registrado
                        </p>

                        <p className="mt-4 text-lg font-semibold text-gray-800">
                          {perfil.crfa || "Não informado"}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#f8f9fc] p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/35">
                          Membro desde
                        </p>

                        <p className="mt-4 text-lg font-semibold text-gray-800">
                          {formatarData(perfil.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Perfil;
