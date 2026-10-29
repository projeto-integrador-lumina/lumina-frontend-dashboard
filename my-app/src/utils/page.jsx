export const getImageUrl = (caminhoFoto, fotoPadrao) => {
  if (!caminhoFoto) return fotoPadrao;

  // Se já for uma URL externa (http/https) ou base64
  if (caminhoFoto.startsWith("http") || caminhoFoto.startsWith("data:")) {
    return caminhoFoto;
  }

  const API_URL = "http://localhost:4000";
  
  // Substitui barras invertidas do Windows (\) por barras normais (/)
  const caminhoFormatado = caminhoFoto.replace(/\\/g, "/");
  
  // Garante que o caminho comece com /
  const rotaLimpa = caminhoFormatado.startsWith("/") 
    ? caminhoFormatado 
    : `/${caminhoFormatado}`;

  return `${API_URL}${rotaLimpa}`;
};