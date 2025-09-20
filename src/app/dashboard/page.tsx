"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Github,
  Plus,
  LogOut,
  User
} from "lucide-react"
import { BurnoutAnalysis } from "@/types"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [burnoutData, setBurnoutData] = useState<BurnoutAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [githubConnected, setGithubConnected] = useState(false)
  const [realData, setRealData] = useState<any>(null)

  // Função para gerar frases motivacionais baseadas no nível de stress
  const getMotivationalPhrases = (score: number) => {
    if (score >= 80) {
      // Alto stress - frases de cuidado e urgência
      return [
        {
          text: "É hora de parar e respirar. Seu bem-estar é mais importante que qualquer código.",
          bgColor: "from-red-50 to-pink-50",
          textColor: "text-red-800"
        },
        {
          text: "Burnout não é um troféu. Cuide-se como cuidaria de um amigo querido.",
          bgColor: "from-orange-50 to-red-50",
          textColor: "text-orange-800"
        },
        {
          text: "Você não é uma máquina. Pausas não são preguiça, são necessárias.",
          bgColor: "from-yellow-50 to-orange-50",
          textColor: "text-yellow-800"
        },
        {
          text: "Peça ajuda. Ninguém consegue carregar o mundo sozinho.",
          bgColor: "from-pink-50 to-purple-50",
          textColor: "text-pink-800"
        }
      ]
    } else if (score >= 60) {
      // Stress moderado - frases de alerta e cuidado
      return [
        {
          text: "Você está no limite. Que tal uma pausa para recarregar as energias?",
          bgColor: "from-yellow-50 to-orange-50",
          textColor: "text-yellow-800"
        },
        {
          text: "Equilíbrio é a chave. Trabalhe com paixão, mas viva com propósito.",
          bgColor: "from-blue-50 to-indigo-50",
          textColor: "text-blue-800"
        },
        {
          text: "Cada linha de código que você escreve é valiosa, mas sua saúde é inestimável.",
          bgColor: "from-green-50 to-blue-50",
          textColor: "text-green-800"
        },
        {
          text: "Lembre-se: você é humano, não um algoritmo. Permita-se ser imperfeito.",
          bgColor: "from-purple-50 to-pink-50",
          textColor: "text-purple-800"
        }
      ]
    } else if (score >= 40) {
      // Stress baixo - frases de manutenção e crescimento
      return [
        {
          text: "Você está no caminho certo! Continue cuidando do seu equilíbrio.",
          bgColor: "from-green-50 to-blue-50",
          textColor: "text-green-800"
        },
        {
          text: "Cada erro é uma oportunidade de aprender. Cada bug é um professor disfarçado.",
          bgColor: "from-indigo-50 to-purple-50",
          textColor: "text-indigo-800"
        },
        {
          text: "O código que você escreve hoje é o legado que você deixa amanhã. Faça com amor.",
          bgColor: "from-blue-50 to-cyan-50",
          textColor: "text-blue-800"
        },
        {
          text: "Você não precisa ser o melhor desenvolvedor do mundo. Apenas seja melhor que ontem.",
          bgColor: "from-cyan-50 to-teal-50",
          textColor: "text-cyan-800"
        }
      ]
    } else {
      // Baixo stress - frases de celebração e motivação
      return [
        {
          text: "Parabéns! Você está mantendo um excelente equilíbrio entre trabalho e vida pessoal.",
          bgColor: "from-green-50 to-emerald-50",
          textColor: "text-green-800"
        },
        {
          text: "Sua disciplina e autocuidado são inspiradores. Continue assim!",
          bgColor: "from-emerald-50 to-teal-50",
          textColor: "text-emerald-800"
        },
        {
          text: "Você é um exemplo de como ser produtivo sem se sacrificar. Inspire outros!",
          bgColor: "from-teal-50 to-cyan-50",
          textColor: "text-teal-800"
        },
        {
          text: "O sucesso não é apenas sobre o que você conquista, mas como você vive no processo.",
          bgColor: "from-cyan-50 to-blue-50",
          textColor: "text-cyan-800"
        }
      ]
    }
  }

  const fetchBurnoutData = useCallback(async () => {
    try {
      setIsLoading(true)

      if ((session?.user as any)?.id) {
        try {
          const tokenResponse = await fetch(`/api/integrations/github?userId=${(session?.user as any)?.id}`)

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json()

            if (tokenData.accessToken) {
              // Teste direto da API
              try {
                const testResponse = await fetch('https://api.github.com/user', {
                  headers: {
                    'Authorization': `Bearer ${tokenData.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                  }
                })
                const userData = await testResponse.json()
              } catch (error) {
              }

              const githubData = await fetchGitHubDataDirect(tokenData.accessToken)
              setRealData(githubData)
              const burnoutScore = calculateBurnoutFromGitHub(githubData)
              setBurnoutData(burnoutScore)
              return
            }
          } else {
            const errorText = await tokenResponse.text()
          }

        } catch (error) {
        }
      }

      const mockData = {
        commits: [
          {
            sha: "abc123",
            message: "feat: adicionar nova funcionalidade",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            author: { name: session?.user?.name, email: session?.user?.email }
          },
          {
            sha: "def456",
            message: "fix: corrigir bug crítico",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            author: { name: session?.user?.name, email: session?.user?.email }
          },
          {
            sha: "ghi789",
            message: "refactor: melhorar performance",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            author: { name: session?.user?.name, email: session?.user?.email }
          }
        ],
        issues: [
          { number: 1, title: "Bug no sistema de login", state: "open", created_at: new Date().toISOString() },
          { number: 2, title: "Melhoria na UX", state: "closed", created_at: new Date().toISOString() }
        ]
      }

      const burnoutScore = calculateBurnoutFromGitHub(mockData)
      setBurnoutData(burnoutScore)
      return
    } catch (error) {
      setBurnoutData({
        score: 0,
        riskLevel: "low",
        factors: {
          lateNightWork: 0,
          weekendWork: 0,
          longSessions: 0,
          highFrequency: 0,
          lowBreaks: 0,
          stressIndicators: 0
        },
        recommendations: [
          "Erro ao conectar com GitHub",
          "Verifique suas configurações"
        ],
        trends: {
          daily: [0, 0, 0, 0, 0, 0, 0],
          weekly: [0, 0, 0, 0],
          monthly: [0, 0]
        }
      })
    } finally {
      setIsLoading(false)
    }
  }, [session?.user])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      setGithubConnected(session?.user?.email?.includes('@') || false)
      fetchBurnoutData()
    }
  }, [session, fetchBurnoutData])

  useEffect(() => {
    if (burnoutData && burnoutData.score > 0) {
      setGithubConnected(true)
    }
  }, [burnoutData])

  const fetchGitHubDataDirect = async (accessToken: string) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json'
    }

    const reposResponse = await fetch(
      `https://api.github.com/user/repos?sort=updated&per_page=100&visibility=all`,
      { headers }
    )

    if (!reposResponse.ok) {
      const errorText = await reposResponse.text()
      throw new Error('Erro ao buscar repositórios do GitHub')
    }

    const repos = await reposResponse.json()

    const allCommits = []
    const sinceDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

    for (const repo of repos.slice(0, 10)) {
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?since=${sinceDate}`,
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
        } else {
          const errorText = await commitsResponse.text()
        }
      } catch (error) {
      }
    }

    // Buscar commits via eventos do usuário (inclui repositórios privados)
    try {
      const eventsResponse = await fetch(
        `https://api.github.com/users/${repos[0]?.owner?.login || 'user'}/events?per_page=100`,
        { headers }
      )

      if (eventsResponse.ok) {
        const events = await eventsResponse.json()
        const pushEvents = events.filter((event: any) =>
          event.type === 'PushEvent' &&
          new Date(event.created_at) >= new Date(sinceDate)
        )

        pushEvents.forEach((event: any) => {
          if (event.payload.commits) {
            event.payload.commits.forEach((commit: any) => {
              allCommits.push({
                sha: commit.sha,
                message: commit.message,
                date: commit.timestamp || event.created_at,
                author: {
                  name: commit.author.name,
                  email: commit.author.email
                }
              })
            })
          }
        })
      }
    } catch (error) {
    }

    const issuesResponse = await fetch(
      `https://api.github.com/search/issues?q=is:issue+author:${repos[0]?.owner?.login || 'user'}+created:>${sinceDate}`,
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


    const result = {
      commits: allCommits,
      issues
    }

    return result
  }

  const calculateBurnoutFromGitHub = (githubData: any) => {
    let lateNightWork = 0
    let weekendWork = 0
    let highFrequency = 0
    let stressIndicators = 0

    if (githubData.commits) {
      const commits = githubData.commits

      const nightCommits = commits.filter((commit: any) => {
        const hour = new Date(commit.date).getHours()
        return hour >= 22 || hour <= 6
      }).length
      lateNightWork = Math.min(25, nightCommits * 2)


      const weekendCommits = commits.filter((commit: any) => {
        const day = new Date(commit.date).getDay()
        return day === 0 || day === 6
      }).length
      weekendWork = Math.min(20, weekendCommits * 3)

      const commitsPerDay = commits.length / 90
      if (commitsPerDay > 10) {
        highFrequency = Math.min(15, (commitsPerDay - 10) * 2)
      }
    }

    if (githubData?.issues) {
      const openIssues = githubData.issues.filter((issue: any) => issue.state === "open").length
      stressIndicators = Math.min(10, openIssues * 2)
    }

    let longSessions = 0
    if (githubData.commits) {
      const commitsPerDay = githubData.commits.length / 90
      if (commitsPerDay > 15) {
        longSessions = Math.min(20, (commitsPerDay - 15) * 2)
      }
    }

    const totalScore = lateNightWork + weekendWork + longSessions + highFrequency + stressIndicators

    let riskLevel: "low" | "medium" | "high" | "critical" = "low"
    if (totalScore > 85) riskLevel = "critical"
    else if (totalScore > 70) riskLevel = "high"
    else if (totalScore > 50) riskLevel = "medium"

    const recommendations = []
    if (lateNightWork > 15) recommendations.push("Tente evitar trabalhar após as 22h")
    if (weekendWork > 10) recommendations.push("Considere reduzir o trabalho nos fins de semana")
    if (highFrequency > 10) recommendations.push("Reduza a frequência de commits para evitar sobrecarga")
    if (longSessions > 15) recommendations.push("Faça pausas de 15 minutos a cada 2 horas")
    if (stressIndicators > 5) recommendations.push("Resolva issues pendentes para reduzir estresse")

    if (recommendations.length === 0) {
      recommendations.push("Continue mantendo um bom equilíbrio!")
    }

    return {
      score: Math.min(100, totalScore),
      riskLevel,
      factors: {
        lateNightWork,
        weekendWork,
        longSessions,
        highFrequency,
        lowBreaks: 0,
        stressIndicators
      },
      recommendations,
      trends: {
        daily: [totalScore, totalScore, totalScore, totalScore, totalScore, totalScore, totalScore],
        weekly: [totalScore, totalScore, totalScore, totalScore],
        monthly: [totalScore, totalScore]
      }
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500"
      case "medium": return "bg-yellow-500"
      case "high": return "bg-orange-500"
      case "critical": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getRiskText = (level: string) => {
    switch (level) {
      case "low": return "Baixo Risco"
      case "medium": return "Risco Médio"
      case "high": return "Alto Risco"
      case "critical": return "Risco Crítico"
      default: return "Desconhecido"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Burnout Tracker</span>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Image
                    src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || session?.user?.email || 'User')}&background=random`}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      console.log('Erro ao carregar avatar:', e);
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || session?.user?.email || 'User')}&background=random`;
                    }}
                    onLoad={() => console.log('Avatar carregado com sucesso:', session.user?.image)}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {session?.user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo da sua saúde mental como desenvolvedor
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Burnout Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Score de Burnout</span>
                  <Badge
                    variant={burnoutData?.riskLevel === "critical" ? "destructive" : "secondary"}
                    className={getRiskColor(burnoutData?.riskLevel || "low")}
                  >
                    {getRiskText(burnoutData?.riskLevel || "low")}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Análise completa da sua atividade no GitHub nos últimos 90 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {burnoutData?.score || 0}
                    </div>
                    <div className="text-sm text-gray-600">de 100</div>
                  </div>
                  <Progress
                    value={burnoutData?.score || 0}
                    className="h-3"
                  />
                  <div className="text-sm text-gray-600 text-center">
                    {burnoutData?.score && burnoutData.score > 70
                      ? "⚠️ Atenção: Você está em risco de burnout"
                      : burnoutData?.score && burnoutData.score > 50
                        ? "⚡ Cuidado: Monitore seus padrões de trabalho"
                        : "✅ Tudo bem: Continue mantendo o equilíbrio"
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Factors Grid */}
            <TooltipProvider>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium cursor-help">Trabalho Noturno</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Commits feitos entre 22h e 6h</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {burnoutData?.factors.lateNightWork || 0}/25
                    </div>
                    <Progress value={(burnoutData?.factors.lateNightWork || 0) * 4} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium cursor-help">Trabalho no Fim de Semana</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Commits feitos aos sábados e domingos</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {burnoutData?.factors.weekendWork || 0}/20
                    </div>
                    <Progress value={(burnoutData?.factors.weekendWork || 0) * 5} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium cursor-help">Sessões Longas</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Muitos commits por dia (mais de 15/dia)</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {burnoutData?.factors.longSessions || 0}/20
                    </div>
                    <Progress value={(burnoutData?.factors.longSessions || 0) * 5} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium cursor-help">Alta Frequência</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Muitos commits por dia (mais de 10/dia)</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {burnoutData?.factors.highFrequency || 0}/15
                    </div>
                    <Progress value={(burnoutData?.factors.highFrequency || 0) * 6.67} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium cursor-help">Poucas Pausas</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Baseado em padrões de commits (simplificado)</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {burnoutData?.factors.lowBreaks || 0}/10
                    </div>
                    <Progress value={(burnoutData?.factors.lowBreaks || 0) * 10} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium cursor-help">Indicadores de Estresse</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Issues abertas no GitHub (problemas pendentes)</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {burnoutData?.factors.stressIndicators || 0}/10
                    </div>
                    <Progress value={(burnoutData?.factors.stressIndicators || 0) * 10} className="h-2" />
                  </CardContent>
                </Card>
              </div>
            </TooltipProvider>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                  Recomendações
                </CardTitle>
                <CardDescription>
                  Sugestões baseadas na sua análise atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {burnoutData?.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                  Conecte suas ferramentas para análise completa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Github className="w-8 h-8 text-gray-900" />
                      <div>
                        <h3 className="font-medium">GitHub</h3>
                        <p className="text-sm text-gray-600">Análise de commits e PRs</p>
                      </div>
                    </div>
                    {githubConnected ? (
                      <Button variant="outline" size="sm" disabled className="bg-green-50 border-green-200 text-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Conectado
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = '/api/auth/signin?callbackUrl=/dashboard'}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Conectar
                      </Button>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Estatísticas Detalhadas - Últimos 90 Dias</CardTitle>
                <CardDescription>
                  Análise completa da sua atividade no GitHub
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Cards Principais */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {realData?.commits?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Total de Commits</div>
                    <div className="text-xs text-blue-500 mt-1">
                      {realData?.commits ? Math.round(realData.commits.length / 90 * 10) / 10 : 0} por dia
                    </div>
                  </div>

                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {realData?.issues?.filter((issue: any) => issue.state === "closed").length || 0}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Issues Resolvidas</div>
                    <div className="text-xs text-green-500 mt-1">
                      {realData?.issues ? Math.round((realData.issues.filter((issue: any) => issue.state === "closed").length / 90) * 10) / 10 : 0} por dia
                    </div>
                  </div>

                  <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {realData?.issues?.filter((issue: any) => issue.state === "open").length || 0}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Issues Abertas</div>
                    <div className="text-xs text-orange-500 mt-1">
                      Pendentes para resolver
                    </div>
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {realData?.commits ?
                        new Set(realData.commits.map((commit: any) =>
                          new Date(commit.date).toDateString()
                        )).size : 0
                      }
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Dias Ativos</div>
                    <div className="text-xs text-purple-500 mt-1">
                      {realData?.commits ?
                        Math.round((new Set(realData.commits.map((commit: any) =>
                          new Date(commit.date).toDateString()
                        )).size / 90) * 100) : 0
                      }% dos últimos 90 dias
                    </div>
                  </div>
                </div>

                {/* Análise Detalhada */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  {/* Padrões de Trabalho */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">🕐 Padrões de Trabalho</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Commits Noturnos</span>
                          <div className="text-xs text-gray-500">22h - 6h</div>
                        </div>
                        <span className="text-xl font-bold text-red-600">
                          {realData?.commits?.filter((commit: any) => {
                            const hour = new Date(commit.date).getHours()
                            return hour >= 22 || hour <= 6
                          }).length || 0}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Fins de Semana</span>
                          <div className="text-xs text-gray-500">Sábado e Domingo</div>
                        </div>
                        <span className="text-xl font-bold text-orange-600">
                          {realData?.commits?.filter((commit: any) => {
                            const day = new Date(commit.date).getDay()
                            return day === 0 || day === 6
                          }).length || 0}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Horário Comercial</span>
                          <div className="text-xs text-gray-500">9h - 18h</div>
                        </div>
                        <span className="text-xl font-bold text-yellow-600">
                          {realData?.commits?.filter((commit: any) => {
                            const hour = new Date(commit.date).getHours()
                            return hour >= 9 && hour <= 18
                          }).length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Análise de Produtividade */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">📈 Produtividade</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-blue-800 mb-1">Maior Sequência</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {realData?.commits ?
                            Math.max(...Array.from({ length: 90 }, (_, i) => {
                              const date = new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000)
                              const dayCommits = realData.commits.filter((commit: any) =>
                                new Date(commit.date).toDateString() === date.toDateString()
                              ).length
                              return dayCommits
                            })) : 0
                          } commits
                        </div>
                        <div className="text-xs text-blue-600">em um único dia</div>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm font-medium text-green-800 mb-1">Sequência Ativa</div>
                        <div className="text-2xl font-bold text-green-600">
                          {realData?.commits ?
                            (() => {
                              let maxStreak = 0
                              let currentStreak = 0
                              for (let i = 89; i >= 0; i--) {
                                const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
                                const hasCommits = realData.commits.some((commit: any) =>
                                  new Date(commit.date).toDateString() === date.toDateString()
                                )
                                if (hasCommits) {
                                  currentStreak++
                                  maxStreak = Math.max(maxStreak, currentStreak)
                                } else {
                                  currentStreak = 0
                                }
                              }
                              return maxStreak
                            })() : 0
                          } dias
                        </div>
                        <div className="text-xs text-green-600">consecutivos com commits</div>
                      </div>
                    </div>
                  </div>

                  {/* Resumo de Issues */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">🎯 Issues & PRs</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm font-medium text-green-800 mb-1">Taxa de Resolução</div>
                        <div className="text-2xl font-bold text-green-600">
                          {realData?.issues ?
                            Math.round((realData.issues.filter((issue: any) => issue.state === "closed").length /
                              Math.max(realData.issues.length, 1)) * 100) : 0
                          }%
                        </div>
                        <div className="text-xs text-green-600">issues resolvidas</div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-sm font-medium text-purple-800 mb-1">Tempo Médio</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {realData?.issues?.filter((issue: any) => issue.closed_at) ?
                            Math.round(realData.issues.filter((issue: any) => issue.closed_at)
                              .reduce((acc: number, issue: any) => {
                                const created = new Date(issue.created_at)
                                const closed = new Date(issue.closed_at)
                                return acc + (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
                              }, 0) / realData.issues.filter((issue: any) => issue.closed_at).length) || 0
                            : 0} dias
                        </div>
                        <div className="text-xs text-purple-600">para resolver issues</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distribuição por Dia da Semana */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Distribuição por Dia da Semana</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => {
                      const dayCommits = realData?.commits?.filter((commit: any) =>
                        new Date(commit.date).getDay() === index
                      ).length || 0
                      const maxCommits = Math.max(...(realData?.commits ?
                        Array.from({ length: 7 }, (_, i) =>
                          realData.commits.filter((commit: any) =>
                            new Date(commit.date).getDay() === i
                          ).length
                        ) : [0]))
                      const percentage = maxCommits > 0 ? (dayCommits / maxCommits) * 100 : 0

                      return (
                        <div key={day} className="text-center">
                          <div className="text-xs text-gray-600 mb-2">{day}</div>
                          <div className="bg-gray-200 rounded h-20 flex items-end justify-center">
                            <div
                              className="bg-blue-500 rounded-t w-full transition-all duration-300"
                              style={{ height: `${Math.max(percentage, 5)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs font-medium text-gray-700 mt-1">{dayCommits}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>💡 Insights e Motivação</CardTitle>
                <CardDescription>
                  Dicas para manter sua saúde mental como desenvolvedor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-600">🌱 Mentalidade Saudável</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                          <p className="text-sm text-green-800">
                            <strong>Não se compare com outros devs.</strong> Cada pessoa tem seu ritmo,
                            suas circunstâncias e seus objetivos únicos.
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm text-blue-800">
                            <strong>Progresso &gt; Perfeição.</strong> Um commit por dia é melhor que
                            100 commits em um dia e depois 2 semanas sem nada.
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                          <p className="text-sm text-purple-800">
                            <strong>Descanso é produtividade.</strong> Seu cérebro precisa de pausas
                            para processar e consolidar o aprendizado.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-600">⚡ Dicas Práticas</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-800">
                            <strong>Pomodoro:</strong> 25min focado + 5min pausa.
                            Seu cérebro agradece!
                          </p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Commits pequenos:</strong> Melhor 5 commits pequenos
                            que 1 commit gigante.
                          </p>
                        </div>
                        <div className="p-4 bg-pink-50 rounded-lg">
                          <p className="text-sm text-pink-800">
                            <strong>Celebre pequenas vitórias:</strong> Cada bug resolvido,
                            cada feature implementada é uma conquista!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-4">🎯 Frases Motivacionais</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {getMotivationalPhrases(burnoutData?.score || 0).map((phrase, index) => (
                        <div key={index} className={`p-4 bg-gradient-to-r ${phrase.bgColor} rounded-lg`}>
                          <p className={`text-sm ${phrase.textColor} italic`}>
                            &ldquo;{phrase.text}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

