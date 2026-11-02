
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getAxiosConfig, logout } from "@/services/auth";
import Back from "@/assets/icons/back.svg";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

const CHAVE_PREFERENCIAS = "lola_preferencias_painel";

const preferenciasIniciais = {
  notificacoesVisuais: true,
  duracaoAtividade: "30",
  nivelInicial: "1",
  formatoRelatorio: "pdf",
};

function OpcaoIndisponivel({ titulo, descricao }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div>
        <p className="font-medium text-text/70">
          {titulo}
        </p>

        <p className="mt-1 text-sm text-text/50">
          {descricao}
        </p>
      </div>

      <span className="shrink-0 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
        Em breve
      </span>
    </div>
  );
}

function CampoSelect({
  id,
  titulo,
  descricao,
  valor,
  aoAlterar,
  opcoes,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium">
        {titulo}
      </label>

      {descricao && (
        <p className="text-xs text-text/60">
          {descricao}
        </p>
      )}

      <select
        id={id}
        value={valor}
        onChange={(evento) => aoAlterar(evento.target.value)}
        className="rounded-2xl border border-text/20 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-turquesa focus:ring-1 focus:ring-turquesa"
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Configuracoes() {
  const router = useRouter();

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [preferencias, setPreferencias] = useState(
    preferenciasIniciais
  );
  const [carregando, setCarregando] = useState(true);
  const [modalDesativacaoAberto, setModalDesativacaoAberto] =
    useState(false);
  const [desativando, setDesativando] = useState(false);

  useEffect(() => {
    try {
      const salvas = localStorage.getItem(
        CHAVE_PREFERENCIAS
      );

      if (salvas) {
        const dados = JSON.parse(salvas);

        setPreferencias({
          ...preferenciasIniciais,
          ...dados,
        });
      }
    } catch (error) {
      console.error(
        "Erro ao carregar preferências:",
        error
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (!modalDesativacaoAberto) return;

    function fecharComEscape(evento) {
      if (evento.key === "Escape" && !desativando) {
        setModalDesativacaoAberto(false);
      }
    }

    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        fecharComEscape
      );
    };
  }, [modalDesativacaoAberto, desativando]);

  function alterarPreferencia(campo, valor) {
    setPreferencias((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function salvarConfiguracoes(evento) {
    evento.preventDefault();

    try {
      localStorage.setItem(
        CHAVE_PREFERENCIAS,
        JSON.stringify(preferencias)
      );

      toast.success(
        "Preferências deste navegador salvas com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao salvar preferências:",
        error
      );

      toast.error(
        "Não foi possível salvar as preferências."
      );
    }
  }

  function restaurarPadrao() {
    try {
      localStorage.removeItem(CHAVE_PREFERENCIAS);
      setPreferencias(preferenciasIniciais);

      toast.success(
        "Preferências restauradas para o padrão."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Não foi possível restaurar as preferências."
      );
    }
  }

  async function desativarConta() {
    if (desativando) return;

    setDesativando(true);

    try {
      await axios.put(
        `${API_URL}/api/auth/desativar`,
        {},
        getAxiosConfig()
      );

      setModalDesativacaoAberto(false);

      toast.success(
        "Sua conta foi desativada com sucesso."
      );

      logout(router);
    } catch (error) {
      console.error(
        "Erro ao desativar conta:",
        error
      );

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Não foi possível desativar sua conta."
      );
    } finally {
      setDesativando(false);
    }
  }

  return (
    <>
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

          <main className="flex flex-col gap-6 bg-fundo px-4 py-5 font-jakarta text-sm text-text sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-text/60 sm:text-sm">
                  Home /{" "}
                  <span className="font-semibold text-salmao">
                    Configurações
                  </span>
                </p>

                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  Configurações
                </h1>

                <p className="mt-2 text-sm text-text/60">
                  Personalize suas preferências e gerencie
                  sua conta no Lolá.
                </p>
              </div>

              <Link
                href="/home"
                className="flex h-10 w-10 items-center justify-center self-end rounded-full bg-white shadow transition hover:bg-gray-100 sm:self-auto"
              >
                <img
                  src={Back.src || Back}
                  alt="Voltar"
                  className="w-5"
                />
              </Link>
            </section>

            <div className="rounded-2xl border border-turquesa/30 bg-turquesa/10 p-4 text-sm leading-relaxed text-text/70">
              As preferências disponíveis nesta tela são
              armazenadas somente neste navegador.
              Elas não alteram automaticamente as atividades
              ou os dados clínicos dos pacientes no servidor.
            </div>

            <form
              onSubmit={salvarConfiguracoes}
              className="flex flex-col gap-6"
            >
              <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                      Preferências do painel
                    </h2>

                    <p className="mt-1 text-sm text-text/60">
                      Ajustes locais da interface.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4">
                      <div>
                        <label
                          htmlFor="notificacoesVisuais"
                          className="font-medium"
                        >
                          Notificações visuais
                        </label>

                        <p className="mt-1 text-sm text-text/60">
                          Preferência para avisos na interface
                        </p>
                      </div>

                      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                        <input
                          id="notificacoesVisuais"
                          type="checkbox"
                          checked={
                            preferencias.notificacoesVisuais
                          }
                          onChange={(evento) =>
                            alterarPreferencia(
                              "notificacoesVisuais",
                              evento.target.checked
                            )
                          }
                          className="peer sr-only"
                        />

                        <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-turquesa" />

                        <div className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                      </label>
                    </div>

                    <p className="text-xs leading-relaxed text-text/50">
                      Esta opção registra uma preferência
                      local. A integração com avisos
                      do sistema ainda não foi implementada.
                    </p>

                    <OpcaoIndisponivel
                      titulo="Modo escuro"
                      descricao="Alternar o tema visual do painel"
                    />

                    <OpcaoIndisponivel
                      titulo="Backup automático"
                      descricao="Cópias de segurança dos dados no servidor"
                    />

                    <OpcaoIndisponivel
                      titulo="Manter sessão ativa"
                      descricao="Controle da duração da autenticação"
                    />
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                      Preferências clínicas
                    </h2>

                    <p className="mt-1 text-sm text-text/60">
                      Valores de referência para futuras
                      personalizações.
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <CampoSelect
                      id="duracaoAtividade"
                      titulo="Tempo preferido de atividade"
                      descricao="Preferência local; não altera a duração das atividades no backend."
                      valor={preferencias.duracaoAtividade}
                      aoAlterar={(valor) =>
                        alterarPreferencia(
                          "duracaoAtividade",
                          valor
                        )
                      }
                      opcoes={[
                        {
                          valor: "15",
                          rotulo: "15 minutos",
                        },
                        {
                          valor: "30",
                          rotulo: "30 minutos",
                        },
                        {
                          valor: "45",
                          rotulo: "45 minutos",
                        },
                        {
                          valor: "60",
                          rotulo: "60 minutos",
                        },
                      ]}
                    />

                    <CampoSelect
                      id="nivelInicial"
                      titulo="Nível inicial preferido"
                      descricao="Não modifica o nível dos pacientes cadastrados."
                      valor={preferencias.nivelInicial}
                      aoAlterar={(valor) =>
                        alterarPreferencia(
                          "nivelInicial",
                          valor
                        )
                      }
                      opcoes={[
                        {
                          valor: "1",
                          rotulo: "Nível 1",
                        },
                        {
                          valor: "2",
                          rotulo: "Nível 2",
                        },
                        {
                          valor: "3",
                          rotulo: "Nível 3",
                        },
                      ]}
                    />

                    <CampoSelect
                      id="formatoRelatorio"
                      titulo="Formato preferido de relatório"
                      descricao="Não gera arquivos automaticamente."
                      valor={preferencias.formatoRelatorio}
                      aoAlterar={(valor) =>
                        alterarPreferencia(
                          "formatoRelatorio",
                          valor
                        )
                      }
                      opcoes={[
                        {
                          valor: "pdf",
                          rotulo: "PDF",
                        },
                        {
                          valor: "xlsx",
                          rotulo: "Excel",
                        },
                        {
                          valor: "csv",
                          rotulo: "CSV",
                        },
                      ]}
                    />

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={carregando}
                        className="rounded-xl bg-turquesa px-6 py-3 font-semibold text-white transition hover:bg-turquesa/80 disabled:opacity-50"
                      >
                        Salvar preferências
                      </button>

                      <button
                        type="button"
                        onClick={restaurarPadrao}
                        disabled={carregando}
                        className="rounded-xl border border-text/20 px-6 py-3 font-medium transition hover:bg-gray-50 disabled:opacity-50"
                      >
                        Restaurar padrão
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </form>

            <section className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Segurança
                </h2>

                <p className="mt-1 text-sm text-text/60">
                  Informações sobre a proteção da conta
                  e funcionalidades futuras.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <OpcaoIndisponivel
                  titulo="Alterar senha"
                  descricao="Atualização segura da senha de acesso"
                />

                <OpcaoIndisponivel
                  titulo="Autenticação em dois fatores"
                  descricao="Uma etapa adicional de verificação"
                />

                <OpcaoIndisponivel
                  titulo="Sessões conectadas"
                  descricao="Gerenciamento de dispositivos autenticados"
                />

                <OpcaoIndisponivel
                  titulo="Histórico de acessos"
                  descricao="Consulta aos registros de login"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-red-700">
                    Desativar minha conta
                  </h2>

                  <p className="mt-1 max-w-3xl text-sm leading-relaxed text-red-600">
                    Sua conta ficará inacessível até ser
                    reativada. Os dados dos pacientes e os
                    históricos de atividades serão preservados.
                    Você poderá solicitar a reativação na
                    tela de login.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setModalDesativacaoAberto(true)
                  }
                  className="w-full shrink-0 rounded-xl bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-600 sm:w-auto"
                >
                  Desativar conta
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>

      {modalDesativacaoAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onMouseDown={(evento) => {
            if (
              evento.target === evento.currentTarget &&
              !desativando
            ) {
              setModalDesativacaoAberto(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-desativacao"
            aria-describedby="descricao-desativacao"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
              <span className="text-2xl font-bold text-red-600">
                !
              </span>
            </div>

            <h2
              id="titulo-desativacao"
              className="text-xl font-semibold text-text"
            >
              Desativar sua conta?
            </h2>

            <p
              id="descricao-desativacao"
              className="mt-3 text-sm leading-relaxed text-text/60"
            >
              Você será desconectada do Lolá e não poderá
              acessar o painel até reativar sua conta
              utilizando suas credenciais na tela de login.
            </p>

            <p className="mt-3 text-sm font-medium text-text">
              Seus dados e os registros dos pacientes
              serão mantidos.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={desativando}
                onClick={() =>
                  setModalDesativacaoAberto(false)
                }
                className="rounded-xl border border-text/20 px-5 py-3 font-medium transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={desativando}
                onClick={desativarConta}
                className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {desativando
                  ? "Desativando..."
                  : "Sim, desativar conta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
