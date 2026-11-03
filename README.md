# Lumina Dashboard — Painel de Gerenciamento Fonoaudiológico

O **Lumina Dashboard** é uma aplicação web desenvolvida para auxiliar fonoaudiólogos no gerenciamento de pacientes, atividades terapêuticas e acompanhamento de informações relacionadas à terapia fonológica infantil.

O Dashboard integra o projeto **Lumina**, uma proposta de sistema multiplataforma voltado ao apoio da terapia fonoaudiológica de crianças com desvio fonológico.

A plataforma disponibiliza uma interface administrativa para o profissional, permitindo centralizar informações dos pacientes e acessar recursos de acompanhamento.

O projeto é composto por três partes principais:

- **Lumina Dashboard:** aplicação web destinada aos fonoaudiólogos.
- **Lumina Backend:** API responsável pelas regras de negócio, autenticação e gerenciamento dos dados.
- **Lolá:** aplicação web infantil destinada aos pacientes, com interfaces lúdicas e elementos de gamificação.

As duas aplicações frontend compartilham o mesmo backend.

## Acesso à aplicação

O Dashboard está disponível em:

**https://lumina-frontend-dashboard-seven.vercel.app**

Outros serviços do projeto:

- **Lolá:** https://my-app-lumina-f76f.vercel.app
- **Lumina Backend:** https://lumina-backend-6mk6.onrender.com

A aplicação está hospedada na Vercel e pode ser acessada pelo navegador.

## Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Next.js 16 | Framework de desenvolvimento web |
| React 19 | Construção das interfaces |
| JavaScript | Implementação das funcionalidades |
| Tailwind CSS 4 | Estilização e responsividade |
| Axios | Comunicação HTTP com o backend |
| Recharts | Visualização gráfica de informações |
| Lucide React | Biblioteca de ícones |
| React Hot Toast | Exibição de notificações na interface |
| Node.js | Ambiente de desenvolvimento |
| npm | Gerenciamento das dependências |
| Vercel | Hospedagem do frontend |

O Dashboard utiliza uma API desenvolvida em Node.js, com persistência de dados no MongoDB Atlas.

**O frontend não se conecta diretamente ao banco de dados.** As operações são realizadas por meio da API Lumina.

## Funcionalidades

### Autenticação e gerenciamento de conta

O projeto contém interfaces relacionadas a:

- Autenticação do fonoaudiólogo.
- Cadastro de conta profissional.
- Gerenciamento da sessão.
- Consulta e edição do perfil.
- Configurações da conta.
- Recuperação e alteração de senha.
- Reativação de conta.

A autenticação é realizada pelo backend, responsável pela validação das credenciais.

### Gerenciamento de pacientes

O Dashboard permite ao profissional gerenciar os pacientes vinculados ao seu acompanhamento.

As funcionalidades incluem:

- Cadastro de pacientes.
- Listagem de pacientes cadastrados.
- Visualização de informações individuais.
- Edição de dados cadastrais.
- Exclusão de pacientes.
- Consulta de informações relacionadas ao acompanhamento.

O cadastro de pacientes também está relacionado à criação das credenciais utilizadas para acessar a aplicação infantil Lolá.

### Cadastro de atividades

O Dashboard possui uma área destinada ao cadastro e gerenciamento de atividades relacionadas à proposta terapêutica.

As atividades fazem parte da estrutura de acompanhamento e da integração planejada entre o painel profissional e a aplicação infantil.

### Relatórios e acompanhamento

O projeto possui páginas para visualização de relatórios e informações relacionadas ao acompanhamento dos pacientes.

As interfaces incluem:

- Relatórios gerais.
- Relatórios de atividades.
- Relatórios de evolução.
- Relatórios relacionados aos fonemas.
- Representações gráficas e indicadores.

> **Importante:** nesta etapa do desenvolvimento, os relatórios utilizam dados fictícios ou de demonstração armazenados no banco de dados. Eles ainda não representam resultados clínicos coletados e validados a partir da utilização completa da Lolá por pacientes.

A estrutura foi desenvolvida para permitir a evolução da integração entre as atividades realizadas no aplicativo infantil e os indicadores apresentados ao fonoaudiólogo.

### Mensagens

O Dashboard possui uma interface de mensagens, destinada à comunicação dentro do ecossistema Lumina.

### Perfil e configurações

A aplicação também disponibiliza interfaces para:

- Visualização do perfil profissional.
- Atualização de informações cadastrais.
- Configurações da conta.
- Gerenciamento de opções relacionadas ao usuário.

> **Observação:** a presença de uma interface não significa necessariamente que todas as funcionalidades estejam completamente integradas ao backend. Algumas partes permanecem em desenvolvimento.

## Integração com a Lolá

O Dashboard e a Lolá são aplicações independentes, mas utilizam a mesma API e o mesmo banco de dados.

O Dashboard é destinado ao profissional responsável pelo acompanhamento fonoaudiológico.

