# ✅ Checklist Master - YUME Atelier
## Ordenado do mais fácil ao mais difícil | 0% → 100% Pronto

**Objetivo:** Completar todas as funcionalidades faltantes para produção  
**Status Atual:** ~85% completo  
**Meta:** 100% pronto para produção

---

## 🟢 NÍVEL 1 - FÁCIL (1-2 horas cada)
*Tarefas simples, sem dependências complexas*

### 1.1 Validação Básica de Arquivos
- [ ] **Validação de tipo de arquivo** (apenas imagens: jpg, png, webp)
  - Arquivo: `components/admin/ImageUpload.tsx`
  - Adicionar validação antes do upload
  - Mostrar erro se tipo inválido
  - **Estimativa:** 30 minutos

- [ ] **Validação de tamanho máximo** (ex: 5MB por imagem)
  - Arquivo: `components/admin/ImageUpload.tsx`
  - Verificar `file.size` antes de upload
  - Mostrar erro se muito grande
  - **Estimativa:** 30 minutos

- [ ] **Validação de slug único** ao criar/editar produto
  - Arquivo: `app/admin/produtos/[id]/page.tsx`
  - Verificar se slug já existe antes de salvar
  - Mostrar erro se duplicado
  - **Estimativa:** 45 minutos

- [ ] **Validação de slug único** ao criar/editar categoria
  - Arquivo: `app/admin/categorias/[id]/page.tsx`
  - Verificar se slug já existe antes de salvar
  - Mostrar erro se duplicado
  - **Estimativa:** 45 minutos

### 1.2 Confirmações e Feedback
- [ ] **Confirmação antes de excluir produto**
  - Arquivo: `app/admin/produtos/page.tsx`
  - Substituir `confirm()` por modal customizado
  - Mostrar nome do produto na confirmação
  - **Estimativa:** 1 hora

- [ ] **Confirmação antes de excluir categoria**
  - Arquivo: `app/admin/categorias/page.tsx`
  - Substituir `confirm()` por modal customizado
  - Avisar se categoria tem produtos associados
  - **Estimativa:** 1 hora

- [ ] **Preview da mensagem WhatsApp** nas configurações
  - Arquivo: `app/admin/configuracoes/page.tsx`
  - Mostrar preview da mensagem com exemplo
  - Atualizar em tempo real
  - **Estimativa:** 1 hora

### 1.3 SEO Básico
- [ ] **Meta tags dinâmicas na home**
  - Arquivo: `app/page.tsx` ou `app/layout.tsx`
  - Adicionar `<head>` com meta tags do site
  - Usar dados de `site_settings`
  - **Estimativa:** 45 minutos

- [ ] **Meta tags dinâmicas em produtos**
  - Arquivo: `app/produto/[slug]/page.tsx`
  - Adicionar meta tags com nome, descrição, imagem do produto
  - Open Graph básico
  - **Estimativa:** 1 hora

- [ ] **Meta tags dinâmicas em categorias**
  - Arquivo: `app/categoria/[slug]/page.tsx`
  - Adicionar meta tags com nome e descrição da categoria
  - **Estimativa:** 45 minutos

- [ ] **robots.txt**
  - Arquivo: `public/robots.txt`
  - Criar arquivo básico permitindo todos os crawlers
  - **Estimativa:** 15 minutos

- [ ] **Sitemap.xml básico**
  - Arquivo: `app/sitemap.ts` (Next.js App Router)
  - Gerar sitemap com produtos e categorias
  - **Estimativa:** 1 hora

---

## 🟡 NÍVEL 2 - MÉDIO (2-4 horas cada)
*Tarefas com lógica moderada, algumas dependências*

### 2.1 Gestão de Imagens no Storage
- [ ] **Deletar imagem do Storage quando removida do preview**
  - Arquivo: `components/admin/ImageUpload.tsx`
  - Criar função `deleteImageFromStorage(url)`
  - Extrair path da URL do Supabase
  - Chamar `supabase.storage.from('yume-atelier').remove([path])`
  - Chamar quando `removeImage()` é executado
  - **Estimativa:** 2 horas
  - **Prioridade:** 🔴 CRÍTICO

