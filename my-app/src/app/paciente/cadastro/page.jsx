"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Input from "@/components/Input";
import Radiobox from "@/components/Radiobox";
import Selectbox from "@/components/Selectbox";
import { getAxiosConfig } from "@/services/auth";
 
//assets
import Back from "@/assets/icons/back.svg";
import Img from "@/assets/icons/img.svg";
 
const TIPOS_FOTO = ["image/png", "image/jpeg", "image/webp"];
const TAMANHO_MAX_FOTO = 10 * 1024 * 1024; // 10 MB
 
const opcoesGravidade = [
  { label: "Leve", value: "Leve" },
  { label: "Moderado", value: "Moderado" },
  { label: "Grave", value: "Grave" },
  { label: "Severa", value: "Severa" },
];
 
const CadastroPaciente = () => {
  const router = useRouter();
  const inputFotoRef = useRef(null);
 
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [enviando, setEnviando] = useState(false);
 
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [sexo, setSexo] = useState("");
  const [nivelGravidade, setNivelGravidade] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [contato, setContato] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
 
  // libera a URL do preview quando trocar a foto ou sair da página
  useEffect(() => {
    return () => {
      if (previewFoto) URL.revokeObjectURL(previewFoto);
    };
  }, [previewFoto]);
 
  const handleFoto = (e) => {
    const arquivo = e.target.files[0];
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
  };
 
  const handleRemoverFoto = () => {
    setFoto(null);
    setPreviewFoto(null);
    if (inputFotoRef.current) inputFotoRef.current.value = "";
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (
      !nome.trim() ||
      !sobrenome.trim() ||
      !dataNasc ||
      !sexo ||
      !nivelGravidade ||
      !responsavel.trim() ||
      !contato.trim()
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
 
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("sobrenome", sobrenome);
    formData.append("data_nasc", dataNasc);
    formData.append("sexo", sexo);
    formData.append("nivel_gravidade", nivelGravidade);
    formData.append("endereco", endereco);
    formData.append("responsavel[nome]", responsavel);
    formData.append("responsavel[contato]", contato);
    formData.append("responsavel[cpf]", cpf);
 
    if (foto) formData.append("foto_perfil", foto); 
 
    try {
      setEnviando(true);
 
      const response = await axios.post(
        "http://localhost:4000/api/pacientes",
        formData,
        getAxiosConfig(),
      );
 
      if (response.status === 201) {
        const { login } = response.data;
        alert(
          `Paciente cadastrado com sucesso!\n\n` +
            `Usuário: ${login.usuario}\n` +
            `Senha provisória: ${login.senha}\n\n` +
            `Anote agora: a senha não será exibida novamente.`,
        );
        router.push("/paciente/pacientes");
      }
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error.response?.data || error);
      alert(error.response?.data?.error || "Erro ao cadastrar o paciente!");
    } finally {
      setEnviando(false);
    }
  };
 
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />
 
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40">
          <Navbar onToggleMenu={() => setSidebarAberta(!sidebarAberta)} />
        </header>
 
        <main className="text-text font-jakarta text-sm p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <p className="text-xs sm:text-sm text-text/60">
              Home / Pacientes /{" "}
              <span className="text-salmao font-semibold">
                Cadastrar Paciente
              </span>
            </p>
 
            <Link
              href="/pacientes"
              className="self-end sm:self-auto flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
              title="Voltar"
            >
              <img src={Back.src || Back} alt="Voltar" className="w-5" />
            </Link>
          </div>
 
          <div className="py-6">
            <p className="text-xl text-center md:text-2xl">Cadastrar Paciente</p>
          </div>
 
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 lg:p-8 grid gap-8 xl:grid-cols-[280px_1fr]"
          >
            {/* FOTO DE PERFIL */}
            <section className="flex flex-col items-center gap-4 xl:items-start">
              <p className="text-base font-semibold">Foto de Perfil</p>
 
              <input
                ref={inputFotoRef}
                type="file"
                name="foto_perfil"
                id="foto_perfil"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFoto}
              />
 
              <button
                type="button"
                onClick={() => inputFotoRef.current?.click()}
                className="w-full max-w-xs cursor-pointer bg-text/10 hover:bg-text/15 transition rounded-2xl p-6 flex flex-col items-center gap-1 text-center"
              >
                {previewFoto ? (
                  <img
                    src={previewFoto}
                    alt="Pré-visualização da foto"
                    className="w-32 h-32 rounded-full object-cover mb-2"
                  />
                ) : (
                  <img src={Img.src || Img} alt="" className="w-6" />
                )}
 
                <p className="text-sm font-semibold">PNG, JPG ou WEBP</p>
                <p className="text-xs text-text/60">(máximo 10 MB)</p>
                <span className="text-xs text-gray-500 break-all">
                  {foto ? foto.name : "Nenhum arquivo selecionado"}
                </span>
              </button>
 
              {foto && (
                <button
                  type="button"
                  onClick={handleRemoverFoto}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remover foto
                </button>
              )}
            </section>
 
            {/* DADOS */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              <div className="flex flex-col gap-1">
                <Input
                  type="text"
                  label="Nome"
                  name="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
 
              <div className="flex flex-col gap-1 md:col-span-1 xl:col-span-2">
                <Input
                  type="text"
                  label="Sobrenome"
                  name="sobrenome"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                />
              </div>
 
              <div className="flex flex-col gap-1">
                <Input
                  type="date"
                  label="Data de Nascimento"
                  name="data_nasc"
                  value={dataNasc}
                  onChange={(e) => setDataNasc(e.target.value)}
                />
              </div>
 
              <div className="flex flex-col gap-3">
                <label className="text-base font-semibold">Sexo</label>
                <div className="flex items-center gap-5 min-h-[48px]">
                  <Radiobox
                    label="Feminino"
                    name="sexo"
                    value="F"
                    checked={sexo === "F"}
                    onChange={(e) => setSexo(e.target.value)}
                  />
                  <Radiobox
                    label="Masculino"
                    name="sexo"
                    value="M"
                    checked={sexo === "M"}
                    onChange={(e) => setSexo(e.target.value)}
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
                  value={nivelGravidade}
                  onChange={(e) => setNivelGravidade(e.target.value)}
                  options={opcoesGravidade}
                  placeholder="Selecione o nível"
                />
              </div>
 
              <div className="flex flex-col gap-1 md:col-span-2">
                <Input
                  type="text"
                  label="Responsável"
                  name="responsavel"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                />
              </div>
 
              <div className="flex flex-col gap-1">
                <Input
                  type="text"
                  label="Contato"
                  name="contato"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                />
              </div>
 
              <div className="flex flex-col gap-1">
                <Input
                  type="text"
                  label="CPF"
                  name="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
 
              <div className="flex flex-col gap-1 md:col-span-2">
                <Input
                  type="text"
                  label="Endereço"
                  name="endereco"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
 
              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end pt-4 md:col-span-2 xl:col-span-3 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full sm:w-auto py-3 px-6 bg-turquesa rounded-xl font-medium hover:bg-turquesa/75 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enviando ? "Cadastrando..." : "Cadastrar"}
                </button>
 
                <Link
                  href="/pacientes"
                  className="w-full sm:w-auto text-center py-3 px-6 bg-red-500 rounded-xl text-white font-medium hover:bg-red-500/80 transition"
                >
                  Cancelar
                </Link>
              </div>
            </section>
          </form>
        </main>
      </div>
    </div>
  );
};
 
export default CadastroPaciente;
