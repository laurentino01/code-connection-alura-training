import { useState } from 'react'
import type { FormEvent } from 'react'
import { AUTH_SOCIAL_PROVIDERS, type SocialProvider } from '@/constants/socialProviders'
import { ArrowRightIcon } from '@/components/atoms/ArrowRightIcon'
import { Button } from '@/components/atoms/Button'
import { Heading } from '@/components/atoms/Heading'
import { LoginIcon } from '@/components/atoms/LoginIcon'
import { Text } from '@/components/atoms/Text'
import { CheckboxField } from '@/components/molecules/CheckboxField'
import { FormField } from '@/components/molecules/FormField'
import { AuthPrompt } from '@/components/molecules/AuthPrompt'
import { SocialAuthSection } from '@/components/organisms/SocialAuthSection'

export type SignupFormValues = {
  name: string
  email: string
  password: string
  rememberMe: boolean
}

export type SignupFormProps = {
  onSubmit: (values: SignupFormValues) => void | Promise<void>
  onSocialSelect?: (providerId: string) => void
  isSubmitting?: boolean
  errorMessage?: string
  socialProviders?: SocialProvider[]
  loginTo?: string
}

export function SignupForm({
  onSubmit,
  onSocialSelect,
  isSubmitting = false,
  errorMessage,
  socialProviders = AUTH_SOCIAL_PROVIDERS,
  loginTo = '/login',
}: SignupFormProps) {
  const [values, setValues] = useState<SignupFormValues>({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Heading level={1} size="lg">
            Cadastro
          </Heading>
          <Text size="subtitle">Olá! Preencha seus dados.</Text>
        </div>

        <div className="flex flex-col gap-4">
          <FormField
            id="name"
            label="Nome"
            placeholder="Nome completo"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            required
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Digite seu email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            required
          />

          <div className="flex flex-col gap-2">
            <FormField
              id="password"
              label="Senha"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />

            <CheckboxField
              id="remember-me"
              label="Lembrar-me"
              checked={values.rememberMe}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, rememberMe: event.target.checked }))
              }
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <Text as="span" size="label" className="text-red-400">
          {errorMessage}
        </Text>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isSubmitting}
        iconRight={<ArrowRightIcon />}
      >
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
      </Button>

      <SocialAuthSection
        label="ou entre com outras contas"
        providers={socialProviders}
        onSelect={onSocialSelect}
      />

      <AuthPrompt
        message="Já tem conta?"
        linkLabel="Faça seu login!"
        to={loginTo}
        layout="inline"
        icon={<LoginIcon />}
      />
    </form>
  )
}
