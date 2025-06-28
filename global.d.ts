// global.d.ts

// This file provides global type declarations for the Google Identity Services (GIS)
// client library, which is typically loaded via a <script> tag and attached to the
// window object. These declarations help TypeScript understand the shape of
// window.google.accounts.id and prevent type errors.

/**
 * Interface for the response object received from the Google Sign-In callback.
 * This is compatible with the local CredentialResponse interface in LoginPage.tsx.
 */
interface GoogleSignInCredentialResponse {
  credential?: string; // The ID token (JWT)
  select_by?: string;
  // Other fields might exist, e.g., 'clientId'.
  [key: string]: any;
}

/**
 * Interface describing the methods available on `window.google.accounts.id`.
 */
interface GoogleAccountsIdInstance {
  /**
   * Initializes the GIS client.
   */
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleSignInCredentialResponse) => void;
    auto_select?: boolean;
    // context?: 'signin' | 'signup' | 'use';
    // ux_mode?: 'popup' | 'redirect';
    // nonce?: string;
    // login_uri?: string;
    // native_callback?: (response: GoogleSignInCredentialResponse) => void;
    // cancel_on_tap_outside?: boolean;
  }) => void;

  /**
   * Renders the Google Sign-In button.
   */
  renderButton: (
    parentElement: HTMLElement,
    options: {
      type?: 'standard' | 'icon';
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin' | 'signup';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      logo_alignment?: 'left' | 'center';
      width?: string; // e.g., '250px'
      locale?: string;
      click_listener?: () => void;
    }
  ) => void;

  /**
   * Prompts the user with the One Tap UI or button.
   */
  prompt: (momentNotification?: (notification: any) => void) => void;

  /**
   * Disables automatic sign-in.
   */
  disableAutoSelect: () => void;

  /**
   * Revokes the GIS token for the given user.
   */
  revoke: (identifier: string, callback?: (revocationResponse: { successful: boolean; error?: any }) => void) => void;

  /**
   * Allows storing a value that can be retrieved when a user signs out or revokes a token from a Google Account.
   */
  storeCredential: (credential: string, callback?: (response: any) => void) => void;

  /**
   * Cancels the currently displayed One Tap prompt.
   */
  cancel: () => void;
}

// Augment the global Window interface to include the google.accounts.id object.
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsIdInstance;
        // Potentially other google.accounts services could be typed here too
      };
      // Potentially other google services (e.g., google.picker)
    };
  }
}

// Adding `export {};` makes this file a module, which is a common practice
// for .d.ts files providing global augmentations, ensuring they are correctly
// processed by the TypeScript compiler.
export {};
