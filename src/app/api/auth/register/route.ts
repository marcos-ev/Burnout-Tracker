import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Usuário já existe" },
        { status: 400 }
      )
    }

    // Hash da senha para segurança
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    // Criar configurações padrão
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        alertThreshold: 70,
        weeklyReport: true,
        dailyCheckIn: true,
        workHoursStart: 9,
        workHoursEnd: 18,
        maxDailyHours: 10,
        breakReminderMinutes: 60,
      }
    })

    return NextResponse.json(
      { message: "Usuário criado com sucesso" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
