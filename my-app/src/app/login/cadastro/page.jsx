"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Onboarding from "@/components/Onboarding";
import Input from "@/components/Input";
import Button from "@/components/Button";
import toast from "react-hot-toast";

//assets
import Google from "@/assets/icons/icon-google.svg";
import Facebook from "@/assets/icons/icon-facebook.svg";

const CadastroUsuario = () => {
  const router = useRouter();

  const [etapa, setEtapa] = useState(1);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [crfa, setCrfa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mensagemErro, setMensagemErro] = useState("");

  //atualiza o estado do formulário inteiro
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nome") setNome(value);
    if (name === "email") setEmail(value);
    if (name === "crfa") setCrfa(value);
    if (name === "telefone") setTelefone(value);
    if (name === "usuario") setUsuario(value);
    if (name === "senha") setSenha(value);
    if (name === "confirmarSenha") setConfirmarSenha(value);
  };

  const handleProximo = (e) => {
    e.preventDefault();

    setMensagemErro("");
    setEtapa(2);
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagemErro("As senhas não coincidem!");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/fonoaudiologos", {
        nome,
        email,
        crfa,
        telefone,
        usuario,
        senha,
      });

      setMensagemErro("");
      toast.success("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.log("Não foi possível cadastrar o usuário.", error);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.mensagem ||
        "Não foi possível cadastrar o usuário.";
      setMensagemErro(msg);
    }
  };

  return (
    <main>
      <div className="flex min-h-screen flex-col font-jakarta xl:flex-row">
        <Onboarding></Onboarding>

        <div className="flex flex-1 items-center justify-center text-text bg-fundo px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-xl rounded-3xl bg-white/70 p-5 sm:p-7 md:p-8 shadow-sm">
            <p className="text-2xl md:text-3xl lg:text-4xl text-center text-salmao font-light">
              Crie uma conta
            </p>

            <div className="py-8 flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${etapa > 1 ? "bg-turquesa" : "bg-salmao"}`}
                >
                  1
                </div>
                <div className="h-1 flex-1 rounded-full bg-salmao"></div>
              </div>

              <div className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-input-gray text-sm font-semibold text-white ${etapa >= 1 ? "bg-salmao" : "bg-salmao"}`}
                >
                  2
                </div>
                <div className="h-1 flex-1 rounded-full bg-input-gray"></div>
              </div>
            </div>

            {mensagemErro && (
              <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm md:text-base text-red-700 text-center mb-8">
                {mensagemErro}
              </div>
            )}

            <form
              action=""
              onSubmit={handleCadastrar}
              method="POST"
              className="flex flex-col gap-5"
            >
              {etapa === 1 && (
                <div id="step1" className="flex flex-col gap-4">
                  <p className="text-lg md:text-xl font-semibold text-text">
                    Dados pessoais
                  </p>

                  <div className="flex flex-col gap-1">
                    <Input
                      type="text"
                      label="Nome"
                      placeholder="Digite seu nome"
                      name="nome"
                      value={nome}
                      onChange={handleChange}
                    ></Input>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Input
                      type="text"
                      label="E-mail"
                      placeholder="Digite seu e-mail"
                      name="email"
                      value={email}
                      onChange={handleChange}
                    ></Input>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <Input
                        type="text"
                        label="CRFa"
                        placeholder="Digite seu CRFa"
                        name="crfa"
                        value={crfa}
                        onChange={handleChange}
                      ></Input>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Input
                        type="text"
                        label="Telefone"
                        placeholder="(00) 00000-0000"
                        name="telefone"
                        value={telefone}
                        onChange={handleChange}
                      ></Input>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleProximo}
                    label="Próximo"
                  ></Button>
                </div>
              )}

              {etapa === 2 && (
                <div className="flex flex-col gap-4">
                  <p className="text-lg md:text-xl font-semibold text-text">
                    Dados de acesso
                  </p>

                  <div className="flex flex-col gap-1">
                    <Input
                      type="text"
                      label="Nome de Usuário"
                      placeholder="Digite um nome de usuário"
                      name="usuario"
                      value={usuario}
                      onChange={handleChange}
                    ></Input>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Input
                      type="password"
                      label="Senha"
                      placeholder="Digite uma senha"
                      name="senha"
                      value={senha}
                      onChange={handleChange}
                    ></Input>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Input
                      type="password"
                      label="Cofirmar Senha"
                      placeholder="Digite a senha novamente"
                      name="confirmarSenha"
                      value={confirmarSenha}
                      onChange={handleChange}
                    ></Input>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      type="button"
                      label="Voltar"
                      color="bg-white"
                      colorHover="hover:bg-salmao"
                      textColor="bg-text"
                      textColorHover="hover:text-white"
                      border="border"
                      borderColor="border-salmao"
                      formNoValidate
                      onClick={(e) => {
                        e.preventDefault();
                        setMensagemErro("");
                        setEtapa(1);
                      }}
                    />
                    <Button label="Cadastrar" />
                  </div>
                </div>
              )}

              <div>
                <p className="text-center md:text-base lg:text-lg">
                  Já tem uma conta?
                  <Link href="/" className="text-salmao font-semibold">
                    Entrar
                  </Link>
                </p>
              </div>

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
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CadastroUsuario;
