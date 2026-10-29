"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

//assets
import Google from "@/assets/icons/icon-google.svg";
import Facebook from "@/assets/icons/icon-facebook.svg";
import Onboarding from "@/components/Onboarding";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Home() {

  const router = useRouter();

  const [ usuario, setUsuario ] = useState("");
  const [ senha, setSenha ] = useState("");


  const handleEntrar = async (e) => {
    e.preventDefault();

    const result = await login(usuario, senha);
    if (result.success) {
      alert("Login realizado com sucesso!");
      router.push("/home");
    } else {
      alert("Falha ao fazer o login. Verifique os dados e tente novamente.");
    }
  };

  return (
    <>
      <main>
        <div className="flex min-h-screen flex-col xl:flex-row">

          <Onboarding></Onboarding>

          <div className="flex flex-1 items-center justify-center text-text bg-fundo px-4 py-8 sm:px-6 lg:px-10">
            <div className="flex w-full max-w-xl flex-col gap-5 rounded-3xl bg-white/70 p-5 sm:p-7 md:p-8 shadow-sm">
              <div>
                <p className="text-2xl md:text-3xl lg:text-4xl pb-3 text-center text-salmao font-light xl:font-medium">
                  Entre com sua conta
                </p>

                <p className="text-sm sm:text-base text-text pb-3 text-center font-light">
                  Acesse o painel e gerencie as informações dos seus pacientes
                  com praticidade.
                </p>
              </div>
              {/*<div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm md:text-base text-red-700 text-center"></div>*/}

              <form action="" method="POST" className="mt-2">
                <input type="hidden" name="usuario" value="" />

                {/*<button
                  type="submit"
                  className="w-full rounded-2xl bg-turquesa px-4 py-3 text-white transition hover:bg-turquesa/80"
                >
                  Reativar conta
                </button>*/}
              </form>

              <form action="" onSubmit={handleEntrar} method="POST" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <Input
                    type="text"
                    label="Usuário"
                    placeholder="Digite o nome do usuário"
                    name="usuario"
                  ></Input>
                </div>

                <div className="flex flex-col gap-1">
                  <Input
                    type="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    name="senha"
                  ></Input>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 xl:w-5 xl:h-5 bg-white cursor-pointer border rounded-3xl appearance-none checked:bg-salmao checked:border-turquesa"
                    />
                    <span className="text-xs md:text-base">Lembre-me</span>
                  </label>

                  <Link
                    href="/login/alterar-senha"
                    className="text-sm md:text-base text-salmao cursor-pointer"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <Button
                  color="bg-salmao"
                  colorHover="hover:bg-turquesa"
                  label="Entrar"
                >
                </Button>

                <div>
                  <p className="text-center text-sm md:text-base lg:text-lg">
                    ou conecte-se com
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link href="#">
                    <img
                      src={Google.src || Google}
                      className="w-12 lg:w-14 xl:w-auto xl:h-auto"
                      alt="Google"
                    />
                  </Link>

                  <Link href="#">
                    <img
                      src={Facebook.src || Facebook}
                      className="w-12 lg:w-14 xl:w-auto xl:h-auto"
                      alt="Facebook"
                    />
                  </Link>
                </div>

                <p className="text-center md:text-base lg:text-lg">
                  Não tem uma conta?
                  <Link
                    href="/login/cadastro"
                    className="text-salmao font-semibold"
                  >
                    Registre-se
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