- [ ] **Deletar imagens quando produto é excluído**
  - Arquivo: `app/admin/produtos/page.tsx` ou `app/api/products/[id]/route.ts`
  - Antes de deletar produto, deletar todas as imagens do Storage
  - Extrair paths das URLs em `image_urls`
  - Deletar do Storage antes de deletar do banco
  - **Estimativa:** 2 horas
  - **Prioridade:** 🔴 CRÍTICO

- [ ] **Deletar vídeo quando produto é excluído**
  - Arquivo: `app/admin/produtos/page.tsx` ou `app/api/products/[id]/route.ts`
  - Se `hero_video_url` existir, deletar do Storage
  - **Estimativa:** 1 hora

### 2.2 Upload para Categorias
- [ ] **Componente ImageUpload para categorias**
  - Arquivo: `app/admin/categorias/[id]/page.tsx`
  - Adicionar componente `ImageUpload` para `background_image_url`
  - Similar ao de produtos, mas single image
  - **Estimativa:** 2 horas
  - **Prioridade:** 🟡 IMPORTANTE

- [ ] **Deletar imagem quando categoria é excluída**
  - Arquivo: `app/admin/categorias/page.tsx`
  - Se categoria tem `background_image_url`, deletar do Storage
  - **Estimativa:** 1 hora

### 2.3 Validações Avançadas
- [ ] **Validação de dimensões de imagem** (opcional)
  - Arquivo: `components/admin/ImageUpload.tsx`
  - Verificar largura/altura mínimas (ex: 800x600)
  - Usar `Image` API do browser para ler dimensões
  - **Estimativa:** 2 horas

- [ ] **Validação de formato de vídeo**
  - Arquivo: `components/admin/VideoUpload.tsx`
  - Verificar tipo de arquivo (mp4, webm)
  - Verificar tamanho máximo
  - **Estimativa:** 1 hora

- [ ] **Verificar estoque ao adicionar ao carrinho**
  - Arquivo: `contexts/CartContext.tsx`
  - Verificar se produto ainda está `available`
  - Mostrar erro se produto foi vendido
  - **Estimativa:** 2 horas

### 2.4 UX Melhorado
- [ ] **Progress bar durante upload**
  - Arquivo: `components/admin/ImageUpload.tsx`
  - Usar `onUploadProgress` do Supabase (se disponível)
  - Ou estimar progresso baseado em arquivos processados
  - **Estimativa:** 2 horas

- [ ] **Preview de imagem antes de deletar**
  - Arquivo: `components/admin/ImageUpload.tsx`
  - Mostrar modal de confirmação com preview
  - **Estimativa:** 1.5 horas

- [ ] **Empty states melhorados**
  - Arquivo: `components/store/CartSidebar.tsx`
  - Melhorar empty state do carrinho
  - Adicionar CTA para continuar comprando
  - **Estimativa:** 1 hora

### 2.5 SEO Avançado
- [ ] **Open Graph tags completas**
  - Arquivos: `app/produto/[slug]/page.tsx`, `app/categoria/[slug]/page.tsx`
  - Adicionar og:title, og:description, og:image, og:type
  - **Estimativa:** 1.5 horas

- [ ] **Twitter Cards**
  - Arquivos: `app/produto/[slug]/page.tsx`
  - Adicionar twitter:card, twitter:title, twitter:description, twitter:image
  - **Estimativa:** 1 hora

- [ ] **Schema.org markup (Product)**
  - Arquivo: `app/produto/[slug]/page.tsx`
  - Adicionar JSON-LD com dados do produto
  - **Estimativa:** 2 horas

---

## 🟠 NÍVEL 3 - MÉDIO-ALTO (4-6 horas cada)
*Tarefas com lógica complexa ou múltiplas dependências*

### 3.1 Funcionalidades de Admin
- [ ] **Ordenação drag & drop de produtos**
  - Arquivo: `app/admin/produtos/page.tsx`
  - Usar biblioteca como `@dnd-kit/core`
  - Atualizar `display_order` ao arrastar
  - **Estimativa:** 4 horas

- [ ] **Ordenação drag & drop de categorias**
  - Arquivo: `app/admin/categorias/page.tsx`
  - Similar ao de produtos
  - **Estimativa:** 3 horas

