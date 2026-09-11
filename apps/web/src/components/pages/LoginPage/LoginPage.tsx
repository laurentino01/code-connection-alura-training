import { useState } from 'react'
import { AuthCard } from '@/components/organisms/AuthCard'
import { LoginForm, type LoginFormValues } from '@/components/organisms/LoginForm'
import { AuthLayout } from '@/components/templates/AuthLayout'

export function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogin(values: LoginFormValues) {
    setIsSubmitting(true)
    // TODO: integrar com apps/api (POST /auth/login) — frontend-only por enquanto
    await new Promise((resolve) => setTimeout(resolve, 600))
    console.info('login submetido', { identifier: values.identifier, rememberMe: values.rememberMe })
    setIsSubmitting(false)
  }

  return (
    <AuthLayout>
      <AuthCard
        image={{
          src: '/login-banner.png',
          alt: 'Profissional de tecnologia sorrindo em frente ao computador',
        }}
      >
        <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />
      </AuthCard>
    </AuthLayout>
  )
}
