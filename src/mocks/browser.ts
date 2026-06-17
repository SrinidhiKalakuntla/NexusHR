// MSW browser setup will be added in Phase 1

export async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') {
    return
  }
}
