#!/bin/bash

# Cores para o output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sem cor

echo -e "${BLUE}===> Iniciando Deploy Unificado (API + WEB) <===${NC}"

# --- DEPLOY API ---
echo -e "${YELLOW}--- [API] ---"
echo -e "${GREEN}==> Atualizando código API...${NC}"
git pull

echo -e "${GREEN}==> Buildando imagem API...${NC}"
docker build -t canavision-api:latest .
if [ $? -ne 0 ]; then echo "Erro no build da API. Abortando."; exit 1; fi

echo -e "${GREEN}==> Reiniciando container API...${NC}"
docker rm -f canavision-api || true
docker run -d --name canavision-api \
  --restart unless-stopped \
  --env-file .env \
  -p 3000:3000 \
  canavision-api:latest

# --- DEPLOY WEB (FRONTEND) ---
# Ajuste o caminho abaixo se a pasta do front tiver outro nome
WEB_PATH="../cana-vision-web"

if [ -d "$WEB_PATH" ]; then
    echo -e "${YELLOW}--- [FRONTEND] ---"
    cd "$WEB_PATH"
    
    echo -e "${GREEN}==> Atualizando código WEB...${NC}"
  git pull

    echo -e "${GREEN}==> Buildando imagem WEB...${NC}"
    docker build -t canavision-web:latest --build-arg NEXT_PUBLIC_API_URI=https://atmosagro.com/api .
    if [ $? -ne 0 ]; then echo "Erro no build do WEB. Abortando."; exit 1; fi

    echo -e "${GREEN}==> Reiniciando container WEB...${NC}"
    docker rm -f canavision-web || true
    docker run -d --name canavision-web \
      --restart unless-stopped \
      -p 8080:8080 \
      canavision-web:latest
    
    cd - > /dev/null
else
    echo -e "${YELLOW}Aviso: Pasta do frontend não encontrada em $WEB_PATH. Pulando deploy web.${NC}"
fi

echo -e "${BLUE}===> Deploy finalizado com sucesso! <===${NC}"
docker ps | grep canavision