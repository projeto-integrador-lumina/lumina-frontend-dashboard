
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Input from "@/components/Input";
import Radiobox from "@/components/Radiobox";
import Selectbox from "@/components/Selectbox";

import Profile from "@/assets/profile.png";
import Img from "@/assets/icons/img.svg";
import Back from "@/assets/icons/back.svg";

import { getAxiosConfig } from "@/services/auth";
import { getImageUrl } from "@/utils/page";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

const LISTA_URL = "/paciente/pacientes";

const TIPOS_FOTO = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const TAMANHO_MAX_FOTO = 10 * 1024 * 1024;

const opcoesGravidade = [
  { label: "Leve", value: "Leve" },
  { label: "Moderado", value: "Moderado" },
  { label: "Grave", value: "Grave" },
  { label: "Severa", value: "Severa" },
];

const estadoInicial = {
  nome: "",
  sobrenome: "",
  data_nasc: "",
  sexo: "",
  nivel_gravidade: "",
  responsavel: "",
  contato: "",
  cpf: "",
  endereco: "",
};

function somenteNumeros(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function formatarCPF(valor) {
  const numeros = somenteNumeros(valor).slice(0, 11);

  return numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function cpfValido(valor) {
  const cpf = somenteNumeros(valor);

  if (!cpf) return true;
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;
  if (digito !== Number(cpf[9])) return false;

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;

  return digito === Number(cpf[10]);
}

function dataNascimentoValida(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }

  const [ano, mes, dia] = valor.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);

  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return false;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return data <= hoje;
}

