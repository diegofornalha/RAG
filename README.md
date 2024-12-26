# Oráculo - Chatbot com IA

Este projeto consiste em um chatbot que utiliza a API do Google Gemini para processar mensagens e fornecer respostas inteligentes. O projeto é dividido em duas partes: backend (FastAPI) e frontend (React).

## Estrutura do Projeto

```
.
├── backend/
│   ├── oracle.py         # API FastAPI
│   ├── Dockerfile        # Configuração para containerização
│   ├── requirements.txt  # Dependências Python
│   ├── .dockerignore    # Arquivos ignorados no Docker
│   ├── .env             # Variáveis de ambiente
│   └── knowledge_base.csv # Base de conhecimento para RAG
├── frontend/
│   ├── src/
│   │   ├── App.tsx      # Componente principal
│   │   └── main.tsx     # Ponto de entrada
│   ├── .env             # Configuração da URL da API
│   ├── index.html       # HTML principal
│   ├── package.json     # Dependências Node.js
│   ├── tsconfig.json    # Configuração TypeScript
│   └── vite.config.ts   # Configuração Vite
└── run.sh               # Script de inicialização
```

## Backend (FastAPI)

## Estrutura do Backend

```
backend/
├── oracle.py         # API FastAPI principal
├── Dockerfile        # Configuração para containerização
├── requirements.txt  # Dependências Python
├── .dockerignore    # Arquivos ignorados no Docker
├── .env             # Variáveis de ambiente
└── knowledge_base.csv # Base de conhecimento para RAG
```

## Base de Conhecimento

O arquivo `knowledge_base.csv` deve conter duas colunas:

- `pergunta`: Contém as perguntas ou textos de referência
- `resposta`: Contém as respostas ou informações relacionadas

Exemplo:

```csv
pergunta,resposta
"O que é machine learning?","Machine Learning é uma área da Inteligência Artificial..."
"Como funciona deep learning?","Deep Learning é uma técnica de Machine Learning..."
```

## Tecnologias e Versões

```txt
fastapi==0.115.6
uvicorn==0.34.0
google-generativeai==0.8.3
python-dotenv==1.0.1
pydantic>=2.0.0
```

## Configuração do Docker

```dockerfile
FROM --platform=linux/amd64 python:3.12-slim

WORKDIR /app

# Copia os arquivos essenciais primeiro
COPY requirements.txt .
COPY knowledge_base.csv .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o resto dos arquivos
COPY . .

EXPOSE ${PORT:-3000}

CMD ["sh", "-c", "uvicorn oracle:app --host 0.0.0.0 --port ${PORT:-3000} --workers 4"]
```

> **Nota**: O arquivo `knowledge_base.csv` é copiado explicitamente para garantir que a base de conhecimento esteja disponível no container. Este arquivo é essencial para o funcionamento do sistema RAG.

## Variáveis de Ambiente (.env)

```env
GEMINI_API_KEY=sua_chave_api_aqui
```

## API Endpoints

### POST /api/chat

Processa mensagens do usuário e retorna respostas do modelo Gemini.

**Request:**

```json
{
  "message": "string"
}
```

**Response:**

```json
{
  "response": "string"
}
```

**Erros:**

- 500: Erro interno do servidor

### GET /health

Verifica a saúde da API.

**Response:**

```json
{
  "status": "healthy",
  "model": "gemini-1.0-pro"
}
```

## CORS

O backend está configurado para aceitar requisições das seguintes origens:

- http://localhost:5173 (Desenvolvimento)
- https://oraculo-asimov.vercel.app (Produção)

## Documentação da API

A documentação completa da API está disponível em:

- Swagger UI: http://localhost:3000/docs
- ReDoc: http://localhost:3000/redoc

## Modelos de Dados

### ChatRequest

```python
class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        description="Mensagem do usuário para o modelo",
        example="Qual é a diferença entre machine learning e deep learning?",
        min_length=1
    )
```

### ChatResponse

```python
class ChatResponse(BaseModel):
    response: str = Field(
        ...,
        description="Resposta gerada pelo modelo"
    )
```

### ErrorResponse

```python
class ErrorResponse(BaseModel):
    detail: str = Field(
        ...,
        description="Descrição detalhada do erro"
    )
```

## Execução Local

```bash
# Ativar ambiente virtual
source ../.venv_rag/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
python oracle.py
```

## Deploy com Docker

```bash
# Construir imagem
docker build -t oraculo-api .

# Executar container
docker run -p 3000:3000 -e GEMINI_API_KEY=sua_chave_api_aqui oraculo-api
```

## Frontend (React)

### Tecnologias Utilizadas

- React 18
- TypeScript
- Material-UI
- Axios
- Vite

### Configuração do Ambiente

O frontend requer a seguinte variável de ambiente no arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api/chat
```

### Componentes Principais

#### App.tsx

- Interface de chat moderna usando Material-UI
- Gerenciamento de estado para mensagens
- Tratamento de erros e feedback visual
- Comunicação com o backend via Axios

## Scripts Disponíveis

### Backend

```bash
# Ativar ambiente virtual
source ../.venv_rag/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
python oracle.py
```

### Frontend

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Script de Inicialização (run.sh)

```bash
#!/bin/bash

# Ativa o ambiente virtual
source ../.venv_rag/bin/activate

# Entra na pasta do projeto
cd frontend

# Inicia o backend em segundo plano
cd backend && python oracle.py &

# Volta para a pasta frontend e inicia o servidor de desenvolvimento
cd .. && npm run dev
```

## Configuração de Desenvolvimento

### ESLint e Prettier

O projeto utiliza ESLint e Prettier para garantir a qualidade do código:

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ]
}

// .prettierrc
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### TypeScript

Configuração completa do TypeScript para garantir tipagem estática:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "strict": true,
    "types": ["node", "react", "react-dom", "axios"]
  }
}
```

## Portas Utilizadas

- Backend: 3000
- Frontend: 5173

## Dependências

### Backend

```txt
fastapi==0.115.6
uvicorn==0.34.0
google-generativeai==0.8.3
python-dotenv==1.0.1
pydantic>=2.0.0
```

### Frontend

```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@mui/material": "^5.16.13",
    "axios": "^1.7.9",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```
