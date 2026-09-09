// No "use client" directive: this module has to run on both the server
// (layout.tsx, generating the inline theme-init script) and the client
// (theme-provider.tsx). A constant exported from a "use client" module isn't
// available to server code, since only its component exports cross that
// boundary.
export const THEME_STORAGE_KEY = "habit-lens-theme";
