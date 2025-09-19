"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    await signIn("github", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Burnout Tracker</CardTitle>
          <CardDescription>
            Conecte sua conta do GitHub para começar a monitorar sua saúde mental
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Conecte sua conta do GitHub para começar a monitorar sua saúde mental como desenvolvedor
            </p>
            <Button
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Github className="w-4 h-4 mr-2" />
              {isLoading ? "Conectando..." : "Conectar com GitHub"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
