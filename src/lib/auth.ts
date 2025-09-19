import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./db"

export const authOptions = {
  adapter: PrismaAdapter(prisma), // Habilitado para salvar usuários do GitHub
  providers: [
    // GitHub OAuth
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),

  ],
  session: {
    strategy: "jwt" as const,
  },
  debug: true,
  callbacks: {
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      if (user) {
        token.id = user.id
      }
      if (account?.access_token) {
        token.accessToken = account.access_token

        // Salvar o accessToken do GitHub no banco
        if (account.provider === "github" && user?.id) {
          try {
            console.log("💾 Salvando accessToken do GitHub no JWT callback...")

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
    async session({ session, token }: { session: any; token: any }) {
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
