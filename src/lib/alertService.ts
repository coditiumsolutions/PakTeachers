import Swal, { type SweetAlertIcon } from 'sweetalert2'

const base = Swal.mixin({
  allowOutsideClick: false,
  allowEscapeKey: false,
  confirmButtonColor: '#1e1b4b',
  customClass: {
    popup: 'rounded-2xl font-sans',
    confirmButton: 'rounded-lg px-5 py-2.5 text-sm font-semibold',
  },
})

export function alertSessionExpired(message?: string | null) {
  return base.fire({
    icon: 'warning',
    title: 'Session Expired',
    text: message ?? 'Your session has expired. Please sign in again to continue.',
    confirmButtonText: 'Sign In',
  })
}

export function alertLoggedOut() {
  return base.fire({
    icon: 'success',
    title: 'Logged Out',
    text: 'You have been successfully logged out. See you next time!',
    confirmButtonText: 'OK',
  })
}

export function alertAccessDenied(message?: string | null) {
  return base.fire({
    icon: 'error',
    title: 'Access Denied',
    text: message ?? 'You do not have the required permissions to view this resource.',
    confirmButtonText: 'I Understand',
  })
}

export function alertGenericError(title: string, message?: string | null) {
  return base.fire({
    icon: 'error' as SweetAlertIcon,
    title,
    text: message ?? 'An unexpected error occurred.',
    confirmButtonText: 'OK',
  })
}
