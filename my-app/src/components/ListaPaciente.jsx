
"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { getAxiosConfig } from "@/services/auth";

// assets
import Eye from "@/assets/icons/eye.svg";
import Editar from "@/assets/icons/editar.svg";
import Excluir from "@/assets/icons/excluir.svg";

const ListaPaciente = ({
  id,
  imagem,
  nome,
  nivel,
  status,
  onExcluir,
}) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const deletePaciente = async () => {
    if (!id || excluindo) return;

    try {
      setExcluindo(true);

      const response = await axios.delete(
        `http://localhost:4000/api/pacientes/${id}`,
        getAxiosConfig()
      );

      if (response.status >= 200 && response.status < 300) {
        setModalAberto(false);

        // Atualiza a lista sem recarregar a página
        onExcluir?.(id);

        toast.success("Paciente excluído com sucesso!");
      }
    } catch (error) {
      console.error(
        "Erro ao excluir paciente:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.error ||
        "Erro ao excluir o paciente!"
      );
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[3fr_1fr_1fr] xl:grid-cols-[3fr_1fr_1fr_1fr] items-center px-4 md:px-8 py-4 md:py-5 border-b border-text/5 hover:bg-text/5 transition text-sm md:text-base">
        <span className="flex gap-2 md:gap-3 items-center min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
            <img
              src={imagem}
              className="w-full h-full object-cover"
              alt="Foto do paciente"
            />
          </div>

          <p className="truncate">{nome}</p>
        </span>

        <span className="text-text/70">
          Nível {nivel}
        </span>

        <span className="hidden xl:block text-text/70">
          {status}
        </span>

        <span className="flex gap-1.5 md:gap-2">
          <Link
            href={`/paciente/detalhePaciente/${id}`}
            className="p-2 md:p-3 bg-amarelo hover:bg-amarelo/75 rounded-lg transition sm:flex items-center justify-center"
          >
            <img
              src={Eye.src || Eye}
              alt="Visualizar"
              className="w-3 md:w-4"
            />
          </Link>

          <Link
            href={
              id
                ? `/paciente/alterar/${id}`
                : "/paciente/pacientes"
            }
            className="p-2 md:p-3 bg-turquesa hover:bg-turquesa/75 rounded-lg transition flex items-center justify-center"
          >
            <img
              src={Editar.src || Editar}
              alt="Editar"
              className="w-3 md:w-4"
            />
          </Link>

          <button
            type="button"
            onClick={() => setModalAberto(true)}
            disabled={!id}
            className="p-2 md:p-3 bg-salmao hover:bg-salmao/75 rounded-lg transition flex items-center justify-center disabled:opacity-50"
          >
            <img
              src={Excluir.src || Excluir}
              alt="Excluir"
              className="w-3 md:w-4"
            />
          </button>
        </span>
      </div>

      {modalAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => {
            if (!excluindo) setModalAberto(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`titulo-excluir-${id}`}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
           
            <div className="w-16 h-16 rounded-full bg-salmao/15 flex items-center justify-center">
              <img
                src={Excluir.src || Excluir}
                alt=""
                className="w-7 h-7"
              />
            </div>

            <div className="text-center space-y-3">
              <h2
                id={`titulo-excluir-${id}`}
                className="text-xl font-semibold text-text font-jakarta"
              >
                Excluir paciente?
              </h2>

              <p className="text-sm text-text/60 font-jakarta leading-relaxed">
                Tem certeza que deseja excluir{" "}
                <span className="font-semibold text-text">
                  {nome}
                </span>
                ?
              </p>

              <p className="text-xs text-red-500">
                Esta ação não poderá ser desfeita.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                disabled={excluindo}
                className="flex-1 py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-text font-medium transition disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={deletePaciente}
                disabled={excluindo}
                className="flex-1 py-3 px-5 rounded-xl bg-salmao hover:bg-salmao/80 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {excluindo
                  ? "Excluindo..."
                  : "Excluir paciente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListaPaciente;
