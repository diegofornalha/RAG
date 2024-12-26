#!/bin/bash

# Ativa o ambiente virtual
source ../.venv_rag/bin/activate

# Cria a pasta backend se não existir
mkdir -p backend

# Move o arquivo oracle.py para a pasta backend se existir
if [ -f oracle.py ]; then
  mv oracle.py backend/
fi

# Inicia o backend em segundo plano
cd backend && python oracle.py &

# Volta para a pasta raiz e inicia o frontend
cd .. && cd frontend && npm run dev 