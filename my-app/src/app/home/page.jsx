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

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import User from "@/assets/icons/user.svg";
import Acerto from "@/assets/icons/acerto.svg";
import Clock from "@/assets/icons/clock.svg";

import { getAxiosConfig } from "@/services/auth";

const API_URL = "http://localhost:4000";

function formatarMinutos(valor) {
  const minutos = Number(valor) || 0;

  if (minutos < 60) {
    return `${minutos.toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    })} min`;
  }

  const horas = Math.floor(minutos / 60);
  const restante = Math.round(minutos % 60);

  return restante
    ? `${horas}h ${restante}min`
    : `${horas}h`;
}

function formatarData(valor) {
  if (!valor) return "Sem registro";

  const data = String(valor).slice(0, 10);

  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  const dataConvertida = new Date(valor);

  return Number.isNaN(dataConvertida.getTime())
    ? "Sem registro"
    : dataConvertida.toLocaleDateString("pt-BR");
}

function imagemPaciente(caminho) {
  if (!caminho) return null;

  if (/^https?:\/\//i.test(caminho)) {
    return caminho;
  }

  return `${API_URL}${caminho.startsWith("/") ? "" : "/"}${caminho}`;
}

function Avatar({ nome, foto, tamanho = "h-11 w-11" }) {
  const [falhou, setFalhou] = useState(false);
  const src = imagemPaciente(foto);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-turquesa/20 font-semibold text-text ${tamanho}`}
    >
      {src && !falhou ? (
        <img
          src={src}
          alt={`Foto de ${nome}`}
          className="h-full w-full object-cover"
          onError={() => setFalhou(true)}
        />
      ) : (
        <span aria-label={nome}>
          {String(nome || "P").charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function Indicador({
  titulo,
  subtitulo,
  valor,
  icone,
  href,
  cor = "bg-salmao/10",
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-44 flex-col justify-between gap-5 rounded-3xl bg-white p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div>
        <p className="text-sm text-text/70 md:text-base">
          {titulo}
        </p>

        <p className="mt-1 text-xs text-text/50">
          {subtitulo}
        </p>
      </div>

      <div className="flex items-end justify-between gap-3">
        <p className="min-w-0 break-words text-3xl font-bold text-salmao lg:text-4xl">
          {valor}
        </p>

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${cor}`}
        >
          <img
            src={icone.src || icone}
            alt=""
            className="w-8"
          />
        </div>
      </div>
    </Link>
  );
}

