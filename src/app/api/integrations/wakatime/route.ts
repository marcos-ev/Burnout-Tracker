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

    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { message: "API Key é obrigatória" },
        { status: 400 }
      )
    }

    // Salvar integração no banco
    const integration = await prisma.integration.upsert({
      where: {
        userId_type: {
          userId: session.user.id,
          type: "wakatime"
        }
      },
      update: {
        accessToken: apiKey,
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        type: "wakatime",
        accessToken: apiKey,
        isActive: true
      }
    })

    return NextResponse.json({
      message: "Integração WakaTime conectada com sucesso",
      integration
    })
  } catch (error) {
    console.error("Erro ao conectar WakaTime:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      )
    }

    // Buscar dados do WakaTime
    const integration = await prisma.integration.findFirst({
      where: {
        userId: session.user.id,
        type: "wakatime",
        isActive: true
      }
    })

    if (!integration) {
      return NextResponse.json(
        { message: "Integração WakaTime não encontrada" },
        { status: 404 }
      )
    }

    // Buscar dados do WakaTime
    const wakaTimeData = await fetchWakaTimeData(integration.accessToken)

    return NextResponse.json(wakaTimeData)
  } catch (error) {
    console.error("Erro ao buscar dados do WakaTime:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

async function fetchWakaTimeData(apiKey: string) {
  const headers = {
    'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`,
    'Accept': 'application/json'
  }

  // Buscar dados dos últimos 7 dias (gratuito)
  const summariesResponse = await fetch(
    `https://wakatime.com/api/v1/users/current/summaries?start=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&end=${new Date().toISOString().split('T')[0]}`,
    { headers }
  )

  if (!summariesResponse.ok) {
    throw new Error('Erro ao buscar dados do WakaTime')
  }

  const summariesData = await summariesResponse.json()

  // Buscar sessões de hoje
  const todayResponse = await fetch(
    `https://wakatime.com/api/v1/users/current/durations?date=${new Date().toISOString().split('T')[0]}`,
    { headers }
  )

  let sessions = []
  if (todayResponse.ok) {
    const todayData = await todayResponse.json()
    sessions = todayData.data || []
  }

  // Processar dados
  const dailySummaries = summariesData.data || []
  const totalTime = dailySummaries.reduce((total: number, day: any) => total + (day.grand_total?.total_seconds || 0), 0)

  // Calcular sessões longas (mais de 4 horas)
  const longSessions = sessions.filter((session: any) => session.duration > 4 * 60).length

  return {
    daily_summaries: dailySummaries,
    sessions: sessions,
    total_time: totalTime,
    long_sessions: longSessions,
    languages: dailySummaries.flatMap((day: any) => day.languages || []),
    projects: dailySummaries.flatMap((day: any) => day.projects || [])
  }
}