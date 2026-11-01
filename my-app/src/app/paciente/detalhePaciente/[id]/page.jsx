
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
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
import Profile from "@/assets/profile.png";
import Back from "@/assets/icons/back.svg";
import Editar from "@/assets/icons/editar.svg";
import { getAxiosConfig } from "@/services/auth";
import { getImageUrl } from "@/utils/page";

const API_URL = "http://localhost:4000";
const LISTA_URL = "/paciente/pacientes";

function formatarTempo(valor) {
  const minutos = Number(valor) || 0;

  if (minutos < 60) {
    return `${Math.round(minutos)} min`;
  }

  const horas = Math.floor(minutos / 60);
  const restante = Math.round(minutos % 60);

  return restante
    ? `${horas}h ${restante}min`
    : `${horas}h`;
}

function formatarData(valor) {
  if (!valor) return "Não informado";

  const [ano, mes, dia] = String(valor)
    .slice(0, 10)
    .split("-");

  if (!ano || !mes || !dia) return "Não informado";

  return `${dia}/${mes}/${ano}`;
}

function calcularIdade(valor) {
  if (!valor) return "Não informado";

  const [ano, mes, dia] = String(valor)
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!ano || !mes || !dia) return "Não informado";

  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;

  if (
    hoje.getMonth() + 1 < mes ||
    (hoje.getMonth() + 1 === mes &&
      hoje.getDate() < dia)
  ) {
    idade--;
  }

  return `${idade} ${idade === 1 ? "ano" : "anos"}`;
}

function formatarCPF(valor) {
  const numeros = String(valor || "").replace(/\D/g, "");

  if (numeros.length !== 11) {
    return valor || "Não informado";
  }

  return numeros.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );
}

function Campo({ titulo, valor }) {
  return (
    <div>
      <p className="text-sm text-text/60">{titulo}</p>
      <p className="mt-1 break-words font-semibold text-text">
        {valor || "Não informado"}
      </p>
    </div>
  );
}