- [ ] **Busca/filtro na lista de produtos**
  - Arquivo: `app/admin/produtos/page.tsx`
  - Adicionar input de busca
  - Filtrar por nome, categoria, status
  - **Estimativa:** 2 horas

- [ ] **Preview de produto antes de salvar**
  - Arquivo: `app/admin/produtos/[id]/page.tsx`
  - Adicionar botão "Preview"
  - Abrir modal com preview do produto
  - **Estimativa:** 3 horas

### 3.2 Funcionalidades do Cliente
- [ ] **Paginação de produtos**
  - Arquivo: `components/store/ProductGrid.tsx`
  - Implementar paginação (ex: 12 produtos por página)
  - Adicionar controles de navegação
  - **Estimativa:** 3 horas

- [ ] **Filtros avançados na busca**
  - Arquivo: `components/search/SearchOverlay.tsx`
  - Adicionar filtro por preço (range slider)
  - Adicionar ordenação (preço, nome, data)
  - **Estimativa:** 4 horas

- [ ] **Compartilhar produto** (social media)
  - Arquivo: `components/inventory/ProductFocus.tsx`
  - Adicionar botões de compartilhamento
  - WhatsApp, Facebook, Twitter, copiar link
  - **Estimativa:** 2 horas

- [ ] **Produtos relacionados**
  - Arquivo: `app/produto/[slug]/page.tsx`
  - Buscar produtos da mesma categoria
  - Excluir produto atual
  - Mostrar grid abaixo
  - **Estimativa:** 3 horas

### 3.3 Performance
- [ ] **Compressão automática de imagens**
  - Criar API route: `app/api/optimize-image/route.ts`
  - Usar biblioteca como `sharp` ou serviço externo
  - Comprimir antes de fazer upload
  - **Estimativa:** 5 horas

- [ ] **Conversão para WebP**
  - Integrar com compressão
  - Converter imagens para WebP automaticamente
  - Manter fallback para outros formatos
  - **Estimativa:** 3 horas

- [ ] **Lazy loading avançado**
  - Arquivo: `components/store/ProductGrid.tsx`
  - Usar Intersection Observer
  - Carregar produtos conforme scroll
  - **Estimativa:** 3 horas

### 3.4 Acessibilidade
- [ ] **ARIA labels completos**
  - Todos os componentes interativos
  - Adicionar `aria-label` em botões sem texto
  - Adicionar `aria-describedby` onde necessário
  - **Estimativa:** 4 horas

- [ ] **Navegação por teclado melhorada**
  - Garantir que todos os elementos sejam focáveis
  - Adicionar atalhos de teclado (ex: ESC para fechar modais)
  - Melhorar ordem de tab
  - **Estimativa:** 3 horas

- [ ] **Focus states visíveis**
  - Adicionar estilos de focus em todos os elementos interativos
  - Garantir contraste adequado
  - **Estimativa:** 2 horas

---

## 🔴 NÍVEL 4 - DIFÍCIL (6+ horas cada)
*Tarefas complexas, arquitetura ou integrações externas*

### 4.1 Funcionalidades Avançadas
- [ ] **Sistema de favoritos**
  - Criar tabela `favorites` no Supabase
  - Adicionar botão de favoritar em produtos
  - Página de favoritos
  - Persistência (localStorage + banco se logado)
  - **Estimativa:** 6 horas

- [ ] **Histórico de visualizações**
  - Criar tabela `view_history` no Supabase
  - Salvar produtos visualizados
  - Mostrar "Vistos recentemente"
  - **Estimativa:** 5 horas

- [ ] **Notificação quando produto voltar ao estoque**
  - Criar tabela `stock_notifications` no Supabase
  - Formulário para cadastrar email/WhatsApp
  - Sistema de notificação (email ou WhatsApp API)
  - **Estimativa:** 8 horas

### 4.2 Analytics e Monitoramento
- [ ] **Google Analytics**
  - Instalar `@next/third-parties` ou `react-ga4`
  - Configurar eventos (visualização, adicionar ao carrinho, checkout)
  - **Estimativa:** 3 horas

- [ ] **Error tracking (Sentry)**
  - Instalar `@sentry/nextjs`
  - Configurar captura de erros
  - Dashboard de erros
  - **Estimativa:** 4 horas

