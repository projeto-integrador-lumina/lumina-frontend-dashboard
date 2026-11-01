"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

import Onboarding from "@/components/Onboarding";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { getAxiosConfig } from "@/services/auth";

const API_URL = "http://localhost:4000";

export default function AlterarSenha() {
  const [usuario, setUsuario] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscarUsuario(evento) {
    evento.preventDefault();

    if (carregando) return;

    if (!usuario.trim()) {
      toast.error("Digite o nome de usuário.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await axios.post(
        `${API_URL}/api/auth/recuperar-senha/buscar`,
        {
          usuario: usuario.trim(),
        },
      );

      if (resposta.data?.encontrado) {
        setUsuarioEncontrado(true);
        toast.success("Usuário encontrado!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Não foi possível buscar o usuário.",
      );
    } finally {
      setCarregando(false);
    }
  }

  async function salvarNovaSenha(evento) {
    evento.preventDefault();

    if (carregando) return;

    if (!novaSenha || !confirmarSenha) {
      toast.error("Preencha os campos de senha.");
      return;
    }

    if (novaSenha.length < 8) {
      toast.error("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await axios.put(
        `${API_URL}/api/auth/recuperar-senha`,
        {
          usuario: usuario.trim(),
          novaSenha,
        },
        getAxiosConfig(),
      );

      toast.success(resposta.data?.message || "Senha alterada com sucesso!");

      setUsuario("");
      setUsuarioEncontrado(false);
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error(
          "É necessário estar autenticado como fonoaudiólogo para concluir esta redefinição de teste.",
        );
      } else {
        toast.error(
          error.response?.data?.error || "Não foi possível alterar a senha.",
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  function alterarUsuario() {
    setUsuarioEncontrado(false);
    setNovaSenha("");
    setConfirmarSenha("");
  }

  return (
    <main>
      <div className="flex min-h-screen flex-col font-jakarta xl:flex-row">
        <Onboarding />

        <div className="flex flex-1 items-center justify-center bg-fundo px-4 py-8 text-text sm:px-6 lg:px-10">
          <div className="flex w-full max-w-xl flex-col gap-5 rounded-3xl bg-white/70 p-5 shadow-sm sm:p-7 md:p-8">
            <div>
              <h1 className="pb-3 text-center text-2xl font-light text-salmao md:text-3xl lg:text-4xl">
                Alterar senha
              </h1>

              <p className="text-center text-sm font-light text-text/70 sm:text-base">
                Informe o nome de usuário para localizar a conta e cadastrar uma
                nova senha.
              </p>
            </div>

            {!usuarioEncontrado ? (
              <form onSubmit={buscarUsuario} className="flex flex-col gap-5">
                <Input
                  type="text"
                  label="Nome de usuário"
                  placeholder="Digite seu nome de usuário"
                  name="usuario"
                  value={usuario}
                  onChange={(evento) => setUsuario(evento.target.value)}
                />

                <div
                  className={`w-full ${carregando ? "pointer-events-none opacity-60" : ""}`}
                >
                  <div className="w-full [&>button]:w-full">
                    <Button
                      color="bg-salmao"
                      colorHover="hover:bg-turquesa"
                      label={
                        carregando ? "Buscando usuário..." : "Buscar usuário"
                      }
                    />
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={salvarNovaSenha} className="flex flex-col gap-5">
                <div className="rounded-xl border border-turquesa/40 bg-turquesa/10 p-4">
                  <p className="text-sm font-semibold">Usuário encontrado</p>

                  <p className="mt-1 break-all text-sm text-text/70">
                    {usuario}
                  </p>

                  <button
                    type="button"
                    onClick={alterarUsuario}
                    className="mt-2 cursor-pointer text-xs font-semibold text-salmao hover:underline"
                  >
                    Buscar outro usuário
                  </button>
                </div>

                <Input
                  type="password"
                  label="Nova senha"
                  placeholder="Digite sua nova senha"
                  name="novaSenha"
                  value={novaSenha}
                  onChange={(evento) => setNovaSenha(evento.target.value)}
                />

                <p className="-mt-3 text-xs text-text/60">
                  A senha deve conter pelo menos 8 caracteres.
                </p>

                <Input
                  type="password"
                  label="Confirme a nova senha"
                  placeholder="Digite novamente a nova senha"
                  name="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(evento) => setConfirmarSenha(evento.target.value)}
                />

                <div
                  className={`w-full ${carregando ? "pointer-events-none opacity-60" : ""}`}
                >
                  <div className="w-full [&>button]:w-full">
                    <Button
                      color="bg-salmao"
                      colorHover="hover:bg-turquesa"
                      label={carregando ? "Salvando..." : "Salvar nova senha"}
                    />
                  </div>
                </div>
              </form>
            )}

            <div className="flex justify-center">
              <Link
                href="/"
                className="text-center text-sm text-salmao transition hover:underline md:text-base lg:text-lg"
              >
                Voltar ao login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
