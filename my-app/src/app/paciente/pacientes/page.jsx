
"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ListaPaciente from "@/components/ListaPaciente";

import Profile from "@/assets/profile.png";
import Add from "@/assets/icons/add.svg";
import Filtrar from "@/assets/icons/filtrar.svg";
import Back from "@/assets/icons/back.svg";

import { getAxiosConfig } from "@/services/auth";
import { getImageUrl } from "@/utils/page";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

function ConteudoPacientes() {
  const searchParams = useSearchParams();
  const pacienteDaPesquisa = searchParams.get("paciente");

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const pacienteDestacadoRef = useRef(null);
  const jaRolouRef = useRef("");

  useEffect(() => {
    const controller = new AbortController();

    async function buscarPacientes() {
      setCarregando(true);

      try {
        const resposta = await axios.get(
          `${API_URL}/api/pacientes`,
          {
            ...getAxiosConfig(),
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        const dados = Array.isArray(resposta.data)
          ? resposta.data
          : resposta.data?.pacientes || [];

        setPacientes(dados);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Erro ao buscar pacientes:", error);

        toast.error(
          error.response?.data?.error ||
            "Não foi possível carregar os pacientes."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    buscarPacientes();

    return () => controller.abort();
  }, []);

  const pacientesFiltrados = useMemo(() => {
    if (pacienteDaPesquisa) {
      return pacientes.filter(
        (paciente) =>
          String(paciente._id || paciente.id) ===
          String(pacienteDaPesquisa)
      );
    }

    if (filtro === "ativos") {
      return pacientes.filter(
        (paciente) => paciente.ativo === true
      );
    }

    if (filtro === "inativos") {
      return pacientes.filter(
        (paciente) => paciente.ativo === false
      );
    }

    return pacientes;
  }, [pacientes, filtro, pacienteDaPesquisa]);

  const pacienteEncontrado = pacienteDaPesquisa
    ? pacientes.find(
        (paciente) =>
          String(paciente._id || paciente.id) ===
          String(pacienteDaPesquisa)
      )
    : null;

  useEffect(() => {
    if (
      !pacienteDaPesquisa ||
      !pacienteEncontrado ||
      carregando
    ) {
      return;
    }

    if (jaRolouRef.current === pacienteDaPesquisa) {
      return;
    }

    jaRolouRef.current = pacienteDaPesquisa;

    const timeout = setTimeout(() => {
      pacienteDestacadoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [pacienteDaPesquisa, pacienteEncontrado, carregando]);

  function handlePacienteExcluido(pacienteId) {
    setPacientes((anteriores) =>
      anteriores.filter(
        (paciente) =>
          String(paciente._id || paciente.id) !==
          String(pacienteId)
      )
    );
  }

  function selecionarFiltro(novoFiltro) {
    setFiltro(novoFiltro);
    setFiltrosAbertos(false);
  }

  function limparPesquisa() {
    jaRolouRef.current = "";
  }

  const nomePacienteEncontrado = pacienteEncontrado
    ? [
        pacienteEncontrado.nome,
        pacienteEncontrado.sobrenome,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarAberta}
        onClose={() => setSidebarAberta(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40">
          <Navbar
            onToggleMenu={() =>
              setSidebarAberta((anterior) => !anterior)
            }
          />
        </header>

        <main className="flex flex-col gap-4 p-4 font-jakarta text-sm text-text md:p-8">
          <div className="hidden px-2 lg:block">
            <p>
              Home /{" "}
              <span className="font-semibold text-salmao">
                Pacientes
              </span>
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href="/paciente/cadastro"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-lg transition hover:bg-gray-50"
            >
              <img
                src={Add.src || Add}
                className="w-5"
                alt=""
              />

              <span className="sm:hidden">
                Cadastrar
              </span>

              <span className="hidden sm:block">
                Cadastrar Paciente
              </span>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setFiltrosAbertos((anterior) => !anterior)
                }
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-lg transition hover:bg-gray-50"
              >
                <img
                  src={Filtrar.src || Filtrar}
                  className="w-5"
                  alt=""
                />

                <span>Filtrar</span>
              </button>

              {filtrosAbertos && (
                <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                  {[
                    {
                      valor: "todos",
                      rotulo: "Todos",
                    },
                    {
                      valor: "ativos",
                      rotulo: "Ativos",
                    },
                    {
                      valor: "inativos",
                      rotulo: "Inativos",
                    },
                  ].map((opcao) => (
                    <button
                      key={opcao.valor}
                      type="button"
                      onClick={() =>
                        selecionarFiltro(opcao.valor)
                      }
                      className={`block w-full cursor-pointer px-4 py-2.5 text-left transition hover:bg-fundo ${
                        filtro === opcao.valor
                          ? "font-semibold text-salmao"
                          : "text-text"
                      }`}
                    >
                      {opcao.rotulo}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/home"
              className="flex h-10 w-10 items-center justify-center self-end rounded-full bg-white shadow transition hover:bg-gray-100 sm:self-auto"
              title="Voltar"
            >
              <img
                src={Back.src || Back}
                alt="Voltar"
                className="w-5"
              />
            </Link>
          </div>

          {pacienteDaPesquisa && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-turquesa/30 bg-turquesa/10 px-4 py-3">
              <div>
                <p className="text-xs text-text/60">
                  Resultado da pesquisa
                </p>

                <p className="font-semibold text-text">
                  {carregando
                    ? "Localizando paciente..."
                    : pacienteEncontrado
                      ? nomePacienteEncontrado
                      : "Paciente não encontrado"}
                </p>
              </div>

              <Link
                href="/paciente/pacientes"
                onClick={limparPesquisa}
                className="rounded-lg bg-white px-4 py-2 font-semibold text-salmao shadow-sm transition hover:bg-gray-50"
              >
                Ver todos
              </Link>
            </div>
          )}

          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-text/15 px-4 py-5 text-sm font-semibold md:grid-cols-[3fr_1fr_1fr] md:px-8 md:text-base xl:grid-cols-[3fr_1fr_1fr_1fr]">
              <span>Paciente</span>
              <span>Nível</span>
              <span className="hidden xl:block">
                Status
              </span>
              <span>Ações</span>
            </div>

            {carregando ? (
              <div className="p-10 text-center text-text/60">
                Carregando pacientes...
              </div>
            ) : pacientesFiltrados.length > 0 ? (
              pacientesFiltrados.map((paciente) => {
                const id = paciente._id || paciente.id;

                const destacado =
                  pacienteDaPesquisa &&
                  String(id) === String(pacienteDaPesquisa);

                return (
                  <div
                    key={id}
                    ref={
                      destacado
                        ? pacienteDestacadoRef
                        : null
                    }
                    className={
                      destacado
                        ? "bg-turquesa/10 ring-2 ring-inset ring-turquesa/40"
                        : ""
                    }
                  >
                    <ListaPaciente
                      id={id}
                      imagem={getImageUrl(
                        paciente.foto_perfil,
                        Profile.src || Profile
                      )}
                      nome={[
                        paciente.nome,
                        paciente.sobrenome,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      nivel={
                        paciente.nivel_gravidade || "N/A"
                      }
                      status={
                        paciente.ativo
                          ? "Em andamento"
                          : "Inativo"
                      }
                      onExcluir={handlePacienteExcluido}
                    />
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-text/60">
                {pacienteDaPesquisa
                  ? "O paciente selecionado não foi encontrado."
                  : "Nenhum paciente encontrado."}
              </div>
            )}

            <div className="flex flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row md:px-8">
              <span className="text-xs text-text/50 md:text-sm">
                Mostrando {pacientesFiltrados.length} de{" "}
                {pacientes.length} pacientes
              </span>

              <span className="rounded-lg bg-salmao px-3 py-1.5 text-sm font-medium text-white">
                1
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Pacientes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-fundo">
          <p className="text-sm text-text/60">
            Carregando pacientes...
          </p>
        </div>
      }
    >
      <ConteudoPacientes />
    </Suspense>
  );
}
