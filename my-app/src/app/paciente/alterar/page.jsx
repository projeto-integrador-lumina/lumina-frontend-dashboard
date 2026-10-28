"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//assets
import Profile from "@/assets/profile.png";
import Img from "@/assets/icons/img.svg";
import Back from "@/assets/icons/back.svg";
import Input from "@/components/Input";
import Radiobox from "@/components/Radiobox";
import Selectbox from "@/components/Selectbox";

const AlterarPaciente = () => {

    const router = useRouter();

    //dados simulados
    const [form, setForm] = useState({
        id: "1",
        nome: "Pedro",
        sobrenome: "Henrique",
        data_nasc: "2018-05-14",
        sexo: "Masculino",
        nivel_gravidade: "Moderado",
        responsavel: "Ana Paula",
        contato: "(13) 99999-0000",
        cpf: "732.000.000.-02",
        endereco: "Rua das Flores, 20"
    });

    const [ fotoPreview, setFotoPreview ] = useState(Profile.src || Profile);

    //para atualizar o formulário
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    //enviar
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dados alterados com sucesso!", form);
        router.push("/paciente/pacientes");
    }

    const opcoesGravidade = [
    { label: "Leve", value: "Leve" },
    { label: "Moderado", value: "Moderado" },
    { label: "Grave", value: "Grave" },
    { label: "Severa", value: "Severa" },
  ];

    return (
        <>

    <div className="flex min-h-screen bg-gray-50">
        <Sidebar/>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-40">
                    <Navbar/>
                </header>

                <main className="text-text font-jakarta text-sm p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div>
                            <p className="text-xs sm:text-sm text-text/60">
                                Home / Pacientes /
                                <span className="text-salmao font-semibold">Editar Paciente</span>
                            </p>
                        </div>

                        <Link href="/paciente/pacientes"
                            className="self-end sm:self-auto flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
                            title="Voltar">
                            <img src={Back.src || Back} alt="voltar" className="w-5"/>
                        </Link>
                    </div>
                    <div className="py-6">
                        <p className="text-xl text-center md:text-2xl">Editar Paciente</p>
                    </div>

                    <form onSubmit={handleSubmit} method="POST" enctype="multipart/form-data"
                        className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 lg:p-8 grid gap-8 xl:grid-cols-[280px_1fr]">

                        {/*<input type="hidden" name="id" value="<%= paciente.id %>">*/}

                        <div className="flex flex-col items-center gap-4 xl:items-start">


                            <div className="flex flex-col items-center gap-6 w-full">
                                <p className="text-base font-semibold">Foto de Perfil</p>
                                <img src={Profile.src || Profile}
                                    alt="foto atual do paciente"
                                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-md"/>

                                <input type="file" name="fotoPerfil" id="fotoPerfil"
                                    accept="image/png, image/jpeg, image/webp" className="hidden"/>

                                <div
                                    className="w-full max-w-xs cursor-pointer bg-text/10 hover:bg-text/15 transition rounded-2xl p-6 flex flex-col items-center gap-1 text-center">
                                    <img src={Img.src || Img} alt="" className="w-6"/>
                                    <p className="text-sm font-semibold">PNG, JPG ou WEBP</p>
                                    <p className="text-xs text-text/60">(máximo 10 MB)</p>
                                    <span id="nome-foto" className="text-xs text-gray-500 break-all">
                                        Nenhum arquivo selecionado
                                    </span>
                                </div>
                            </div>
                        </div>

                        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                            <div className="flex flex-col gap-1">
                                <Input
                                    label="Nome"
                                    type="text"
                                    name="nome"
                                    required
                                    value={form.nome}
                                    onChange={handleChange}
                                >
                                </Input>
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-1 xl:col-span-2">
                                <Input
                                    label="Sobrenome"
                                    type="text"
                                    name="sobrenome"
                                    required
                                    value={form.sobrenome}
                                    onChange={handleChange}
                                >
                                </Input>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Input
                                    label="Data de Nascimento"
                                    type="text"
                                    name="data_nasc"
                                    required
                                    value={form.data_nasc}
                                    onChange={handleChange}
                                >
                                </Input>
                                
                            </div>

                            <div className="flex flex-col gap-3">
                                <label>Sexo</label>
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
                                <label>Nível de Gravidade</label>
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
                  ></Input>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Input
                    type="text"
                    label="Contato"
                    name="contato"
                    value={form.contato}
                    onChange={handleChange}
                  ></Input>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Input
                    type="text"
                    label="CPF"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                  ></Input>
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">
                                <Input
                    type="text"
                    label="Endereço"
                    name="endereco"
                    value={form.endereco}
                    onChange={handleChange}
                  ></Input>
                            </div>

                            <div
                                className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end pt-4 md:col-span-2 xl:col-span-3 border-t border-gray-100">
                               <button
                    type="submit"
                    className="w-full sm:w-auto py-3 px-6 bg-turquesa rounded-xl font-medium hover:bg-turquesa/75 transition"
                  >
                    Cadastrar
                  </button>

                  <Link
                    href="/paciente/pacientes"
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

        </>
    )
}

export default AlterarPaciente;