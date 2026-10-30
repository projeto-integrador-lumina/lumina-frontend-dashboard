"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { getAxiosConfig } from "@/services/auth";

//assets
import Profile from "@/assets/profile.png";
import Img from "@/assets/icons/img.svg";
import Back from "@/assets/icons/back.svg";
import Input from "@/components/Input";
import Radiobox from "@/components/Radiobox";
import Selectbox from "@/components/Selectbox";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const LISTA_URL = "/paciente/pacientes";
const TIPOS_FOTO = ["image/png", "image/jpeg", "image/webp"];
const TAMANHO_MAX_FOTO = 10 * 1024 * 1024;

const opcoesGravidade = [
  { label: "Leve", value: "Leve" },
  { label: "Moderado", value: "Moderado" },
  { label: "Grave", value: "Grave" },
  { label: "Severa", value: "Severa" },
];

const AlterarPaciente = () => {
  const estadoInicial = {
    nome: "",
    sobrenome: "",
    data_nasc: "",
    sexo: "",
    nivel_gravidade: "",
    responsavel: "",
    contato: "",
    cpf: "",
    endereco: "",
  };

  function urlFoto(caminho) {
    if (!caminho) return Profile.src || Profile;
    if (/^(https?:\/\/|data:|blob:)/i.test(caminho)) return caminho;
    const normalizado = String(caminho).replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_URL}/${normalizado}`;
  }

  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const inputFotoRef = useRef(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState(estadoInicial);
  const [foto, setFoto] = useState(null);
  const [fotoAtual, setFotoAtual] = useState(Profile.src || Profile);
  const [previewFoto, setPreviewFoto] = useState(null);

  useEffect(() => {
    return () => {
      if (previewFoto) URL.revokeObjectURL(previewFoto);
    };
  }, [previewFoto]);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    async function buscarPaciente() {
      setCarregando(true);
      setErro("");
      try {
        const resposta = await axios.get(
          `${API_URL}/api/pacientes/${encodeURIComponent(id)}`,
          { ...getAxiosConfig(), signal: controller.signal },
        );
        const paciente = resposta.data?.paciente ?? resposta.data;
        if (!paciente || typeof paciente !== "object")
          throw new Error("Resposta inválida da API.");
        const responsavel = paciente.responsavel || {};
        setForm({
          nome: paciente.nome || "",
          sobrenome: paciente.sobrenome || "",
          data_nasc: paciente.data_nasc
            ? String(paciente.data_nasc).slice(0, 10)
            : "",
          sexo:
            paciente.sexo === "Masculino"
              ? "M"
              : paciente.sexo === "Feminino"
                ? "F"
                : paciente.sexo || "",
          nivel_gravidade: paciente.nivel_gravidade || "",
          responsavel:
            typeof responsavel === "string"
              ? responsavel
              : responsavel.nome || "",
          contato: paciente.contato || responsavel.contato || "",
          cpf: paciente.cpf || responsavel.cpf || "",
          endereco: paciente.endereco || "",
        });
        setFotoAtual(urlFoto(paciente.foto_perfil));
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Erro ao carregar paciente:", error);
        setErro(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Não foi possível carregar o paciente.",
        );
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }
    buscarPaciente();
    return () => controller.abort();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFoto(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (!TIPOS_FOTO.includes(arquivo.type)) {
      alert("Formato inválido. Use PNG, JPG ou WEBP.");
      e.target.value = "";
      return;
    }
    if (arquivo.size > TAMANHO_MAX_FOTO) {
      alert("A foto deve ter no máximo 10 MB.");
      e.target.value = "";
      return;
    }
    setFoto(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  function handleRemoverFoto() {
    setFoto(null);
    setPreviewFoto(null);
    if (inputFotoRef.current) inputFotoRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (enviando || carregando) return;
    if (
      !form.nome.trim() ||
      !form.sobrenome.trim() ||
      !form.data_nasc ||
      !form.sexo ||
      !form.nivel_gravidade ||
      !form.responsavel.trim() ||
      !form.contato.trim()
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    const formData = new FormData();
    formData.append("nome", form.nome.trim());
    formData.append("sobrenome", form.sobrenome.trim());
    formData.append("data_nasc", form.data_nasc);
    formData.append("sexo", form.sexo);
    formData.append("nivel_gravidade", form.nivel_gravidade);
    formData.append("endereco", form.endereco);
    formData.append("responsavel[nome]", form.responsavel.trim());
    formData.append("responsavel[contato]", form.contato.trim());
    formData.append("responsavel[cpf]", form.cpf.trim());
    if (foto) formData.append("foto_perfil", foto);

    setEnviando(true);
    setErro("");
    try {
      await axios.put(
        `${API_URL}/api/pacientes/${encodeURIComponent(id)}`,
        formData,
        getAxiosConfig(),
      );
      alert("Paciente atualizado com sucesso!");
      router.push(LISTA_URL);
    } catch (error) {
      console.error("Erro ao alterar paciente:", error.response?.data || error);
      const mensagem =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao alterar o paciente!";
      setErro(mensagem);
      alert(mensagem);
    } finally {
      setEnviando(false);
    }
  }

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

          <main className="text-text font-jakarta text-sm p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <p className="text-xs sm:text-sm text-text/60">
                  Home / Pacientes /
                  <span className="text-salmao font-semibold">
                    Editar Paciente
                  </span>
                </p>
              </div>

              <Link
                href={LISTA_URL}
                className="self-end sm:self-auto flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
                title="Voltar"
              >
                <img src={Back.src || Back} alt="voltar" className="w-5" />
              </Link>
            </div>
            <div className="py-6">
              <p className="text-xl text-center md:text-2xl">Editar Paciente</p>
            </div>
            {carregando ? (
              <p className="text-center py-8">
                Carregando dados do paciente...
              </p>
            ) : erro && !form.nome ? (
              <div className="text-center py-8 text-red-600" role="alert">
                {erro}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 lg:p-8 grid gap-8 xl:grid-cols-[280px_1fr]"
              >
                <section className="flex flex-col items-center gap-4 xl:items-start">
                  <p className="text-base font-semibold">Foto de Perfil</p>
                  <input
                    ref={inputFotoRef}
                    type="file"
                    name="foto_perfil"
                    id="foto_perfil"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFoto}
                  />
                  <button
                    type="button"
                    onClick={() => inputFotoRef.current?.click()}
                    className="w-full max-w-xs cursor-pointer bg-text/10 hover:bg-text/15 transition rounded-2xl p-6 flex flex-col items-center gap-1 text-center"
                  >
                    <img
                      src={previewFoto || fotoAtual}
                      alt="Foto do paciente"
                      className="w-32 h-32 rounded-full object-cover mb-2"
                      onError={(e) => {
                        e.currentTarget.src = Profile.src || Profile;
                      }}
                    />
                    <img src={Img.src || Img} alt="" className="w-6" />
                    <p className="text-sm font-semibold">PNG, JPG ou WEBP</p>
                    <p className="text-xs text-text/60">(máximo 10 MB)</p>
                    <span className="text-xs text-gray-500 break-all">
                      {foto ? foto.name : "Clique para trocar a foto"}
                    </span>
                  </button>
                  {foto && (
                    <button
                      type="button"
                      onClick={handleRemoverFoto}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Cancelar troca da foto
                    </button>
                  )}
                </section>
                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                  <div className="flex flex-col gap-1">
                    <Input
                      type="text"
                      label="Nome"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-1 xl:col-span-2">
                    <Input
                      type="text"
                      label="Sobrenome"
                      name="sobrenome"
                      value={form.sobrenome}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Input
                      type="date"
                      label="Data de Nascimento"
                      name="data_nasc"
                      value={form.data_nasc}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-base font-semibold">Sexo</label>
                    <div className="flex items-center gap-5 min-h-[48px]">
                      <Radiobox
                        label="Feminino"
                        name="sexo"
                        value="F"
                        checked={form.sexo === "F"}
                        onChange={handleChange}
                      />
                      <Radiobox
                        label="Masculino"
                        name="sexo"
                        value="M"
                        checked={form.sexo === "M"}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-base font-semibold">
                      Nível de Gravidade
                    </label>
                    <Selectbox
                      label="Nível de Gravidade"
                      name="nivel_gravidade"
                      value={form.nivel_gravidade}
                      onChange={handleChange}
                      options={opcoesGravidade}
                      placeholder="Selecione o nível"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <Input
                      type="text"
                      label="Responsável"
                      name="responsavel"
                      value={form.responsavel}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Input
                      type="text"
                      label="Contato"
                      name="contato"
                      value={form.contato}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Input
                      type="text"
                      label="CPF"
                      name="cpf"
                      value={form.cpf}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <Input
                      type="text"
                      label="Endereço"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleChange}
                    />
                  </div>
                  {erro && (
                    <p
                      role="alert"
                      className="text-red-600 md:col-span-2 xl:col-span-3"
                    >
                      {erro}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end pt-4 md:col-span-2 xl:col-span-3 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={enviando}
                      className="w-full sm:w-auto py-3 px-6 bg-turquesa rounded-xl font-medium hover:bg-turquesa/75 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enviando ? "Salvando..." : "Salvar Alterações"}
                    </button>
                    <Link
                      href={LISTA_URL}
                      className="w-full sm:w-auto text-center py-3 px-6 bg-red-500 rounded-xl text-white font-medium hover:bg-red-500/80 transition"
                    >
                      Cancelar
                    </Link>
                  </div>
                </section>
              </form>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default AlterarPaciente;
