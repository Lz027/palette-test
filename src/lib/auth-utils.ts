export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

// Redirect to login with a toast notification
export function redirectToLogin(toast?: (options: { title: string; description: string; variant: string }) => void) {
  if (toast) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Redirecting to login...",
      variant: "destructive",
    });
  }
  setTimeout(() => {
    // Redirect to root which handles auth state
    window.location.href = "/";
  }, 500);
}
