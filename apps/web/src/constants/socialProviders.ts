export type SocialProvider = {
  id: string
  label: string
  iconSrc: string
}

export const AUTH_SOCIAL_PROVIDERS: SocialProvider[] = [
  { id: 'github', label: 'Github', iconSrc: '/git-logo.svg' },
  { id: 'google', label: 'Gmail', iconSrc: '/google-logo.svg' },
]
