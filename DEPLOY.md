# 🚀 Deploy Guide - Burnout Tracker

## Deploy na Vercel

### 1. Preparação

1. **Push para GitHub**
```bash
git add .
git commit -m "Initial commit - Burnout Tracker MVP"
git push origin main
```

2. **Acesse a Vercel**
- Vá para [vercel.com](https://vercel.com)
- Faça login com sua conta GitHub
- Clique em "New Project"

### 2. Configuração

1. **Importe o repositório**
- Selecione seu repositório do Burnout Tracker
- Clique em "Import"

2. **Configure as variáveis de ambiente**
Na aba "Environment Variables", adicione:

```env
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=sua-chave-secreta-super-forte
DATABASE_URL=file:./dev.db
GITHUB_ID=seu-github-client-id
GITHUB_SECRET=seu-github-client-secret
LINKEDIN_ID=seu-linkedin-client-id
LINKEDIN_SECRET=seu-linkedin-client-secret
```

3. **Deploy**
- Clique em "Deploy"
- Aguarde o build completar

### 3. Configuração OAuth

#### GitHub
1. Vá para GitHub Settings > Developer settings > OAuth Apps
2. Edite sua OAuth App
3. Atualize a "Authorization callback URL" para:
   ```
   https://seu-app.vercel.app/api/auth/callback/github
   ```

#### LinkedIn
1. Vá para LinkedIn Developer Portal
2. Edite sua app
3. Atualize a "Authorized redirect URLs" para:
   ```
   https://seu-app.vercel.app/api/auth/callback/linkedin
   ```

### 4. Database (Produção)

Para produção, recomendamos usar PostgreSQL:

1. **Crie um banco no Neon ou Supabase**
2. **Atualize o schema.prisma**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Atualize as variáveis de ambiente**
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
```

4. **Execute as migrations**
```bash
npx prisma migrate deploy
```

## Deploy Alternativo (Railway)

### 1. Preparação
```bash
npm install -g @railway/cli
railway login
```

### 2. Deploy
```bash
railway init
railway add postgresql
railway deploy
```

### 3. Configuração
```bash
railway variables set NEXTAUTH_URL=https://seu-app.railway.app
railway variables set NEXTAUTH_SECRET=sua-chave-secreta
# ... outras variáveis
```

## Monitoramento

### 1. Logs
```bash
# Vercel
vercel logs

# Railway
railway logs
```

### 2. Analytics
- Configure Vercel Analytics
- Configure Google Analytics (opcional)

### 3. Error Tracking
- Configure Sentry (opcional)
- Configure LogRocket (opcional)

## Performance

### 1. Otimizações
- [x] Next.js Image Optimization
- [x] Static Generation onde possível
- [x] Lazy Loading de componentes
- [ ] Service Worker para cache (futuro)

### 2. Métricas
- Core Web Vitals
- Lighthouse Score
- Bundle Size Analysis

## Backup

### 1. Database
```bash
# Backup automático (Neon/Supabase)
# Ou backup manual:
pg_dump $DATABASE_URL > backup.sql
```

### 2. Código
- Git como backup principal
- GitHub como repositório remoto

## Domínio Customizado

### 1. Compre um domínio
- Namecheap, GoDaddy, etc.

### 2. Configure DNS
```
A record: @ -> 76.76.19.61
CNAME: www -> seu-app.vercel.app
```

### 3. Adicione na Vercel
- Project Settings > Domains
- Adicione seu domínio customizado

## SSL/HTTPS

- ✅ Automático na Vercel
- ✅ Automático no Railway
- ✅ Let's Encrypt gratuito

## Conclusão

Seu Burnout Tracker estará rodando em produção! 🎉

**URLs importantes:**
- App: https://seu-app.vercel.app
- Admin: https://seu-app.vercel.app/dashboard
- API: https://seu-app.vercel.app/api

**Próximos passos:**
1. Configure analytics
2. Adicione mais integrações
3. Implemente notificações
4. Escale conforme necessário
