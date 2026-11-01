
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { getAxiosConfig, logout } from "@/services/auth";

import Menu from "@/assets/icons/icon-menu-salmao.svg";
import Home from "@/assets/icons/icon-home.svg";
import Usuario from "@/assets/icons/icon-usuario.svg";
import Grafico from "@/assets/icons/icon-grafico.svg";
import Exercicio from "@/assets/icons/exercicios.svg";
import Chat from "@/assets/icons/chat.svg";
import Perfil from "@/assets/icons/perfil.svg";
import Config from "@/assets/icons/icon-config.svg";
import Sair from "@/assets/icons/icon-exit.svg";

const API_URL = "http://localhost:4000";

const relatorios = [
  {
    nome: "Visão geral",
    href: "/relatorios",
  },
  {
    nome: "Dificuldades por fonema",
    href: "/relatorios/fonema",
  },
  {
    nome: "Atividade diária",
    href: "/relatorios/atividade",
  },
  {
    nome: "Evolução de acertos",
    href: "/relatorios/evolucao",
  },
];

const menuPrincipal = [
  {
    nome: "Home",
    href: "/home",
    icone: Home,
  },
  {
    nome: "Pacientes",
    href: "/paciente/pacientes",
    icone: Usuario,
  },
];

const menuSecundario = [
  {
    nome: "Atividades",
    href: "/atividade",
    icone: Exercicio,
  },
  {
    nome: "Mensagens",
    href: "/mensagem",
    icone: Chat,
  },
];

