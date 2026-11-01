
"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { getAxiosConfig } from "@/services/auth";
import { getImageUrl } from "@/utils/page";
import Profile from "@/assets/profile.png";

const API_URL = "http://localhost:4000/api";

const Mensagem = () => {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const [conversas, setConversas] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [mensagens, setMensagens] = useState([]);

  const [busca, setBusca] = useState("");
  const [textoMensagem, setTextoMensagem] = useState("");

  const [carregandoConversas, setCarregandoConversas] = useState(true);
  const [carregandoMensagens, setCarregandoMensagens] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const mensagensFimRef = useRef(null);
  const pacienteSelecionadoRef = useRef(null);
  const requisicaoAtualRef = useRef(0);

  // Formata o horário das mensagens
  const formatarHora = (data) => {
    if (!data) return "";

    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Formata a data das mensagens
  const formatarData = (data) => {
    if (!data) return "";

    return new Date(data).toLocaleDateString("pt-BR");
  };

  // Busca todas as conversas da fono
  const buscarConversas = async (mostrarCarregamento = false) => {
    try {
      if (mostrarCarregamento) {
        setCarregandoConversas(true);
      }

      const response = await axios.get(
        `${API_URL}/mensagens`,
        getAxiosConfig()
      );

      setConversas(response.data.conversas || []);
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);

      if (mostrarCarregamento) {
        toast.error("Não foi possível carregar as conversas.");
      }
    } finally {
      if (mostrarCarregamento) {
        setCarregandoConversas(false);
      }
    }
  };

  // Busca as mensagens de um paciente
  const buscarMensagens = async (
    idPaciente,
    mostrarCarregamento = false
  ) => {
    const numeroRequisicao = ++requisicaoAtualRef.current;

    try {
      if (mostrarCarregamento) {
        setCarregandoMensagens(true);
      }

      const response = await axios.get(
        `${API_URL}/mensagens/${idPaciente}`,
        getAxiosConfig()
      );

      // Evita mostrar mensagens de outro paciente
      if (
        pacienteSelecionadoRef.current !== idPaciente ||
        numeroRequisicao !== requisicaoAtualRef.current
      ) {
        return;
      }

      setMensagens(response.data.mensagens || []);

      // Ao abrir, o backend marca mensagens recebidas como lidas
      setConversas((anteriores) =>
        anteriores.map((conversa) =>
          String(conversa.id_paciente) === String(idPaciente)
            ? { ...conversa, nao_lidas: 0 }
            : conversa
        )
      );
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);

      if (
        mostrarCarregamento &&
        pacienteSelecionadoRef.current === idPaciente
      ) {
        toast.error("Não foi possível carregar as mensagens.");
      }
    } finally {
      if (
        mostrarCarregamento &&
        pacienteSelecionadoRef.current === idPaciente
      ) {
        setCarregandoMensagens(false);
      }
    }
  };

  // Carrega as conversas quando a página abre
  useEffect(() => {
    buscarConversas(true);
  }, []);

  // Atualiza as conversas e mensagens a cada 10 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      buscarConversas();

      if (pacienteSelecionadoRef.current) {
        buscarMensagens(pacienteSelecionadoRef.current);
      }
    }, 10000);

    return () => clearInterval(intervalo);
  }, []);

  // Abre a conversa selecionada
  const abrirConversa = async (conversa) => {
    const idPaciente = String(conversa.id_paciente);

    pacienteSelecionadoRef.current = idPaciente;

    setPacienteSelecionado(conversa);
    setMensagens([]);

    await buscarMensagens(idPaciente, true);
  };

  // Envia mensagem
  const enviarMensagem = async (e) => {
    e.preventDefault();

    const texto = textoMensagem.trim();

    if (!texto) {
      toast.error("Digite uma mensagem.");
      return;
    }

    if (texto.length > 1000) {
      toast.error("A mensagem deve ter até 1000 caracteres.");
      return;
    }

    if (!pacienteSelecionado || enviando) return;

    const idPaciente = String(pacienteSelecionado.id_paciente);

    try {
      setEnviando(true);

      const response = await axios.post(
        `${API_URL}/mensagens/${idPaciente}`,
        { texto },
        getAxiosConfig()
      );

      // Só atualiza o chat se a conversa ainda for a mesma
      if (pacienteSelecionadoRef.current === idPaciente) {
        setMensagens((anteriores) => [
          ...anteriores,
          response.data.mensagem,
        ]);
      }

      setTextoMensagem("");

      // Atualiza a lista lateral
      await buscarConversas();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      toast.error(
        error.response?.data?.error ||
        "Não foi possível enviar a mensagem."
      );
    } finally {
      setEnviando(false);
    }
  };

  // Filtra as conversas pela busca
  const conversasFiltradas = conversas.filter((conversa) =>
    conversa.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase().trim())
  );

  // Mantém as mensagens em ordem cronológica
  const mensagensOrdenadas = [...mensagens].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Rola até a mensagem mais recente
  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mensagens]);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarAberta}
          onClose={() => setSidebarAberta(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40">
            <Navbar
              onToggleMenu={() =>
                setSidebarAberta(!sidebarAberta)
              }
            />
          </header>

          <main
            className="text-text font-jakarta text-sm p-4 md:p-8 flex flex-col gap-4"
            style={{ height: "calc(100vh - 64px)" }}
          >
            {/* Breadcrumb */}
            <div className="hidden lg:block px-2">
              <p>
                Home /{" "}
                <span className="text-salmao font-semibold">
                  Mensagens
                </span>
              </p>
            </div>

            <div className="flex gap-4 flex-1 min-h-0">
              {/* LISTA DE CONVERSAS */}
              <div
                className={`${
                  pacienteSelecionado
                    ? "hidden md:flex"
                    : "flex"
                } w-full md:w-72 xl:w-80 bg-white shadow-lg rounded-xl flex-col min-h-0 shrink-0`}
              >
                <div className="p-4 border-b border-text/10 flex flex-col gap-3">
                  <p className="font-semibold text-base">
                    Conversas
                  </p>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar paciente..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
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
                  {carregandoConversas ? (
                    <p className="text-center text-text/50 py-10 px-4">
                      Carregando conversas...
                    </p>
                  ) : conversasFiltradas.length === 0 ? (
                    <p className="text-center text-text/50 py-10 px-4">
                      {busca
                        ? "Nenhuma conversa encontrada."
                        : "Nenhuma conversa iniciada ainda."}
                    </p>
                  ) : (
                    conversasFiltradas.map((conversa) => {
                      const selecionada =
                        String(pacienteSelecionado?.id_paciente) ===
                        String(conversa.id_paciente);

                      return (
                        <button
                          key={conversa.id_paciente}
                          type="button"
                          onClick={() => abrirConversa(conversa)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition ${
                            selecionada
                              ? "bg-turquesa/10 border-l-4 border-turquesa"
                              : "hover:bg-gray-50 border-l-4 border-transparent"
                          }`}
                        >
                          <img
                            src={Profile.src || Profile}
                            alt="Foto do paciente"
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline gap-1">
                              <p className="font-semibold text-sm truncate">
                                {conversa.nome}
                              </p>

                              <span className="text-[10px] text-text/40 shrink-0">
                                {formatarHora(
                                  conversa.ultima?.createdAt
                                )}
                              </span>
                            </div>

                            <p className="text-xs text-text/50 truncate">
                              {conversa.ultima?.autor === "fono"
                                ? "Você: "
                                : ""}
                              {conversa.ultima?.texto}
                            </p>
                          </div>

                          {conversa.nao_lidas > 0 && (
                            <span className="min-w-5 h-5 px-1 bg-salmao text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                              {conversa.nao_lidas}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ÁREA DO CHAT */}
              <div
                className={`${
                  pacienteSelecionado
                    ? "flex"
                    : "hidden md:flex"
                } flex-1 bg-white shadow-lg rounded-xl flex-col min-h-0 min-w-0`}
              >
                {!pacienteSelecionado ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-turquesa/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-turquesa"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 10h8m-8 4h5m-9 7 3.5-3.5A9 9 0 1 0 3 12c0 2 .5 3.5 1.5 5L4 21z"
                        />
                      </svg>
                    </div>

                    <p className="font-semibold text-base">
                      Suas mensagens
                    </p>

                    <p className="text-text/50 max-w-xs">
                      Selecione uma conversa para visualizar
                      as mensagens dos responsáveis.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* CABEÇALHO DO CHAT */}
                    <div className="flex items-center gap-3 px-4 md:px-5 py-4 border-b border-text/10">
                      <button
                        type="button"
                        onClick={() => {
                          pacienteSelecionadoRef.current = null;
                          requisicaoAtualRef.current += 1;
                          setPacienteSelecionado(null);
                          setMensagens([]);
                          setCarregandoMensagens(false);
                        }}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                        aria-label="Voltar para conversas"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 18l-6-6 6-6"
                          />
                        </svg>
                      </button>

                      <img
                        src={Profile.src || Profile}
                        alt="Foto do paciente"
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {pacienteSelecionado.nome}
                        </p>

                        <p className="text-xs text-text/50">
                          Conversa com o responsável
                        </p>
                      </div>
                    </div>

                    {/* MENSAGENS */}
                    <div className="flex-1 overflow-y-auto px-4 md:px-5 py-6 flex flex-col gap-4">
                      {carregandoMensagens ? (
                        <p className="text-center text-text/50 py-10">
                          Carregando mensagens...
                        </p>
                      ) : mensagensOrdenadas.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-text/50 text-center">
                            Nenhuma mensagem nesta conversa.
                          </p>
                        </div>
                      ) : (
                        mensagensOrdenadas.map((mensagem) => {
                          const enviadaPelaFono =
                            mensagem.autor === "fono";

                          return (
                            <div
                              key={mensagem._id}
                              className={`flex gap-2 items-end max-w-[85%] md:max-w-[70%] ${
                                enviadaPelaFono
                                  ? "self-end justify-end"
                                  : "self-start"
                              }`}
                            >
                              {!enviadaPelaFono && (
                                <img
                                  src={Profile.src || Profile}
                                  alt="Responsável"
                                  className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                                />
                              )}

                              <div className="min-w-0">
                                <div
                                  className={`rounded-2xl px-4 py-2.5 ${
                                    enviadaPelaFono
                                      ? "bg-turquesa/20 rounded-br-sm"
                                      : "bg-gray-100 rounded-bl-sm"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {mensagem.texto}
                                  </p>
                                </div>

                                <p
                                  className={`text-[10px] text-text/30 mt-1 ${
                                    enviadaPelaFono
                                      ? "text-right mr-1"
                                      : "ml-1"
                                  }`}
                                >
                                  {formatarData(
                                    mensagem.createdAt
                                  )}{" "}
                                  às{" "}
                                  {formatarHora(
                                    mensagem.createdAt
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}

                      <div ref={mensagensFimRef} />
                    </div>

                    {/* CAMPO DE ENVIO */}
                    <form
                      onSubmit={enviarMensagem}
                      className="px-4 py-4 border-t border-text/10"
                    >
                      <div className="flex items-center gap-2 bg-gray-50 border border-text/15 rounded-2xl px-4 py-2">
                        <input
                          type="text"
                          value={textoMensagem}
                          onChange={(e) =>
                            setTextoMensagem(e.target.value)
                          }
                          maxLength={1000}
                          placeholder="Digite uma mensagem..."
                          disabled={enviando}
                          className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none disabled:opacity-50"
                        />

                        <button
                          type="submit"
                          disabled={
                            enviando ||
                            !textoMensagem.trim()
                          }
                          className="p-2 bg-salmao rounded-xl hover:bg-salmao/80 transition shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Enviar mensagem"
                        >
                          {enviando ? (
                            <span className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 fill-white"
                              viewBox="0 0 24 24"
                            >
                              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <p className="text-[10px] text-text/40 text-right mt-2">
                        {textoMensagem.length}/1000
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Mensagem;
