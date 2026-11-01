
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Selectbox from "@/components/Selectbox";
import { getAxiosConfig } from "@/services/auth";
import Back from "@/assets/icons/back.svg";

const API_URL = "http://localhost:4000";

const gruposFonemas = [
  {
    nome: "Oclusivos",
    fonemas: ["/p/", "/b/", "/t/", "/d/", "/k/", "/g/"],
    cor: "amarelo",
  },
  {
    nome: "Fricativos",
    fonemas: ["/f/", "/v/", "/s/", "/z/", "/ʃ/", "/ʒ/"],
    cor: "turquesa",
  },
  {
    nome: "Nasais",
    fonemas: ["/m/", "/n/", "/ɲ/"],
    cor: "roxo",
  },
  {
    nome: "Líquidos",
    fonemas: ["/l/", "/ʎ/", "/ɾ/", "/r/"],
    cor: "salmao",
  },
];

const estilosFonemas = {
  amarelo: {
    fundo: "bg-amarelo/30",
    ativo: "peer-checked:bg-amarelo",
  },
  turquesa: {
    fundo: "bg-turquesa/30",
    ativo: "peer-checked:bg-turquesa",
  },
  roxo: {
    fundo: "bg-roxo/30",
    ativo: "peer-checked:bg-roxo",
  },
  salmao: {
    fundo: "bg-salmao/30",
    ativo: "peer-checked:bg-salmao",
  },
};

const posicoesDisponiveis = [
  { valor: "inicial", rotulo: "Inicial" },
  { valor: "medial", rotulo: "Medial" },
  { valor: "final", rotulo: "Final" },
];

const diasDisponiveis = [
  { valor: 1, letra: "S", nome: "Segunda-feira" },
  { valor: 2, letra: "T", nome: "Terça-feira" },
  { valor: 3, letra: "Q", nome: "Quarta-feira" },
  { valor: 4, letra: "Q", nome: "Quinta-feira" },
  { valor: 5, letra: "S", nome: "Sexta-feira" },
  { valor: 6, letra: "S", nome: "Sábado" },
  { valor: 0, letra: "D", nome: "Domingo" },
];

function dadosIniciais() {
  return {
    fonemas: [],
    posicoes: [],
    tempo_pratica: 15,
    dias_semana: [],
  };
}

