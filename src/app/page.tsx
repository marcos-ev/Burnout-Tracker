import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Shield,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Github,
  Linkedin,
  Zap
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Burnout Tracker</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/signup">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 MVP Lançado
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Monitore sua saúde mental como{" "}
            <span className="text-blue-600">desenvolvedor</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Prevenha burnout através de análise de dados reais do seu trabalho.
            Conecte seu GitHub para insights personalizados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                <Zap className="w-4 h-4 mr-2" />
                Começar Agora
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-lg text-gray-600">
              Conecte suas ferramentas e receba insights em tempo real
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Github className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Conecte suas ferramentas</CardTitle>
                <CardDescription>
                  GitHub para análise completa
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Análise inteligente</CardTitle>
                <CardDescription>
                  Algoritmo que detecta padrões de burnout em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Alertas preventivos</CardTitle>
                <CardDescription>
                  Notificações quando você está se aproximando do limite
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de desenvolvedores que já monitoram sua saúde mental
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              <Zap className="w-4 h-4 mr-2" />
              Começar Grátis Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">Burnout Tracker</span>
          </div>
          <p className="text-gray-400 mb-4">
            Monitorando a saúde mental de desenvolvedores desde 2024
          </p>
        </div>
      </footer>
    </div>
  )
}