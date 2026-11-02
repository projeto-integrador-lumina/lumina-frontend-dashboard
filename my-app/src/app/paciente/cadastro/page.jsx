"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Input from "@/components/Input";
import Radiobox from "@/components/Radiobox";
import Selectbox from "@/components/Selectbox";
import { getAxiosConfig } from "@/services/auth";
import Back from "@/assets/icons/back.svg";
import Img from "@/assets/icons/img.svg";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "");

const TIPOS_FOTO = ["image/png", "image/jpeg", "image/webp"];
const TAMANHO_MAX_FOTO = 10 * 1024 * 1024;
const opcoesGravidade = [
  { label: "Leve", value: "Leve" },
  { label: "Moderado", value: "Moderado" },
  { label: "Grave", value: "Grave" },
  { label: "Severa", value: "Severa" }
];

function somenteNumeros(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function formatarCPF(valor) {
  return somenteNumeros(valor).slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function dataNascimentoValida(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [ano, mes, dia] = valor.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return data <= hoje;
}

function gerarPin() {
  const numeros = new Uint32Array(1);
  const limite = Math.floor(4294967296 / 900000) * 900000;
  do {
    crypto.getRandomValues(numeros);
  } while (numeros[0] >= limite);
  return String(100000 + (numeros[0] % 900000));
}

export default function CadastroPaciente() {
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
  const [credenciais, setCredenciais] = useState(null);

  useEffect(() => {
    return () => {
      if (previewFoto) URL.revokeObjectURL(previewFoto);
    };
  }, [previewFoto]);

  function handleFoto(evento) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    if (!TIPOS_FOTO.includes(arquivo.type)) {
      toast.error("Formato inválido. Use PNG, JPG ou WEBP.");
      evento.target.value = "";
      return;
    }
    if (arquivo.size > TAMANHO_MAX_FOTO) {
      toast.error("A foto deve ter no máximo 10 MB.");
      evento.target.value = "";
      return;
    }
    setFoto(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  function removerFoto() {
    setFoto(null);
    setPreviewFoto(null);
    if (inputFotoRef.current) inputFotoRef.current.value = "";
  }

  async function copiarTexto(texto, descricao) {
    try {
      await navigator.clipboard.writeText(String(texto));
      toast.success(`${descricao} copiado!`);
    } catch {
      toast.error("Não foi possível copiar. Selecione o texto manualmente.");
    }
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (enviando || credenciais) return;
    if (!nome.trim() || !sobrenome.trim() || !dataNasc || !sexo || !nivelGravidade || !responsavel.trim() || !contato.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!dataNascimentoValida(dataNasc)) {
      toast.error("Informe uma data de nascimento válida.");
      return;
    }

    const pin = gerarPin();
    const formData = new FormData();
    formData.append("nome", nome.trim());
    formData.append("sobrenome", sobrenome.trim());
    formData.append("data_nasc", dataNasc);
    formData.append("sexo", sexo);
    formData.append("nivel_gravidade", nivelGravidade);
    formData.append("endereco", endereco.trim());
    formData.append("responsavel[nome]", responsavel.trim());
    formData.append("responsavel[contato]", contato.trim());
    formData.append("responsavel[cpf]", somenteNumeros(cpf));
    formData.append("pin_responsavel", pin);
    if (foto) formData.append("foto_perfil", foto);

    setEnviando(true);
    try {
      const resposta = await axios.post(`${API_URL}/api/pacientes`, formData, getAxiosConfig());
      if (resposta.status === 201) {
        toast.success(resposta.data?.message || "Paciente cadastrado com sucesso!");
        const login = resposta.data?.login;
        if (login?.usuario && login?.senha) {
          setCredenciais({ usuario: login.usuario, senha: login.senha, pin });
        } else {
          toast.error("O cadastro foi concluído, mas as credenciais não vieram na resposta.");
          router.push("/paciente/pacientes");
        }
      }
    } catch (error) {
      if (error.response?.status === 401) toast.error("Sua sessão expirou. Entre novamente.");
      else if (error.response?.status === 403) toast.error("Você não tem permissão para cadastrar pacientes.");
      else if (error.response?.status === 413) toast.error("A imagem enviada é muito grande.");
      else toast.error(error.response?.data?.error || error.response?.data?.message || "Não foi possível cadastrar o paciente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40">
          <Navbar onToggleMenu={() => setSidebarAberta((anterior) => !anterior)} />
        </header>
        <main className="p-4 font-jakarta text-sm text-text sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text/60 sm:text-sm">Home / Pacientes / <span className="font-semibold text-salmao">Cadastrar Paciente</span></p>
            <Link href="/paciente/pacientes" className="flex h-10 w-10 items-center justify-center self-end rounded-full bg-white shadow transition hover:bg-gray-100 sm:self-auto" title="Voltar">
              <img src={Back.src || Back} alt="Voltar" className="w-5" />
            </Link>
          </div>
          <div className="py-6 text-center">
            <h1 className="text-xl font-semibold md:text-2xl">Cadastrar Paciente</h1>
            <p className="mt-2 text-sm text-text/60">Preencha os dados para criar o cadastro, a senha de acesso e o PIN do responsável.</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-8 rounded-2xl bg-white p-5 shadow-lg sm:p-6 lg:p-8 xl:grid-cols-[280px_1fr]">
            <section className="flex flex-col items-center gap-4 xl:items-start">
              <h2 className="text-base font-semibold">Foto de Perfil</h2>
              <input ref={inputFotoRef} type="file" name="foto_perfil" id="foto_perfil" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFoto} />
              <button type="button" onClick={() => inputFotoRef.current?.click()} disabled={enviando} className="flex w-full max-w-xs cursor-pointer flex-col items-center gap-2 rounded-2xl bg-text/10 p-6 text-center transition hover:bg-text/15 disabled:opacity-50">
                {previewFoto ? <img src={previewFoto} alt="Pré-visualização da foto" className="mb-2 h-32 w-32 rounded-full object-cover" /> : <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white"><img src={Img.src || Img} alt="" className="w-8" /></div>}
                <p className="text-sm font-semibold">PNG, JPG ou WEBP</p>
                <p className="text-xs text-text/60">Máximo de 10 MB</p>
                <span className="max-w-full break-all text-xs text-gray-500">{foto ? foto.name : "Nenhum arquivo selecionado"}</span>
              </button>
              {foto && <button type="button" onClick={removerFoto} disabled={enviando} className="cursor-pointer text-xs text-red-500 hover:underline disabled:opacity-50">Remover foto</button>}
              <p className="max-w-xs text-center text-xs text-text/50 xl:text-left">A foto é opcional e poderá ser alterada posteriormente.</p>
            </section>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
              <div className="md:col-span-2 xl:col-span-3"><h2 className="border-b border-gray-100 pb-3 text-base font-semibold">Dados do paciente</h2></div>
              <div className="flex flex-col gap-1"><Input type="text" label="Nome" name="nome" value={nome} onChange={(evento) => setNome(evento.target.value)} /></div>
              <div className="flex flex-col gap-1 xl:col-span-2"><Input type="text" label="Sobrenome" name="sobrenome" value={sobrenome} onChange={(evento) => setSobrenome(evento.target.value)} /></div>
              <div className="flex flex-col gap-1"><Input type="date" label="Data de Nascimento" name="data_nasc" value={dataNasc} onChange={(evento) => setDataNasc(evento.target.value)} /></div>
              <div className="flex flex-col gap-3">
                <label className="text-base font-semibold">Sexo</label>
                <div className="flex min-h-[48px] flex-wrap items-center gap-5">
                  <Radiobox label="Feminino" name="sexo" value="F" checked={sexo === "F"} onChange={(evento) => setSexo(evento.target.value)} />
                  <Radiobox label="Masculino" name="sexo" value="M" checked={sexo === "M"} onChange={(evento) => setSexo(evento.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1"><label className="text-base font-semibold">Nível de Gravidade</label><Selectbox label="Nível de Gravidade" name="nivel_gravidade" value={nivelGravidade} onChange={(evento) => setNivelGravidade(evento.target.value)} options={opcoesGravidade} placeholder="Selecione o nível" /></div>
              <div className="md:col-span-2 xl:col-span-3"><h2 className="mt-3 border-b border-gray-100 pb-3 text-base font-semibold">Dados do responsável</h2></div>
              <div className="flex flex-col gap-1 md:col-span-2"><Input type="text" label="Nome do Responsável" name="responsavel" value={responsavel} onChange={(evento) => setResponsavel(evento.target.value)} /></div>
              <div className="flex flex-col gap-1"><Input type="tel" label="Contato" name="contato" value={contato} onChange={(evento) => setContato(evento.target.value)} /></div>
              <div className="flex flex-col gap-1"><Input type="text" label="CPF" name="cpf" value={cpf} onChange={(evento) => setCpf(formatarCPF(evento.target.value))} /></div>
              <div className="flex flex-col gap-1 md:col-span-2"><Input type="text" label="Endereço" name="endereco" value={endereco} onChange={(evento) => setEndereco(evento.target.value)} /></div>
              <div className="border-t border-gray-100 pt-4 md:col-span-2 xl:col-span-3">
                <p className="mb-4 text-xs text-text/50">O CPF, o endereço e a foto são opcionais. Os demais campos são necessários para concluir o cadastro. A senha e o PIN serão exibidos somente após o cadastro.</p>
                <div className="flex flex-col justify-end gap-3 sm:flex-row">
                  <Link href="/paciente/pacientes" className="w-full rounded-xl bg-red-500 px-6 py-3 text-center font-medium text-white transition hover:bg-red-500/80 sm:w-auto">Cancelar</Link>
                  <button type="submit" disabled={enviando} className="w-full cursor-pointer rounded-xl bg-turquesa px-6 py-3 font-semibold text-text transition hover:bg-turquesa/75 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">{enviando ? "Cadastrando..." : "Cadastrar paciente"}</button>
                </div>
              </div>
            </section>
          </form>
        </main>
      </div>
      {credenciais && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="titulo-credenciais" className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 font-jakarta shadow-2xl sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-turquesa/15"><span className="text-3xl text-turquesa">✓</span></div>
              <h2 id="titulo-credenciais" className="text-xl font-bold text-text">Paciente cadastrado!</h2>
              <p className="mt-2 text-sm text-text/60">Copie o usuário, a senha e o PIN para entregar ao responsável.</p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { titulo: "USUÁRIO", valor: credenciais.usuario, descricao: "Usuário" },
                { titulo: "SENHA DE ACESSO", valor: credenciais.senha, descricao: "Senha" },
                { titulo: "PIN DO RESPONSÁVEL", valor: credenciais.pin, descricao: "PIN" }
              ].map((item) => (
                <div key={item.titulo} className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-medium text-text/50">{item.titulo}</p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="break-all font-semibold text-text">{item.valor}</p>
                    <button type="button" onClick={() => copiarTexto(item.valor, item.descricao)} className="shrink-0 cursor-pointer text-sm font-semibold text-turquesa">Copiar</button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => copiarTexto(`Acesso à Lolá\nUsuário: ${credenciais.usuario}\nSenha: ${credenciais.senha}\nPIN do responsável: ${credenciais.pin}`, "Credenciais")} className="mt-4 w-full rounded-xl border border-turquesa px-5 py-3 font-semibold text-text">Copiar todas as credenciais</button>
            <div className="mt-5 rounded-xl bg-salmao/10 p-4"><p className="text-sm text-text/80">Estas credenciais serão exibidas somente agora. Entregue-as apenas ao responsável autorizado. O PIN protege a conversa com a fonoaudióloga e não substitui a senha de login.</p></div>
            <button type="button" onClick={() => { setCredenciais(null); router.push("/paciente/pacientes"); }} className="mt-6 w-full cursor-pointer rounded-xl bg-turquesa px-5 py-3 font-semibold text-text transition hover:bg-turquesa/80">Já copiei as credenciais</button>
          </div>
        </div>
      )}
    </div>
  );
}
