/**
 * Pancake Test Mode Toggle
 * Developer mode to test payments without real charges
 *
 * Activation: Click avatar 5 times within 5 seconds
 * Effect: All payments will use Pancake's test/sandbox mode (no real charges)
 *
 * Test Card Info:
 * - Card: 4242 4242 4242 4242
 * - Expiry: Any future date (e.g., 12/25)
 * - CVV: Any 3 digits (e.g., 123)
 */

const PANCAKE_TEST_MODE_KEY = 'skillhub_pancake_test_mode';
const PANCAKE_TEST_MODE_ENABLED_KEY = 'skillhub_pancake_test_mode_enabled';

/**
 * Check if Pancake Test Mode is enabled
 * When enabled, all Pancake payments use test/sandbox environment
 */
export function isPancakeTestModeEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const testMode = localStorage.getItem(PANCAKE_TEST_MODE_ENABLED_KEY);
    return testMode === 'true';
  } catch {
    return false;
  }
}

/**
 * Enable Pancake Test Mode
 * All subsequent payments will go to Pancake's test environment
 */
export function enablePancakeTestMode(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PANCAKE_TEST_MODE_ENABLED_KEY, 'true');
    localStorage.setItem(PANCAKE_TEST_MODE_KEY, new Date().toISOString());

    console.log('%c🧪 Pancake Test Mode Enabled', 'color: #f59e0b; font-size: 14px; font-weight: bold');
    console.log('%c💳 Use test card: 4242 4242 4242 4242', 'color: #6b7280; font-size: 12px');
    console.log('%c⚠️  No real charges will be made', 'color: #10b981; font-size: 12px');

    // 也显示浏览器通知
    if (typeof window !== 'undefined' && 'alert' in window) {
      alert('🧪 Pancake Test Mode Enabled!\n\nTest Card: 4242 4242 4242 4242\nNo real charges will be made.');
    }
  } catch (e) {
    console.error('Failed to enable Pancake test mode:', e);
  }
}

/**
 * Disable Pancake Test Mode
 * Return to production payments
 */
export function disablePancakeTestMode(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(PANCAKE_TEST_MODE_ENABLED_KEY);
    localStorage.removeItem(PANCAKE_TEST_MODE_KEY);
    console.log('%c✅ Pancake Test Mode Disabled', 'color: #ef4444; font-size: 14px; font-weight: bold');
    console.log('%c💳 Payments will use production mode', 'color: #6b7280; font-size: 12px');
  } catch (e) {
    console.error('Failed to disable Pancake test mode:', e);
  }
}

/**
 * Get Pancake Test Mode status
 */
export function getPancakeTestModeStatus(): { enabled: boolean; enabledAt?: string } {
  if (!isPancakeTestModeEnabled()) {
    return { enabled: false };
  }

  try {
    const enabledAt = localStorage.getItem(PANCAKE_TEST_MODE_KEY);
    return {
      enabled: true,
      enabledAt: enabledAt || undefined
    };
  } catch {
    return { enabled: false };
  }
}