- [ ] **Logs estruturados**
  - Criar sistema de logging
  - Logar ações importantes do admin
  - Armazenar em banco ou serviço externo
  - **Estimativa:** 6 horas

### 4.3 Performance Avançada
- [ ] **Service Worker (PWA)**
  - Configurar PWA com Next.js
  - Cache de assets estáticos
  - Offline support básico
  - **Estimativa:** 6 horas

- [ ] **CDN para imagens**
  - Configurar CDN (Cloudflare, Cloudinary, etc)
  - Otimização automática de imagens
  - Cache inteligente
  - **Estimativa:** 5 horas

- [ ] **Cache de dados**
  - Implementar cache de produtos/categorias
  - Usar React Query ou SWR
  - Invalidação inteligente
  - **Estimativa:** 6 horas

### 4.4 Segurança e Infraestrutura
- [ ] **Rate limiting nas APIs**
  - Implementar rate limiting
  - Proteger endpoints de upload
  - Usar biblioteca como `express-rate-limit` ou similar
  - **Estimativa:** 4 horas

- [ ] **Backup automático de imagens**
  - Configurar backup periódico do Storage
  - Script para backup manual
  - **Estimativa:** 5 horas

- [ ] **Sistema de permissões** (se múltiplos admins)
  - Criar tabela `admin_roles`
  - Sistema de permissões granular
  - **Estimativa:** 10 horas

### 4.5 Testes
- [ ] **Testes unitários**
  - Configurar Jest + React Testing Library
  - Testar componentes críticos
  - Testar funções utilitárias
  - **Estimativa:** 8 horas

- [ ] **Testes E2E**
  - Configurar Playwright ou Cypress
  - Testar fluxos críticos (cliente e admin)
  - **Estimativa:** 10 horas

---

## 📊 RESUMO POR PRIORIDADE

### 🔴 CRÍTICO (Fazer primeiro)
1. Deletar imagem do Storage quando removida do preview (Nível 2)
2. Deletar imagens quando produto é excluído (Nível 2)
3. Validação básica de arquivos (Nível 1)

### 🟡 IMPORTANTE (Fazer em seguida)
4. Upload de imagens para categorias (Nível 2)
5. SEO básico - Meta tags dinâmicas (Nível 1)
6. Confirmações antes de excluir (Nível 1)
7. Validação de estoque no carrinho (Nível 2)

### 🟢 DESEJÁVEL (Pode fazer depois)
8. Paginação de produtos (Nível 3)
9. Filtros avançados (Nível 3)
10. Analytics básico (Nível 4)
11. Performance avançada (Nível 4)
12. Testes automatizados (Nível 4)

---

## 🎯 PLANO DE EXECUÇÃO SUGERIDO

### Fase 1: Crítico (1-2 semanas)
- ✅ Nível 1: Validações básicas
- ✅ Nível 2: Gestão de imagens no Storage
- ✅ Nível 1: SEO básico

### Fase 2: Importante (2-3 semanas)
- ✅ Nível 2: Upload para categorias
- ✅ Nível 2: Validações avançadas
- ✅ Nível 1: Confirmações e feedback

### Fase 3: Melhorias (3-4 semanas)
- ✅ Nível 3: Funcionalidades de admin
- ✅ Nível 3: Funcionalidades do cliente
- ✅ Nível 3: Performance básica

### Fase 4: Avançado (4+ semanas)
- ✅ Nível 4: Funcionalidades avançadas
- ✅ Nível 4: Analytics e monitoramento
- ✅ Nível 4: Testes

---

## 📈 PROGRESSO

**Total de Tarefas:** ~50 tarefas  
**Concluídas:** 0  
**Em Progresso:** 0  
**Pendentes:** ~50

**Estimativa Total:** ~150-200 horas de desenvolvimento

---

## ✅ COMO USAR ESTA CHECKLIST

1. **Marque as tarefas conforme completa** usando `[x]`
2. **Siga a ordem sugerida** (do mais fácil ao mais difícil)
3. **Priorize os itens CRÍTICOS** antes de produção
4. **Atualize o progresso** no final do documento
5. **Documente problemas** encontrados durante implementação

---

**Última atualização:** 22 de Fevereiro de 2026  
**Status:** Em desenvolvimento
