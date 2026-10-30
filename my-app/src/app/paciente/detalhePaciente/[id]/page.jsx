"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { getAxiosConfig } from "@/services/auth";
import { getImageUrl } from "@/utils/page";
import toast from "react-hot-toast";

//assets
import Editar from "@/assets/icons/editar.svg";
import Excluir from "@/assets/icons/excluir.svg";
import Perfil from "@/assets/icons/perfil.svg";
import Seguranca from "@/assets/icons/seguranca.svg";
import Back from "@/assets/icons/back.svg";
import Profile from "@/assets/profile.png";

const detalhePaciente = () => {
  const router = useRouter();
  const { id } = useParams();

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [login, setLogin] = useState(null);
  const [senhaProvisoria, setSenhaProvisoria] = useState("");
  const [redefinindoSenha, setRedefinindoSenha] = useState(false);
  const [confirmarRedefinicao, setConfirmarRedefinicao] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    if (!id) return;

    const detalhePaciente = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/pacientes/${id}`,
          getAxiosConfig(),
        );

        setPaciente(response.data.paciente);
        setLogin(response.data.login);
      } catch (error) {
        console.log("ão foi possível mostrar os detalhes do paciente.", error);
        setMensagemErro("Não foi possível mostrar os detalhes do paciente.");
      } finally {
        setCarregando(false);
      }
    };
    detalhePaciente();
  }, [id]);

  const formatarData = (data) => {
    if (!data) return "Não informado";

    const [ano, mes, dia] = String(data).slice(0, 10).split("-");

    return `${dia}/${mes}/${ano}`;
  };

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return "Não informado";

    const [ano, mes, dia] = String(dataNascimento)
      .slice(0, 10)
      .split("-")
      .map(Number);

    const hoje = new Date();

    let idade = hoje.getFullYear() - ano;

    if (
      hoje.getMonth() + 1 < mes ||
      (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)
    ) {
      idade--;
    }

    return `${idade} anos`;
  };

  const formatarDataRegistro = (data) => {
    if (!data) return "Não informado";

    return new Date(data).toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  };

  const excluirPaciente = async () => {
    if (!id || excluindo) return;

    try {
      setExcluindo(true);

      await axios.delete(
        `http://localhost:4000/api/pacientes/${id}`,
        getAxiosConfig(),
      );

      setModalExcluirAberto(false);

      toast.success("Paciente excluído com sucesso!");

      router.push("/paciente/pacientes");
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);

      toast.error("Não foi possível excluir o paciente.");
    } finally {
      setExcluindo(false);
    }
  };

  const redefinirSenha = async () => {
    if (!id || redefinindoSenha) return;

    try {
      setRedefinindoSenha(true);

      const response = await axios.post(
        `http://localhost:4000/api/pacientes/${id}/resetar-senha`,
        {},
        getAxiosConfig(),
      );

      setSenhaProvisoria(response.data.login.senha);
      setMostrarSenha(true);
      setConfirmarRedefinicao(false);

      setLogin((anterior) => ({
        ...anterior,
        usuario: response.data.login.usuario,
        precisa_trocar_senha: true,
      }));

      toast.success("Nova senha provisória gerada!");
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);

      toast.error(
        error.response?.data?.error || "Não foi possível redefinir a senha.",
      );
    } finally {
      setRedefinindoSenha(false);
    }
  };

  const copiarTexto = async (texto) => {
    if (!texto) {
      toast.error("Não há informações para copiar.");
      return;
    }

    try {
      await navigator.clipboard.writeText(texto);
      toast.success("Copiado com sucesso!");
    } catch (error) {
      console.error("Erro ao copiar:", error);
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarAberta}
          onClose={() => setSidebarAberta(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40">
            <Navbar onToggleMenu={() => setSidebarAberta(!sidebarAberta)} />
          </header>

          <main className="text-text font-jakarta text-sm p-4 md:p-8 flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <p className="hidden lg:block px-2">
                  Home / Pacientes /{" "}
                  <span className="text-salmao font-semibold">
                    {paciente
                      ? `${paciente.nome} ${paciente.sobrenome}`
                      : "Carregando..."}
                  </span>
                </p>
              </div>

              <Link
                href="/paciente/pacientes"
                className="self-end sm:self-auto flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
                title="Voltar"
              >
                <img src={Back.src || Back} alt="voltar" className="w-5" />
              </Link>
            </div>

            <div className="w-full flex flex-col gap-6 lg:gap-8">
              <div className="grid gap-6 xl:grid-cols-[3fr_1.2fr]">
                {!carregando && paciente && (
                  <section className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 lg:p-8">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
                      <div className="flex flex-col items-center text-center gap-2 md:col-span-2 xl:col-span-1 xl:row-span-3 xl:justify-center">
                        <img
                          src={getImageUrl(
                            paciente.foto_perfil,
                            Profile.src || Profile,
                          )}
                          alt={`Foto de ${paciente.nome}`}
                          className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover shadow-md"
                        />

                        <p className="text-lg sm:text-xl font-semibold">
                          {paciente.nome} {paciente.sobrenome}
                        </p>

                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs sm:text-sm font-medium">
                          {paciente.ativo ? "Ativo" : "Inativo"}
                        </span>

                        <p className="text-sm sm:text-base text-text/70">
                          Nível 1
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-text/60">Nome</p>
                        <p className="text-base font-semibold">
                          {paciente.nome} {paciente.sobrenome}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-text/60">
                          Data de Nascimento
                        </p>
                        <p className="text-base font-semibold">
                          {formatarData(paciente.data_nasc)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-text/60">Idade</p>
                        <p className="text-base font-semibold">
                          {calcularIdade(paciente.data_nasc)}
                        </p>
                      </div>

                      <div className="xl:col-start-2">
                        <p className="text-sm text-text/60">Alvo Atual</p>
                        <p className="text-base font-semibold">/s/</p>
                      </div>

                      <div>
                        <p className="text-sm text-text/60">Cadastrado em</p>
                        <p className="text-base font-semibold">
                          {formatarDataRegistro(paciente.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-text/60">Responsável</p>
                        <p className="text-base font-semibold break-words">
                          {paciente.responsavel?.nome || "Não informado"}
                        </p>
                      </div>

                      <div className="xl:col-start-2">
                        <p className="text-sm text-text/60">Contato</p>
                        <p className="text-base font-semibold">
                          {paciente.responsavel?.contato || "Não informado"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-text/60">CPF</p>
                        <p className="text-base font-semibold">
                          {paciente.responsavel?.cpf || "Não informado"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-text/60">Sexo</p>
                        <p className="text-base font-semibold">
                          {paciente.sexo}
                        </p>
                      </div>

                      <div className="md:col-span-2 xl:col-span-2 xl:col-start-2">
                        <p className="text-sm text-text/60">Endereço</p>
                        <p className="text-base font-semibold break-words">
                          {paciente.endereco}
                        </p>
                      </div>

                      <div className="md:col-span-2 xl:col-span-4 flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-100">
                        <Link
                          href={`/paciente/alterar/${id}`}
                          className="flex items-center justify-center gap-2 px-5 py-3 bg-turquesa rounded-xl hover:bg-turquesa/75 transition"
                        >
                          <img src={Editar.src || Editar} className="w-5" />
                          <span className="font-medium">Editar</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setModalExcluirAberto(true)}
                          className="flex items-center justify-center gap-2 px-5 py-3 bg-salmao text-white rounded-xl hover:bg-salmao/75 transition cursor-pointer"
                        >
                          <img
                            src={Excluir.src || Excluir}
                            alt=""
                            className="w-5"
                          />
                          <span className="font-medium">Excluir</span>
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                <aside className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col gap-5 justify-between">
                  <div>
                    <p className="font-semibold text-lg md:text-xl">Notas</p>

                    <ul className="pl-5 flex flex-col gap-2 md:text-base pt-4 text-text/80">
                      <li className="list-disc">
                        Apresentou dificuldades na produção do encontro
                        consonantal na última sessão.
                      </li>
                      <li className="list-disc">
                        Maior dificuldade na consoante /s/.
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row gap-3">
                    <Link
                      href="#"
                      className="flex-1 text-center px-4 py-3 bg-roxo rounded-xl text-white hover:bg-roxo/75 transition"
                    >
                      Ver tudo
                    </Link>

                    <Link
                      href="#"
                      className="flex items-center justify-center px-4 py-3 bg-turquesa rounded-xl hover:bg-turquesa/75 transition"
                    >
                      <img src={Editar.src || Editar} className="w-5" />
                    </Link>
                  </div>
                </aside>
              </div>

              <section className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 font-jakarta">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-text">
                    Acesso ao Aplicativo
                  </h2>

                  <p className="text-sm text-text/60 mt-1">
                    Credenciais utilizadas para acessar o PWA.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-text/50 mb-2">USUÁRIO</p>

                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-text break-all">
                        {login?.usuario || "Não disponível"}
                      </p>

                      <button
                        type="button"
                        onClick={() => copiarTexto(login?.usuario)}
                        disabled={!login?.usuario}
                        className="text-turquesa text-sm font-semibold cursor-pointer"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-text/50 mb-2">
                      SENHA PROVISÓRIA
                    </p>

                    {senhaProvisoria ? (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-semibold text-text break-all">
                          {mostrarSenha ? senhaProvisoria : "••••••••"}
                        </p>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            className="text-sm font-semibold text-turquesa cursor-pointer"
                          >
                            {mostrarSenha ? "Ocultar" : "Mostrar"}
                          </button>

                          <button
                            type="button"
                            onClick={() => copiarTexto(senhaProvisoria)}
                            className="text-turquesa text-sm font-semibold cursor-pointer"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-text/60">
                        A senha está protegida e não pode ser consultada.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <p className="text-xs text-text/60">
                    Caso o responsável tenha perdido a senha, você pode gerar
                    uma nova senha provisória. A senha anterior deixará de
                    funcionar.
                  </p>

                  <button
                    type="button"
                    disabled={!paciente?.ativo || redefinindoSenha}
                    onClick={() => setConfirmarRedefinicao(true)}
                    className="self-start bg-salmao text-white px-5 py-3 rounded-xl font-medium hover:bg-salmao/80 transition disabled:opacity-50 cursor-pointer"
                  >
                    Redefinir senha
                  </button>
                </div>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
                <div className="bg-white shadow-lg rounded-2xl p-5 lg:p-8 flex flex-col items-center justify-between gap-5 text-center">
                  <p className="text-base font-semibold md:text-xl">
                    Média de Acertos
                  </p>
                  <span className="font-bold text-3xl text-salmao md:text-4xl">
                    68,9%
                  </span>
                  <Link
                    href="/relatorios"
                    className="px-4 py-2 bg-turquesa rounded-xl text-sm md:py-3 md:px-5 hover:bg-turquesa/75 transition"
                  >
                    Ver relatório
                  </Link>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-5 lg:p-8 flex flex-col items-center justify-between gap-5 text-center">
                  <p className="text-base font-semibold md:text-xl">
                    Média de Prática Semanal
                  </p>
                  <span className="font-bold text-3xl text-salmao md:text-4xl">
                    2h52min
                  </span>
                  <Link
                    href="/relatorios"
                    className="px-4 py-2 bg-turquesa rounded-xl text-sm md:py-3 md:px-5 hover:bg-turquesa/75 transition"
                  >
                    Ver relatório
                  </Link>
                </div>

                <div className="sm:col-span-2 bg-white shadow-lg rounded-2xl p-5 lg:p-8 flex flex-col gap-5 min-h-64">
                  <div>
                    <p className="text-lg font-semibold md:text-xl">
                      Desempenho por fonema
                    </p>
                    <p className="text-sm text-text/75">Taxa de Acertos</p>
                  </div>

                  <div className="flex flex-1 items-center justify-center rounded-xl bg-gray-50 text-text/50 h-40">
                    <canvas id="graficoFonemaPerfil"></canvas>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {modalExcluirAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-center font-jakarta">
            <div className="w-16 h-16 bg-salmao/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <img src={Excluir.src || Excluir} alt="" className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-text mb-3">
              Excluir paciente?
            </h2>

            <p className="text-text/60 text-sm mb-6">
              Tem certeza de que deseja excluir{" "}
              <strong className="text-text">
                {paciente?.nome} {paciente?.sobrenome}
              </strong>
              ? Essa ação não poderá ser desfeita.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setModalExcluirAberto(false)}
                disabled={excluindo}
                className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-text font-medium hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={excluirPaciente}
                disabled={excluindo}
                className="flex-1 px-5 py-3 rounded-xl bg-salmao text-white font-medium hover:bg-salmao/80 transition disabled:opacity-50  cursor-pointer"
              >
                {excluindo ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmarRedefinicao && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-redefinir-senha"
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 font-jakarta"
          >
            <h2
              id="titulo-redefinir-senha"
              className="text-xl font-bold text-text mb-3"
            >
              Redefinir senha do paciente?
            </h2>

            <p className="text-sm text-text/60 mb-6">
              Uma nova senha provisória será gerada para{" "}
              <strong>
                {paciente?.nome} {paciente?.sobrenome}
              </strong>
              . A senha atual deixará de funcionar.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={redefinindoSenha}
                onClick={() => setConfirmarRedefinicao(false)}
                className="flex-1 px-4 py-3 border border-turquesa rounded-xl font-medium disabled:opacity-50 hover:bg-turquesa cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={redefinindoSenha}
                onClick={redefinirSenha}
                className="flex-1 px-4 py-3 bg-salmao text-white rounded-xl font-medium disabled:opacity-50 hover:bg-salmao/80 cursor-pointer"
              >
                {redefinindoSenha ? "Gerando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {senhaProvisoria && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-nova-senha"
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-jakarta"
          >
            <h2
              id="titulo-nova-senha"
              className="text-xl font-bold text-text mb-2"
            >
              Nova senha gerada!
            </h2>

            <p className="text-sm text-text/60 mb-5">
              Copie as credenciais e entregue aos responsáveis. A senha será
              exibida apenas agora.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-3">
              <p className="text-xs text-text/50 mb-2">USUÁRIO</p>

              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold break-all">{login?.usuario}</p>

                <button
                  type="button"
                  onClick={() => copiarTexto(login?.usuario)}
                  className="text-turquesa text-sm font-semibold cursor-pointer"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-xs text-text/50 mb-2">NOVA SENHA PROVISÓRIA</p>

              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold break-all">
                  {mostrarSenha ? senhaProvisoria : "••••••••"}
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="text-turquesa text-sm font-semibold cursor-pointer"
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => copiarTexto(senhaProvisoria)}
                    className="text-turquesa text-sm font-semibold cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-salmao/10 p-4 mb-5">
              <p className="text-sm text-text/80">
                A senha anterior foi substituída. O responsável precisará
                utilizar esta nova senha para entrar novamente no aplicativo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSenhaProvisoria("");
                setMostrarSenha(false);
              }}
              className="w-full bg-turquesa px-5 py-3 rounded-xl font-semibold hover:bg-turquesa/80 transition cursor-pointer"
            >
              Já copiei as credenciais
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default detalhePaciente;
