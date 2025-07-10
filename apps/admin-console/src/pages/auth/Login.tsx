import { onMount, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth";

export default function Login() {
  console.log("Login component rendering...");

  const navigate = useNavigate();
  const auth = useAuth();
  const [error, setError] = createSignal("");
  const [isProcessing, setIsProcessing] = createSignal(true);
  const [isLoggingOut, setIsLoggingOut] = createSignal(false);
  const [isResendingEmail, setIsResendingEmail] = createSignal(false);
  const [resendSuccess, setResendSuccess] = createSignal(false);
  const [userEmail, setUserEmail] = createSignal("");
  const [isCheckingVerification, setIsCheckingVerification] =
    createSignal(false);
  const [isConsentRequired, setIsConsentRequired] = createSignal(false);

  onMount(async () => {
    console.log("Login onMount called...");
    try {
      // Only access window after component has mounted on client
      if (typeof window === "undefined") {
        console.log("Window is undefined, returning early");
        setIsProcessing(false);
        return;
      }

      console.log("Login page mounted, current URL:", window.location.href);
      console.log("URL search params:", window.location.search);

      // Handle Auth0 redirect callback if code parameter is present
      if (
        window.location.search.includes("code=") ||
        window.location.search.includes("error=")
      ) {
        try {
          // Check for Auth0 errors first
          if (window.location.search.includes("error=")) {
            const errorParams = new URLSearchParams(window.location.search);
            const errorType = errorParams.get("error") || "unknown";
            const errorMessage =
              errorParams.get("error_description") ||
              "An unknown error occurred";

            console.error(`Auth0 error (${errorType}):`, errorMessage);

            // Handle specific error types
            if (errorType === "consent_required") {
              setError(
                "Authorization required: You need to grant permission to access this application."
              );
              setIsConsentRequired(true);
            } else if (errorType === "invalid_request") {
              if (errorMessage.includes("no connections enabled")) {
                setError(
                  "Authentication configuration error: No login methods are configured for this organization. Please contact your administrator."
                );
              } else {
                setError(`Configuration error: ${errorMessage}`);
              }
            } else if (errorType === "access_denied") {
              setError(`Access denied: ${errorMessage}`);
            } else {
              setError(`Authentication error: ${errorMessage}`);
            }

            setIsProcessing(false);
            return;
          }

          console.log("Processing Auth0 callback...");
          await authService.handleAuthCallback();
          console.log("Auth0 callback processed, getting current user...");
          const user = await authService.getCurrentUser();
          console.log("Current user after callback:", user);

          if (user) {
            console.log(
              "User authenticated successfully, setting user and navigating..."
            );
            auth.setUser(user);
            // Check if there's a saved redirect path
            const redirectPath = sessionStorage.getItem("redirectPath");
            if (redirectPath) {
              sessionStorage.removeItem("redirectPath");
              console.log("Redirecting to saved path:", redirectPath);
              navigate(redirectPath, { replace: true });
            } else {
              console.log("Redirecting to home page");
              navigate("/", { replace: true });
            }
          } else {
            console.log("No user after callback, redirecting to Auth0 login");
            // Callback didn't result in a logged in user, redirect to Auth0
            await initiateAuth0Login();
          }
        } catch (err: unknown) {
          console.error("Auth callback error:", err);
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";

          // Check if error message contains consent_required
          if (
            typeof errorMessage === "string" &&
            errorMessage.toLowerCase().includes("consent_required")
          ) {
            setError(
              "Authorization required: You need to grant permission to access this application."
            );
            setIsConsentRequired(true);
          } else {
            setError(`Authentication error: ${errorMessage}`);

            // Extract email from error message if it contains one
            if (
              typeof errorMessage === "string" &&
              errorMessage.toLowerCase().includes("email")
            ) {
              const emailMatch = errorMessage.match(
                /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
              );
              if (emailMatch && emailMatch[0]) {
                setUserEmail(emailMatch[0]);
              }
            }
          }

          setIsProcessing(false);
        }
      } else {
        // Check if user is already logged in
        const user = await authService.getCurrentUser();
        if (user) {
          auth.setUser(user);
          // Check if there's a saved redirect path
          const redirectPath = sessionStorage.getItem("redirectPath");
          if (redirectPath) {
            sessionStorage.removeItem("redirectPath");
            navigate(redirectPath, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          // User is not logged in, redirect to Auth0
          if (typeof window !== "undefined") {
            await initiateAuth0Login();
          }
        }
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to verify authentication status"
      );
      setIsProcessing(false);
    }
  });

  const initiateAuth0Login = async () => {
    try {
      await authService.signIn();
      // The page will redirect to Auth0's login page
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.signOut();
      // The user will be redirected to Auth0 logout page
    } catch (err: unknown) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : "Failed to log out");
      setIsLoggingOut(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!userEmail()) {
      setError("No email available to resend verification");
      return;
    }

    try {
      setIsResendingEmail(true);
      const success = await authService.resendVerificationEmail(userEmail());

      if (success) {
        setResendSuccess(true);
        // Reset success message after 5 seconds
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setError(
          "Failed to resend verification email. Please try again later."
        );
      }
    } catch (err) {
      console.error("Error resending verification email:", err);
      setError("Failed to resend verification email. Please try again later.");
    } finally {
      setIsResendingEmail(false);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      setIsCheckingVerification(true);

      // Instead of logging out, we'll use silent login to check email verification
      const user = await authService.silentLogin();

      console.log("Silent login User:", user);
      if (user && user.email_verified) {
        // If email is verified, set the user and navigate
        auth.setUser(user);
        navigate("/", { replace: true });
      } else if (user && !user.email_verified) {
        // User exists but email is still not verified
        setError(
          "Your email is not verified yet. Please check your inbox or request a new verification email."
        );
        setIsCheckingVerification(false);
      } else {
        // If no user at all, something went wrong
        setError("Failed to verify status. Please try logging in again.");
        setIsCheckingVerification(false);
      }
    } catch (err) {
      console.error("Error checking verification status:", err);
      setError("Failed to check verification status. Please try again later.");
      setIsCheckingVerification(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  // Helper function to check if error is authentication-related
  const isAuthError = (errorMsg: string) => {
    const authKeywords = [
      "authentication",
      "auth",
      "login",
      "sign in",
      "access denied",
      "unauthorized",
      "forbidden",
      "consent_required",
      "invalid_request",
    ];
    return authKeywords.some((keyword) =>
      errorMsg.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return (
    <Show
      when={!isProcessing()}
      fallback={
        <div class="min-h-screen bg-black flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p class="text-gray-400 font-light tracking-wide uppercase">
              Initializing...
            </p>
          </div>
        </div>
      }
    >
      <div class="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div class="text-center">
            <h1 class="text-5xl font-light tracking-wider text-white mb-4">
              ZENOBIA
            </h1>
            <div class="w-16 h-0.5 bg-white mx-auto mb-6"></div>
            <p class="text-gray-400 font-light tracking-wide uppercase text-sm">
              Authentication Required
            </p>
          </div>

          {error() && (
            <div class="text-center">
              {isAuthError(error()) ? (
                <div>
                  <h2 class="text-6xl font-bold text-red-500 mb-4 tracking-wider">
                    ACCESS DENIED
                  </h2>
                  <div class="w-32 h-1 bg-red-500 mx-auto mb-6"></div>
                </div>
              ) : (
                <div class="bg-gray-900 border border-red-800 rounded-md p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg
                        class="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <h3 class="text-sm font-medium text-red-400 tracking-wide uppercase">
                        Error
                      </h3>
                      <div class="mt-2 text-sm text-red-300">{error()}</div>
                      <div class="mt-3">
                        <button
                          onClick={clearError}
                          class="text-sm text-red-400 hover:text-red-300 underline tracking-wide uppercase"
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {resendSuccess() && (
            <div class="bg-gray-900 border border-green-800 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-400 tracking-wide uppercase">
                    Success
                  </h3>
                  <div class="mt-2 text-sm text-green-300">
                    Verification email sent successfully!
                  </div>
                </div>
              </div>
            </div>
          )}

          {userEmail() && (
            <div class="space-y-2">
              <button
                onClick={handleResendVerificationEmail}
                disabled={isResendingEmail()}
                class="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md text-sm font-medium tracking-wide uppercase text-gray-300 bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-300 disabled:opacity-50"
              >
                {isResendingEmail()
                  ? "Sending..."
                  : "Resend Verification Email"}
              </button>

              <button
                onClick={checkVerificationStatus}
                disabled={isCheckingVerification()}
                class="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md text-sm font-medium tracking-wide uppercase text-gray-300 bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-300 disabled:opacity-50"
              >
                {isCheckingVerification()
                  ? "Checking..."
                  : "Check Verification Status"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Show>
  );
}
