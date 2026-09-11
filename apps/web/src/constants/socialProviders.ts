export type SocialProvider = {
  id: string
  label: string
  iconSrc: string
  iconWidth?: number
  iconHeight?: number
}

export const AUTH_SOCIAL_PROVIDERS: SocialProvider[] = [
  { id: 'github', label: 'Github', iconSrc: '/git-logo.svg', iconWidth: 33, iconHeight: 32 },
  { id: 'google', label: 'Gmail', iconSrc: '/google-logo.svg', iconWidth: 28, iconHeight: 28 },
]
