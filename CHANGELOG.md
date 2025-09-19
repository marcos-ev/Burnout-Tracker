# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.1.0] - 2024-09-19

### 🎉 MVP Lançado

#### ✨ Funcionalidades
- **Sistema de Autenticação**
  - Login com email/senha
  - OAuth com GitHub
  - OAuth com LinkedIn
  - Registro de novos usuários

- **Dashboard Principal**
  - Score de burnout (0-100)
  - Análise de 6 fatores de risco
  - Recomendações personalizadas
  - Interface responsiva

- **Algoritmo de Burnout**
  - Trabalho noturno (0-25 pontos)
  - Trabalho no fim de semana (0-20 pontos)
  - Sessões longas (0-20 pontos)
  - Alta frequência (0-15 pontos)
  - Poucas pausas (0-10 pontos)
  - Indicadores de estresse (0-10 pontos)

- **Integrações**
  - Base para integração com GitHub
  - Estrutura para WakaTime
  - Estrutura para RescueTime

- **Sistema de Alertas**
  - Alertas automáticos quando score > 70
  - Níveis de risco (baixo, médio, alto, crítico)

#### 🛠️ Tecnologias
- Next.js 14 com App Router
- TypeScript para type safety
- Tailwind CSS para estilização
- shadcn/ui para componentes
- Prisma ORM com SQLite
- NextAuth.js para autenticação

#### 📊 Métricas do MVP
- **Tempo de desenvolvimento**: 2 semanas
- **Arquivos criados**: 35+
- **Componentes UI**: 15
- **APIs**: 3
- **Páginas**: 4

### 🎯 Próximos Passos (v0.2.0)
- [ ] Integração completa com GitHub API
- [ ] Integração com WakaTime
- [ ] Integração com RescueTime
- [ ] Gráficos e visualizações
- [ ] Notificações em tempo real
- [ ] Configurações personalizáveis

### 🐛 Bugs Conhecidos
- Autenticação com credenciais usa hash simples (não bcrypt)
- Dados de burnout são simulados
- Integrações são mockadas

### 📝 Notas de Desenvolvimento
- Projeto criado seguindo melhores práticas
- Código totalmente tipado com TypeScript
- Interface moderna e responsiva
- Pronto para deploy na Vercel

---

## Versões Futuras

### [0.2.0] - Planejado
- Integrações reais com APIs
- Sistema de notificações
- Gráficos interativos
- Relatórios semanais

### [0.3.0] - Planejado
- App mobile (PWA)
- Dashboard para equipes
- Configurações avançadas
- Suporte a mais integrações

### [1.0.0] - Planejado
- Versão completa para produção
- Monetização implementada
- Suporte completo
- Documentação final
