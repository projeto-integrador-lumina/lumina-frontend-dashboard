
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { login } from "@/services/auth";
import Onboarding from "@/components/Onboarding";
import Input from "@/components/Input";
import Button from "@/components/Button";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

const LoginPage = () => {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [contaDesativada, setContaDesativada] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [reativando, setReativando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const alterarUsuario = (valor) => {
    setUsuario(valor);
    setContaDesativada(false);
    setErro("");
    setMensagem("");
  };

  const alterarSenha = (valor) => {
    setSenha(valor);
    setContaDesativada(false);
    setErro("");
    setMensagem("");
  };

  const handleEntrar = async (evento) => {
    evento.preventDefault();

    if (carregando || reativando) return;

    if (!usuario.trim() || !senha) {
      setErro("Preencha seu usuário e sua senha.");
      return;
    }

    setCarregando(true);
    setErro("");
    setMensagem("");
    setContaDesativada(false);

    try {
      const resultado = await login(usuario.trim(), senha);

      if (resultado?.success) {
        toast.success("Login realizado com sucesso!");
        router.push("/home");
        return;
      }

      const respostaErro =
        resultado?.error?.response ||
        resultado?.response ||
        resultado?.data;

      const dadosErro = respostaErro?.data || respostaErro || {};

      const status =
        respostaErro?.status ||
        resultado?.status ||
        resultado?.error?.status;

      if (
        (status === 403 || dadosErro?.contaDesativada) &&
        dadosErro?.contaDesativada === true
      ) {
        setContaDesativada(true);
        setErro("");
        return;
      }

      setErro(
        dadosErro?.error ||
          dadosErro?.message ||
          "Falha ao fazer login. Verifique os dados e tente novamente."
      );
    } catch (error) {
      console.error("Erro no login:", error);

      const dadosErro = error.response?.data || {};

      if (
        error.response?.status === 403 &&
        dadosErro.contaDesativada === true
      ) {
        setContaDesativada(true);
        return;
      }

      setErro(
        dadosErro.error ||
          dadosErro.message ||
          "Não foi possível entrar. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  const handleReativar = async () => {
    if (reativando || carregando) return;

    if (!usuario.trim() || !senha) {
      setErro("Informe seu usuário e sua senha para reativar a conta.");
      return;
    }

    setReativando(true);
    setErro("");
    setMensagem("");

    try {
      await axios.post(`${API_URL}/api/auth/reativar`, {
        usuario: usuario.trim(),
        senha,
      });

      setContaDesativada(false);

      setMensagem(
        "Sua conta foi reativada com sucesso! Agora você pode entrar normalmente."
      );

      toast.success("Conta reativada com sucesso!");
    } catch (error) {
      console.error(
        "Erro ao reativar conta:",
        error.response?.data || error
      );

      setErro(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Não foi possível reativar sua conta. Verifique suas credenciais."
      );
    } finally {
      setReativando(false);
    }
  };

  return (
    <main>
      <div className="flex min-h-screen flex-col xl:flex-row">
        <Onboarding />

        <div className="flex flex-1 items-center justify-center bg-fundo px-4 py-8 text-text sm:px-6 lg:px-10">
          <div className="flex w-full max-w-xl flex-col gap-5 rounded-3xl bg-white/70 p-5 shadow-sm sm:p-7 md:p-8">
            <div>
              <h1 className="pb-3 text-center text-2xl font-light text-salmao md:text-3xl lg:text-4xl xl:font-medium">
                Entre com sua conta
              </h1>

              <p className="pb-3 text-center text-sm font-light text-text sm:text-base">
                Acesse o painel e gerencie as informações dos seus pacientes com
                praticidade.
              </p>
            </div>

            {erro && (
              <div
                role="alert"
                className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
              >
                {erro}
              </div>
            )}

            {mensagem && (
              <div
                role="status"
                className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-700"
              >
                {mensagem}
              </div>
            )}

            {contaDesativada && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl font-bold text-amber-700">
                    !
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-amber-800">
                      Sua conta está desativada
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-amber-700">
                      Sua conta foi desativada anteriormente, mas seus dados
                      continuam preservados. Você pode reativá-la usando o
                      usuário e a senha informados neste formulário.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReativar}
                  disabled={reativando || carregando}
                  className="mt-5 w-full rounded-2xl bg-salmao px-4 py-3 font-semibold text-white transition hover:bg-salmao/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reativando ? "Reativando conta..." : "Reativar minha conta"}
                </button>
              </div>
            )}

            <form onSubmit={handleEntrar} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <Input
                  type="text"
                  label="Usuário"
                  placeholder="Digite o nome do usuário"
                  name="usuario"
                  autoComplete="username"
                  onChange={(evento) =>
                    alterarUsuario(evento.target.value)
                  }
                  value={usuario}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  type="password"
                  label="Senha"
                  placeholder="Digite sua senha"
                  name="senha"
                  autoComplete="current-password"
                  onChange={(evento) =>
                    alterarSenha(evento.target.value)
                  }
                  value={senha}
                />
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  href="/login/alterar-senha"
                  className="cursor-pointer text-sm text-salmao hover:underline md:text-base"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <div
                className={`w-full [&>button]:!w-full [&>button]:!rounded-2xl [&>button]:!py-3 [&>button]:!text-center ${
                  carregando || reativando
                    ? "pointer-events-none opacity-60"
                    : ""
                }`}
              >
                <Button
                  color="bg-salmao"
                  colorHover="hover:bg-turquesa"
                  label={carregando ? "Entrando..." : "Entrar"}
                />
              </div>

              <p className="text-center text-sm md:text-base lg:text-lg">
                Não tem uma conta?{" "}
                <Link
                  href="/login/cadastro"
                  className="font-semibold text-salmao hover:underline"
                >
                  Registre-se
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
