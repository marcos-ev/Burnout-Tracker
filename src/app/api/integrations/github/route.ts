import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      )
    }

    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json(
        { message: "Token de acesso é obrigatório" },
        { status: 400 }
      )
    }

    // Salvar integração no banco
    const integration = await prisma.integration.upsert({
      where: {
        userId_type: {
          userId: session.user.id,
          type: "github"
        }
      },
      update: {
        accessToken,
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        type: "github",
        accessToken,
        isActive: true
      }
    })

    return NextResponse.json({
      message: "Integração GitHub conectada com sucesso",
      integration
    })
  } catch (error) {
    console.error("Erro ao conectar GitHub:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { message: "userId é obrigatório" },
        { status: 400 }
      )
    }

    const integration = await prisma.integration.findFirst({
      where: {
        userId: userId,
        type: "github",
        isActive: true
      }
    })

    if (!integration) {
      return NextResponse.json(
        { message: "Integração GitHub não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      accessToken: integration.accessToken,
      isActive: integration.isActive
    })
  } catch (error) {
    console.error("Erro ao buscar token do GitHub:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

async function fetchGitHubData(accessToken: string) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/vnd.github.v3+json'
  }

  // Buscar commits dos últimos 30 dias
  const commitsResponse = await fetch(
    `https://api.github.com/user/repos?sort=updated&per_page=100`,
    { headers }
  )

  if (!commitsResponse.ok) {
    throw new Error('Erro ao buscar repositórios do GitHub')
  }

  const repos = await commitsResponse.json()

  // Buscar commits de cada repositório
  const allCommits = []
  for (const repo of repos.slice(0, 10)) { // Limitar a 10 repositórios
    try {
      const commitsResponse = await fetch(
        `https://api.github.com/repos/${repo.full_name}/commits?since=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
        { headers }
      )

      if (commitsResponse.ok) {
        const commits = await commitsResponse.json()
        allCommits.push(...commits.map((commit: any) => ({
          sha: commit.sha,
          message: commit.commit.message,
          date: commit.commit.author.date,
          author: {
            name: commit.commit.author.name,
            email: commit.commit.author.email
          }
        })))
      }
    } catch (error) {
      console.error(`Erro ao buscar commits do repositório ${repo.name}:`, error)
    }
  }

  // Buscar pull requests
  const prsResponse = await fetch(
    `https://api.github.com/search/issues?q=is:pr+author:${repos[0]?.owner?.login || 'user'}+created:>${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
    { headers }
  )

  let pullRequests = []
  if (prsResponse.ok) {
    const prsData = await prsResponse.json()
    pullRequests = prsData.items.map((pr: any) => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      created_at: pr.created_at,
      closed_at: pr.closed_at
    }))
  }

  // Buscar issues
  const issuesResponse = await fetch(
    `https://api.github.com/search/issues?q=is:issue+author:${repos[0]?.owner?.login || 'user'}+created:>${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
    { headers }
  )

  let issues = []
  if (issuesResponse.ok) {
    const issuesData = await issuesResponse.json()
    issues = issuesData.items.map((issue: any) => ({
      number: issue.number,
      title: issue.title,
      state: issue.state,
      created_at: issue.created_at,
      closed_at: issue.closed_at
    }))
  }

  return {
    commits: allCommits,
    pullRequests,
    issues
  }
}
