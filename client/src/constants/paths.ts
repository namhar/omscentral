import qs from 'query-string';

type Parameters = {
  [key: string]: string;
};

export const paths = {
  course: (id?: string): string => (id ? `/course/${id}` : '/course/:id'),
  courses: '/courses',
  trends: '/trends',
  error: (code?: number): string => (code ? `/error/${code}` : '/error/:code'),
  landing: '/',
  login: '/login',
  pricing: (toast?: boolean): string =>
    toast ? '/pricing?t=true' : '/pricing',
  privacy: '/privacy',
  recent: '/recent',
  register: '/register',
  resetPassword: '/reset-password',
  review: {
    create: '/review',
    update: (id?: string): string => (id ? `/review/${id}` : '/review/:id'),
  },
  reviews: (params?: Parameters): string =>
    params ? `/reviews?${qs.stringify(params)}` : '/reviews',
  setPassword: '/set-password',
  terms: '/terms',
  userProfile: '/user/profile',
  userSubscription: '/user/subscription',
  userReviews: '/user/reviews',
};
