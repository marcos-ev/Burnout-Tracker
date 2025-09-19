# 🧠 Burnout Tracker

Uma plataforma para monitorar e prevenir burnout em desenvolvedores através de análise de dados reais do GitHub.

## 🚀 Funcionalidades

- **Análise de Burnout**: Score baseado em padrões de trabalho reais do GitHub
- **Integração GitHub**: Análise completa de commits, issues e atividade
- **Frases Motivacionais Dinâmicas**: Mensagens personalizadas baseadas no nível de stress
- **Dashboard Completo**: Visualização de métricas e tendências em tempo real
- **Autenticação Segura**: Login via GitHub OAuth e email/senha com bcrypt
- **Avatar Inteligente**: Exibição automática da foto do GitHub ou avatar personalizado
- **Recomendações Personalizadas**: Sugestões baseadas na análise de burnout

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação Segura
- **GitHub OAuth**: Login rápido e seguro com conta do GitHub
- **Email/Senha**: Cadastro tradicional com senhas criptografadas (bcrypt)
- **Sessões JWT**: Gerenciamento seguro de sessões
- **Avatar Inteligente**: Exibição automática da foto do GitHub ou avatar personalizado

### 📊 Análise de Burnout
- **Score Dinâmico**: Cálculo baseado em 6 fatores de stress
- **Análise em Tempo Real**: Dados atualizados automaticamente
- **Métricas Detalhadas**: Breakdown completo de cada fator
- **Histórico**: Acompanhamento de tendências ao longo do tempo

### 💬 Sistema Motivacional
- **Frases Dinâmicas**: Mensagens personalizadas por nível de stress
- **4 Níveis de Resposta**: Baixo, Moderado, Alto e Crítico
- **Cores Intuitivas**: Visual que reflete o nível de alerta
- **Mensagens Empáticas**: Foco no bem-estar e autocuidado

### 🎨 Interface Moderna
- **Design Responsivo**: Funciona perfeitamente em mobile e desktop
- **Componentes shadcn/ui**: Interface moderna e acessível
- **Tema Consistente**: Cores e tipografia harmoniosas
- **UX Intuitiva**: Navegação simples e clara

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: SQLite + Prisma ORM
- **Auth**: NextAuth.js (GitHub OAuth + Email/Senha com bcrypt)
- **Deploy**: Vercel

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/marcos-ev/Burnout-Tracker.git
cd Burnout-Tracker
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

- **0-39**: Baixo Risco ✅ - Frases de celebração e motivação
- **40-59**: Risco Baixo 🟢 - Frases de manutenção e crescimento  
- **60-79**: Risco Médio ⚠️ - Frases de alerta e cuidado
- **80-100**: Alto Risco 🚨 - Frases de cuidado urgente e alerta

### Frases Motivacionais Dinâmicas

O sistema exibe frases personalizadas baseadas no seu nível de burnout:
- **Alto stress (80+)**: "É hora de parar e respirar. Seu bem-estar é mais importante que qualquer código."
- **Stress moderado (60-79)**: "Você está no limite. Que tal uma pausa para recarregar as energias?"
- **Stress baixo (40-59)**: "Você está no caminho certo! Continue cuidando do seu equilíbrio."
- **Baixo stress (0-39)**: "Parabéns! Você está mantendo um excelente equilíbrio entre trabalho e vida pessoal."

## 🎯 Roadmap

### MVP (Atual)
- [x] Sistema de autenticação (GitHub OAuth + Email/Senha com bcrypt)
- [x] Dashboard completo com análise em tempo real
- [x] Integração completa com GitHub API
- [x] Cálculo de score de burnout baseado em 6 fatores
- [x] Frases motivacionais dinâmicas por nível de stress
- [x] Avatar inteligente (GitHub ou personalizado)
- [x] Interface moderna e responsiva
- [x] Sistema de recomendações personalizadas

### Próximas Versões
- [ ] Gráficos e visualizações avançadas
- [ ] Relatórios semanais automáticos
- [ ] Configurações personalizadas de alertas
- [ ] Notificações push
- [ ] App mobile (PWA)
- [ ] Integração com calendário
- [ ] Análise de sentimentos em commits

## 💰 Monetização

### Planos
- **Grátis**: Análise básica do GitHub, 30 dias de histórico
- **Pro** (R$ 9,90/mês): Análise avançada, histórico completo, relatórios
- **Equipe** (R$ 29,90/mês): Até 10 usuários, dashboard da equipe, insights compartilhados

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **GitHub**: [@marcos-ev](https://github.com/marcos-ev)
- **Repositório**: [Burnout-Tracker](https://github.com/marcos-ev/Burnout-Tracker)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Prisma](https://prisma.io/) - ORM
- [NextAuth.js](https://next-auth.js.org/) - Autenticação
- [Tailwind CSS](https://tailwindcss.com/) - Estilização

---

**Desenvolvido com ❤️ para a comunidade de desenvolvedores**