const menuConta = [
  {
    nome: "Perfil",
    href: "/perfil",
    icone: Perfil,
  },
  {
    nome: "Configurações",
    href: "/configuracoes",
    icone: Config,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();

  const estaEmRelatorios =
    pathname === "/relatorios" ||
    pathname.startsWith("/relatorios/");

  const [relatoriosAbertos, setRelatoriosAbertos] =
    useState(estaEmRelatorios);

  const [fonoaudiologa, setFonoaudiologa] = useState(null);
  const [tipoConta, setTipoConta] = useState("");
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [erroPerfil, setErroPerfil] = useState(false);
  const [erroFoto, setErroFoto] = useState(false);

  useEffect(() => {
    if (estaEmRelatorios) {
      setRelatoriosAbertos(true);
    }
  }, [estaEmRelatorios]);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarPerfil() {
      setCarregandoPerfil(true);
      setErroPerfil(false);

      try {
        const resposta = await axios.get(
          `${API_URL}/api/fonoaudiologos/me`,
          {
            ...getAxiosConfig(),
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        const dados = resposta.data;

        setFonoaudiologa(
          dados?.fonoaudiologo || dados?.fonoaudiologa || null
        );

        setTipoConta(dados?.conta?.tipo || "Fono");
        setErroFoto(false);
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        console.error("Erro ao carregar perfil:", error);
        setErroPerfil(true);
      } finally {
        if (!controller.signal.aborted) {
          setCarregandoPerfil(false);
        }
      }
    }

    carregarPerfil();

    return () => controller.abort();
  }, []);

  const nomeFono = fonoaudiologa?.nome || "";

  const fotoOriginal = fonoaudiologa?.foto_perfil;

  const fotoPerfil = fotoOriginal
    ? /^https?:\/\//i.test(fotoOriginal)
      ? fotoOriginal
      : `${API_URL}/${String(fotoOriginal).replace(/^\/+/, "")}`
    : null;

  const cargo =
    tipoConta.toLowerCase() === "fono"
      ? "Fonoaudióloga"
      : tipoConta || "Profissional";

  function paginaAtiva(href) {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  function fecharMenu() {
    onClose?.();
  }

  function handleSair() {
    logout(router);
    toast.success("Sessão encerrada com sucesso!");
    fecharMenu();
  }

  function classeLink(ativo) {
    return `flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition-all duration-150 ${
      ativo
        ? "bg-white/20 text-white shadow-sm"
        : "text-white/75 hover:bg-white/10 hover:pl-[18px] hover:text-white"
    }`;
  }

  function renderizarLink(item) {
    const ativo = paginaAtiva(item.href);

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={fecharMenu}
          aria-current={ativo ? "page" : undefined}
          className={classeLink(ativo)}
        >
          <img
            src={item.icone.src || item.icone}
            className="w-5 shrink-0"
            alt=""
          />

          <span>{item.nome}</span>

          {ativo && (
            <span className="ml-auto h-2 w-2 rounded-full bg-turquesa" />
          )}
        </Link>
      </li>
    );
  }

  return (
    <>
      <div
        onClick={fecharMenu}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "block opacity-100"
            : "pointer-events-none hidden opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-4/5 max-w-[280px] flex-col bg-salmao shadow-2xl transition-transform duration-300 ease-in-out sm:w-72 lg:sticky lg:top-0 lg:w-[260px] lg:shadow-none ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex justify-end px-5 pt-5 lg:hidden">
          <button
            type="button"
            onClick={fecharMenu}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
            title="Fechar menu"
            aria-label="Fechar menu"
          >
            <img
              src={Menu.src || Menu}
              className="w-6"
              alt=""
            />
          </button>
        </div>

        <div className="px-5 pb-4 pt-6">
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/90 text-lg font-semibold text-salmao ring-2 ring-turquesa/70">
                  {fotoPerfil && !erroFoto ? (
                    <img
                      src={fotoPerfil}
                      className="h-full w-full object-cover"
                      alt={`Foto de ${nomeFono || "perfil"}`}
                      onError={() => setErroFoto(true)}
                    />
                  ) : (
                    <span>
                      {nomeFono.charAt(0).toUpperCase() || "F"}
                    </span>
                  )}
                </div>

                <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-turquesa ring-2 ring-salmao" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-[16px] font-semibold text-white"
                  title={nomeFono}
                >
                  {carregandoPerfil
                    ? "Carregando..."
                    : erroPerfil
                      ? "Perfil indisponível"
                      : nomeFono || "Fonoaudióloga"}
                </p>

                <span className="inline-block mt-1 max-w-full truncate rounded-full bg-turquesa/20 px-2 py-0.5 text-[11px] text-white ring-1 ring-turquesa/40">
                  {carregandoPerfil
                    ? "Aguarde..."
                    : cargo}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Navegação principal"
        >
          <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-widest text-white/50">
            Menu
          </p>

          <ul className="flex flex-col gap-1 text-white">
            {menuPrincipal.map(renderizarLink)}

            <li>
              <button
                type="button"
                onClick={() =>
                  setRelatoriosAbertos(
                    (anterior) => !anterior
                  )
                }
                aria-expanded={relatoriosAbertos}
                aria-controls="submenu-relatorios"
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[15px] font-medium transition-all duration-150 ${
                  estaEmRelatorios
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <img
                  src={Grafico.src || Grafico}
                  className="w-5 shrink-0"
                  alt=""
                />

                <span className="flex-1">
                  Relatórios
                </span>

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`shrink-0 transition-transform duration-200 ${
                    relatoriosAbertos
                      ? "rotate-180"
                      : ""
                  }`}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {relatoriosAbertos && (
                <ul
                  id="submenu-relatorios"
                  className="ml-5 mt-1 flex flex-col gap-1 border-l border-white/25 pl-3"
                >
                  {relatorios.map((item) => {
                    const ativo = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={fecharMenu}
                          aria-current={
                            ativo ? "page" : undefined
                          }
                          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-150 ${
                            ativo
                              ? "bg-white/15 font-semibold text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              ativo
                                ? "bg-turquesa"
                                : "bg-white/40"
                            }`}
                          />

                          <span className="flex-1">
                            {item.nome}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            {menuSecundario.map(renderizarLink)}
          </ul>

          <p className="px-3 pb-1 pt-4 text-[10px] font-medium uppercase tracking-widest text-white/50">
            Conta
          </p>

          <ul className="flex flex-col gap-1 text-white">
            {menuConta.map(renderizarLink)}
          </ul>
        </nav>

        <div className="shrink-0 px-3 pb-5 pt-2">
          <div className="mb-3 h-px bg-white/20" />

          <button
            type="button"
            onClick={handleSair}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 text-[15px] font-medium text-white/70 transition-all hover:border-white/25 hover:bg-white/15 hover:text-white"
          >
            <img
              src={Sair.src || Sair}
              className="w-5 shrink-0"
              alt=""
            />

            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
