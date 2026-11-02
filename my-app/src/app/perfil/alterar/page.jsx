"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getAxiosConfig } from "@/services/auth";
import { getImageUrl } from "@/utils/page";

import Profile from "@/assets/profile.png";
import Back from "@/assets/icons/back.svg";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

const camposIniciais = {
  nome: "",
  email: "",
  telefone: "",
  crfa: "",
};

export default function EditarPerfil() {
  const router = useRouter();
  const inputFotoRef = useRef(null);

  const [formulario, setFormulario] = useState(camposIniciais);
  const [fotoAtual, setFotoAtual] = useState("");
  const [novaFoto, setNovaFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        const resposta = await axios.get(
          `${API_URL}/fonoaudiologos/me`,
          getAxiosConfig(),
        );

        const fono = resposta.data?.fonoaudiologo;

        if (!fono) {
          throw new Error("Dados do perfil não encontrados.");
        }

        if (!ativo) return;

        setFormulario({
          nome: fono.nome || "",
          email: fono.email || "",
          telefone: fono.telefone || "",
          crfa: fono.crfa || "",
        });

        setFotoAtual(fono.foto_perfil ? getImageUrl(fono.foto_perfil) : "");
      } catch (error) {
        if (!ativo) return;

        const mensagem =
          error.response?.data?.error ||
          error.message ||
          "Não foi possível carregar o perfil.";

        setErro(mensagem);
        toast.error(mensagem);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!novaFoto) {
      setPreviewFoto("");
      return;
    }

    const url = URL.createObjectURL(novaFoto);
    setPreviewFoto(url);

    return () => URL.revokeObjectURL(url);
  }, [novaFoto]);

  function alterarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function selecionarFoto(evento) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      evento.target.value = "";
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      evento.target.value = "";
      return;
    }

    setNovaFoto(arquivo);
  }

  function cancelarNovaFoto() {
    setNovaFoto(null);

    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }
  }

  async function salvarPerfil(evento) {
    evento.preventDefault();

    if (salvando) return;

    const nome = formulario.nome.trim();
    const email = formulario.email.trim().toLowerCase();
    const telefone = formulario.telefone.trim();
    const crfa = formulario.crfa.trim();

    if (!nome || !email || !telefone || !crfa) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Informe um e-mail válido.");
      return;
    }

    const dados = new FormData();

    dados.append("nome", nome);
    dados.append("email", email);
    dados.append("telefone", telefone);
    dados.append("crfa", crfa);

    if (novaFoto) {
      dados.append("foto_perfil", novaFoto);
    }

    try {
      setSalvando(true);

      const resposta = await axios.put(
        `${API_URL}/fonoaudiologos/me`,
        dados,
        getAxiosConfig(),
      );

      toast.success(resposta.data?.message || "Perfil atualizado com sucesso!");

      router.push("/perfil");
      router.refresh();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Não foi possível atualizar o perfil.",
      );
    } finally {
      setSalvando(false);
    }
  }

  const imagemExibida = previewFoto || fotoAtual || Profile.src;

  const classeInput =
    "w-full rounded-2xl border border-gray-200 bg-[#f8f9fc] px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-turquesa focus:bg-white focus:ring-2 focus:ring-turquesa/10";

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40">
          <Navbar />
        </header>

        <main className="flex flex-col gap-8 p-4 font-jakarta text-text sm:p-6 lg:p-8 xl:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-text/50">
              Home / Perfil /{" "}
              <span className="font-semibold text-salmao">Editar perfil</span>
            </p>

            <Link
              href="/perfil"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100"
              title="Voltar ao perfil"
            >
              <img src={Back.src || Back} alt="Voltar" className="w-5" />
            </Link>
          </div>

          {carregando && (
            <div className="flex min-h-80 items-center justify-center rounded-[30px] bg-white shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-salmao/20 border-t-salmao" />
                <p className="text-sm text-text/50">
                  Carregando informações...
                </p>
              </div>
            </div>
          )}

          {!carregando && erro && (
            <div className="rounded-[30px] border border-red-100 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-red-600">
                Não foi possível carregar o perfil
              </h2>

              <p className="mt-2 text-sm text-text/60">{erro}</p>

              <Link
                href="/perfil"
                className="mt-6 inline-flex rounded-2xl bg-salmao px-6 py-3 text-sm font-semibold text-white"
              >
                Voltar ao perfil
              </Link>
            </div>
          )}

          {!carregando && !erro && (
            <form onSubmit={salvarPerfil} className="flex flex-col gap-6">
              <section className="overflow-hidden rounded-[30px] border border-gray-100 bg-white shadow-sm">
                <div className="relative h-28 overflow-hidden bg-gradient-to-r from-[#ED8981] via-[#F29B93] to-[#F5B2A9] sm:h-36">
                  <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border-[35px] border-white/10" />
                  <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/10" />
                </div>

                <div className="px-6 pb-10 pt-5 sm:px-10 sm:pb-12 sm:pt-7 lg:px-12">
                  <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12 lg:gap-16">
                    <div className="relative shrink-0 sm:-mt-12">
                      <div className="h-28 w-28 overflow-hidden rounded-full border-[5px] border-white bg-[#f1f2f4] shadow-lg sm:h-36 sm:w-36">
                        <img
                          src={imagemExibida}
                          alt="Foto de perfil"
                          className="h-full w-full object-cover object-center"
                          onError={(evento) => {
                            evento.currentTarget.onerror = null;
                            evento.currentTarget.src = Profile.src;
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => inputFotoRef.current?.click()}
                        className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-salmao text-white shadow-md transition hover:bg-[#e77d75]"
                        title="Alterar foto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col items-center gap-3 py-3 text-center sm:items-start sm:py-5 sm:text-left">
                      <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                        Personalize seu perfil
                      </h2>

                      <p className="text-sm text-text/50">
                        Escolha uma foto para identificar sua conta.
                      </p>

                      <div className="mt-2 flex flex-wrap justify-center gap-3 sm:justify-start">
                        <button
                          type="button"
                          onClick={() => inputFotoRef.current?.click()}
                          className="rounded-xl bg-[#fff3f1] px-4 py-2.5 text-sm font-semibold text-salmao transition hover:bg-[#ffe8e4]"
                        >
                          {novaFoto ? "Escolher outra foto" : "Alterar foto"}
                        </button>

                        {novaFoto && (
                          <button
                            type="button"
                            onClick={cancelarNovaFoto}
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
                          >
                            Cancelar seleção
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-text/40">
                        JPG, PNG ou WEBP. Máximo de 5 MB.
                      </p>

                      {novaFoto && (
                        <p className="max-w-full truncate text-xs font-medium text-turquesa">
                          Nova foto selecionada: {novaFoto.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <input
                    ref={inputFotoRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selecionarFoto}
                    className="hidden"
                  />
                </div>
              </section>

              <section className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Informações pessoais
                  </h3>

                  <p className="mt-1 text-sm text-text/50">
                    Atualize os dados da sua conta profissional.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="nome"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Nome completo
                    </label>

                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      value={formulario.nome}
                      onChange={alterarCampo}
                      placeholder="Digite seu nome completo"
                      className={classeInput}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      E-mail
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formulario.email}
                      onChange={alterarCampo}
                      placeholder="Digite seu e-mail"
                      className={classeInput}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="telefone"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Telefone
                    </label>

                    <input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      value={formulario.telefone}
                      onChange={alterarCampo}
                      placeholder="Digite seu telefone"
                      className={classeInput}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="crfa"
                      className="text-sm font-semibold text-gray-700"
                    >
                      CRFa
                    </label>

                    <input
                      id="crfa"
                      name="crfa"
                      type="text"
                      value={formulario.crfa}
                      onChange={alterarCampo}
                      placeholder="Digite seu CRFa"
                      className={classeInput}
                      required
                    />
                  </div>
                </div>
              </section>

              <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <Link
                  href="/perfil"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  disabled={salvando}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-salmao px-8 py-3 text-sm font-semibold text-white shadow-[0_5px_15px_rgba(237,137,129,0.2)] transition hover:bg-[#e77d75] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {salvando ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar alterações"
                  )}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
