import { useState } from 'react'
import type { FormEvent } from 'react'
import { AUTH_SOCIAL_PROVIDERS, type SocialProvider } from '@/constants/socialProviders'
import { ArrowRightIcon } from '@/components/atoms/ArrowRightIcon'
import { Button } from '@/components/atoms/Button'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { TextLink } from '@/components/atoms/TextLink'
import { CheckboxField } from '@/components/molecules/CheckboxField'
import { FormField } from '@/components/molecules/FormField'
import { AuthPrompt } from '@/components/molecules/AuthPrompt'
import { SocialAuthSection } from '@/components/organisms/SocialAuthSection'

export type LoginFormValues = {
  identifier: string
  password: string
  rememberMe: boolean
}

export type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>
  onSocialSelect?: (providerId: string) => void
  isSubmitting?: boolean
  errorMessage?: string
  socialProviders?: SocialProvider[]
  forgotPasswordTo?: string
  signupTo?: string
}

export function LoginForm({
  onSubmit,
  onSocialSelect,
  isSubmitting = false,
  errorMessage,
  socialProviders = AUTH_SOCIAL_PROVIDERS,
  forgotPasswordTo = '/recuperar-senha',
  signupTo = '/cadastro',
}: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({
    identifier: '',
    password: '',
    rememberMe: false,
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Heading level={1} size="lg">
          Login
        </Heading>
        <Text tone="muted">Boas-vindas! Faça seu login.</Text>
      </div>

      <FormField
        id="identifier"
        label="Email ou usuário"
        placeholder="usuario123"
        autoComplete="username"
        value={values.identifier}
        onChange={(event) => setValues((prev) => ({ ...prev, identifier: event.target.value }))}
        required
      />

      <FormField
        id="password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
        required
      />

      <div className="flex items-center justify-between">
        <CheckboxField
          id="remember-me"
          label="Lembre-me"
          checked={values.rememberMe}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, rememberMe: event.target.checked }))
          }
        />
        <TextLink to={forgotPasswordTo} tone="muted" size="xs">
          Esqueci a senha
        </TextLink>
      </div>

      {errorMessage && (
        <Text as="span" size="xs" className="text-red-400">
          {errorMessage}
        </Text>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting} iconRight={<ArrowRightIcon />}>
        {isSubmitting ? 'Entrando...' : 'Login'}
      </Button>

      <SocialAuthSection
        label="ou entre com outras contas"
        providers={socialProviders}
        onSelect={onSocialSelect}
      />

      <AuthPrompt message="Ainda não tem conta?" linkLabel="Crie seu cadastro!" to={signupTo} />
    </form>
  )
}