function Indicador({ titulo, valor, descricao }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg">
      <p className="text-sm text-text/60">{titulo}</p>
      <p className="mt-3 text-2xl font-bold text-salmao md:text-3xl">
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

export default function DetalhePaciente() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [login, setLogin] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [resumo, setResumo] = useState(null);
  const [atividade, setAtividade] = useState(null);
  const [fonemas, setFonemas] = useState([]);
  const [carregandoRelatorios, setCarregandoRelatorios] =
    useState(true);
  const [erroRelatorios, setErroRelatorios] = useState("");
  const [recarregarRelatorios, setRecarregarRelatorios] =
    useState(0);

  const [notas, setNotas] = useState([]);
  const [carregandoNotas, setCarregandoNotas] = useState(true);
  const [textoNota, setTextoNota] = useState("");
  const [notaEditando, setNotaEditando] = useState(null);
  const [salvandoNota, setSalvandoNota] = useState(false);
  const [excluindoNota, setExcluindoNota] = useState(null);
  const [mostrarTodasNotas, setMostrarTodasNotas] =
    useState(false);

  const [confirmarStatus, setConfirmarStatus] = useState(false);
  const [alterandoStatus, setAlterandoStatus] = useState(false);

  const [confirmarSenha, setConfirmarSenha] = useState(false);
  const [redefinindoSenha, setRedefinindoSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(true);

  useEffect(() => {
    if (!id) {
      setCarregando(false);
      setErro("Paciente não identificado.");
      return;
    }

    const controller = new AbortController();

    async function carregarPaciente() {
      setCarregando(true);
      setErro("");

      try {
        const resposta = await axios.get(
          `${API_URL}/api/pacientes/${encodeURIComponent(id)}`,
          {
            ...getAxiosConfig(),
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        const dados = resposta.data?.paciente;

        if (!dados?._id) {
          throw new Error("Dados do paciente inválidos.");
        }

        setPaciente(dados);
        setLogin(resposta.data?.login || null);
      } catch (error) {
        if (controller.signal.aborted) return;

        const mensagem =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Não foi possível carregar o paciente.";

        setErro(mensagem);
        toast.error(mensagem);
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarPaciente();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function carregarRelatorios() {
      setCarregandoRelatorios(true);
      setErroRelatorios("");

      const config = {
        ...getAxiosConfig(),
        signal: controller.signal,
        params: {
          id_paciente: id,
        },
      };

      try {
        const [respostaResumo, respostaAtividade, respostaFonema] =
          await Promise.all([
            axios.get(
              `${API_URL}/api/relatorios/resumo`,
              config
            ),
            axios.get(
              `${API_URL}/api/relatorios/atividade`,
              config
            ),
            axios.get(
              `${API_URL}/api/relatorios/fonema`,
              config
            ),
          ]);

        if (controller.signal.aborted) return;

        setResumo(respostaResumo.data);
        setAtividade(respostaAtividade.data);
        setFonemas(respostaFonema.data?.fonemas || []);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Erro ao carregar desempenho:", error);

        setErroRelatorios(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Não foi possível carregar o desempenho."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregandoRelatorios(false);
        }
      }
    }

    carregarRelatorios();

    return () => controller.abort();
  }, [id, recarregarRelatorios]);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function carregarNotas() {
      setCarregandoNotas(true);

      try {
        const resposta = await axios.get(
          `${API_URL}/api/pacientes/${encodeURIComponent(id)}/notas`,
          {
            ...getAxiosConfig(),
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        setNotas(resposta.data?.notas || []);
      } catch (error) {
        if (controller.signal.aborted) return;

        toast.error("Não foi possível carregar as notas clínicas.");
      } finally {
        if (!controller.signal.aborted) {
          setCarregandoNotas(false);
        }
      }
    }

    carregarNotas();

    return () => controller.abort();
  }, [id]);

  const diasGrafico = useMemo(
    () =>
      (resumo?.por_dia || []).map((item) => ({
        dia: item.dia,
        data: item.data,
        minutos: Number(item.minutos) || 0,
        tentativas: Number(item.tentativas) || 0,
      })),
    [resumo]
  );

  const totalTentativas = useMemo(
    () =>
      (atividade?.dias || []).reduce(
        (total, dia) =>
          total + (Number(dia.tentativas) || 0),
        0
      ),
    [atividade]
  );

  const tentativasPorFonema = useMemo(
    () =>
      fonemas.reduce(
        (total, fonema) =>
          total + (Number(fonema.tentativas) || 0),
        0
      ),
    [fonemas]
  );

  const nomeCompleto = paciente
    ? [paciente.nome, paciente.sobrenome]
        .filter(Boolean)
        .join(" ")
    : "";

  const responsavel = paciente?.responsavel || {};
  const notasVisiveis = mostrarTodasNotas
    ? notas
    : notas.slice(0, 3);

  async function alterarStatus() {
    if (!paciente || alterandoStatus) return;

    const ativar = !paciente.ativo;

    setAlterandoStatus(true);

    try {
      const resposta = await axios.put(
        `${API_URL}/api/pacientes/${encodeURIComponent(id)}/${
          ativar ? "ativar" : "desativar"
        }`,
        {},
        getAxiosConfig()
      );

      setPaciente((anterior) => ({
        ...anterior,
        ativo: ativar,
      }));

      setConfirmarStatus(false);

      toast.success(
        resposta.data?.message ||
          (ativar
            ? "Paciente reativado!"
            : "Paciente desativado!")
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Não foi possível alterar o status."
      );
    } finally {
      setAlterandoStatus(false);
    }
  }

  async function redefinirSenha() {
    if (!paciente?.ativo || redefinindoSenha) return;

    setRedefinindoSenha(true);

    try {
      const resposta = await axios.post(
        `${API_URL}/api/pacientes/${encodeURIComponent(id)}/resetar-senha`,
        {},
        getAxiosConfig()
      );

      const credenciais = resposta.data?.login;

      if (!credenciais?.senha) {
        toast.error(
          "A senha foi redefinida, mas não foi retornada."
        );
        setConfirmarSenha(false);
        return;
      }

      setLogin((anterior) => ({
        ...anterior,
        usuario: credenciais.usuario,
        precisa_trocar_senha: true,
      }));

      setNovaSenha(credenciais.senha);
      setMostrarSenha(true);
      setConfirmarSenha(false);

      toast.success("Nova senha provisória gerada!");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Não foi possível redefinir a senha."
      );
    } finally {
      setRedefinindoSenha(false);
    }
  }

  async function copiarTexto(texto, descricao) {
    try {
      await navigator.clipboard.writeText(texto);
      toast.success(`${descricao} copiado!`);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  async function salvarNota(evento) {
    evento.preventDefault();

    const texto = textoNota.trim();

    if (!texto) {
      toast.error("Escreva uma nota antes de salvar.");
      return;
    }

    if (texto.length > 3000 || salvandoNota) return;

    setSalvandoNota(true);

    try {
      if (notaEditando) {
        const resposta = await axios.put(
          `${API_URL}/api/pacientes/${encodeURIComponent(id)}/notas/${notaEditando}`,
          { texto },
          getAxiosConfig()
        );

        setNotas((anteriores) =>
          anteriores.map((nota) =>
            nota._id === notaEditando
              ? resposta.data.nota
              : nota
          )
        );

        toast.success("Nota atualizada!");
      } else {
        const resposta = await axios.post(
          `${API_URL}/api/pacientes/${encodeURIComponent(id)}/notas`,
          { texto },
          getAxiosConfig()
        );

        setNotas((anteriores) => [
          resposta.data.nota,
          ...anteriores,
        ]);

        toast.success("Nota adicionada!");
      }

      setTextoNota("");
      setNotaEditando(null);
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Não foi possível salvar a nota."
      );
    } finally {
      setSalvandoNota(false);
    }
  }

  function editarNota(nota) {
    setNotaEditando(nota._id);
    setTextoNota(nota.texto);
    setMostrarTodasNotas(true);
  }

  async function excluirNota(notaId) {
    if (excluindoNota) return;

    setExcluindoNota(notaId);

    try {
      await axios.delete(
        `${API_URL}/api/pacientes/${encodeURIComponent(id)}/notas/${notaId}`,
        getAxiosConfig()
      );

      setNotas((anteriores) =>
        anteriores.filter((nota) => nota._id !== notaId)
      );

      if (notaEditando === notaId) {
        setNotaEditando(null);
        setTextoNota("");
      }

      toast.success("Nota excluída!");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Não foi possível excluir a nota."
      );
    } finally {
      setExcluindoNota(null);
    }
  }

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

        <main className="flex flex-col gap-6 p-4 font-jakarta text-sm text-text md:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="hidden lg:block">
              Home / Pacientes /{" "}
              <span className="font-semibold text-salmao">
                {nomeCompleto || "Detalhes"}
              </span>
            </p>

            <Link
              href={LISTA_URL}
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
            >
              <img
                src={Back.src || Back}
                alt="Voltar"
                className="w-5"
              />
            </Link>
          </div>

          {carregando ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
              Carregando paciente...
            </div>
          ) : erro || !paciente ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
              <p className="text-red-600">
                {erro || "Paciente não encontrado."}
              </p>
              <Link
                href={LISTA_URL}
                className="mt-4 inline-block text-salmao"
              >
                Voltar aos pacientes
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <section className="rounded-2xl bg-white p-5 shadow-lg sm:p-6">
                  <div className="mb-7 flex flex-col items-center gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:text-left">
                    <img
                      src={getImageUrl(
                        paciente.foto_perfil,
                        Profile.src || Profile
                      )}
                      alt={`Foto de ${nomeCompleto}`}
                      className="h-28 w-28 rounded-full object-cover"
                      onError={(evento) => {
                        evento.currentTarget.onerror = null;
                        evento.currentTarget.src =
                          Profile.src || Profile;
                      }}
                    />

                    <div className="text-center sm:text-left">
                      <h1 className="text-xl font-semibold md:text-2xl">
                        {nomeCompleto}
                      </h1>
                      <p className="mt-2 text-text/60">
                        {calcularIdade(paciente.data_nasc)}
                      </p>
                      <span
                        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          paciente.ativo
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {paciente.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>

                  <h2 className="mb-5 text-lg font-semibold">
                    Dados cadastrais
                  </h2>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Campo
                      titulo="Nome"
                      valor={nomeCompleto}
                    />
                    <Campo
                      titulo="Data de nascimento"
                      valor={formatarData(paciente.data_nasc)}
                    />
                    <Campo
                      titulo="Sexo"
                      valor={
                        paciente.sexo === "F"
                          ? "Feminino"
                          : paciente.sexo === "M"
                            ? "Masculino"
                            : paciente.sexo
                      }
                    />
                    <Campo
                      titulo="Nível de gravidade"
                      valor={paciente.nivel_gravidade}
                    />
                    <Campo
                      titulo="Responsável"
                      valor={
                        typeof responsavel === "string"
                          ? responsavel
                          : responsavel.nome
                      }
                    />
                    <Campo
                      titulo="Contato"
                      valor={responsavel.contato}
                    />
                    <Campo
                      titulo="CPF do responsável"
                      valor={formatarCPF(responsavel.cpf)}
                    />
                    <Campo
                      titulo="Endereço"
                      valor={paciente.endereco}
                    />
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                    {paciente.ativo && (
                      <Link
                        href={`/paciente/alterar/${id}`}
                        className="flex items-center gap-2 rounded-xl bg-turquesa px-5 py-3 font-semibold"
                      >
                        <img
                          src={Editar.src || Editar}
                          alt=""
                          className="w-5"
                        />
                        Editar paciente
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => setConfirmarStatus(true)}
                      className="cursor-pointer rounded-xl bg-salmao px-5 py-3 font-semibold text-white"
                    >
                      {paciente.ativo
                        ? "Desativar paciente"
                        : "Reativar paciente"}
                    </button>
                  </div>
                </section>

                <aside className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-lg sm:p-6">
                  <h2 className="text-lg font-semibold">
                    Notas clínicas
                  </h2>

                  {carregandoNotas ? (
                    <p className="text-text/60">
                      Carregando notas...
                    </p>
                  ) : notas.length === 0 ? (
                    <p className="text-text/60">
                      Nenhuma nota registrada.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {notasVisiveis.map((nota) => (
                        <div
                          key={nota._id}
                          className="rounded-xl bg-gray-50 p-4"
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {nota.texto}
                          </p>

                          <p className="mt-2 text-xs text-text/50">
                            {formatarData(nota.createdAt)}
                          </p>

                          <div className="mt-3 flex gap-4">
                            <button
                              type="button"
                              onClick={() => editarNota(nota)}
                              className="cursor-pointer text-xs font-semibold text-turquesa"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              disabled={
                                excluindoNota === nota._id
                              }
                              onClick={() =>
                                excluirNota(nota._id)
                              }
                              className="cursor-pointer text-xs font-semibold text-red-500 disabled:opacity-50"
                            >
                              {excluindoNota === nota._id
                                ? "Excluindo..."
                                : "Excluir"}
                            </button>
                          </div>
                        </div>
                      ))}

                      {notas.length > 3 && (
                        <button
                          type="button"
                          onClick={() =>
                            setMostrarTodasNotas(
                              (anterior) => !anterior
                            )
                          }
                          className="cursor-pointer font-semibold text-salmao"
                        >
                          {mostrarTodasNotas
                            ? "Mostrar menos"
                            : "Ver todas as notas"}
                        </button>
                      )}
                    </div>
                  )}

                  <form
                    onSubmit={salvarNota}
                    className="mt-auto flex flex-col gap-3 border-t border-gray-100 pt-4"
                  >
                    <label
                      htmlFor="texto-nota"
                      className="font-semibold"
                    >
                      {notaEditando
                        ? "Editar nota"
                        : "Nova nota"}
                    </label>

                    <textarea
                      id="texto-nota"
                      value={textoNota}
                      onChange={(evento) =>
                        setTextoNota(evento.target.value)
                      }
                      maxLength={3000}
                      rows={4}
                      placeholder="Escreva uma observação clínica..."
                      className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-turquesa"
                    />

                    <p className="text-right text-xs text-text/50">
                      {textoNota.length}/3000
                    </p>

                    <button
                      type="submit"
                      disabled={salvandoNota}
                      className="cursor-pointer rounded-xl bg-turquesa px-4 py-3 font-semibold disabled:opacity-50"
                    >
                      {salvandoNota
                        ? "Salvando..."
                        : notaEditando
                          ? "Salvar edição"
                          : "Adicionar nota"}
                    </button>

                    {notaEditando && (
                      <button
                        type="button"
                        onClick={() => {
                          setNotaEditando(null);
                          setTextoNota("");
                        }}
                        className="cursor-pointer text-sm text-text/60"
                      >
                        Cancelar edição
                      </button>
                    )}
                  </form>
                </aside>
              </div>

              <section className="rounded-2xl bg-white p-5 shadow-lg sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Desempenho do paciente
                    </h2>
                    <p className="mt-1 text-sm text-text/60">
                      Indicadores reais registrados nas atividades.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={carregandoRelatorios}
                    onClick={() =>
                      setRecarregarRelatorios(
                        (anterior) => anterior + 1
                      )
                    }
                    className="cursor-pointer rounded-xl bg-turquesa px-4 py-2.5 font-semibold disabled:opacity-50"
                  >
                    {carregandoRelatorios
                      ? "Atualizando..."
                      : "Atualizar dados"}
                  </button>
                </div>

                {erroRelatorios && (
                  <p
                    role="alert"
                    className="mb-5 rounded-xl bg-red-50 p-4 text-red-700"
                  >
                    {erroRelatorios}
                  </p>
                )}

                {carregandoRelatorios && !resumo ? (
                  <p className="py-10 text-center text-text/60">
                    Carregando desempenho...
                  </p>
                ) : resumo ? (
                  <>
                    <p className="mb-5 text-xs text-text/50">
                      Período:{" "}
                      {formatarData(resumo.periodo?.de)} a{" "}
                      {formatarData(resumo.periodo?.ate)}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <Indicador
                        titulo="Média de acertos"
                        valor={
                          tentativasPorFonema > 0
                            ? `${resumo.media_acertos ?? 0}%`
                            : "—"
                        }
                        descricao="Taxa de acertos no período"
                      />

                      <Indicador
                        titulo="Tempo de prática"
                        valor={formatarTempo(
                          atividade?.total_minutos
                        )}
                        descricao="Tempo total no período"
                      />

                      <Indicador
                        titulo="Tentativas registradas"
                        valor={totalTentativas}
                        descricao="Exercícios realizados no período"
                      />

                      <Indicador
                        titulo="Tempo médio de prática"
                        valor={formatarTempo(
                          resumo.tempo_medio_min
                        )}
                        descricao="Por dia com atividade"
                      />
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
                      <div className="min-w-0 rounded-xl border border-gray-100 p-4 sm:p-5">
                        <h3 className="mb-2 font-semibold">
                          Prática nos últimos 7 dias
                        </h3>

                        <p className="mb-5 text-xs text-text/50">
                          Minutos de atividade por dia
                        </p>

                        <div className="h-64 w-full">
                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                          >
                            <BarChart
                              data={diasGrafico}
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
                                  const data =
                                    itens?.[0]?.payload?.data;

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
                      </div>

                      <div className="rounded-xl border border-gray-100 p-4 sm:p-5">
                        <h3 className="font-semibold">
                          Desempenho por fonema
                        </h3>

                        <p className="mt-1 text-xs text-text/50">
                          Acertos e tentativas por fonema
                        </p>

                        {fonemas.length === 0 ? (
                          <p className="py-10 text-center text-text/50">
                            Nenhuma tentativa por fonema
                            registrada no período.
                          </p>
                        ) : (
                          <div className="mt-5 flex flex-col gap-5">
                            {fonemas.map((fonema) => (
                              <div key={fonema.fonema}>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                  <span className="font-semibold">
                                    {fonema.fonema}
                                  </span>
                                  <span className="font-semibold text-salmao">
                                    {fonema.taxa_acerto}%
                                  </span>
                                </div>

                                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className="h-full rounded-full bg-turquesa"
                                    style={{
                                      width: `${Math.max(
                                        0,
                                        Math.min(
                                          100,
                                          Number(
                                            fonema.taxa_acerto
                                          ) || 0
                                        )
                                      )}%`,
                                    }}
                                  />
                                </div>

                                <div className="mt-2 flex justify-between gap-3 text-xs text-text/50">
                                  <span>
                                    {fonema.acertos} acertos de{" "}
                                    {fonema.tentativas} tentativas
                                  </span>
                                  <span>
                                    {fonema.dificuldade}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <Link
                          href={`/relatorios/fonema?id_paciente=${encodeURIComponent(id)}`}
                          className="mt-6 inline-block font-semibold text-salmao hover:underline"
                        >
                          Ver relatório por fonema
                        </Link>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-4">
                      <Link
                        href={`/relatorios/atividade?id_paciente=${encodeURIComponent(id)}`}
                        className="font-semibold text-salmao hover:underline"
                      >
                        Ver atividade diária
                      </Link>

                      <Link
                        href={`/relatorios/evolucao?id_paciente=${encodeURIComponent(id)}`}
                        className="font-semibold text-salmao hover:underline"
                      >
                        Ver evolução de acertos
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="py-10 text-center text-text/60">
                    Os indicadores ainda não estão disponíveis.
                  </p>
                )}
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-lg sm:p-6">
                <h2 className="text-lg font-semibold">
                  Acesso ao aplicativo
                </h2>

                <p className="mt-1 text-sm text-text/60">
                  Gerencie as credenciais do paciente.
                </p>

                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-text/50">
                    USUÁRIO
                  </p>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="break-all font-semibold">
                      {login?.usuario || "Não disponível"}
                    </p>

                    {login?.usuario && (
                      <button
                        type="button"
                        onClick={() =>
                          copiarTexto(
                            login.usuario,
                            "Usuário"
                          )
                        }
                        className="cursor-pointer font-semibold text-turquesa"
                      >
                        Copiar
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm text-text/60">
                  A senha atual não pode ser consultada.
                  Você pode gerar uma nova senha provisória.
                </p>

                <button
                  type="button"
                  disabled={!paciente.ativo}
                  onClick={() => setConfirmarSenha(true)}
                  className="mt-4 cursor-pointer rounded-xl bg-salmao px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  Redefinir senha
                </button>
              </section>
            </>
          )}
        </main>
      </div>

      {confirmarStatus && paciente && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold">
              {paciente.ativo
                ? "Desativar paciente?"
                : "Reativar paciente?"}
            </h2>

            <p className="mt-3 text-text/60">
              {paciente.ativo
                ? "O cadastro será preservado e poderá ser reativado depois."
                : "O paciente voltará a ficar ativo no sistema."}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={alterandoStatus}
                onClick={() => setConfirmarStatus(false)}
                className="flex-1 rounded-xl border px-4 py-3"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={alterandoStatus}
                onClick={alterarStatus}
                className="flex-1 rounded-xl bg-salmao px-4 py-3 font-semibold text-white disabled:opacity-50"
              >
                {alterandoStatus
                  ? "Aguarde..."
                  : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmarSenha && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold">
              Redefinir senha?
            </h2>

            <p className="mt-3 text-text/60">
              A senha atual deixará de funcionar.
              Uma nova senha provisória será gerada.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={redefinindoSenha}
                onClick={() => setConfirmarSenha(false)}
                className="flex-1 rounded-xl border px-4 py-3"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={redefinindoSenha}
                onClick={redefinirSenha}
                className="flex-1 rounded-xl bg-salmao px-4 py-3 font-semibold text-white disabled:opacity-50"
              >
                {redefinindoSenha
                  ? "Gerando..."
                  : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {novaSenha && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold">
              Nova senha gerada!
            </h2>

            <p className="mt-2 text-text/60">
              Copie as credenciais antes de fechar.
            </p>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-text/50">
                USUÁRIO
              </p>

              <p className="mt-2 break-all font-semibold">
                {login?.usuario}
              </p>

              <button
                type="button"
                onClick={() =>
                  copiarTexto(login?.usuario, "Usuário")
                }
                className="mt-2 font-semibold text-turquesa"
              >
                Copiar usuário
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-text/50">
                SENHA PROVISÓRIA
              </p>

              <p className="mt-2 break-all font-semibold">
                {mostrarSenha ? novaSenha : "••••••••"}
              </p>

              <div className="mt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setMostrarSenha((anterior) => !anterior)
                  }
                  className="font-semibold text-turquesa"
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    copiarTexto(novaSenha, "Senha")
                  }
                  className="font-semibold text-turquesa"
                >
                  Copiar senha
                </button>
              </div>
            </div>

            <p className="mt-4 rounded-xl bg-salmao/10 p-4 text-sm">
              Esta senha será exibida somente agora.
              Entregue-a apenas ao responsável autorizado.
            </p>

            <button
              type="button"
              onClick={() => {
                setNovaSenha("");
                setMostrarSenha(false);
              }}
              className="mt-5 w-full rounded-xl bg-turquesa px-5 py-3 font-semibold"
            >
              Já copiei as credenciais
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
