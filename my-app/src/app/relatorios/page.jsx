
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

const API_URL = "http://localhost:4000";

function formatarTempo(minutos) {
  const valor = Number(minutos) || 0;

  if (valor < 60) {
    return `${Math.round(valor)} min`;
  }

  const horas = Math.floor(valor / 60);
  const restante = Math.round(valor % 60);

  return restante ? `${horas}h ${restante}min` : `${horas}h`;
}

function formatarData(data) {
  if (!data) return "—";

  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

function Indicador({ titulo, valor, descricao }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg">
      <p className="text-sm text-text/60">{titulo}</p>

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

function LinkRelatorio({ titulo, descricao, href }) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col justify-between gap-5 rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div>
        <h3 className="text-lg font-semibold">
          {titulo}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-text/60">
          {descricao}
        </p>
      </div>

      <span className="font-semibold text-salmao">
        Ver detalhes
      </span>
    </Link>
  );
}

export default function RelatoriosPage() {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [resumo, setResumo] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [recarregar, setRecarregar] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarRelatorios() {
      setCarregando(true);
      setErro("");

      try {
        const config = {
          ...getAxiosConfig(),
          signal: controller.signal,
        };

        const [respostaResumo, respostaRanking] =
          await Promise.all([
            axios.get(
              `${API_URL}/api/relatorios/resumo`,
              config
            ),
            axios.get(
              `${API_URL}/api/relatorios/ranking`,
              config
            ),
          ]);

        if (controller.signal.aborted) return;

        setResumo(respostaResumo.data);
        setRanking(respostaRanking.data);
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        console.error(error);

        setErro(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Não foi possível carregar os relatórios."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarRelatorios();

    return () => controller.abort();
  }, [recarregar]);

  const dadosGrafico = useMemo(() => {
    return (resumo?.por_dia || []).map((item) => ({
      dia: item.dia,
      data: item.data,
      minutos: Number(item.minutos) || 0,
      tentativas: Number(item.tentativas) || 0,
    }));
  }, [resumo]);

  const pacientesRanking = ranking?.pacientes || [];
  const maiorEvolucao = ranking?.maior_evolucao;

  const totalTentativas = pacientesRanking.reduce(
    (total, paciente) =>
      total + (Number(paciente.tentativas) || 0),
    0
  );

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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-text/60 sm:text-sm">
              Home /{" "}
              <span className="font-semibold text-salmao">
                Relatórios
              </span>
            </p>

            <button
              type="button"
              onClick={() =>
                setRecarregar((anterior) => anterior + 1)
              }
              disabled={carregando}
              className="rounded-xl bg-turquesa px-5 py-2.5 font-medium transition hover:bg-turquesa/75 disabled:opacity-50"
            >
              {carregando ? "Atualizando..." : "Atualizar"}
            </button>
          </div>

          <div className="py-5 text-center">
            <h1 className="text-xl font-semibold md:text-2xl">
              Relatórios
            </h1>

            <p className="mt-2 text-sm text-text/60">
              Acompanhe o desempenho e a atividade dos pacientes.
            </p>
          </div>

          {erro && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
            >
              {erro}
            </div>
          )}

          {carregando && !resumo && (
            <div className="rounded-2xl bg-white p-10 text-center text-text/60 shadow-lg">
              Carregando relatórios...
            </div>
          )}

          {resumo && (
            <>
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <Indicador
                  titulo="Pacientes cadastrados"
                  valor={resumo.total_cadastrados ?? 0}
                />

                <Indicador
                  titulo="Pacientes ativos"
                  valor={resumo.pacientes_ativos ?? 0}
                />

                <Indicador
                  titulo="Média de acertos"
                  valor={`${resumo.media_acertos ?? 0}%`}
                  descricao="Tentativas no período analisado"
                />

                <Indicador
                  titulo="Tempo médio de prática"
                  valor={formatarTempo(
                    resumo.tempo_medio_min
                  )}
                  descricao="Por paciente e dia com atividade"
                />
              </section>

              <section className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
                <Secao
                  titulo="Atividade dos últimos 7 dias"
                  descricao="Tempo total de prática registrado diariamente."
                >
                  <div className="h-72 w-full">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={dadosGrafico}
                        margin={{
                          top: 10,
                          right: 10,
                          left: -20,
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
                          tick={{ fontSize: 12 }}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                          allowDecimals={false}
                          unit="min"
                        />

                        <Tooltip
                          formatter={(valor) => [
                            `${valor} min`,
                            "Prática",
                          ]}
                          labelFormatter={(label, itens) => {
                            const data = itens?.[0]?.payload?.data;

                            return data
                              ? `${label} - ${formatarData(data)}`
                              : label;
                          }}
                        />

                        <Bar
                          dataKey="minutos"
                          fill="#76D3CC"
                          radius={[7, 7, 0, 0]}
                          maxBarSize={45}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Secao>

                <Secao titulo="Resumo do período">
                  <div className="flex flex-col gap-4">
                    <div className="border-l-4 border-salmao pl-4">
                      <p className="text-text/60">
                        Tentativas registradas
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {totalTentativas}
                      </p>
                    </div>

                    <div className="border-l-4 border-turquesa pl-4">
                      <p className="text-text/60">
                        Pacientes sem treino nos últimos 7 dias
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {resumo.inativos?.length ?? 0}
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-4">
                      <p className="text-text/60">
                        Período dos indicadores
                      </p>

                      <p className="mt-1 font-semibold">
                        {formatarData(resumo.periodo?.de)}
                        {" a "}
                        {formatarData(resumo.periodo?.ate)}
                      </p>
                    </div>
                  </div>
                </Secao>
              </section>

              <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <Secao
                  titulo="Pacientes mais ativos"
                  descricao="Ordenados pelo tempo de prática no período."
                >
                  {resumo.top_pacientes?.length ? (
                    <div className="flex flex-col gap-3">
                      {resumo.top_pacientes.map(
                        (paciente, index) => (
                          <div
                            key={paciente._id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-4"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-turquesa/20 font-semibold">
                                {index + 1}
                              </span>

                              <div className="min-w-0">
                                <p className="truncate font-semibold">
                                  {paciente.nome}
                                </p>

                                <p className="text-xs text-text/50">
                                  {paciente.tentativas} tentativas
                                </p>
                              </div>
                            </div>

                            <span className="shrink-0 font-semibold text-salmao">
                              {formatarTempo(
                                paciente.minutos
                              )}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="py-10 text-center text-text/50">
                      Nenhuma atividade registrada no período.
                    </p>
                  )}
                </Secao>

                <Secao
                  titulo="Maior evolução"
                  descricao="Comparação entre a primeira e a última semana com tentativas."
                >
                  {maiorEvolucao ? (
                    <div className="flex h-full flex-col justify-center gap-5">
                      <div>
                        <p className="text-lg font-semibold">
                          {maiorEvolucao.nome}
                        </p>

                        <p className="mt-2 text-3xl font-bold text-salmao">
                          {maiorEvolucao.evolucao > 0
                            ? "+"
                            : ""}
                          {maiorEvolucao.evolucao} p.p.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs text-text/60">
                            Taxa inicial
                          </p>

                          <p className="mt-2 text-xl font-semibold">
                            {maiorEvolucao.taxa_inicial}%
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs text-text/60">
                            Taxa atual
                          </p>

                          <p className="mt-2 text-xl font-semibold">
                            {maiorEvolucao.taxa_atual}%
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/relatorios/evolucao?id_paciente=${maiorEvolucao._id}`}
                        className="font-semibold text-salmao hover:underline"
                      >
                        Ver evolução do paciente
                      </Link>
                    </div>
                  ) : (
                    <p className="py-10 text-center text-text/50">
                      Ainda não há semanas suficientes para
                      calcular a evolução.
                    </p>
                  )}
                </Secao>
              </section>

              <Secao titulo="Pacientes sem atividade recente">
                {resumo.inativos?.length ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {resumo.inativos.map((paciente) => (
                      <div
                        key={paciente._id}
                        className="rounded-xl border border-gray-100 p-4"
                      >
                        <p className="font-semibold">
                          {paciente.nome}
                        </p>

                        <p className="mt-2 text-xs text-text/60">
                          {paciente.ultimo_treino
                            ? `Último treino: ${new Date(
                                paciente.ultimo_treino
                              ).toLocaleDateString("pt-BR")}`
                            : "Sem treino registrado"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-text/60">
                    Nenhum paciente está na lista de inativos.
                  </p>
                )}
              </Secao>
            </>
          )}

          <div>
            <h2 className="mb-5 text-lg font-semibold md:text-xl">
              Relatórios detalhados
            </h2>

            <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <LinkRelatorio
                titulo="Dificuldade por Fonema"
                descricao="Compare acertos, erros e níveis de dificuldade de cada fonema."
                href="/relatorios/fonema"
              />

              <LinkRelatorio
                titulo="Atividade Diária"
                descricao="Consulte o tempo de prática e a frequência de atividades dos pacientes."
                href="/relatorios/atividade"
              />

              <LinkRelatorio
                titulo="Evolução de Acertos"
                descricao="Acompanhe a evolução semanal de um paciente."
                href="/relatorios/evolucao"
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
