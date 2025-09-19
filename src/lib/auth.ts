import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./db"

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Desabilitado para permitir login com credenciais
  providers: [
    // GitHub OAuth
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),

    // Login com email/senha
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        // Verificar senha com bcrypt
        if (!user.password || !(await bcrypt.compare(credentials.password, user.password))) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random`,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.image = user.image
      }
      if (account?.access_token) {
        token.accessToken = account.access_token

        // Salvar o accessToken do GitHub no banco e atualizar dados do usuário
        if (account.provider === "github" && user?.id) {
          try {
            console.log("💾 Salvando accessToken do GitHub no JWT callback...")
            console.log("Dados do usuário GitHub:", { name: user.name, image: user.image, email: user.email })

            // Atualizar dados do usuário com informações do GitHub
            await prisma.user.update({
              where: { id: user.id },
              data: {
                name: user.name,
                image: user.image,
                email: user.email
              }
            })

            await prisma.integration.upsert({
              where: {
                userId_type: {
                  userId: user.id,
                  type: "github"
                }
              },
              update: {
                accessToken: account.access_token,
                isActive: true,
                updatedAt: new Date()
              },
              create: {
                userId: user.id,
                type: "github",
                accessToken: account.access_token,
                isActive: true
              }
            })
            console.log("✅ AccessToken do GitHub salvo no banco")
          } catch (error) {
            console.error("❌ Erro ao salvar accessToken:", error)
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
    signUp: "/signup",
  },
}
