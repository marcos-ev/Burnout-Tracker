import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      )
    }

    const { githubData, wakaTimeData, rescueTimeData } = await request.json()

    // Calcular score de burnout
    const burnoutScore = calculateBurnoutScore(githubData, wakaTimeData, rescueTimeData)

    // Salvar no banco
    const savedScore = await prisma.burnoutScore.create({
      data: {
        userId: session.user.id,
        score: burnoutScore.score,
        lateNightWork: burnoutScore.factors.lateNightWork,
        weekendWork: burnoutScore.factors.weekendWork,
        longSessions: burnoutScore.factors.longSessions,
        highFrequency: burnoutScore.factors.highFrequency,
        lowBreaks: burnoutScore.factors.lowBreaks,
        stressIndicators: burnoutScore.factors.stressIndicators
      }
    })

    // Verificar se precisa criar alerta
    if (burnoutScore.score > 70) {
      await prisma.alert.create({
        data: {
          userId: session.user.id,
          type: burnoutScore.score > 85 ? "critical" : "warning",
          message: `Seu score de burnout está em ${burnoutScore.score}. Considere fazer uma pausa.`
        }
      })
    }

    return NextResponse.json({
      score: savedScore,
      analysis: burnoutScore
    })
  } catch (error) {
    console.error("Erro ao calcular burnout:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

function calculateBurnoutScore(githubData: any, wakaTimeData: any, rescueTimeData: any) {
  let lateNightWork = 0
  let weekendWork = 0
  let longSessions = 0
  let highFrequency = 0
  let lowBreaks = 0
  let stressIndicators = 0

  // Análise de commits noturnos (22h - 6h)
  if (githubData?.commits) {
    const nightCommits = githubData.commits.filter((commit: any) => {
      const hour = new Date(commit.date).getHours()
      return hour >= 22 || hour <= 6
    }).length

    lateNightWork = Math.min(25, nightCommits * 2) // Máximo 25 pontos
  }

  // Análise de trabalho no fim de semana
  if (githubData?.commits) {
    const weekendCommits = githubData.commits.filter((commit: any) => {
      const day = new Date(commit.date).getDay()
      return day === 0 || day === 6 // Domingo ou Sábado
    }).length

    weekendWork = Math.min(20, weekendCommits * 3) // Máximo 20 pontos
  }

  // Análise de sessões longas (WakaTime)
  if (wakaTimeData?.sessions) {
    const longSessionsCount = wakaTimeData.sessions.filter((session: any) => {
      return session.duration > 4 * 60 // Mais de 4 horas
    }).length

    longSessions = Math.min(20, longSessionsCount * 4) // Máximo 20 pontos
  }

  // Análise de alta frequência de commits
  if (githubData?.commits) {
    const commitsPerDay = githubData.commits.length / 30 // Últimos 30 dias
    if (commitsPerDay > 10) {
      highFrequency = Math.min(15, (commitsPerDay - 10) * 2) // Máximo 15 pontos
    }
  }

  // Análise de pausas (RescueTime)
  if (rescueTimeData?.activities) {
    const totalBreakTime = rescueTimeData.activities.reduce((total: number, activity: any) => {
      return total + (activity.categories?.find((cat: any) => cat.name === "Break")?.time || 0)
    }, 0)

    const avgBreakTime = totalBreakTime / rescueTimeData.activities.length
    if (avgBreakTime < 30) { // Menos de 30 min de pausa por dia
      lowBreaks = Math.min(10, (30 - avgBreakTime) * 0.5) // Máximo 10 pontos
    }
  }

  // Indicadores de estresse (combinação de fatores)
  if (githubData?.issues) {
    const openIssues = githubData.issues.filter((issue: any) => issue.state === "open").length
    stressIndicators = Math.min(10, openIssues * 2) // Máximo 10 pontos
  }

  const totalScore = lateNightWork + weekendWork + longSessions + highFrequency + lowBreaks + stressIndicators

  // Determinar nível de risco
  let riskLevel = "low"
  if (totalScore > 85) riskLevel = "critical"
  else if (totalScore > 70) riskLevel = "high"
  else if (totalScore > 50) riskLevel = "medium"

  // Gerar recomendações
  const recommendations = []
  if (lateNightWork > 15) {
    recommendations.push("Tente evitar trabalhar após as 22h")
  }
  if (weekendWork > 10) {
    recommendations.push("Considere reduzir o trabalho nos fins de semana")
  }
  if (longSessions > 15) {
    recommendations.push("Faça pausas de 15 minutos a cada 2 horas")
  }
  if (highFrequency > 10) {
    recommendations.push("Reduza a frequência de commits para evitar sobrecarga")
  }
  if (lowBreaks > 5) {
    recommendations.push("Aumente o tempo de pausas durante o trabalho")
  }

  return {
    score: Math.min(100, totalScore),
    riskLevel,
    factors: {
      lateNightWork,
      weekendWork,
      longSessions,
      highFrequency,
      lowBreaks,
      stressIndicators
    },
    recommendations
  }
}
