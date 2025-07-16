import {
  createContext,
  createSignal,
  useContext,
  JSX,
  onMount,
} from "solid-js";

type Environment = "BETA" | "PROD";

interface EnvironmentContextType {
  environment: () => Environment;
  setEnvironment: (env: Environment) => void;
  toggleEnvironment: () => void;
  getApiBaseUrl: () => string;
  onEnvironmentChange: (callback: () => void) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType>();

export function EnvironmentProvider(props: { children: JSX.Element }) {
  const [environment, setEnvironmentState] = createSignal<Environment>("PROD");
  const [environmentChangeCallbacks, setEnvironmentChangeCallbacks] =
    createSignal<(() => void)[]>([]);

  const setEnvironment = (env: Environment) => {
    setEnvironmentState(env);

    // Trigger callbacks
    environmentChangeCallbacks().forEach((callback) => callback());
  };

  const toggleEnvironment = () => {
    const newEnv = environment() === "PROD" ? "BETA" : "PROD";
    setEnvironment(newEnv);
  };

  const getApiBaseUrl = () => {
    return environment() === "PROD"
      ? "https://api.zenobiapay.com"
      : "https://mm24mwlpnd.execute-api.us-east-1.amazonaws.com/Prod";
  };

  const onEnvironmentChange = (callback: () => void) => {
    setEnvironmentChangeCallbacks([...environmentChangeCallbacks(), callback]);
  };

  const value: EnvironmentContextType = {
    environment,
    setEnvironment,
    toggleEnvironment,
    getApiBaseUrl,
    onEnvironmentChange,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {props.children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error(
      "useEnvironment must be used within an EnvironmentProvider"
    );
  }
  return context;
}
