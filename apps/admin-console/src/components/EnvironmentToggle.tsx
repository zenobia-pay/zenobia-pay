import { useEnvironment } from "../context/EnvironmentContext";

export default function EnvironmentToggle() {
  const { environment, setEnvironment } = useEnvironment();

  const handleToggle = () => {
    setEnvironment(environment() === "PROD" ? "BETA" : "PROD");
  };

  return (
    <div class="flex items-center space-x-3">
      <span class="text-gray-400 text-xs font-medium tracking-wide uppercase">
        Environment
      </span>
      <button
        onClick={handleToggle}
        class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          environment() === "PROD" ? "bg-green-600" : "bg-yellow-600"
        }`}
      >
        <span
          class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            environment() === "PROD" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span
        class={`text-xs font-bold tracking-wide uppercase ${
          environment() === "PROD" ? "text-green-400" : "text-yellow-400"
        }`}
      >
        {environment()}
      </span>
    </div>
  );
}
