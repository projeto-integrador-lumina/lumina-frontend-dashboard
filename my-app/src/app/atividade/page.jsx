"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";
import Link from "next/link";

//assets
import Back from "@/assets/icons/back.svg";
import Selectbox from "@/components/Selectbox";
import Button from "@/components/Button";

const Atividade = () => {
  //estado para controlar a seleção do paciente
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [ mensagemSucesso, setMensagemSucesso ] = useState("");

  //estado para mudar o tempo de prática (slider)
  const [ tempoPratica, setTempoPratica ] = useState(15);

  const opcoesPaciente = [
    { label: "Natasha", value: "Natasha" },
    { label: "Anny", value: "Anny" },
    { label: "Carol", value: "Carol" },
  ];

  const handleSalvar = (e) => {
    e.preventDefault();
    setMensagemSucesso(`Atividades atualizadas com sucesso!`);
    setTimeout(() => setMensagemSucesso(""), 4000);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar></Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40">
            <Navbar></Navbar>
          </header>

          <main className="text-text font-jakarta text-sm p-4 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <p className="hidden lg:block px-2">
                  Home /{" "}
                  <span className=" text-salmao font-semibold">
                    {" "}
                    Atividades{" "}
                  </span>
                </p>
              </div>

              <Link
                href="/home"
                className="self-end sm:self-auto flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
                title="Voltar"
              >
                <img src={Back.src || Back} alt="voltar" className="w-5" />
              </Link>
            </div>

            {mensagemSucesso && (
              <div
                id="sucesso"
                className="bg-green-500 text-white px-4 py-3 rounded-lg mb-4"
              >{mensagemSucesso}</div>
            )}

            <div className="bg-white shadow-lg rounded-xl p-5 md:p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="font-semibold text-base">
                  Selecionar Paciente
                </label>
                <Selectbox
                  label="Selecionar Paciente"
                  name="paciente"
                  value={pacienteSelecionado}
                  onChange={(e) => setPacienteSelecionado(e.target.value)}
                  options={opcoesPaciente}
                  placeholder="Selecione um paciente..."
                ></Selectbox>
              </div>

              {!pacienteSelecionado && (
                <div  className="py-10 md:py-16">
                  <p className="text-center text-text/50">
                    Escolha um paciente para começar a personalização.
                  </p>
                </div>
              )}

              {pacienteSelecionado && (
                <form onSubmit={handleSalvar} className="flex-col gap-8">
                  <div className="flex flex-col gap-6">
                    <p className="text-base font-semibold">
                      Seleção de Fonemas
                    </p>

                    <div className="flex flex-col gap-4">
                      <p className="text-text/60 text-xs uppercase tracking-wide font-medium">
                        Oclusivos
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {["/p/", "/b/", "/t/", "/d/", "/k/", "/g/"].map((f) => (
                          <label key={f} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="sr-only peer" />
                            <div
                              className="w-11 h-6 lg:w-14 lg:h-7 bg-amarelo/30 rounded-full peer-checked:bg-amarelo relative transition-colors duration-300 shrink-0
                    after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full
                    after:w-5 after:h-5 after:transition-transform after:duration-300 peer-checked:after:translate-x-5
                    lg:after:w-6 lg:after:h-6 lg:peer-checked:after:translate-x-7"
                            ></div>
                            <p className="italic text-sm lg:text-base">{f}</p>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <p className="text-text/60 text-xs uppercase tracking-wide font-medium">
                        Fricativos
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {["/f/", "/v/", "/s/", "/z/", "/ʃ/", "/ʒ/"].map((f) => (
                          <label key={f} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div
                              className="w-11 h-6 lg:w-14 lg:h-7 bg-turquesa/30 rounded-full peer-checked:bg-turquesa relative transition-colors duration-300 shrink-0
                    after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full
                    after:w-5 after:h-5 after:transition-transform after:duration-300 peer-checked:after:translate-x-5
                    lg:after:w-6 lg:after:h-6 lg:peer-checked:after:translate-x-7"
                            ></div>
                            <p className="italic text-sm lg:text-base">{f}</p>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <p className="text-text/60 text-xs uppercase tracking-wide font-medium">
                        Nasais
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {["/m/", "/n/", "/ɲ/"].map((f) => (
                          <label key={f} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div
                              className="w-11 h-6 lg:w-14 lg:h-7 bg-roxo/30 rounded-full peer-checked:bg-roxo relative transition-colors duration-300 shrink-0
                    after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full
                    after:w-5 after:h-5 after:transition-transform after:duration-300 peer-checked:after:translate-x-5
                    lg:after:w-6 lg:after:h-6 lg:peer-checked:after:translate-x-7"
                            ></div>
                            <p className="italic text-sm lg:text-base">{f}</p>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <p className="text-text/60 text-xs uppercase tracking-wide font-medium">
                        Líquidos
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {["/l/", "/ʎ/", "/ɾ/", "/r/"].map((f) => (
                          <label key={f} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div
                              className="w-11 h-6 lg:w-14 lg:h-7 bg-salmao/30 rounded-full peer-checked:bg-salmao relative transition-colors duration-300 shrink-0
                    after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full
                    after:w-5 after:h-5 after:transition-transform after:duration-300 peer-checked:after:translate-x-5
                    lg:after:w-6 lg:after:h-6 lg:peer-checked:after:translate-x-7"
                            ></div>
                            <p className="italic text-sm lg:text-base">{f}</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="my-6 border-text/10" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4">
                      <p className="font-semibold text-base">Posição</p>
                      {["Inicial", "Medial", "Final"].map((p) => (
                        <label key={p} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div
                            className="w-5 h-5 shrink-0 rounded border-2 border-gray-300 peer-checked:bg-salmao peer-checked:border-salmao relative transition-colors
                  after:content-['✓'] after:text-white after:text-xs after:font-bold after:absolute after:inset-0
                  after:flex after:items-center after:justify-center after:opacity-0 peer-checked:after:opacity-100 after:transition-opacity"
                          ></div>
                          <span className="text-gray-700">{p}</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4">
                      <p className="font-semibold text-base">
                        Tempo de Prática
                      </p>
                      <input
                        type="range"
                        name="tempo_pratica"
                        min="5"
                        max="120"
                        step="5"
                        value={tempoPratica}
                        className="w-full accent-salmao cursor-pointer"
                        onChange={(e) => setTempoPratica(e.target.value)}
                      />
                      <p className="text-text/60">
                        <span id="minutos" className="text-text font-semibold">
                          {tempoPratica}
                        </span>{" "}
                        minutos
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <p className="font-semibold text-base">Frequência</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          ["seg", "S"],
                          ["ter", "T"],
                          ["qua", "Q"],
                          ["qui", "Q"],
                          ["sex", "S"],
                          ["sab", "S"],
                          ["dom", "D"],
                        ].map(([v, l], index) => (
                          <label key={v} className="cursor-pointer">
                            <input
                              type="checkbox"
                              name="dias"
                              value="<%= v %>"
                              className="sr-only peer"
                            />
                            <div className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-sm font-medium text-gray-400 peer-checked:bg-salmao peer-checked:border-salmao peer-checked:text-white transition-all">
                              {l}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center md:justify-end pt-2">
                    <Button
                      type="button"
                      label="Cancelar"
                      onClick={() => setPacienteSelecionado("")}
                      color="bg-red-500 text-white hover:bg-red-600"
                      className="px-8 py-2.5"
                    />
                    <Button
                      type="submit"
                      label="Atualizar"
                      color="bg-turquesa text-text hover:opacity-90"
                      className="px-8 py-2.5"
                    />
                  </div>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Atividade;
