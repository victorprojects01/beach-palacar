# Guia para Rodar o Beach Placar Localmente

Este aplicativo é construído com React e TypeScript, utilizando módulos ES modernos. Como o projeto contém arquivos `.tsx` (TypeScript com JSX), é necessário um ambiente de desenvolvimento para transpilar o código para JavaScript que o navegador entenda (ou usar um bundler como Vite).

Abaixo, apresento a estrutura de pastas recomendada e o passo a passo usando o Vite, que é a maneira mais rápida e eficiente hoje.

## 1. Estrutura de Pastas

Organize seus arquivos da seguinte forma em uma pasta (ex: `beach-placar`):

beach-placar/
├── index.html
├── package.json
├── tsconfig.json (opcional, mas recomendado)
├── vite.config.ts (opcional)
└── src/
    ├── index.tsx
    ├── App.tsx
    ├── types.ts
    ├── metadata.json
    ├── components/
    │   ├── AssistantChat.tsx
    │   └── ScoreCard.tsx
    ├── hooks/
    │   └── useBeachTennisGame.ts
    └── services/
        └── geminiService.ts

*Nota: Movi os arquivos de código para dentro de uma pasta `src` para organização padrão, mas se preferir manter na raiz, ajuste os imports.*

## 2. Passo a Passo de Instalação

### Pré-requisitos
- Node.js instalado (versão 18 ou superior).

### Passo 1: Inicializar o projeto e instalar dependências

Abra o terminal na pasta `beach-placar` e execute:

```bash
# Cria o package.json
npm init -y

# Instala o Vite, React, TypeScript e as bibliotecas usadas
npm install vite @vitejs/plugin-react react react-dom lucide-react @google/genai typescript --save-dev
```

### Passo 2: Configurar o `index.html`

Edite o seu `index.html` para apontar para o arquivo de entrada correto. Como estamos rodando localmente, removemos o `importmap` (pois usaremos o `npm` para gerenciar pacotes) e apontamos o script para o `src/index.tsx`.

Substitua o conteúdo do `index.html` original por:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Beach Placar</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              beach: {
                yellow: '#FFD74A',
                orange: '#FF8A3D',
                sand: '#FFF8E1',
                dark: '#2D3748',
              }
            },
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-gray-50 text-gray-800">
    <div id="root"></div>
    <!-- O Vite vai injetar o script aqui -->
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

### Passo 3: Configurar a Chave da API

Para que o assistente funcione, você precisa da chave da API do Gemini. 
No desenvolvimento local com Vite, crie um arquivo chamado `.env` na raiz do projeto:

**Arquivo `.env`**:
```
VITE_API_KEY=sua_chave_api_aqui
```

E atualize o arquivo `services/geminiService.ts` para ler essa variável:
*Troque `process.env.API_KEY` por `import.meta.env.VITE_API_KEY`.*

### Passo 4: Rodar o projeto

No terminal, execute:

```bash
npx vite
```

O terminal mostrará um link (geralmente `http://localhost:5173`). Abra no seu navegador.

---

## 3. Resolução de Problemas Comuns

1. **Imports não encontrados**: Se estiver usando a estrutura de pastas sugerida (`src/`), certifique-se de que seus imports dentro dos arquivos `.tsx` estão corretos (ex: `import App from './App'` funciona se estiverem na mesma pasta).
2. **Erro de TypeScript**: O Vite roda mesmo com erros de TS, mas se quiser configurar, crie um `tsconfig.json` básico na raiz.
3. **Tailwind**: O script CDN do Tailwind no `index.html` funciona perfeitamente para desenvolvimento rápido sem precisar configurar PostCSS.

Agora você tem o Beach Placar rodando na sua máquina! 🎾☀️
