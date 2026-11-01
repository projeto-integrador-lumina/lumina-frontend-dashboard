"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getAxiosConfig } from "@/services/auth";
import Link from "next/link";
import Back from "@/assets/icons/back.svg";

const API_URL = "http://localhost:4000";

function dataLocal(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function periodoInicial() {
  const ate = new Date();
  const de = new Date();
  de.setDate(de.getDate() - 29);

  return {
    de: dataLocal(de),
    ate: dataLocal(ate),
  };
}

function percentual(valor) {
  return `${Number(valor || 0).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}

function corDificuldade(dificuldade) {
  if (dificuldade === "Alta") {
    return "bg-red-100 text-red-700";
  }

  if (dificuldade === "Média") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-emerald-100 text-emerald-700";
}

function Cartao({ titulo, valor, descricao }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg">
      <p className="text-sm text-text/60">{titulo}</p>

      <p className="mt-3 text-3xl font-bold text-salmao">{valor}</p>

      {descricao && <p className="mt-2 text-xs text-text/50">{descricao}</p>}
    </div>
  );
}

export default function RelatorioFonemaPage() {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [idPaciente, setIdPaciente] = useState("");
  const [periodo, setPeriodo] = useState(periodoInicial);
  const [filtros, setFiltros] = useState(null);
  const [fonemas, setFonemas] = useState([]);
  const [periodoRetornado, setPeriodoRetornado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPacientes() {
      try {
        const resposta = await axios.get(
          `${API_URL}/api/pacientes`,
          getAxiosConfig(),
        );

        if (!ativo) return;

        const dados = resposta.data;

        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados?.pacientes)
            ? dados.pacientes
            : [];

        setPacientes(lista);
      } catch (error) {
        if (!ativo) return;

        console.error(error);
      }
    }

    carregarPacientes();

    return () => {
      ativo = false;
    };
  }, []);

  const carregarRelatorio = useCallback(async (parametros, signal) => {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await axios.get(`${API_URL}/api/relatorios/fonema`, {
        ...getAxiosConfig(),
        params: {
          de: parametros.de,
          ate: parametros.ate,
          ...(parametros.id_paciente
            ? { id_paciente: parametros.id_paciente }
            : {}),
        },
        signal,
      });

      if (signal?.aborted) return;

      setFonemas(
        Array.isArray(resposta.data?.fonemas) ? resposta.data.fonemas : [],
      );

      setPeriodoRetornado(resposta.data?.periodo || null);
    } catch (error) {
      if (axios.isCancel(error) || signal?.aborted) return;

      console.error(error);

      setErro(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Não foi possível carregar o relatório por fonema.",
      );
    } finally {
      if (!signal?.aborted) {
        setCarregando(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const inicial = periodoInicial();

    carregarRelatorio(
      {
        ...inicial,
        id_paciente: "",
      },
      controller.signal,
    );

    return () => controller.abort();
  }, [carregarRelatorio]);

  function aplicarFiltros(evento) {
    evento.preventDefault();

    if (periodo.de > periodo.ate) {
      setErro("A data inicial não pode ser maior que a final.");
      return;
    }

    const parametros = {
      ...periodo,
      id_paciente: idPaciente,
    };

    setFiltros(parametros);
    carregarRelatorio(parametros);
  }

  const resumo = useMemo(() => {
    const totalTentativas = fonemas.reduce(
      (total, item) => total + (Number(item.tentativas) || 0),
      0,
    );

    const totalAcertos = fonemas.reduce(
      (total, item) => total + (Number(item.acertos) || 0),
      0,
    );

    const totalErros = fonemas.reduce(
      (total, item) => total + (Number(item.erros) || 0),
      0,
    );

    const maiorDificuldade = fonemas.length
      ? [...fonemas].sort(
          (a, b) => Number(b.taxa_erro || 0) - Number(a.taxa_erro || 0),
        )[0]
      : null;

    return {
      totalTentativas,
      totalAcertos,
      totalErros,
      taxaAcerto: totalTentativas ? (totalAcertos / totalTentativas) * 100 : 0,
      maiorDificuldade,
    };
  }, [fonemas]);

  const dadosGrafico = useMemo(() => {
    return fonemas.map((item) => ({
      fonema: item.fonema,
      acertos: Number(item.taxa_acerto) || 0,
      erros: Number(item.taxa_erro) || 0,
    }));
  }, [fonemas]);

  const pacienteSelecionado = pacientes.find(
    (paciente) => String(paciente._id) === String(filtros?.id_paciente),
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40">
          <Navbar
            onToggleMenu={() => setSidebarAberta((anterior) => !anterior)}
          />
        </header>

        <main className="flex flex-col gap-6 p-4 font-jakarta text-sm text-text sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-text/60 sm:text-sm">
                Home / Relatórios /{" "}
                <span className="font-semibold text-salmao">
                  Dificuldade por Fonemas
                </span>
              </p>
            </div>

            <a
              href="/relatorios"
              className="flex h-10 w-10 items-center justify-center self-end rounded-full bg-white shadow transition hover:bg-gray-100 sm:self-auto"
            >
              <img src={Back.src || Back} alt="voltar" className="w-5" />
            </a>
          </div>

          <div className="py-4 text-center">
            <h1 className="text-xl font-semibold md:text-2xl">
              Dificuldade por Fonema
            </h1>

            <p className="mt-2 text-sm text-text/60">
              Analise os fonemas com maior índice de erros durante os
              exercícios.
            </p>
          </div>

          <section className="rounded-2xl bg-white p-5 shadow-lg sm:p-6">
            <h2 className="mb-5 text-lg font-semibold">Filtrar relatório</h2>

            <form
              onSubmit={aplicarFiltros}
              className="grid grid-cols-1 items-end gap-4 md:grid-cols-4"
            >
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="paciente" className="font-medium">
                  Paciente
                </label>

                <select
                  id="paciente"
                  value={idPaciente}
                  onChange={(evento) => setIdPaciente(evento.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-salmao"
                >
                  <option value="">Todos os pacientes</option>

                  {pacientes.map((paciente) => (
                    <option key={paciente._id} value={paciente._id}>
                      {paciente.nome} {paciente.sobrenome || ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="dataInicial" className="font-medium">
                  Data inicial
                </label>

                <input
                  id="dataInicial"
                  type="date"
                  value={periodo.de}
                  onChange={(evento) =>
                    setPeriodo((anterior) => ({
                      ...anterior,
                      de: evento.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-salmao"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="dataFinal" className="font-medium">
                  Data final
                </label>

                <input
                  id="dataFinal"
                  type="date"
                  value={periodo.ate}
                  onChange={(evento) =>
                    setPeriodo((anterior) => ({
                      ...anterior,
                      ate: evento.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-salmao"
                />
              </div>

              <div className="md:col-span-4">
                <button
                  type="submit"
                  disabled={carregando}
                  className="rounded-xl bg-turquesa px-6 py-3 font-semibold transition hover:bg-turquesa/75 disabled:opacity-50"
                >
                  {carregando ? "Carregando..." : "Aplicar filtros"}
                </button>
              </div>
            </form>
          </section>

          {erro && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
            >
              {erro}
            </div>
          )}

          {periodoRetornado && (
            <p className="text-sm text-text/60">
              Exibindo dados de{" "}
              <strong>
                {pacienteSelecionado
                  ? `${pacienteSelecionado.nome} ${pacienteSelecionado.sobrenome || ""}`
                  : "todos os pacientes"}
              </strong>
              {" · "}
              {periodoRetornado.de} até {periodoRetornado.ate}
            </p>
          )}

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Cartao titulo="Fonemas praticados" valor={fonemas.length} />

            <Cartao
              titulo="Total de tentativas"
              valor={resumo.totalTentativas}
            />

            <Cartao
              titulo="Taxa geral de acertos"
              valor={percentual(resumo.taxaAcerto)}
            />

            <Cartao
              titulo="Fonema com mais dificuldade"
              valor={resumo.maiorDificuldade?.fonema || "—"}
              descricao={
                resumo.maiorDificuldade
                  ? `${percentual(resumo.maiorDificuldade.taxa_erro)} de erros`
                  : "Sem dados no período"
              }
            />
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-lg sm:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold md:text-xl">
                Acertos e erros por fonema
              </h2>

              <p className="mt-1 text-sm text-text/60">
                Comparação percentual do desempenho em cada fonema.
              </p>
            </div>

            {carregando ? (
              <div className="py-16 text-center text-text/60">
                Carregando gráfico...
              </div>
            ) : dadosGrafico.length ? (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosGrafico}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5e7eb"
                    />

                    <XAxis dataKey="fonema" axisLine={false} tickLine={false} />

                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(valor) => `${valor}%`}
                    />

                    <Tooltip
                      formatter={(valor, nome) => [
                        percentual(valor),
                        nome === "acertos" ? "Acertos" : "Erros",
                      ]}
                    />

                    <Legend
                      formatter={(valor) =>
                        valor === "acertos" ? "Acertos" : "Erros"
                      }
                    />

                    <Bar
                      dataKey="acertos"
                      fill="#76D3CC"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={45}
                    />

                    <Bar
                      dataKey="erros"
                      fill="#F49A8A"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-16 text-center text-text/60">
                Nenhuma tentativa encontrada para os filtros selecionados.
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-lg sm:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold md:text-xl">
                Detalhamento por fonema
              </h2>

              <p className="mt-1 text-sm text-text/60">
                Fonemas ordenados pela maior taxa de erros.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-text/60">
                    <th className="px-4 py-3 font-semibold">Fonema</th>

                    <th className="px-4 py-3 font-semibold">Tentativas</th>

                    <th className="px-4 py-3 font-semibold">Acertos</th>

                    <th className="px-4 py-3 font-semibold">Erros</th>

                    <th className="px-4 py-3 font-semibold">Taxa de acerto</th>

                    <th className="px-4 py-3 font-semibold">Taxa de erro</th>

                    <th className="px-4 py-3 font-semibold">Dificuldade</th>
                  </tr>
                </thead>

                <tbody>
                  {fonemas.map((item) => (
                    <tr
                      key={item.fonema}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-4 py-4 font-semibold">{item.fonema}</td>

                      <td className="px-4 py-4">{item.tentativas}</td>

                      <td className="px-4 py-4">{item.acertos}</td>

                      <td className="px-4 py-4">{item.erros}</td>

                      <td className="px-4 py-4">
                        {percentual(item.taxa_acerto)}
                      </td>

                      <td className="px-4 py-4">
                        {percentual(item.taxa_erro)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${corDificuldade(item.dificuldade)}`}
                        >
                          {item.dificuldade}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {!fonemas.length && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-text/60"
                      >
                        {carregando
                          ? "Carregando dados..."
                          : "Nenhum dado encontrado no período."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
