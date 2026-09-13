import { configureAxe } from 'jest-axe'

/**
 * axe-core run limited to WCAG 2.0/2.1/2.2 rules at Level A and Level AA
 * ("Nível 2"). AA is cumulative on A, so both tag families are included.
 */
export const axe = configureAxe({
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
  },
})

export { toHaveNoViolations } from 'jest-axe'
