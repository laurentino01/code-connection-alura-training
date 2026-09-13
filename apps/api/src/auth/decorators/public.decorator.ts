import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route (or an entire controller) as exempt from the global
 * AuthGuard — see the Nest "Security > Authentication" docs.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