A Lolá é destinada ao paciente, oferecendo uma experiência infantil com elementos lúdicos e de gamificação.

### Cadastro e acesso dos pacientes

O cadastro de um paciente é realizado pelo fonoaudiólogo por meio do Dashboard.

Durante esse processo, são geradas as credenciais necessárias para que o paciente acesse a Lolá.

O profissional deve disponibilizar essas informações ao paciente ou ao seu responsável.

**A Lolá não permite que o paciente realize seu próprio cadastro.**

Dessa forma, o acesso à aplicação infantil depende de um cadastro previamente realizado pelo fonoaudiólogo e da utilização de credenciais válidas.

## Arquitetura do sistema

A arquitetura geral do Lumina é apresentada abaixo:

```text
          Lumina Dashboard
           (Fonoaudiólogo)
                  |
                  |
                  v
             Lumina API
           (Node.js/Express)
                  |
                  v
             MongoDB Atlas
                  ^
                  |
                  |
                Lolá
             (Paciente)
```

O backend centraliza a autenticação, as regras de negócio e a comunicação com o banco de dados.

Essa organização permite manter o Dashboard e a Lolá como aplicações independentes, sem a necessidade de criar um backend separado para cada interface.

## Pré-requisitos

Para executar o Dashboard localmente, é necessário possuir:

- Node.js compatível com Next.js 16, preferencialmente uma versão LTS recente.
- npm.
- Git.
- Um editor de código, como o Visual Studio Code.
- Acesso à API Lumina, local ou remota.

Para verificar as instalações:

```bash
node -v
npm -v
git --version
```

## Instalação e execução local

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

Acesse o diretório da aplicação:

```bash
cd lumina-frontend-dashboard/my-app
```

O caminho pode variar conforme o nome da pasta clonada.

> **Importante:** o arquivo `package.json` está localizado dentro da pasta `my-app`.

### 2. Instalar as dependências

```bash
npm install
```

Esse comando instala as dependências declaradas no arquivo `package.json`.

### 3. Configuração da API

O Dashboard utiliza a API Lumina para autenticação e acesso aos dados.

O endereço do backend pode ser configurado por meio da variável de ambiente `NEXT_PUBLIC_API_URL`.

A API remota está disponível em:

```text
https://lumina-backend-6mk6.onrender.com
```

Para utilizar um endereço diferente, é possível criar opcionalmente um arquivo `.env.local` dentro da pasta `my-app`.

**Exemplo para utilizar o backend local:**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Nesse caso, o backend deverá estar configurado e em execução na porta `4000`.

**Exemplo para utilizar o backend remoto:**

```env
NEXT_PUBLIC_API_URL=https://lumina-backend-6mk6.onrender.com
```

O arquivo `.env.local` é uma configuração opcional de desenvolvimento, não sendo necessário criá-lo quando a aplicação já possui um endereço padrão válido para a API.

> **Observação:** não adicione `/api` ao final do endereço, pois esse prefixo já faz parte das requisições utilizadas pelo frontend.

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse o endereço indicado no terminal, normalmente:

```text
http://localhost:3000
```

### 5. Realizar o login

Para acessar as funcionalidades do Dashboard, utilize uma conta válida de fonoaudiólogo.

O sistema também possui uma interface de cadastro de conta profissional.

A autenticação é realizada pela API Lumina.

## Estrutura do projeto

A estrutura principal do Dashboard está organizada da seguinte maneira:

```text
lumina-frontend-dashboard/
├── README.md
└── my-app/
    ├── public/
    ├── src/
    │   ├── app/
    │   │   ├── atividade/
    │   │   ├── configuracoes/
    │   │   ├── home/
    │   │   ├── login/
    │   │   │   ├── alterar-senha/
    │   │   │   └── cadastro/
    │   │   ├── mensagem/
    │   │   ├── paciente/
    │   │   │   ├── alterar/
    │   │   │   │   └── [id]/
    │   │   │   ├── cadastro/
    │   │   │   ├── detalhePaciente/
    │   │   │   │   └── [id]/
    │   │   │   └── pacientes/
    │   │   ├── perfil/
    │   │   │   └── alterar/
    │   │   ├── relatorios/
    │   │   │   ├── atividade/
    │   │   │   ├── evolucao/
    │   │   │   └── fonema/
    │   │   ├── globals.css
    │   │   ├── layout.js
    │   │   └── page.js
    │   ├── assets/
    │   └── components/
    │       ├── Button.jsx
    │       ├── Input.jsx
    │       ├── ListaPaciente.jsx
    │       ├── Navbar.jsx
    │       ├── Onboarding.jsx
    │       ├── Radiobox.jsx
    │       ├── Selectbox.jsx
    │       └── Sidebar.jsx
    ├── .gitignore
    ├── eslint.config.mjs
    ├── jsconfig.json
    ├── next.config.mjs
    ├── package.json
    └── package-lock.json
```

