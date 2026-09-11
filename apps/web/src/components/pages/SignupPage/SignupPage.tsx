import { useState } from 'react'
import { AuthCard } from '@/components/organisms/AuthCard'
import { SignupForm, type SignupFormValues } from '@/components/organisms/SignupForm'
import { AuthLayout } from '@/components/templates/AuthLayout'

export function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSignup(values: SignupFormValues) {
    setIsSubmitting(true)
    // TODO: integrar com apps/api (POST /auth/cadastro) — frontend-only por enquanto
    await new Promise((resolve) => setTimeout(resolve, 600))
    console.info('cadastro submetido', { name: values.name, email: values.email })
    setIsSubmitting(false)
  }

  return (
    <AuthLayout>
      <AuthCard
        image={{
          src: '/signup-banner.png',
          alt: 'Profissional de tecnologia analisando dados em um ambiente futurista',
        }}
      >
        <SignupForm onSubmit={handleSignup} isSubmitting={isSubmitting} />
      </AuthCard>
    </AuthLayout>
  )
}
