"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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

function formatarData(valor) {
  if (!valor) return "—";

  const data = String(valor).slice(0, 10);
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

function formatarMinutos(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
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

function Secao({ titulo, descricao, children }) {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-5 shadow-lg sm:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-lg font-semibold md:text-xl">{titulo}</h2>

        {descricao && <p className="mt-1 text-sm text-text/60">{descricao}</p>}
      </div>

      {children}
    </section>
  );
}

export default function RelatorioAtividadePage() {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [idPaciente, setIdPaciente] = useState("");
  const [periodo, setPeriodo] = useState(periodoInicial);
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    ...periodoInicial(),
    id_paciente: "",
  });
  const [atividade, setAtividade] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function carregarPacientes() {
      try {
        const resposta = await axios.get(`${API_URL}/api/pacientes`, {
          ...getAxiosConfig(),
          signal: controller.signal,
        });

        const dados = resposta.data;

        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados?.pacientes)
            ? dados.pacientes
            : [];

        if (!controller.signal.aborted) {
          setPacientes(lista);
        }
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        console.error(error);
      }
    }

    carregarPacientes();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarAtividade() {
      setCarregando(true);
      setErro("");

      try {
        const resposta = await axios.get(
          `${API_URL}/api/relatorios/atividade`,
          {
            ...getAxiosConfig(),
            params: {
              de: filtrosAplicados.de,
              ate: filtrosAplicados.ate,
              ...(filtrosAplicados.id_paciente
                ? {
                    id_paciente: filtrosAplicados.id_paciente,
                  }
                : {}),
            },
            signal: controller.signal,
          },
        );

        if (!controller.signal.aborted) {
          setAtividade(resposta.data);
        }
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        console.error(error);

        setErro(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Não foi possível carregar o relatório de atividade.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarAtividade();

    return () => controller.abort();
  }, [filtrosAplicados]);

  function aplicarFiltros(evento) {
    evento.preventDefault();

    if (periodo.de > periodo.ate) {
      setErro("A data inicial não pode ser maior que a final.");
      return;
    }

    const inicio = new Date(`${periodo.de}T12:00:00`);
    const fim = new Date(`${periodo.ate}T12:00:00`);
    const dias = Math.round((fim.getTime() - inicio.getTime()) / 86400000);

    if (dias > 365) {
      setErro("O período máximo permitido é de 366 dias.");
      return;
    }

    setFiltrosAplicados({
      de: periodo.de,
      ate: periodo.ate,
      id_paciente: idPaciente,
    });
  }

  const dias = useMemo(() => {
    return Array.isArray(atividade?.dias) ? atividade.dias : [];
  }, [atividade]);

  const dadosGrafico = useMemo(() => {
    const agrupados = new Map();

    for (const item of dias) {
      const data = String(item.data).slice(0, 10);

      if (!agrupados.has(data)) {
        agrupados.set(data, {
          data,
          minutos: 0,
          tentativas: 0,
        });
      }

      const registro = agrupados.get(data);

      registro.minutos += Number(item.minutos) || 0;
      registro.tentativas += Number(item.tentativas) || 0;
    }

    return [...agrupados.values()]
      .sort((a, b) => a.data.localeCompare(b.data))
      .map((item) => ({
        ...item,
        minutos: Number(item.minutos.toFixed(1)),
        dia: formatarData(item.data),
      }));
  }, [dias]);

  const resumo = useMemo(() => {
    const totalMinutos = Number(atividade?.total_minutos) || 0;

    const totalTentativas = dias.reduce(
      (total, item) => total + (Number(item.tentativas) || 0),
      0,
    );

    const diasAtivos = new Set(
      dias
        .filter(
          (item) => Number(item.tentativas) > 0 || Number(item.minutos) > 0,
        )
        .map((item) => String(item.data).slice(0, 10)),
    ).size;

    const pacientesAtivos = new Set(
      dias
        .filter(
          (item) => Number(item.tentativas) > 0 || Number(item.minutos) > 0,
        )
        .map((item) => String(item.id_paciente)),
    ).size;

    return {
      totalMinutos,
      totalTentativas,
      diasAtivos,
      pacientesAtivos,
      mediaPorDia: diasAtivos ? totalMinutos / diasAtivos : 0,
    };
  }, [atividade, dias]);

  const linhasTabela = useMemo(() => {
    return [...dias].sort((a, b) =>
      String(b.data).localeCompare(String(a.data)),
    );
  }, [dias]);

  const pacienteSelecionado = pacientes.find(
    (paciente) => String(paciente._id) === String(filtrosAplicados.id_paciente),
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
                  Atividade Diária
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
              Atividade Diária
            </h1>

            <p className="mt-2 text-sm text-text/60">
              Acompanhe o tempo de prática e a frequência dos exercícios
              realizados pelos pacientes.
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

          {atividade?.periodo && (
            <p className="text-sm text-text/60">
              Exibindo dados de{" "}
              <strong>
                {pacienteSelecionado
                  ? `${pacienteSelecionado.nome} ${pacienteSelecionado.sobrenome || ""}`
                  : "todos os pacientes"}
              </strong>
              {" · "}
              {formatarData(atividade.periodo.de)}
              {" a "}
              {formatarData(atividade.periodo.ate)}
            </p>
          )}

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Cartao
              titulo="Tempo total de prática"
              valor={`${formatarMinutos(resumo.totalMinutos)} min`}
            />

            <Cartao
              titulo="Total de tentativas"
              valor={resumo.totalTentativas}
            />

            <Cartao titulo="Dias com atividade" valor={resumo.diasAtivos} />

            <Cartao
              titulo="Média por dia ativo"
              valor={`${formatarMinutos(resumo.mediaPorDia)} min`}
            />
          </section>

          <Secao
            titulo="Tempo de prática por dia"
            descricao="Soma dos minutos registrados por todos os pacientes selecionados."
          >
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

                    <XAxis
                      dataKey="dia"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      interval="preserveStartEnd"
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      unit="min"
                    />

                    <Tooltip
                      formatter={(valor) => [
                        `${formatarMinutos(valor)} min`,
                        "Tempo de prática",
                      ]}
                    />

                    <Bar
                      dataKey="minutos"
                      fill="#76D3CC"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-16 text-center text-text/60">
                Nenhuma atividade encontrada para o período.
              </div>
            )}
          </Secao>

          <Secao
            titulo="Detalhamento das atividades"
            descricao="Registros agrupados por paciente e dia."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-text/60">
                    <th className="px-4 py-3 font-semibold">Data</th>

                    <th className="px-4 py-3 font-semibold">Paciente</th>

                    <th className="px-4 py-3 font-semibold">Tentativas</th>

                    <th className="px-4 py-3 font-semibold">
                      Tempo de prática
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {linhasTabela.map((item, index) => (
                    <tr
                      key={`${item.data}-${item.id_paciente}-${index}`}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-4 py-4">{formatarData(item.data)}</td>

                      <td className="px-4 py-4 font-semibold">
                        {item.paciente || "Paciente"}
                      </td>

                      <td className="px-4 py-4">{item.tentativas}</td>

                      <td className="px-4 py-4">
                        {formatarMinutos(item.minutos)} min
                      </td>
                    </tr>
                  ))}

                  {!linhasTabela.length && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-12 text-center text-text/60"
                      >
                        {carregando
                          ? "Carregando atividades..."
                          : "Nenhuma atividade encontrada no período."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Secao>
        </main>
      </div>
    </div>
  );
}
