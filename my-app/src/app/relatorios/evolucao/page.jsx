
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import Back from "@/assets/icons/back.svg";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

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

  const [ano, mes, dia] = String(valor)
    .slice(0, 10)
    .split("-");

  return `${dia}/${mes}/${ano}`;
}

function formatarPercentual(valor) {
  return `${Number(valor || 0).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}

function formatarVariacao(valor) {
  const numero = Number(valor) || 0;
  const prefixo = numero > 0 ? "+" : "";

  return `${prefixo}${numero.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })} p.p.`;
}

function Cartao({ titulo, valor, descricao }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg">
      <p className="text-sm text-text/60">
        {titulo}
      </p>

      <p className="mt-3 text-3xl font-bold text-salmao">
        {valor}
      </p>

      {descricao && (
        <p className="mt-2 text-xs text-text/50">
          {descricao}
        </p>
      )}
    </div>
  );
}

function Secao({ titulo, descricao, children }) {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-5 shadow-lg sm:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-lg font-semibold md:text-xl">
          {titulo}
        </h2>

        {descricao && (
          <p className="mt-1 text-sm text-text/60">
            {descricao}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

export default function RelatorioEvolucaoPage() {
  const searchParams = useSearchParams();
  const pacienteDaUrl = searchParams.get("id_paciente") || "";

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [idPaciente, setIdPaciente] = useState(pacienteDaUrl);
  const [periodo, setPeriodo] = useState(periodoInicial);
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    ...periodoInicial(),
    id_paciente: pacienteDaUrl,
  });
  const [relatorio, setRelatorio] = useState(null);
  const [carregandoPacientes, setCarregandoPacientes] =
    useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function carregarPacientes() {
      setCarregandoPacientes(true);

      try {
        const resposta = await axios.get(
          `${API_URL}/api/pacientes`,
          {
            ...getAxiosConfig(),
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        const dados = resposta.data;

        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados?.pacientes)
            ? dados.pacientes
            : [];

        setPacientes(lista);

        const pacienteValido = lista.some(
          (paciente) =>
            String(paciente._id) === String(pacienteDaUrl)
        );

        const selecionado = pacienteValido
          ? pacienteDaUrl
          : lista[0]?._id || "";

        setIdPaciente(selecionado);

        setFiltrosAplicados((anterior) => ({
          ...anterior,
          id_paciente: selecionado,
        }));
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        console.error(error);

        setErro(
          error.response?.data?.error ||
            error.response?.data?.message ||
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
  }, [pacienteDaUrl]);

  useEffect(() => {
    if (!filtrosAplicados.id_paciente) {
      setRelatorio(null);
      return;
    }

    const controller = new AbortController();

    async function carregarEvolucao() {
      setCarregando(true);
      setErro("");

      try {
        const resposta = await axios.get(
          `${API_URL}/api/relatorios/evolucao`,
          {
            ...getAxiosConfig(),
            params: {
              id_paciente: filtrosAplicados.id_paciente,
              de: filtrosAplicados.de,
              ate: filtrosAplicados.ate,
            },
            signal: controller.signal,
          }
        );

        if (!controller.signal.aborted) {
          setRelatorio(resposta.data);
        }
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        console.error(error);
        setRelatorio(null);

        setErro(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Não foi possível carregar a evolução de acertos."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarEvolucao();

    return () => controller.abort();
  }, [filtrosAplicados]);

  function aplicarFiltros(evento) {
    evento.preventDefault();

    if (!idPaciente) {
      setErro("Selecione um paciente.");
      return;
    }

    if (periodo.de > periodo.ate) {
      setErro("A data inicial não pode ser maior que a final.");
      return;
    }

    const inicio = new Date(`${periodo.de}T12:00:00`);
    const fim = new Date(`${periodo.ate}T12:00:00`);

    const diferenca = Math.round(
      (fim.getTime() - inicio.getTime()) / 86400000
    );

    if (diferenca > 365) {
      setErro("O período máximo permitido é de 366 dias.");
      return;
    }

    setFiltrosAplicados({
      id_paciente: idPaciente,
      de: periodo.de,
      ate: periodo.ate,
    });
  }

  const semanas = useMemo(() => {
    return [...(relatorio?.por_semana || [])]
      .sort((a, b) =>
        String(a.semana).localeCompare(String(b.semana))
      )
      .map((item) => ({
        semana: item.semana,
        tentativas: Number(item.tentativas) || 0,
        acertos: Number(item.acertos) || 0,
        taxa_acerto: Number(item.taxa_acerto) || 0,
      }));
  }, [relatorio]);

  const categorias = useMemo(() => {
    return (relatorio?.por_categoria || []).map((item) => ({
      categoria: item.categoria,
      rotulo: item.rotulo || item.categoria,
      tentativas: Number(item.tentativas) || 0,
      acertos: Number(item.acertos) || 0,
      taxa_acerto: Number(item.taxa_acerto) || 0,
    }));
  }, [relatorio]);

  const resumo = useMemo(() => {
    const totalTentativas = semanas.reduce(
      (total, item) => total + item.tentativas,
      0
    );

    const totalAcertos = semanas.reduce(
      (total, item) => total + item.acertos,
      0
    );

    const taxaGeral = totalTentativas
      ? (totalAcertos / totalTentativas) * 100
      : 0;

    const primeiraSemana = semanas[0];
    const ultimaSemana = semanas[semanas.length - 1];

    const evolucao =
      semanas.length >= 2
        ? ultimaSemana.taxa_acerto -
          primeiraSemana.taxa_acerto
        : null;

    return {
      totalTentativas,
      totalAcertos,
      taxaGeral,
      evolucao,
      primeiraSemana,
      ultimaSemana,
    };
  }, [semanas]);

  const pacienteSelecionado = pacientes.find(
    (paciente) =>
      String(paciente._id) ===
      String(filtrosAplicados.id_paciente)
  );

  const semDados =
    !carregando &&
    !erro &&
    relatorio &&
    semanas.length === 0 &&
    categorias.length === 0;

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

        <main className="flex flex-col gap-6 p-4 font-jakarta text-sm text-text sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-text/60 sm:text-sm">
                Home / Relatórios /{" "}
                <span className="font-semibold text-salmao">
                  Evolução de Acertos
                </span>
              </p>
            </div>

            <a
              href="/relatorios"
              className="flex h-10 w-10 items-center justify-center self-end rounded-full bg-white shadow transition hover:bg-gray-100 sm:self-auto"
            >
              <img
                src={Back.src || Back}
                alt="voltar"
                className="w-5"
              />
            </a>
          </div>

          <div className="py-4 text-center">
            <h1 className="text-xl font-semibold md:text-2xl">
              Evolução de Acertos
            </h1>

            <p className="mt-2 text-sm text-text/60">
              Acompanhe o progresso semanal e o desempenho
              por categoria de fonema.
            </p>
          </div>

          <section className="rounded-2xl bg-white p-5 shadow-lg sm:p-6">
            <h2 className="mb-5 text-lg font-semibold">
              Filtrar relatório
            </h2>

            <form
              onSubmit={aplicarFiltros}
              className="grid grid-cols-1 items-end gap-4 md:grid-cols-4"
            >
              <div className="flex flex-col gap-2 md:col-span-2">
                <label
                  htmlFor="paciente"
                  className="font-medium"
                >
                  Paciente
                </label>

                <select
                  id="paciente"
                  value={idPaciente}
                  onChange={(evento) =>
                    setIdPaciente(evento.target.value)
                  }
                  disabled={carregandoPacientes}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-salmao disabled:opacity-50"
                >
                  <option value="">
                    {carregandoPacientes
                      ? "Carregando pacientes..."
                      : "Selecione um paciente"}
                  </option>

                  {pacientes.map((paciente) => (
                    <option
                      key={paciente._id}
                      value={paciente._id}
                    >
                      {paciente.nome}{" "}
                      {paciente.sobrenome || ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="dataInicial"
                  className="font-medium"
                >
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
                <label
                  htmlFor="dataFinal"
                  className="font-medium"
                >
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
                  disabled={
                    carregando ||
                    carregandoPacientes ||
                    !idPaciente
                  }
                  className="rounded-xl bg-turquesa px-6 py-3 font-semibold transition hover:bg-turquesa/75 disabled:opacity-50"
                >
                  {carregando
                    ? "Carregando..."
                    : "Aplicar filtros"}
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

          {!carregandoPacientes && pacientes.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center text-text/60 shadow-lg">
              Nenhum paciente encontrado para esta conta.
            </div>
          )}

          {relatorio?.periodo && pacienteSelecionado && (
            <p className="text-sm text-text/60">
              Paciente:{" "}
              <strong>
                {pacienteSelecionado.nome}{" "}
                {pacienteSelecionado.sobrenome || ""}
              </strong>
              {" · "}
              {formatarData(relatorio.periodo.de)}
              {" a "}
              {formatarData(relatorio.periodo.ate)}
            </p>
          )}

          {carregando && (
            <div className="rounded-2xl bg-white p-8 text-center text-text/60 shadow-lg">
              Carregando evolução...
            </div>
          )}

          {semDados && (
            <div className="rounded-2xl bg-white p-8 text-center text-text/60 shadow-lg">
              Este paciente não possui tentativas registradas
              no período selecionado.
            </div>
          )}

          {relatorio && !carregando && (
            <>
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <Cartao
                  titulo="Total de tentativas"
                  valor={resumo.totalTentativas}
                />

                <Cartao
                  titulo="Total de acertos"
                  valor={resumo.totalAcertos}
                />

                <Cartao
                  titulo="Taxa geral de acertos"
                  valor={formatarPercentual(
                    resumo.taxaGeral
                  )}
                />

                <Cartao
                  titulo="Evolução semanal"
                  valor={
                    resumo.evolucao === null
                      ? "—"
                      : formatarVariacao(resumo.evolucao)
                  }
                  descricao="Diferença entre a primeira e a última semana com tentativas"
                />
              </section>

              <Secao
                titulo="Evolução semanal de acertos"
                descricao="Taxa de acertos registrada em cada semana com atividades."
              >
                {semanas.length ? (
                  <div className="h-80 w-full">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <LineChart
                        data={semanas}
                        margin={{
                          top: 10,
                          right: 20,
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
                          dataKey="semana"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                        />

                        <YAxis
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(valor) =>
                            `${valor}%`
                          }
                        />

                        <Tooltip
                          formatter={(valor) => [
                            formatarPercentual(valor),
                            "Taxa de acertos",
                          ]}
                        />

                        <Line
                          type="monotone"
                          dataKey="taxa_acerto"
                          stroke="#F49A8A"
                          strokeWidth={3}
                          dot={{
                            r: 5,
                            fill: "#F49A8A",
                          }}
                          activeDot={{ r: 7 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="py-12 text-center text-text/60">
                    Sem dados semanais no período.
                  </p>
                )}
              </Secao>

              <Secao
                titulo="Desempenho por categoria"
                descricao="Percentual de acertos em cada categoria de fonema."
              >
                {categorias.length ? (
                  <div className="h-80 w-full">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={categorias}
                        margin={{
                          top: 10,
                          right: 15,
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
                          dataKey="rotulo"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                        />

                        <YAxis
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(valor) =>
                            `${valor}%`
                          }
                        />

                        <Tooltip
                          formatter={(valor) => [
                            formatarPercentual(valor),
                            "Taxa de acertos",
                          ]}
                        />

                        <Bar
                          dataKey="taxa_acerto"
                          fill="#76D3CC"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={65}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="py-12 text-center text-text/60">
                    Sem dados por categoria no período.
                  </p>
                )}
              </Secao>

              <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <Secao titulo="Detalhamento semanal">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[440px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-gray-200 text-text/60">
                          <th className="px-3 py-3 font-semibold">
                            Semana
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            Tentativas
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            Acertos
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            Taxa
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {semanas.map((item) => (
                          <tr
                            key={item.semana}
                            className="border-b border-gray-100 last:border-0"
                          >
                            <td className="px-3 py-4 font-medium">
                              {item.semana}
                            </td>
                            <td className="px-3 py-4">
                              {item.tentativas}
                            </td>
                            <td className="px-3 py-4">
                              {item.acertos}
                            </td>
                            <td className="px-3 py-4 font-semibold text-salmao">
                              {formatarPercentual(
                                item.taxa_acerto
                              )}
                            </td>
                          </tr>
                        ))}

                        {!semanas.length && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-3 py-10 text-center text-text/60"
                            >
                              Nenhuma semana registrada.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Secao>

                <Secao titulo="Detalhamento por categoria">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[440px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-gray-200 text-text/60">
                          <th className="px-3 py-3 font-semibold">
                            Categoria
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            Tentativas
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            Acertos
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            Taxa
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {categorias.map((item) => (
                          <tr
                            key={item.categoria}
                            className="border-b border-gray-100 last:border-0"
                          >
                            <td className="px-3 py-4 font-medium">
                              {item.rotulo}
                            </td>
                            <td className="px-3 py-4">
                              {item.tentativas}
                            </td>
                            <td className="px-3 py-4">
                              {item.acertos}
                            </td>
                            <td className="px-3 py-4 font-semibold text-salmao">
                              {formatarPercentual(
                                item.taxa_acerto
                              )}
                            </td>
                          </tr>
                        ))}

                        {!categorias.length && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-3 py-10 text-center text-text/60"
                            >
                              Nenhuma categoria registrada.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Secao>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
