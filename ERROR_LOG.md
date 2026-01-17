# Error Log

## Profile Page Error
**Error**: `ReferenceError: togglePinBoard is not defined`

**Cause**: The `usePaletteStore` hook is missing the `togglePinBoard` function export, but it's being destructured in components.

**Fix**: Add `togglePinBoard` to the return statement of `usePaletteStore.ts`.