export default function Atividade() {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState("");

  const [atividadesPaciente, setAtividadesPaciente] =
    useState([]);

  const [atividadeSelecionada, setAtividadeSelecionada] =
    useState("");

  const [fonemas, setFonemas] = useState([]);
  const [posicoes, setPosicoes] = useState([]);
  const [tempoPratica, setTempoPratica] = useState(15);
  const [diasSemana, setDiasSemana] = useState([]);

  const [carregandoPacientes, setCarregandoPacientes] =
    useState(true);

  const [carregandoAtividades, setCarregandoAtividades] =
    useState(false);

  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarPacientes() {
      try {
        const resposta = await axios.get(
          `${API_URL}/api/pacientes`,
          {
            ...getAxiosConfig(),
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        setPacientes(resposta.data?.pacientes || []);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Erro ao carregar pacientes:", error);

        toast.error(
          error.response?.data?.error ||
            "Não foi possível carregar os pacientes."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregandoPacientes(false);
        }
      }
    }

    carregarPacientes();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!pacienteSelecionado) {
      setAtividadesPaciente([]);
      setAtividadeSelecionada("");
      limparFormulario();
      return;
    }

    const controller = new AbortController();

    async function carregarAtividades() {
      setCarregandoAtividades(true);
      setAtividadesPaciente([]);
      setAtividadeSelecionada("");
      limparFormulario();

      try {
        const resposta = await axios.get(
          `${API_URL}/api/atividades`,
          {
            ...getAxiosConfig(),
            params: {
              id_paciente: pacienteSelecionado,
            },
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        const atividades = resposta.data?.atividades || [];

        setAtividadesPaciente(atividades);

        if (atividades.length > 0) {
          const atividade = atividades[0];

          setAtividadeSelecionada(atividade._id);
          preencherFormulario(atividade);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Erro ao carregar atividades:", error);

        toast.error(
          error.response?.data?.error ||
            "Não foi possível carregar as atividades do paciente."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregandoAtividades(false);
        }
      }
    }

    carregarAtividades();

    return () => controller.abort();
  }, [pacienteSelecionado]);

  function limparFormulario() {
    const dados = dadosIniciais();

    setFonemas(dados.fonemas);
    setPosicoes(dados.posicoes);
    setTempoPratica(dados.tempo_pratica);
    setDiasSemana(dados.dias_semana);
  }

  function preencherFormulario(atividade) {
    setFonemas(atividade.fonemas || []);
    setPosicoes(atividade.posicoes || []);
    setTempoPratica(
      Number(atividade.tempo_pratica) || 15
    );
    setDiasSemana(
      (atividade.dias_semana || []).map(Number)
    );
  }

  function selecionarAtividade(id) {
    setAtividadeSelecionada(id);

    if (!id) {
      limparFormulario();
      return;
    }

    const atividade = atividadesPaciente.find(
      (item) => item._id === id
    );

    if (atividade) {
      preencherFormulario(atividade);
    }
  }

  function alternarFonema(fonema) {
    setFonemas((anteriores) =>
      anteriores.includes(fonema)
        ? anteriores.filter((item) => item !== fonema)
        : [...anteriores, fonema]
    );
  }

  function alternarPosicao(posicao) {
    setPosicoes((anteriores) =>
      anteriores.includes(posicao)
        ? anteriores.filter((item) => item !== posicao)
        : [...anteriores, posicao]
    );
  }

  function alternarDia(dia) {
    setDiasSemana((anteriores) =>
      anteriores.includes(dia)
        ? anteriores.filter((item) => item !== dia)
        : [...anteriores, dia]
    );
  }

  function cancelarEdicao() {
    if (atividadeSelecionada) {
      const atividade = atividadesPaciente.find(
        (item) => item._id === atividadeSelecionada
      );

      if (atividade) {
        preencherFormulario(atividade);
      }
    } else {
      limparFormulario();
    }

    toast("Alterações não salvas descartadas.");
  }

  async function handleSalvar(evento) {
    evento.preventDefault();

    if (salvando) return;

    if (!pacienteSelecionado) {
      toast.error("Selecione um paciente.");
      return;
    }

    if (fonemas.length === 0) {
      toast.error("Selecione pelo menos um fonema.");
      return;
    }

    if (
      !Number.isInteger(Number(tempoPratica)) ||
      Number(tempoPratica) < 1 ||
      Number(tempoPratica) > 240
    ) {
      toast.error("Informe um tempo de prática válido.");
      return;
    }

    const dados = {
      fonemas,
      posicoes,
      tempo_pratica: Number(tempoPratica),
      dias_semana: [...diasSemana].sort((a, b) => a - b),
    };

    setSalvando(true);

    try {
      let resposta;

      if (atividadeSelecionada) {
        resposta = await axios.put(
          `${API_URL}/api/atividades/${atividadeSelecionada}`,
          dados,
          getAxiosConfig()
        );
      } else {
        resposta = await axios.post(
          `${API_URL}/api/atividades`,
          {
            id_paciente: pacienteSelecionado,
            ...dados,
          },
          getAxiosConfig()
        );
      }

      const atividadeSalva = resposta.data?.atividade;

      if (atividadeSalva?._id) {
        setAtividadeSelecionada(atividadeSalva._id);

        setAtividadesPaciente((anteriores) => {
          const existe = anteriores.some(
            (item) => item._id === atividadeSalva._id
          );

          if (existe) {
            return anteriores.map((item) =>
              item._id === atividadeSalva._id
                ? atividadeSalva
                : item
            );
          }

          return [atividadeSalva, ...anteriores];
        });

        preencherFormulario(atividadeSalva);
      }

      toast.success(
        resposta.data?.message ||
          (atividadeSelecionada
            ? "Atividade atualizada com sucesso!"
            : "Atividade criada com sucesso!")
      );
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Não foi possível salvar a atividade."
      );
    } finally {
      setSalvando(false);
    }
  }

  const opcoesPaciente = pacientes.map((paciente) => ({
    label: [
      paciente.nome,
      paciente.sobrenome,
    ]
      .filter(Boolean)
      .join(" "),
    value: paciente._id,
  }));

  const pacienteAtual = pacientes.find(
    (paciente) => paciente._id === pacienteSelecionado
  );

  const nomePaciente = pacienteAtual
    ? [pacienteAtual.nome, pacienteAtual.sobrenome]
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

        <main className="flex flex-col gap-6 bg-fundo p-4 font-jakarta text-sm text-text md:p-8">
          <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-text/60 sm:text-sm">
                Home /{" "}
                <span className="font-semibold text-salmao">
                  Atividades
                </span>
              </p>

              <p className="mt-2 text-sm text-text/60">
                Defina os fonemas e a rotina de prática
                de cada paciente.
              </p>
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

          <div className="flex flex-col gap-8 rounded-2xl bg-white p-5 shadow-lg md:p-8">
            <div className="flex flex-col gap-3">
              <label className="text-base font-semibold">
                Selecionar paciente
              </label>

              <Selectbox
                label="Selecionar paciente"
                name="paciente"
                value={pacienteSelecionado}
                onChange={(evento) =>
                  setPacienteSelecionado(evento.target.value)
                }
                options={opcoesPaciente}
                placeholder={
                  carregandoPacientes
                    ? "Carregando pacientes..."
                    : "Selecione um paciente..."
                }
              />

              {!carregandoPacientes &&
                pacientes.length === 0 && (
                  <p className="text-sm text-text/60">
                    Nenhum paciente ativo encontrado.
                  </p>
                )}
            </div>

            {!pacienteSelecionado && (
              <div className="py-10 md:py-16">
                <p className="text-center text-text/50">
                  Escolha um paciente para começar
                  a personalização.
                </p>
              </div>
            )}

            {pacienteSelecionado &&
              carregandoAtividades && (
                <div className="py-10 text-center text-text/50">
                  Carregando atividades do paciente...
                </div>
              )}

            {pacienteSelecionado &&
              !carregandoAtividades && (
                <form
                  onSubmit={handleSalvar}
                  className="flex flex-col gap-8"
                >

                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="atividadeExistente"
                      className="text-base font-semibold"
                    >
                      Atividade
                    </label>

                    <select
                      id="atividadeExistente"
                      value={atividadeSelecionada}
                      onChange={(evento) =>
                        selecionarAtividade(evento.target.value)
                      }
                      className="w-full rounded-2xl border border-text/20 bg-white px-4 py-3 outline-none transition focus:border-turquesa focus:ring-1 focus:ring-turquesa"
                    >
                      <option value="">
                        + Criar nova atividade
                      </option>

                      {atividadesPaciente.map(
                        (atividade, indice) => (
                          <option
                            key={atividade._id}
                            value={atividade._id}
                          >
                            {`Atividade ${
                              atividadesPaciente.length - indice
                            } - ${atividade.fonemas.join(", ")}`}
                          </option>
                        )
                      )}
                    </select>

                    <p className="text-xs text-text/60">
                      {atividadeSelecionada
                        ? "Você está editando uma atividade já salva no banco."
                        : "Você está criando uma nova atividade para este paciente."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-6">
                    <h2 className="text-base font-semibold">
                      Seleção de fonemas
                    </h2>

                    {gruposFonemas.map((grupo) => {
                      const estilos =
                        estilosFonemas[grupo.cor];

                      return (
                        <div
                          key={grupo.nome}
                          className="flex flex-col gap-4"
                        >
                          <p className="text-xs font-medium uppercase tracking-wide text-text/60">
                            {grupo.nome}
                          </p>

                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {grupo.fonemas.map((fonema) => (
                              <label
                                key={fonema}
                                className="group flex cursor-pointer items-center gap-3"
                              >
                                <input
                                  type="checkbox"
                                  checked={fonemas.includes(
                                    fonema
                                  )}
                                  onChange={() =>
                                    alternarFonema(fonema)
                                  }
                                  className="peer sr-only"
                                />

                                <div
                                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 lg:h-7 lg:w-14 ${estilos.fundo} ${estilos.ativo}
                                    after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:content-[''] after:transition-transform after:duration-300
                                    peer-checked:after:translate-x-5
                                    lg:after:h-6 lg:after:w-6 lg:peer-checked:after:translate-x-7`}
                                />

                                <span className="text-sm italic lg:text-base">
                                  {fonema}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <hr className="border-text/10" />

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="flex flex-col gap-4">
                      <h2 className="text-base font-semibold">
                        Posição
                      </h2>

                      {posicoesDisponiveis.map((posicao) => (
                        <label
                          key={posicao.valor}
                          className="flex cursor-pointer items-center gap-3"
                        >
                          <input
                            type="checkbox"
                            checked={posicoes.includes(
                              posicao.valor
                            )}
                            onChange={() =>
                              alternarPosicao(posicao.valor)
                            }
                            className="peer sr-only"
                          />

                          <div
                            className="relative h-5 w-5 shrink-0 rounded border-2 border-gray-300 transition-colors
                              peer-checked:border-salmao peer-checked:bg-salmao
                              after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-xs after:font-bold after:text-white after:opacity-0 after:content-['✓']
                              peer-checked:after:opacity-100"
                          />

                          <span className="text-gray-700">
                            {posicao.rotulo}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4">
                      <h2 className="text-base font-semibold">
                        Tempo de prática
                      </h2>

                      <input
                        type="range"
                        name="tempo_pratica"
                        min="5"
                        max="120"
                        step="5"
                        value={tempoPratica}
                        onChange={(evento) =>
                          setTempoPratica(
                            Number(evento.target.value)
                          )
                        }
                        className="w-full cursor-pointer accent-salmao"
                      />

                      <p className="text-text/60">
                        <span className="font-semibold text-text">
                          {tempoPratica}
                        </span>{" "}
                        minutos
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h2 className="text-base font-semibold">
                        Frequência
                      </h2>

                      <div className="flex flex-wrap gap-2">
                        {diasDisponiveis.map((dia) => (
                          <label
                            key={dia.valor}
                            className="cursor-pointer"
                            title={dia.nome}
                          >
                            <input
                              type="checkbox"
                              checked={diasSemana.includes(
                                dia.valor
                              )}
                              onChange={() =>
                                alternarDia(dia.valor)
                              }
                              className="peer sr-only"
                            />

                            <div
                              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-200 text-sm font-medium text-gray-400 transition-all
                                peer-checked:border-salmao peer-checked:bg-salmao peer-checked:text-white"
                            >
                              {dia.letra}
                            </div>
                          </label>
                        ))}
                      </div>

                      <p className="text-xs text-text/50">
                        Selecione os dias de prática.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2 md:justify-end">
                    <button
                      type="button"
                      onClick={cancelarEdicao}
                      disabled={salvando}
                      className="rounded-xl bg-red-500 px-8 py-3 font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={salvando}
                      className="rounded-xl bg-turquesa px-8 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {salvando
                        ? "Salvando..."
                        : atividadeSelecionada
                          ? "Atualizar atividade"
                          : "Criar atividade"}
                    </button>
                  </div>
                </form>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