export default function AlterarPaciente() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const inputFotoRef = useRef(null);

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erroCarregamento, setErroCarregamento] =
    useState("");

  const [form, setForm] = useState(estadoInicial);
  const [foto, setFoto] = useState(null);
  const [fotoAtual, setFotoAtual] = useState(
    Profile.src || Profile
  );
  const [previewFoto, setPreviewFoto] = useState(null);

  useEffect(() => {
    return () => {
      if (previewFoto) {
        URL.revokeObjectURL(previewFoto);
      }
    };
  }, [previewFoto]);

  useEffect(() => {
    if (!id) {
      setErroCarregamento(
        "O identificador do paciente não foi informado."
      );
      setCarregando(false);
      return;
    }

    const controller = new AbortController();

    async function buscarPaciente() {
      setCarregando(true);
      setErroCarregamento("");

      try {
        const resposta = await axios.get(
          `${API_URL}/api/pacientes/${encodeURIComponent(id)}`,
          {
            ...getAxiosConfig(),
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        const paciente =
          resposta.data?.paciente || resposta.data;

        if (!paciente?._id) {
          throw new Error(
            "O servidor retornou dados inválidos."
          );
        }

        const responsavel = paciente.responsavel || {};

        setForm({
          nome: paciente.nome || "",
          sobrenome: paciente.sobrenome || "",
          data_nasc: paciente.data_nasc
            ? String(paciente.data_nasc).slice(0, 10)
            : "",
          sexo:
            paciente.sexo === "Masculino"
              ? "M"
              : paciente.sexo === "Feminino"
                ? "F"
                : paciente.sexo || "",
          nivel_gravidade:
            paciente.nivel_gravidade || "",
          responsavel:
            typeof responsavel === "string"
              ? responsavel
              : responsavel.nome || "",
          contato:
            paciente.contato ||
            responsavel.contato ||
            "",
          cpf: formatarCPF(
            paciente.cpf || responsavel.cpf || ""
          ),
          endereco: paciente.endereco || "",
        });

        setFotoAtual(
          getImageUrl(
            paciente.foto_perfil,
            Profile.src || Profile
          )
        );
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error(
          "Erro ao carregar paciente:",
          error
        );

        const mensagem =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Não foi possível carregar o paciente.";

        setErroCarregamento(mensagem);
        toast.error(mensagem);
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    buscarPaciente();

    return () => controller.abort();
  }, [id]);

  function handleChange(evento) {
    const { name, value } = evento.target;

    setForm((anterior) => ({
      ...anterior,
      [name]:
        name === "cpf"
          ? formatarCPF(value)
          : value,
    }));
  }

  function handleFoto(evento) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) return;

    if (!TIPOS_FOTO.includes(arquivo.type)) {
      toast.error(
        "Formato inválido. Use PNG, JPG ou WEBP."
      );
      evento.target.value = "";
      return;
    }

    if (arquivo.size > TAMANHO_MAX_FOTO) {
      toast.error(
        "A foto deve ter no máximo 10 MB."
      );
      evento.target.value = "";
      return;
    }

    setFoto(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  function handleRemoverFoto() {
    setFoto(null);
    setPreviewFoto(null);

    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    if (enviando || carregando || erroCarregamento) {
      return;
    }

    if (
      !form.nome.trim() ||
      !form.sobrenome.trim() ||
      !form.data_nasc ||
      !form.sexo ||
      !form.nivel_gravidade ||
      !form.responsavel.trim() ||
      !form.contato.trim()
    ) {
      toast.error(
        "Preencha todos os campos obrigatórios."
      );
      return;
    }

    if (!dataNascimentoValida(form.data_nasc)) {
      toast.error(
        "Informe uma data de nascimento válida."
      );
      return;
    }

    if (!cpfValido(form.cpf)) {
      toast.error(
        "O CPF do responsável é inválido."
      );
      return;
    }

    const formData = new FormData();

    formData.append("nome", form.nome.trim());
    formData.append(
      "sobrenome",
      form.sobrenome.trim()
    );
    formData.append("data_nasc", form.data_nasc);
    formData.append("sexo", form.sexo);
    formData.append(
      "nivel_gravidade",
      form.nivel_gravidade
    );
    formData.append(
      "endereco",
      form.endereco.trim()
    );
    formData.append(
      "responsavel[nome]",
      form.responsavel.trim()
    );
    formData.append(
      "responsavel[contato]",
      form.contato.trim()
    );
    formData.append(
      "responsavel[cpf]",
      somenteNumeros(form.cpf)
    );

    if (foto) {
      formData.append("foto_perfil", foto);
    }

    setEnviando(true);

    try {
      const resposta = await axios.put(
        `${API_URL}/api/pacientes/${encodeURIComponent(id)}`,
        formData,
        getAxiosConfig()
      );

      toast.success(
        resposta.data?.message ||
          "Paciente atualizado com sucesso!"
      );

      router.push(LISTA_URL);
    } catch (error) {
      console.error(
        "Erro ao alterar paciente:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error(
          "Sua sessão expirou. Entre novamente."
        );
      } else if (error.response?.status === 403) {
        toast.error(
          "Você não tem permissão para editar este paciente."
        );
      } else if (error.response?.status === 413) {
        toast.error(
          "A imagem enviada é muito grande."
        );
      } else {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Não foi possível atualizar o paciente."
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarAberta}
        onClose={() => setSidebarAberta(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40">
          <Navbar
            onToggleMenu={() =>
              setSidebarAberta((anterior) => !anterior)
            }
          />
        </header>

        <main className="p-4 font-jakarta text-sm text-text sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text/60 sm:text-sm">
              Home / Pacientes /{" "}
              <span className="font-semibold text-salmao">
                Editar Paciente
              </span>
            </p>

            <Link
              href={LISTA_URL}
              className="flex h-10 w-10 items-center justify-center self-end rounded-full bg-white shadow transition hover:bg-gray-100 sm:self-auto"
              title="Voltar"
            >
              <img
                src={Back.src || Back}
                alt="Voltar"
                className="w-5"
              />
            </Link>
          </div>

          <div className="py-6 text-center">
            <h1 className="text-xl font-semibold md:text-2xl">
              Editar Paciente
            </h1>

            <p className="mt-2 text-sm text-text/60">
              Atualize os dados cadastrais do paciente.
            </p>
          </div>

          {carregando ? (
            <div className="rounded-2xl bg-white p-10 text-center text-text/60 shadow-lg">
              Carregando dados do paciente...
            </div>
          ) : erroCarregamento ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
              <p className="text-red-600">
                {erroCarregamento}
              </p>

              <Link
                href={LISTA_URL}
                className="mt-5 inline-block rounded-xl bg-salmao px-6 py-3 font-semibold text-white"
              >
                Voltar aos pacientes
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-8 rounded-2xl bg-white p-5 shadow-lg sm:p-6 lg:p-8 xl:grid-cols-[280px_1fr]"
            >
              <section className="flex flex-col items-center gap-4 xl:items-start">
                <h2 className="text-base font-semibold">
                  Foto de Perfil
                </h2>

                <input
                  ref={inputFotoRef}
                  type="file"
                  name="foto_perfil"
                  id="foto_perfil"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFoto}
                />

                <button
                  type="button"
                  onClick={() =>
                    inputFotoRef.current?.click()
                  }
                  disabled={enviando}
                  className="flex w-full max-w-xs cursor-pointer flex-col items-center gap-2 rounded-2xl bg-text/10 p-6 text-center transition hover:bg-text/15 disabled:opacity-50"
                >
                  <img
                    src={previewFoto || fotoAtual}
                    alt="Foto do paciente"
                    className="mb-2 h-32 w-32 rounded-full object-cover"
                    onError={(evento) => {
                      evento.currentTarget.onerror = null;
                      evento.currentTarget.src =
                        Profile.src || Profile;
                    }}
                  />

                  <img
                    src={Img.src || Img}
                    alt=""
                    className="w-6"
                  />

                  <p className="text-sm font-semibold">
                    PNG, JPG ou WEBP
                  </p>

                  <p className="text-xs text-text/60">
                    Máximo de 10 MB
                  </p>

                  <span className="max-w-full break-all text-xs text-gray-500">
                    {foto
                      ? foto.name
                      : "Clique para trocar a foto"}
                  </span>
                </button>

                {foto && (
                  <button
                    type="button"
                    onClick={handleRemoverFoto}
                    disabled={enviando}
                    className="cursor-pointer text-xs text-red-500 hover:underline"
                  >
                    Cancelar troca da foto
                  </button>
                )}

                <p className="max-w-xs text-center text-xs text-text/50 xl:text-left">
                  Se não selecionar uma nova foto,
                  a foto atual será mantida.
                </p>
              </section>

              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                <div className="md:col-span-2 xl:col-span-3">
                  <h2 className="border-b border-gray-100 pb-3 text-base font-semibold">
                    Dados do paciente
                  </h2>
                </div>

                <div className="flex flex-col gap-1">
                  <Input
                    type="text"
                    label="Nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1 xl:col-span-2">
                  <Input
                    type="text"
                    label="Sobrenome"
                    name="sobrenome"
                    value={form.sobrenome}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Input
                    type="date"
                    label="Data de Nascimento"
                    name="data_nasc"
                    value={form.data_nasc}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-base font-semibold">
                    Sexo
                  </label>

                  <div className="flex min-h-[48px] flex-wrap items-center gap-5">
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
                  <label className="text-base font-semibold">
                    Nível de Gravidade
                  </label>

                  <Selectbox
                    label="Nível de Gravidade"
                    name="nivel_gravidade"
                    value={form.nivel_gravidade}
                    onChange={handleChange}
                    options={opcoesGravidade}
                    placeholder="Selecione o nível"
                  />
                </div>

                <div className="md:col-span-2 xl:col-span-3">
                  <h2 className="mt-3 border-b border-gray-100 pb-3 text-base font-semibold">
                    Dados do responsável
                  </h2>
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <Input
                    type="text"
                    label="Nome do Responsável"
                    name="responsavel"
                    value={form.responsavel}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Input
                    type="tel"
                    label="Contato"
                    name="contato"
                    value={form.contato}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Input
                    type="text"
                    label="CPF"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <Input
                    type="text"
                    label="Endereço"
                    name="endereco"
                    value={form.endereco}
                    onChange={handleChange}
                  />
                </div>

                <div className="border-t border-gray-100 pt-4 md:col-span-2 xl:col-span-3">
                  <p className="mb-4 text-xs text-text/50">
                    O CPF, o endereço e a foto são
                    opcionais. Os demais campos devem
                    ser preenchidos.
                  </p>

                  <div className="flex flex-col justify-end gap-3 sm:flex-row">
                    <Link
                      href={LISTA_URL}
                      className="w-full rounded-xl bg-red-500 px-6 py-3 text-center font-medium text-white transition hover:bg-red-500/80 sm:w-auto"
                    >
                      Cancelar
                    </Link>

                    <button
                      type="submit"
                      disabled={enviando}
                      className="w-full cursor-pointer rounded-xl bg-turquesa px-6 py-3 font-semibold text-text transition hover:bg-turquesa/75 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {enviando
                        ? "Salvando..."
                        : "Salvar alterações"}
                    </button>
                  </div>
                </div>
              </section>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
