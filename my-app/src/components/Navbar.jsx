"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { getAxiosConfig } from "@/services/auth";

import Menu from "@/assets/icons/icon-menu-salmao.svg";
import Pesquisar from "@/assets/icons/icon-search.svg";
import Notificacao from "@/assets/icons/icon-notif.svg";

const API_URL = "http://localhost:4000";

export default function Navbar({ onToggleMenu }) {
  const router = useRouter();
  const areaPesquisaRef = useRef(null);
  const campoPesquisaRef = useRef(null);

  const [agora, setAgora] = useState(null);
  const [pesquisaAberta, setPesquisaAberta] = useState(false);
  const [termo, setTermo] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erroPesquisa, setErroPesquisa] = useState(false);

  useEffect(() => {
    setAgora(new Date());

    const intervalo = setInterval(() => {
      setAgora(new Date());
    }, 60000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!pesquisaAberta) return;

    const controller = new AbortController();

    async function carregarPacientes() {
      setCarregando(true);
      setErroPesquisa(false);

      try {
        const resposta = await axios.get(`${API_URL}/api/pacientes`, {
          ...getAxiosConfig(),
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setPacientes(
          Array.isArray(resposta.data?.pacientes)
            ? resposta.data.pacientes
            : [],
        );
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Erro na pesquisa:", error);
        setErroPesquisa(true);
        toast.error("Não foi possível buscar os pacientes.");
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarPacientes();

    return () => controller.abort();
  }, [pesquisaAberta]);

  useEffect(() => {
    function clicarFora(evento) {
      if (
        areaPesquisaRef.current &&
        !areaPesquisaRef.current.contains(evento.target)
      ) {
        setPesquisaAberta(false);
      }
    }

    function pressionarTecla(evento) {
      if (evento.key === "Escape") {
        setPesquisaAberta(false);
      }
    }

    document.addEventListener("mousedown", clicarFora);
    document.addEventListener("keydown", pressionarTecla);

    return () => {
      document.removeEventListener("mousedown", clicarFora);
      document.removeEventListener("keydown", pressionarTecla);
    };
  }, []);

  function abrirPesquisa() {
    setPesquisaAberta(true);

    requestAnimationFrame(() => {
      campoPesquisaRef.current?.focus();
    });
  }

  function fecharPesquisa() {
    setPesquisaAberta(false);
    setTermo("");
  }

  function abrirPaciente(paciente) {
    fecharPesquisa();
    router.push(`/paciente/pacientes?paciente=${paciente._id}`);
  }

  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  const termoNormalizado = normalizar(termo);

  const resultados = termoNormalizado
    ? pacientes
        .filter((paciente) => {
          const nomeCompleto = [paciente.nome, paciente.sobrenome]
            .filter(Boolean)
            .join(" ");

          return normalizar(nomeCompleto).includes(termoNormalizado);
        })
        .slice(0, 6)
    : [];

  const dataFormatada = agora
    ? new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(agora)
    : "";

  const horaFormatada = agora
    ? new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(agora)
    : "--:--";

  return (
    <div className="relative flex min-h-20 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 font-jakarta text-text shadow-sm sm:px-6 lg:min-h-24 lg:px-8">
      <button
        type="button"
        onClick={onToggleMenu}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl transition hover:bg-gray-50 active:scale-95 lg:hidden"
        aria-label="Abrir menu"
      >
        <img src={Menu.src || Menu} className="w-7" alt="" />
      </button>

      <div className="hidden min-w-0 flex-1 lg:block">
        <h1 className="text-lg font-semibold xl:text-xl">
          Painel Administrativo
        </h1>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm text-text/60">
            {dataFormatada || "Carregando data..."}
          </span>

          <span className="h-1 w-1 rounded-full bg-text/30" />

          <span className="flex items-center gap-1.5 text-sm font-medium text-salmao">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>

            {horaFormatada}
          </span>
        </div>
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-4">
        <div ref={areaPesquisaRef} className="relative flex items-center">
          <div
            className={`flex items-center gap-2 rounded-2xl border bg-gray-50 transition-all duration-200 ${
              pesquisaAberta
                ? "w-[min(65vw,320px)] border-turquesa px-3 py-2 shadow-sm sm:w-80"
                : "w-10 border-transparent p-2 lg:w-64 lg:border-gray-100 lg:px-3 lg:py-2 xl:w-72"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                if (!pesquisaAberta) {
                  abrirPesquisa();
                } else {
                  campoPesquisaRef.current?.focus();
                }
              }}
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center"
              aria-label="Pesquisar pacientes"
            >
              <img src={Pesquisar.src || Pesquisar} className="w-5" alt="" />
            </button>

            <input
              ref={campoPesquisaRef}
              type="search"
              value={termo}
              onChange={(evento) => {
                setTermo(evento.target.value);
                if (!pesquisaAberta) {
                  setPesquisaAberta(true);
                }
              }}
              onFocus={() => setPesquisaAberta(true)}
              placeholder="Pesquisar pacientes..."
              aria-label="Pesquisar pacientes"
              className={`min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text/40 ${
                pesquisaAberta ? "block" : "hidden lg:block"
              }`}
            />

            {pesquisaAberta && (
              <button
                type="button"
                onClick={fecharPesquisa}
                className="shrink-0 cursor-pointer text-lg leading-none text-text/50 transition hover:text-text"
                aria-label="Fechar pesquisa"
              >
                ×
              </button>
            )}
          </div>

          {pesquisaAberta && (
            <div className="absolute right-0 top-full z-[60] mt-3 w-[min(90vw,380px)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-text/50">
                  Pacientes
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {carregando ? (
                  <p className="px-4 py-6 text-center text-sm text-text/50">
                    Buscando pacientes...
                  </p>
                ) : erroPesquisa ? (
                  <p className="px-4 py-6 text-center text-sm text-red-500">
                    Não foi possível carregar os pacientes.
                  </p>
                ) : !termoNormalizado ? (
                  <p className="px-4 py-6 text-center text-sm text-text/50">
                    Digite o nome de um paciente para pesquisar.
                  </p>
                ) : resultados.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-text/50">
                    Nenhum paciente encontrado.
                  </p>
                ) : (
                  <ul className="py-2">
                    {resultados.map((paciente) => {
                      const nome = [paciente.nome, paciente.sobrenome]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <li key={paciente._id}>
                          <button
                            type="button"
                            onClick={() => abrirPaciente(paciente)}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition hover:bg-fundo"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-salmao/15 font-semibold text-salmao">
                              {nome.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-text">
                                {nome}
                              </p>

                              <p className="text-xs text-text/50">
                                Ver cadastro do paciente
                              </p>
                            </div>

                            <span className="text-lg text-text/30">›</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="border-t border-gray-100 px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    fecharPesquisa();
                    router.push("/paciente/pacientes");
                  }}
                  className="w-full cursor-pointer text-center text-sm font-semibold text-salmao transition hover:underline"
                >
                  Ver todos os pacientes
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            toast("As notificações do painel ainda não estão disponíveis.")
          }
          className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl transition hover:bg-gray-50"
          aria-label="Notificações"
          title="Notificações"
        >
          <img src={Notificacao.src || Notificacao} className="w-5" alt="" />
        </button>
      </div>
    </div>
  );
}
