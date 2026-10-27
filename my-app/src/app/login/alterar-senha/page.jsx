"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//assets
import Onboarding from "@/components/Onboarding";
import Input from "@/components/Input";
import Button from "@/components/Button";

const AlterarSenha = () => {
  //controla o formulário multi-step
  const [etapa, setEtapa] = useState("");

  //estados para armazenar os dados digitados pra usar na próxima etapa do formulário
  const [usuario, setUsuario] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const router = useRouter();

  const handleBuscarUsuario = (e) => {
    e.preventDefault();

    if (!usuario.trim()) {
      setMensagemErro("Por favor, digite seu nome de usuário.");
      return;
    }

    //se o usuário existir, mantenha a mensagem de erro vazia (não exibe nada) e pula pra etapa 2 do form
    setMensagemErro("");
    //avança para a etapa 2
    setEtapa(2);
  };

  const handleAlterarSenha = (e) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      setMensagemErro("As senhas não coincidem!");
      return;
    }

    alert("Senha alterada com sucesso");
    router.push("/");
  };

  return (
    <>
      <main>
        <div className="flex min-h-screen flex-col font-jakarta xl:flex-row">
          <Onboarding></Onboarding>

          <div className="flex flex-1 items-center justify-center text-text bg-fundo px-4 py-8 sm:px-6 lg:px-10">
            <div className="flex w-full max-w-xl flex-col gap-5 rounded-3xl bg-white/70 p-5 sm:p-7 md:p-8 shadow-sm">
              <div>
                <p className="text-2xl md:text-3xl lg:text-4xl pb-3 text-center text-salmao font-light">
                  Alterar Senha
                </p>

                <p className="text-sm sm:text-base text-text/70 text-center font-light">
                  Primeiro informe o nome de usuário. Depois cadastre uma nova
                  senha.
                </p>
              </div>

              {mensagemErro && (
                <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm md:text-base text-red-700 text-center">
                  {mensagemErro}
                </div>
              )}
              {/*

              <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm md:text-base text-green-700 text-center"></div>*/}

              {etapa == 1 && (
                <form
                  action=""
                  onSubmit="handleBuscarUsuario"
                  method="POST"
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-1">
                    <Input
                      type="text"
                      label="Usuário"
                      placeholder="Digite o nome do usuário"
                      name="usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                    ></Input>
                  </div>

                  <Button
                    label="Procurar Usuário"
                    color="bg-salmao"
                    colorHover="hover:bg-turquesa"
                  />

                  <div>
                    <Link href="/">
                      <p className="text-center text-salmao text-sm md:text-base lg:text-lg">
                        voltar ao Login
                      </p>
                    </Link>
                  </div>
                </form>
              )}

              {etapa === 2 && (
                <form action="" onSubmit={handleAlterarSenha} method="POST" className="flex flex-col gap-5">
                  <Input type="hidden" name="id" value=""></Input>
                  <Input type="hidden" name="usuario" value=""></Input>

                  <div className="rounded-2xl bg-turquesa/10 px-4 py-3 text-center">
                    <p className="text-sm text-text/70">Alterando senha de:</p>

                    <p className="font-semibold text-salmao"></p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Input
                      type="password"
                      label="Nova Senha"
                      placeholder="Digite a nova senha"
                      name="novaSenha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                    ></Input>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Input
                      type="password"
                      label="Confirme a senha"
                      placeholder="Digite novamente a senha"
                      name="confirmarSenha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    ></Input>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      setEtapa(1);
                      setMensagemErro("");
                    }}
                  ></Button>

                  <div className="flex justify-center gap-4">
                    <Link href="/login/alterar-senha">
                      <p className="text-center text-turquesa text-sm md:text-base lg:text-lg">
                        procurar outro usuário
                      </p>
                    </Link>

                    <Link href="/">
                      <p className="text-center text-salmao text-sm md:text-base lg:text-lg">
                        voltar ao Login
                      </p>
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AlterarSenha;
