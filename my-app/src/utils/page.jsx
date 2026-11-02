
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

export const getImageUrl = (caminhoFoto, fotoPadrao) => {
  if (!caminhoFoto) return fotoPadrao;

  const caminho = String(caminhoFoto).trim().replace(/\\/g, "/");

  if (!caminho) return fotoPadrao;

  if (caminho.startsWith("data:") || caminho.startsWith("blob:")) {
    return caminho;
  }

  if (/^https?:\/\//i.test(caminho)) {
    try {
      const url = new URL(caminho);

      if (
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1"
      ) {
        return `${API_URL}${url.pathname}${url.search}`;
      }

      return caminho;
    } catch {
      return fotoPadrao;
    }
  }

  const rotaLimpa = caminho.startsWith("/")
    ? caminho
    : `/${caminho}`;

  return `${API_URL}${rotaLimpa}`;
};
