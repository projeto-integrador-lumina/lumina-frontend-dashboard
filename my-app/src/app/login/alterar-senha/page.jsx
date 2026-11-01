
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Onboarding from "@/components/Onboarding";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { getAxiosConfig } from "@/services/auth";

export default function AlterarSenha() {
  const router = useRouter();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleAlterarSenha(evento) {
    evento.preventDefault();

    if (carregando) return;

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (novaSenha.length < 8) {
      toast.error(
        "A nova senha precisa ter pelo menos 8 caracteres."
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    if (senhaAtual === novaSenha) {
      toast.error(
        "A nova senha deve ser diferente da senha atual."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Para alterar sua senha, entre na sua conta primeiro."
      );
      router.push("/");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await axios.put(
        "http://localhost:4000/api/auth/senha",
        {
          senhaAtual,
          novaSenha,
        },
        getAxiosConfig()
      );

      toast.success(
        resposta.data?.message ||
          "Senha alterada com sucesso!"
      );

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

      router.push("/perfil");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);

      if (error.response?.status === 401) {
        toast.error(
          error.response?.data?.error ||
            "Senha atual incorreta ou sessão expirada."
        );
      } else {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Não foi possível alterar sua senha."
        );
      }
    } finally {
      setCarregando(false);
    }
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
                Para sua segurança, informe sua senha
                atual e escolha uma nova senha de acesso.
              </p>
            </div>

            <form
              onSubmit={handleAlterarSenha}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1">
                <Input
                  type="password"
                  label="Senha atual"
                  placeholder="Digite sua senha atual"
                  name="senhaAtual"
                  value={senhaAtual}
                  onChange={(evento) =>
                    setSenhaAtual(evento.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  type="password"
                  label="Nova senha"
                  placeholder="Digite sua nova senha"
                  name="novaSenha"
                  value={novaSenha}
                  onChange={(evento) =>
                    setNovaSenha(evento.target.value)
                  }
                />

                <p className="mt-1 text-xs text-text/60">
                  A senha deve conter pelo menos 8 caracteres.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  type="password"
                  label="Confirme a nova senha"
                  placeholder="Digite novamente a nova senha"
                  name="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(evento) =>
                    setConfirmarSenha(evento.target.value)
                  }
                />
              </div>

              <div
                className={
                  carregando
                    ? "pointer-events-none opacity-60"
                    : ""
                }
              >
                <Button
                  color="bg-salmao"
                  colorHover="hover:bg-turquesa"
                  label={
                    carregando
                      ? "Alterando senha..."
                      : "Salvar nova senha"
                  }
                />
              </div>

              <div className="flex justify-center">
                <Link
                  href="/perfil"
                  className="text-center text-sm text-salmao transition hover:underline md:text-base lg:text-lg"
                >
                  Voltar ao perfil
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
