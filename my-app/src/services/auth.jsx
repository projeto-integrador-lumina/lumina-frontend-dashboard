
import axios from "axios";

const API_URL = "http://localhost:4000";

export const getAxiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${
      typeof window !== "undefined"
        ? localStorage.getItem("token") ?? ""
        : ""
    }`,
  },
});

export const login = async (usuario, senha) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        usuario,
        senha,
      }
    );

    const token = response.data.token;

    if (!token) {
      return {
        success: false,
        message: "O servidor não retornou um token de acesso.",
      };
    }

    localStorage.setItem("token", token);

    return {
      success: true,
      token,
      data: response.data,
    };
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;

    return {
      success: false,
      status,
      data,
      message:
        data?.error ||
        data?.message ||
        "Falha ao fazer login. Verifique os dados e tente novamente.",
      contaDesativada: data?.contaDesativada === true,
    };
  }
};

export const reativarConta = async (usuario, senha) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/reativar`,
      {
        usuario,
        senha,
      }
    );

    return {
      success: true,
      data: response.data,
      message:
        response.data?.message ||
        "Conta reativada com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      data: error.response?.data,
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Não foi possível reativar a conta.",
    };
  }
};

export const logout = (router) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }

  router.push("/");
};
