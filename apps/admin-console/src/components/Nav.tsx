import { useLocation } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const location = useLocation();
  const auth = useAuth();
  const active = (path: string) =>
    path == location.pathname
      ? "border-white text-white"
      : "border-transparent text-gray-300 hover:text-white hover:border-gray-400";

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav class="bg-black border-b border-gray-800 shadow-lg">
      <div class="container mx-auto px-4">
        <ul class="flex items-center justify-between py-4">
          <div class="flex items-center space-x-8">
            <li
              class={`border-b-2 transition-all duration-300 ${active(
                "/"
              )} px-2 py-1`}
            >
              <a href="/" class="text-sm font-medium tracking-wide uppercase">
                God Mode
              </a>
            </li>
          </div>
          <li>
            <button
              onClick={handleSignOut}
              class="px-6 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-all duration-300 border border-gray-700 hover:border-gray-500"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
