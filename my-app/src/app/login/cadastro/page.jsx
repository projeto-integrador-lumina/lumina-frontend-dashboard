"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

import Onboarding from "@/components/Onboarding";
import Input from "@/components/Input";
import Button from "@/components/Button";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

export default function CadastroUsuario() {
  const router = useRouter();

  const [etapa, setEtapa] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    crfa: "",
    telefone: "",
    usuario: "",
    senha: "",
    confirmarSenha: "",
  });

  function handleChange(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    if (mensagemErro) {
      setMensagemErro("");
    }
  }

  function mostrarErro(mensagem) {
    setMensagemErro(mensagem);
    toast.error(mensagem);
  }

  function validarDadosPessoais() {
    const { nome, email, crfa, telefone } = formulario;

    if (!nome.trim() || !email.trim() || !crfa.trim() || !telefone.trim()) {
      mostrarErro("Preencha todos os dados pessoais.");
      return false;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email.trim())) {
      mostrarErro("Informe um e-mail válido.");
      return false;
    }

    return true;
  }

  function handleProximo() {
    if (!validarDadosPessoais()) return;

    setMensagemErro("");
    setEtapa(2);
  }

  function handleVoltar() {
    setMensagemErro("");
    setEtapa(1);
  }

  async function handleCadastrar(evento) {
    evento.preventDefault();

    if (carregando) return;

    if (etapa === 1) {
      handleProximo();
      return;
    }

    if (!validarDadosPessoais()) {
      setEtapa(1);
      return;
    }

    const { usuario, senha, confirmarSenha } = formulario;

    if (!usuario.trim() || !senha || !confirmarSenha) {
      mostrarErro("Preencha todos os dados de acesso.");
      return;
    }

    if (senha.length < 8) {
      mostrarErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      mostrarErro("As senhas não coincidem!");
      return;
    }

    try {
      setCarregando(true);
      setMensagemErro("");

      const resposta = await axios.post(`${API_URL}/fonoaudiologos`, {
        nome: formulario.nome.trim(),
        email: formulario.email.trim().toLowerCase(),
        crfa: formulario.crfa.trim(),
        telefone: formulario.telefone.trim(),
        usuario: usuario.trim().toLowerCase(),
        senha,
      });

      toast.success(resposta.data?.message || "Conta criada com sucesso!");

      router.push("/");
    } catch (error) {
      const mensagem =
        error.response?.data?.error ||
        error.response?.data?.mensagem ||
        "Não foi possível cadastrar o usuário.";

      mostrarErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main>
      <div className="flex min-h-screen flex-col font-jakarta xl:flex-row">
        <Onboarding />

        <div className="flex flex-1 items-center justify-center bg-fundo px-4 py-8 text-text sm:px-6 lg:px-10">
          <div className="w-full max-w-xl rounded-3xl bg-white/70 p-5 shadow-sm sm:p-7 md:p-8">
            <h1 className="text-center text-2xl font-light text-salmao md:text-3xl lg:text-4xl">
              Crie uma conta
            </h1>

            <div className="flex items-center gap-3 py-8">
              <div className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                    etapa === 1 ? "bg-salmao" : "bg-turquesa"
                  }`}
                >
                  1
                </div>

                <div
                  className={`h-1 flex-1 rounded-full ${
                    etapa === 1 ? "bg-salmao" : "bg-turquesa"
                  }`}
                />
              </div>

              <div className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                    etapa === 2 ? "bg-salmao" : "bg-gray-300"
                  }`}
                >
                  2
                </div>

                <div
                  className={`h-1 flex-1 rounded-full ${
                    etapa === 2 ? "bg-salmao" : "bg-gray-200"
                  }`}
                />
              </div>
            </div>

            {mensagemErro && (
              <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-center text-sm text-red-700 md:text-base">
                {mensagemErro}
              </div>
            )}

            <form
              onSubmit={handleCadastrar}
              className="flex flex-col gap-5"
              noValidate
            >
              {etapa === 1 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-text md:text-xl">
                    Dados pessoais
                  </h2>

                  <Input
                    type="text"
                    label="Nome"
                    placeholder="Digite seu nome"
                    name="nome"
                    value={formulario.nome}
                    onChange={handleChange}
                  />

                  <Input
                    type="email"
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    name="email"
                    value={formulario.email}
                    onChange={handleChange}
                  />

                  <div className="flex flex-col gap-4">
                    <div className="flex w-full flex-col gap-1">
                      <Input
                        type="text"
                        label="CRFa"
                        placeholder="Digite seu CRFa"
                        name="crfa"
                        value={formulario.crfa}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex w-full flex-col gap-1">
                      <Input
                        type="tel"
                        label="Telefone"
                        placeholder="(00) 00000-0000"
                        name="telefone"
                        value={formulario.telefone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <Button label="Próximo" />
                </div>
              )}

              {etapa === 2 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-text md:text-xl">
                    Dados de acesso
                  </h2>

                  <Input
                    type="text"
                    label="Nome de usuário"
                    placeholder="Digite um nome de usuário"
                    name="usuario"
                    value={formulario.usuario}
                    onChange={handleChange}
                  />

                  <Input
                    type="password"
                    label="Senha"
                    placeholder="Digite uma senha"
                    name="senha"
                    value={formulario.senha}
                    onChange={handleChange}
                  />

                  <p className="-mt-2 text-xs text-text/60">
                    A senha deve conter pelo menos 8 caracteres.
                  </p>

                  <Input
                    type="password"
                    label="Confirmar senha"
                    placeholder="Digite a senha novamente"
                    name="confirmarSenha"
                    value={formulario.confirmarSenha}
                    onChange={handleChange}
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleVoltar}
                      disabled={carregando}
                      className="min-h-12 rounded-full border border-salmao bg-white px-6 py-3 font-semibold text-salmao transition hover:bg-salmao hover:text-white disabled:opacity-60"
                    >
                      Voltar
                    </button>

                    <div
                      className={`w-full [&>button]:w-full ${
                        carregando ? "pointer-events-none opacity-60" : ""
                      }`}
                    >
                      <Button
                        label={carregando ? "Cadastrando..." : "Cadastrar"}
                      />
                    </div>
                  </div>
                </div>
              )}

              <p className="text-center text-sm md:text-base lg:text-lg">
                Já tem uma conta?{" "}
                <Link
                  href="/"
                  className="font-semibold text-salmao hover:underline"
                >
                  Entrar
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
