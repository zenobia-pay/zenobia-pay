import { onMount, createEffect } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useEnvironment } from "../context/EnvironmentContext";

export default function EnvironmentSync() {
  const { environment, setEnvironment } = useEnvironment();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize environment from URL on mount, but only if not already set
  onMount(() => {
    const envParam = searchParams.env;
    const currentEnv = environment();

    // Only set if we don't already have an environment set or if URL differs
    if (currentEnv === "PROD" && (envParam === "beta" || envParam === "BETA")) {
      setEnvironment("BETA");
    } else if (currentEnv === "BETA" && !envParam) {
      setEnvironment("PROD");
    } else if (currentEnv === "PROD" && !envParam) {
      // Already correct, do nothing
    } else if (
      currentEnv === "BETA" &&
      (envParam === "beta" || envParam === "BETA")
    ) {
      // Already correct, do nothing
    }
  });

  // Update URL when environment changes (but avoid infinite loops)
  createEffect(() => {
    const currentEnv = environment();
    const currentUrlEnv = searchParams.env;

    // Only update URL if it doesn't match our environment
    if (currentEnv === "BETA" && currentUrlEnv !== "beta") {
      const newParams = { ...searchParams, env: "beta" };
      setSearchParams(newParams, { replace: true });
    } else if (currentEnv === "PROD" && currentUrlEnv) {
      const newParams = { ...searchParams };
      delete newParams.env;
      setSearchParams(newParams, { replace: true });
    }
  });

  // This component doesn't render anything
  return null;
}