### Organização dos diretórios

| Diretório | Descrição |
|---|---|
| `src/app/` | Páginas e rotas da aplicação |
| `src/app/home/` | Página inicial do Dashboard |
| `src/app/login/` | Autenticação e cadastro profissional |
| `src/app/paciente/` | Gerenciamento de pacientes |
| `src/app/atividade/` | Área de atividades |
| `src/app/relatorios/` | Relatórios e indicadores |
| `src/app/mensagem/` | Interface de mensagens |
| `src/app/perfil/` | Perfil profissional |
| `src/app/configuracoes/` | Configurações da conta |
| `src/components/` | Componentes reutilizáveis |
| `src/assets/` | Recursos visuais |
| `public/` | Arquivos públicos |

## Scripts disponíveis

Os comandos abaixo devem ser executados dentro da pasta `my-app`.

### Desenvolvimento

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

### Compilação

```bash
npm run build
```

Gera a versão de produção do projeto.

### Produção

```bash
npm run start
```

Inicia a aplicação após a compilação.

### Verificação de código

```bash
npm run lint
```

Executa o ESLint para verificar possíveis problemas no código.

## Hospedagem e deploy

O frontend do Dashboard está hospedado na **Vercel**.

O backend do projeto está hospedado no **Render** e utiliza o **MongoDB Atlas** para persistência dos dados.

Para realizar o deploy:

1. Publicar o código no repositório Git.
2. Conectar o repositório à Vercel.
3. Configurar o diretório raiz como `my-app`, quando necessário.
4. Configurar a variável de ambiente `NEXT_PUBLIC_API_URL`, caso seja utilizada.
5. Executar o deployment.
6. Verificar o funcionamento da aplicação e sua comunicação com o backend.

A variável para o ambiente de produção pode ser definida como:

```env
NEXT_PUBLIC_API_URL=https://lumina-backend-6mk6.onrender.com
```

Variáveis com o prefixo `NEXT_PUBLIC_` são disponibilizadas ao navegador. Portanto, não devem conter senhas ou outras informações secretas.

## Limitações da versão atual

O Dashboard faz parte de um projeto acadêmico em desenvolvimento e apresenta algumas limitações.

### Relatórios com dados de demonstração

Os relatórios e indicadores ainda não representam resultados clínicos reais coletados por meio do uso completo da Lolá.

Nesta etapa, são utilizados dados fictícios para demonstrar a apresentação e a organização das informações.

### Integração em desenvolvimento

A integração entre o Dashboard, a Lolá e os dados produzidos durante as atividades terapêuticas ainda está em evolução.

### Funcionalidades em implementação

Algumas interfaces podem apresentar funcionalidades parcialmente implementadas ou dependentes de integrações futuras.

### Dependência do backend

As operações que necessitam de autenticação ou persistência de dados dependem da disponibilidade da API Lumina.

## Problemas comuns

### Não consigo realizar o login

Verifique se:

- As credenciais foram informadas corretamente.
- A conta está ativa.
- A API está disponível.
- O endereço do backend está configurado corretamente.

### Não consigo cadastrar um paciente

Verifique se a sessão do fonoaudiólogo está válida e se o backend está disponível.

Também confira se os campos obrigatórios foram preenchidos corretamente.

### Erro de conexão com a API

Verifique o endereço definido em `NEXT_PUBLIC_API_URL` e confirme se o backend está em execução.

### Alterei a variável de ambiente, mas nada mudou

Reinicie o servidor de desenvolvimento.

Em produção, pode ser necessário realizar um novo deployment para aplicar a alteração.

### Os relatórios não apresentam resultados reais da Lolá

Nesta versão, os relatórios utilizam dados de demonstração e ainda não representam resultados coletados a partir da utilização completa da aplicação infantil.

## Segurança e boas práticas

- Não publicar credenciais reais no repositório.
- Não compartilhar tokens de autenticação.
- Não versionar arquivos `.env.local`.
- Utilizar HTTPS em produção.
- Manter as validações de autenticação e autorização no backend.
- Utilizar dados fictícios durante testes.
- Evitar exposição de informações sensíveis de pacientes.
- Verificar as permissões de acesso às funcionalidades protegidas.

## Objetivo do projeto

O Lumina Dashboard foi desenvolvido para auxiliar o gerenciamento das informações relacionadas ao acompanhamento fonoaudiológico infantil.

A plataforma busca oferecer ao profissional uma interface centralizada para cadastro de pacientes, organização de atividades e visualização de informações relevantes ao acompanhamento terapêutico.

Em conjunto com a Lolá e o Lumina Backend, o Dashboard integra a proposta de desenvolvimento de uma solução multiplataforma que utiliza recursos tecnológicos e de gamificação como apoio à terapia fonológica.

O sistema é uma ferramenta complementar ao trabalho do fonoaudiólogo e não substitui a avaliação, o diagnóstico ou a intervenção profissional.
