export interface BurnoutScore {
  id: string
  userId: string
  score: number
  lateNightWork: number
  weekendWork: number
  longSessions: number
  highFrequency: number
  lowBreaks: number
  stressIndicators: number
  createdAt: Date
}

export interface Integration {
  id: string
  userId: string
  type: 'github' | 'wakatime' | 'rescuetime'
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Alert {
  id: string
  userId: string
  type: 'warning' | 'critical' | 'info'
  message: string
  isRead: boolean
  createdAt: Date
}

export interface UserSettings {
  id: string
  userId: string
  alertThreshold: number
  weeklyReport: boolean
  dailyCheckIn: boolean
  workHoursStart: number
  workHoursEnd: number
  maxDailyHours: number
  breakReminderMinutes: number
  createdAt: Date
  updatedAt: Date
}

export interface GitHubData {
  commits: {
    sha: string
    message: string
    date: string
    author: {
      name: string
      email: string
    }
  }[]
  pullRequests: {
    number: number
    title: string
    state: string
    created_at: string
    closed_at?: string
  }[]
  issues: {
    number: number
    title: string
    state: string
    created_at: string
    closed_at?: string
  }[]
}

export interface WakaTimeData {
  sessions: {
    id: string
    duration: number
    project: string
    language: string
    start_time: string
    end_time: string
  }[]
  daily_summaries: {
    date: string
    total_time: number
    languages: {
      name: string
      total_seconds: number
    }[]
  }[]
}

export interface RescueTimeData {
  activities: {
    date: string
    total_time: number
    productivity: number
    categories: {
      name: string
      time: number
      productivity: number
    }[]
  }[]
}

export interface BurnoutAnalysis {
  score: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  factors: {
    lateNightWork: number
    weekendWork: number
    longSessions: number
    highFrequency: number
    lowBreaks: number
    stressIndicators: number
  }
  recommendations: string[]
  trends: {
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }

  interface User {
    id: string
  }
}
