# 🧠 Burnout Tracker

Uma plataforma para monitorar e prevenir burnout em desenvolvedores através de análise de dados reais.

## 🚀 Funcionalidades

- **Análise de Burnout**: Score baseado em padrões de trabalho reais
- **Integrações**: GitHub, WakaTime, RescueTime
- **Alertas Inteligentes**: Notificações quando necessário
- **Dashboard Completo**: Visualização de métricas e tendências
- **Recomendações Personalizadas**: Sugestões baseadas na análise

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: SQLite + Prisma ORM
- **Auth**: NextAuth.js (GitHub, LinkedIn, Email)
- **Deploy**: Vercel

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/burnout-tracker.git
cd burnout-tracker
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# GitHub OAuth
GITHUB_ID="seu-github-client-id"
GITHUB_SECRET="seu-github-client-secret"

# LinkedIn OAuth
LINKEDIN_ID="seu-linkedin-client-id"
LINKEDIN_SECRET="seu-linkedin-client-secret"

# WakaTime API
WAKATIME_API_KEY="sua-wakatime-api-key"

# RescueTime API
RESCUETIME_API_KEY="sua-rescuetime-api-key"
```

4. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

5. **Execute o projeto**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🔧 Configuração das APIs

### GitHub OAuth
1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Crie uma nova OAuth App
3. Defina a URL de callback: `http://localhost:3000/api/auth/callback/github`
4. Copie o Client ID e Client Secret

### LinkedIn OAuth
1. Acesse [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Crie uma nova app
3. Adicione a URL de callback: `http://localhost:3000/api/auth/callback/linkedin`
4. Copie o Client ID e Client Secret

### WakaTime API
1. Acesse [WakaTime Settings](https://wakatime.com/settings/account)
2. Gere uma API Key
3. Cole no arquivo `.env.local`

### RescueTime API
1. Acesse [RescueTime API](https://www.rescuetime.com/anapi/manage)
2. Gere uma API Key
3. Cole no arquivo `.env.local`

## 📊 Como Funciona

### Algoritmo de Burnout

O score é calculado baseado em 6 fatores:

1. **Trabalho Noturno** (0-25 pontos)
   - Commits entre 22h e 6h
   - Máximo 25 pontos

2. **Trabalho no Fim de Semana** (0-20 pontos)
   - Commits aos sábados e domingos
   - Máximo 20 pontos

3. **Sessões Longas** (0-20 pontos)
   - Sessões de programação > 4 horas
   - Máximo 20 pontos

4. **Alta Frequência** (0-15 pontos)
   - Muitos commits por dia
   - Máximo 15 pontos

5. **Poucas Pausas** (0-10 pontos)
   - Tempo de pausa < 30 min/dia
   - Máximo 10 pontos

6. **Indicadores de Estresse** (0-10 pontos)
   - Issues abertas, PRs pendentes
   - Máximo 10 pontos

### Níveis de Risco

- **0-50**: Baixo Risco ✅
- **51-70**: Risco Médio ⚠️
- **71-85**: Alto Risco 🚨
- **86-100**: Risco Crítico 🔥

## 🎯 Roadmap

### MVP (Atual)
- [x] Sistema de autenticação
- [x] Dashboard básico
- [x] Integração com GitHub
- [x] Cálculo de score de burnout
- [x] Alertas básicos

### Próximas Versões
- [ ] Integração com WakaTime
- [ ] Integração com RescueTime
- [ ] Gráficos e visualizações
- [ ] Relatórios semanais
- [ ] Configurações personalizadas
- [ ] Notificações push
- [ ] App mobile (PWA)

## 💰 Monetização

### Planos
- **Grátis**: 1 integração, 7 dias de histórico
- **Pro** (R$ 9,90/mês): Integrações ilimitadas, histórico completo
- **Equipe** (R$ 29,90/mês): Até 10 usuários, dashboard da equipe

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Email**: contato@burnouttracker.com
- **Twitter**: [@burnouttracker](https://twitter.com/burnouttracker)
- **GitHub**: [@burnouttracker](https://github.com/burnouttracker)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Prisma](https://prisma.io/) - ORM
- [NextAuth.js](https://next-auth.js.org/) - Autenticação
- [Tailwind CSS](https://tailwindcss.com/) - Estilização

---

**Desenvolvido com ❤️ para a comunidade de desenvolvedores**