function Calendario({ atividades }) {
  const [mesAtual, setMesAtual] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  const hoje = new Date();
  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const quantidadeDias = new Date(ano, mes + 1, 0).getDate();

  const diasComPratica = new Set(
    atividades
      .filter((item) => Number(item.tentativas) > 0)
      .map((item) => String(item.data).slice(0, 10))
  );

  const celulas = [
    ...Array.from({ length: primeiroDia }, () => null),
    ...Array.from({ length: quantidadeDias }, (_, i) => i + 1),
  ];

  const tituloMes = mesAtual.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  function mudarMes(diferenca) {
    setMesAtual(new Date(ano, mes + diferenca, 1));
  }

  return (
    <div className="mt-5 rounded-2xl bg-roxo/5 p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => mudarMes(-1)}
          aria-label="Mês anterior"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm transition hover:bg-gray-100"
        >
          ‹
        </button>

        <h3 className="text-center font-semibold capitalize">
          {tituloMes}
        </h3>

        <button
          type="button"
          onClick={() => mudarMes(1)}
          aria-label="Próximo mês"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm transition hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["D", "S", "T", "Q", "Q", "S", "S"].map(
          (dia, index) => (
            <span
              key={index}
              className="py-2 text-xs font-semibold text-text/50"
            >
              {dia}
            </span>
          )
        )}

        {celulas.map((dia, index) => {
          if (dia === null) {
            return <span key={`vazio-${index}`} />;
          }

          const chave = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

          const temPratica = diasComPratica.has(chave);

          const ehHoje =
            dia === hoje.getDate() &&
            mes === hoje.getMonth() &&
            ano === hoje.getFullYear();

          return (
            <div
              key={chave}
              title={
                temPratica
                  ? "Prática registrada"
                  : "Sem informação de prática neste resumo"
              }
              className={`relative flex aspect-square items-center justify-center rounded-xl text-xs sm:text-sm ${
                ehHoje
                  ? "border-2 border-salmao font-bold"
                  : ""
              } ${
                temPratica
                  ? "bg-turquesa/30 font-semibold"
                  : "bg-white/60"
              }`}
            >
              {dia}

              {temPratica && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-salmao" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-text/60">
        <span className="h-3 w-3 rounded bg-turquesa/30" />
        Dia com prática registrada
      </div>

      <p className="mt-3 text-xs leading-relaxed text-text/50">
        O resumo da API informa as práticas dos últimos
        7 dias. Datas anteriores não são classificadas
        neste calendário.
      </p>
    </div>
  );
}

export default function Home() {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [resumo, setResumo] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarHome() {
      setCarregando(true);
      setErro("");

      try {
        const config = {
          ...getAxiosConfig(),
          signal: controller.signal,
        };

        const [respostaResumo, respostaPacientes] =
          await Promise.all([
            axios.get(
              `${API_URL}/api/relatorios/resumo`,
              config
            ),
            axios.get(
              `${API_URL}/api/pacientes`,
              {
                ...config,
                params: { ativo: "todos" },
              }
            ),
          ]);

        if (controller.signal.aborted) return;

        const dadosPacientes = respostaPacientes.data;

        setResumo(respostaResumo.data);

        setPacientes(
          Array.isArray(dadosPacientes)
            ? dadosPacientes
            : Array.isArray(dadosPacientes?.pacientes)
              ? dadosPacientes.pacientes
              : []
        );
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        console.error(error);

        setErro(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Não foi possível carregar os dados da Home."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarHome();

    return () => controller.abort();
  }, [atualizacao]);

  const semPraticaRecente = resumo?.inativos || [];
  const atividadeSemanal = resumo?.por_dia || [];

  const pacientesOrdenados = useMemo(() => {
    return [...pacientes].sort((a, b) =>
      `${a.nome} ${a.sobrenome}`.localeCompare(
        `${b.nome} ${b.sobrenome}`,
        "pt-BR"
      )
    );
  }, [pacientes]);

  const dadosGrafico = useMemo(() => {
    return atividadeSemanal.map((item) => ({
      dia: item.dia,
      data: item.data,
      minutos: Number(item.minutos) || 0,
      tentativas: Number(item.tentativas) || 0,
    }));
  }, [atividadeSemanal]);

  const totalTentativasSemana = dadosGrafico.reduce(
    (total, item) => total + item.tentativas,
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

        <main className="flex flex-col gap-6 bg-fundo px-4 py-5 font-jakarta text-text sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>

              <h1 className="mt-1 text-2xl font-semibold">
                Visão geral
              </h1>

              <p className="mt-1 text-sm text-text/60">
                Acompanhe seus pacientes e a prática
                dos exercícios no Lolá.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setAtualizacao((anterior) => anterior + 1)
              }
              disabled={carregando}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-salmao shadow transition hover:bg-gray-100 disabled:opacity-50"
            >
              {carregando ? "Atualizando..." : "Atualizar dados"}
            </button>
          </div>

          {erro && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
            >
              <p>{erro}</p>

              <button
                type="button"
                onClick={() =>
                  setAtualizacao((anterior) => anterior + 1)
                }
                className="mt-3 font-semibold underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {carregando && !resumo && (
            <div className="rounded-3xl bg-white p-10 text-center text-text/60 shadow-lg">
              Carregando painel...
            </div>
          )}

          {resumo && (
            <>
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                <Indicador
                  titulo="Pacientes cadastrados"
                  subtitulo="Total de cadastros"
                  valor={resumo.total_cadastrados ?? 0}
                  icone={User}
                  href="/pacientes"
                />

                <Indicador
                  titulo="Média de acertos"
                  subtitulo="Últimos 30 dias"
                  valor={`${resumo.media_acertos ?? 0}%`}
                  icone={Acerto}
                  href="/relatorios"
                  cor="bg-turquesa/10"
                />

                <Indicador
                  titulo="Tempo médio de prática"
                  subtitulo="Por paciente e dia com treino"
                  valor={formatarMinutos(
                    resumo.tempo_medio_min
                  )}
                  icone={Clock}
                  href="/relatorios/atividade"
                  cor="bg-roxo/10"
                />

                <div className="flex min-h-44 flex-col justify-between gap-4 rounded-3xl bg-gradient-to-br from-salmao to-salmao/80 p-5 text-white shadow-lg sm:col-span-2">
                  <div>
                    <p className="text-base font-semibold">
                      Pacientes sem prática recente
                    </p>

                    <p className="mt-1 text-sm text-white/90">
                      Crianças que não jogam há 7 dias ou mais
                    </p>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <p className="text-5xl font-bold">
                        {semPraticaRecente.length}
                      </p>

                      <div className="flex items-center pl-2">
                        {semPraticaRecente
                          .slice(0, 4)
                          .map((paciente, index) => (
                            <div
                              key={paciente._id}
                              className={`rounded-full border-2 border-salmao ${
                                index > 0 ? "-ml-3" : ""
                              }`}
                            >
                              <Avatar
                                nome={paciente.nome}
                                foto={paciente.foto_perfil}
                                tamanho="h-11 w-11"
                              />
                            </div>
                          ))}
                      </div>
                    </div>

                    <span className="rounded-2xl bg-white/15 px-4 py-2 text-xs font-semibold">
                      {semPraticaRecente.length
                        ? "Acompanhar frequência"
                        : "Prática em dia"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                <div className="min-w-0 rounded-3xl bg-white p-5 shadow-lg sm:p-6 xl:col-span-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold lg:text-xl">
                        Atividade diária
                      </h2>

                      <p className="mt-1 text-sm text-text/60">
                        Minutos praticados nos últimos 7 dias
                      </p>
                    </div>

                    <Link
                      href="/relatorios/atividade"
                      className="rounded-full bg-salmao/10 px-4 py-2 text-sm font-medium text-salmao transition hover:bg-salmao hover:text-white"
                    >
                      Ver relatório
                    </Link>
                  </div>

                  <div className="mt-6 h-72 w-full sm:h-80">
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
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                          unit="min"
                        />

                        <Tooltip
                          formatter={(valor) => [
                            `${valor} min`,
                            "Tempo de prática",
                          ]}
                          labelFormatter={(label, itens) => {
                            const data = itens?.[0]?.payload?.data;

                            return data
                              ? `${label} · ${formatarData(data)}`
                              : label;
                          }}
                        />

                        <Bar
                          dataKey="minutos"
                          fill="#76D3CC"
                          radius={[7, 7, 0, 0]}
                          maxBarSize={48}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="mt-3 text-xs text-text/50">
                    {totalTentativasSemana} tentativas
                    registradas nos últimos 7 dias.
                  </p>
                </div>

                <div className="min-w-0 rounded-3xl bg-white p-5 shadow-lg sm:p-6 xl:col-span-2">
                  <div>
                    <h2 className="text-lg font-semibold lg:text-xl">
                      Calendário de prática
                    </h2>

                    <p className="mt-1 text-sm text-text/60">
                      Dias com exercícios registrados
                    </p>
                  </div>

                  <Calendario atividades={atividadeSemanal} />
                </div>
              </section>

              <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6 xl:col-span-2">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold lg:text-xl">
                      Atenção à frequência
                    </h2>

                    <p className="mt-1 text-sm text-text/60">
                      Pacientes com cadastro ativo que não
                      jogaram nos últimos 7 dias.
                    </p>
                  </div>

                  {semPraticaRecente.length ? (
                    <div className="flex flex-col gap-3">
                      {semPraticaRecente.map((paciente) => (
                        <div
                          key={paciente._id}
                          className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3"
                        >
                          <Avatar
                            nome={paciente.nome}
                            foto={paciente.foto_perfil}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">
                              {paciente.nome}
                            </p>

                            <p className="mt-1 text-xs text-text/60">
                              {paciente.ultimo_treino
                                ? `Última prática no período: ${formatarData(paciente.ultimo_treino)}`
                                : "Sem prática registrada no período consultado"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-turquesa/10 p-5 text-sm text-text/70">
                      Todos os pacientes com cadastro ativo
                      praticaram nos últimos 7 dias.
                    </div>
                  )}
                </div>

                <div className="min-w-0 rounded-3xl bg-white p-5 shadow-lg sm:p-6 xl:col-span-3">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold lg:text-xl">
                        Pacientes em destaque
                      </h2>

                      <p className="mt-1 text-sm text-text/60">
                        Maior tempo de prática no período
                        analisado.
                      </p>
                    </div>

                    <Link
                      href="/relatorios"
                      className="rounded-full bg-salmao/10 px-4 py-2 text-sm font-medium text-salmao transition hover:bg-salmao hover:text-white"
                    >
                      Ver relatório
                    </Link>
                  </div>

                  {resumo.top_pacientes?.length ? (
                    <div className="flex flex-col gap-3">
                      {resumo.top_pacientes.map(
                        (paciente, index) => (
                          <div
                            key={paciente._id}
                            className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3"
                          >
                            <span className="w-5 text-center font-semibold text-text/50">
                              {index + 1}
                            </span>

                            <Avatar
                              nome={paciente.nome}
                              foto={paciente.foto_perfil}
                            />

                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold">
                                {paciente.nome}
                              </p>

                              <p className="mt-1 text-xs text-text/60">
                                {paciente.tentativas} tentativas
                                {" · "}
                                {paciente.taxa_acerto}% de acertos
                              </p>
                            </div>

                            <span className="shrink-0 font-semibold text-salmao">
                              {formatarMinutos(paciente.minutos)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-text/60">
                      Nenhuma prática registrada no período.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold lg:text-xl">
                      Pacientes cadastrados
                    </h2>

                    <p className="mt-1 text-sm text-text/60">
                      Situação cadastral, independente
                      da frequência nos jogos.
                    </p>
                  </div>

                  <Link
                    href="/pacientes"
                    className="rounded-full bg-salmao px-4 py-2 text-sm font-medium text-white transition hover:bg-salmao/80"
                  >
                    Ver todos
                  </Link>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-text/10 text-text/60">
                        <th className="px-3 py-4 font-semibold">
                          Paciente
                        </th>

                        <th className="px-3 py-4 font-semibold">
                          Idade
                        </th>

                        <th className="px-3 py-4 font-semibold">
                          Gravidade
                        </th>

                        <th className="px-3 py-4 font-semibold">
                          Situação do cadastro
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {pacientesOrdenados.slice(0, 6).map(
                        (paciente) => (
                          <tr
                            key={paciente._id}
                            className="border-b border-text/5 last:border-0"
                          >
                            <td className="px-3 py-4">
                              <Link
                                href={`/pacientes/${paciente._id}`}
                                className="flex items-center gap-3 hover:text-salmao"
                              >
                                <Avatar
                                  nome={paciente.nome}
                                  foto={paciente.foto_perfil}
                                  tamanho="h-10 w-10"
                                />

                                <span className="font-medium">
                                  {paciente.nome}{" "}
                                  {paciente.sobrenome || ""}
                                </span>
                              </Link>
                            </td>

                            <td className="px-3 py-4">
                              {paciente.idade != null
                                ? `${paciente.idade} anos`
                                : "—"}
                            </td>

                            <td className="px-3 py-4">
                              {paciente.nivel_gravidade || "—"}
                            </td>

                            <td className="px-3 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                  paciente.ativo === false
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {paciente.ativo === false
                                  ? "Cadastro desativado"
                                  : "Cadastro ativo"}
                              </span>
                            </td>
                          </tr>
                        )
                      )}

                      {!pacientesOrdenados.length && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-10 text-center text-text/60"
                          >
                            Nenhum paciente cadastrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {pacientesOrdenados.length > 6 && (
                  <p className="mt-4 text-right text-xs text-text/50">
                    Exibindo 6 de {pacientesOrdenados.length} pacientes.
                  </p>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
