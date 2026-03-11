# ✅ Checklist - Fluxo do Admin
## Tarefas para completar o painel administrativo para produção

---

## 🔐 AUTENTICAÇÃO

- [x] Login com email e senha
- [x] Proteção de rotas admin
- [x] Sessão persistente
- [ ] Recuperação de senha (esqueci minha senha)
- [ ] Logout em todas as abas (opcional)

---

## 📦 GERENCIAMENTO DE PRODUTOS

### CRUD Básico
- [x] Listar produtos
- [x] Criar produto
- [x] Editar produto
- [x] Excluir produto
- [x] Visualizar produto antes de editar

### Upload de Imagens
- [x] Upload direto para Supabase Storage
- [x] Múltiplas imagens por produto
- [x] Drag & Drop de imagens
- [x] Preview de imagens antes de salvar
- [x] Adicionar URLs manualmente
- [ ] **DELETAR imagens do Storage quando removidas do preview** 🔴 CRÍTICO
- [ ] **DELETAR todas as imagens quando produto é excluído** 🔴 CRÍTICO
- [ ] Validação de tipo de arquivo (apenas imagens)
- [ ] Validação de tamanho máximo (ex: 5MB)
- [ ] Validação de dimensões mínimas/máximas
- [ ] Progress bar durante upload
- [ ] Preview de imagem antes de deletar

### Vídeos
- [x] Upload de vídeo hero
- [x] URL manual de vídeo
- [ ] Validação de formato de vídeo
- [ ] Validação de tamanho de vídeo

### Validações
- [x] Campos obrigatórios
- [x] Slug automático
- [ ] Validação de slug único
- [ ] Validação de formato de preço
- [ ] Validação de URLs de imagens
- [ ] Mensagens de erro claras

### UX/UI
- [x] Loading states básicos
- [x] Mensagens de sucesso/erro
- [ ] Confirmação antes de excluir produto
- [ ] Preview de produto antes de salvar
- [ ] Ordenação de produtos (drag & drop)
- [ ] Busca/filtro na lista de produtos

---

## 📁 GERENCIAMENTO DE CATEGORIAS

### CRUD Básico
- [x] Listar categorias
- [x] Criar categoria
- [x] Editar categoria
- [x] Excluir categoria
- [x] Visualizar categoria antes de editar

### Upload de Imagens
- [x] Campo para URL de imagem de fundo
- [ ] **Upload direto de imagem de fundo** 🟡 IMPORTANTE
- [ ] Preview de imagem de fundo
- [ ] Deletar imagem quando categoria é excluída

### Validações
- [x] Campos obrigatórios
- [x] Slug automático
- [ ] Validação de slug único
- [ ] Validação de URLs de imagens

### UX/UI
- [x] Loading states básicos
- [x] Mensagens de sucesso/erro
- [ ] Confirmação antes de excluir categoria
- [ ] Ordenação de categorias (drag & drop)
- [ ] Visualização de produtos por categoria

---

## ⚙️ CONFIGURAÇÕES DO SITE

### Configurações Gerais
- [x] Título do site
- [x] Descrição do site
- [x] Salvar configurações

### WhatsApp
- [x] Número do WhatsApp
- [x] Template de mensagem
- [x] Validação de formato de número
- [ ] Preview da mensagem WhatsApp

### Imagens e Vídeos Globais
- [x] URL de imagem de fundo global
- [x] URL de vídeo de fundo global
- [ ] Upload direto de imagens/vídeos globais
- [ ] Preview de imagens/vídeos globais

---

## 🧪 UTILITÁRIOS

### Dashboard
- [x] Estatísticas básicas (produtos, categorias)
- [x] Links rápidos para ações
- [ ] Gráficos de vendas (futuro)
- [ ] Últimos produtos adicionados

### Seed de Teste
- [x] Criar produtos de exemplo
- [x] Criar categorias de exemplo
- [ ] Limpar dados de teste

---

## 🔒 SEGURANÇA

- [x] Autenticação obrigatória
- [x] Proteção de rotas
- [ ] Rate limiting nas APIs
- [ ] Validação de permissões (se múltiplos admins)
- [ ] Logs de ações do admin
- [ ] Backup automático de dados

---

## 🐛 TRATAMENTO DE ERROS

- [x] Mensagens de erro básicas
- [ ] Tratamento de erros de rede
- [ ] Retry automático em caso de falha
- [ ] Logs de erro estruturados
- [ ] Notificações de erro para admin

---

## 📱 RESPONSIVIDADE

- [x] Layout responsivo básico
- [ ] Otimização para tablets
- [ ] Otimização para mobile
- [ ] Testes em diferentes dispositivos

---

## ⚡ PERFORMANCE

- [x] Loading states
- [ ] Lazy loading de imagens
- [ ] Cache de dados
- [ ] Otimização de queries
- [ ] Compressão de imagens antes do upload

---

## 📊 RESUMO DE PRIORIDADES

### 🔴 CRÍTICO (Fazer antes de produção)
1. [ ] Deletar imagens do Storage quando removidas do preview
2. [ ] Deletar imagens do Storage quando produto é excluído
3. [ ] Validação básica de arquivos (tipo e tamanho)

### 🟡 IMPORTANTE (Melhorias significativas)
4. [ ] Upload de imagens para categorias
5. [ ] Confirmação antes de excluir
6. [ ] Validação de slug único
7. [ ] Preview de mensagem WhatsApp

### 🟢 DESEJÁVEL (Pode fazer depois)
8. [ ] Recuperação de senha
9. [ ] Ordenação drag & drop
10. [ ] Busca/filtro na lista
11. [ ] Gráficos e analytics
12. [ ] Logs de ações

---

**Status Atual:** 70% completo  
**Pronto para Produção:** Não (faltam itens críticos)
