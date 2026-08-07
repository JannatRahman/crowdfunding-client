export const ROLES = {
  SUPPORTER: 'supporter',
  CREATOR: 'creator',
  ADMIN: 'admin',
};

export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  FUNDED: 'funded',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
};

export const CAMPAIGN_CATEGORIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'art', label: 'Art' },
  { value: 'community', label: 'Community' },
  { value: 'environment', label: 'Environment' },
  { value: 'other', label: 'Other' },
];

export const WITHDRAWAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
};

export const REPORT_REASONS = [
  { value: 'fraud', label: 'Fraud' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Other' },
];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CAMPAIGNS: '/campaigns',
  CAMPAIGN_DETAIL: (id) => `/campaigns/${id}`,
  DASHBOARD: '/dashboard',
  SUPPORTER_DASHBOARD: '/dashboard/supporter',
  SUPPORTER_CONTRIBUTIONS: '/dashboard/supporter/contributions',
  SUPPORTER_SAVED: '/dashboard/supporter/saved',
  SUPPORTER_PURCHASE_CREDIT: '/dashboard/supporter/purchase-credit',
  SUPPORTER_PAYMENT_HISTORY: '/dashboard/supporter/payment-history',
  CREATOR_DASHBOARD: '/dashboard/creator',
  CREATOR_CAMPAIGNS: '/dashboard/creator/campaigns',
  CREATOR_NEW_CAMPAIGN: '/dashboard/creator/campaigns/new',
  CREATOR_EDIT_CAMPAIGN: (id) => `/dashboard/creator/campaigns/${id}/edit`,
  CREATOR_WITHDRAWALS: '/dashboard/creator/withdrawals',
  CREATOR_PAYMENT_HISTORY: '/dashboard/creator/payment-history',
  ADMIN_DASHBOARD: '/dashboard/admin',
  ADMIN_USERS: '/dashboard/admin/users',
  ADMIN_CAMPAIGNS: '/dashboard/admin/campaigns',
  ADMIN_WITHDRAWALS: '/dashboard/admin/withdrawals',
  ADMIN_REPORTS: '/dashboard/admin/reports',
  ADMIN_NOTIFICATIONS: '/dashboard/admin/notifications',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_CANCEL: '/payment/cancel',
};
