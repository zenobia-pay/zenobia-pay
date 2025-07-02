import { createSignal, onMount } from "solid-js";

export default function ApiTest() {
  const [getResponse, setGetResponse] = createSignal<any>(null);
  const [postResponse, setPostResponse] = createSignal<any>(null);
  const [loading, setLoading] = createSignal(false);
  const [postLoading, setPostLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [postError, setPostError] = createSignal<string | null>(null);
  const [inputName, setInputName] = createSignal("");
  const [inputEmail, setInputEmail] = createSignal("");

  async function fetchApiData() {
    setLoading(true);
    setError(null);

    try {
      const result = await fetch("/api/hello");
      const data = await result.json();
      setGetResponse(data);
    } catch (err) {
      console.error("Error fetching API data:", err);
      setError("Failed to fetch data from API");
    } finally {
      setLoading(false);
    }
  }

  async function submitFormData(e: Event) {
    e.preventDefault();
    setPostLoading(true);
    setPostError(null);

    try {
      const formData = {
        name: inputName(),
        email: inputEmail(),
        timestamp: new Date().toISOString(),
      };

      const result = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await result.json();
      setPostResponse(data);
    } catch (err) {
      console.error("Error submitting form data:", err);
      setPostError("Failed to submit form data");
    } finally {
      setPostLoading(false);
    }
  }

  onMount(() => {
    fetchApiData();
  });

  return (
    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Cloudflare Pages Functions Test</h1>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-3">GET Request Test</h2>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={fetchApiData}
          disabled={loading()}
        >
          {loading() ? "Loading..." : "Fetch Data (GET)"}
        </button>

        {error() && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error()}
          </div>
        )}

        {getResponse() && (
          <div class="bg-white shadow rounded p-4">
            <h3 class="text-lg font-semibold mb-2">API Response:</h3>
            <pre class="bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(getResponse(), null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-3">POST Request Test</h2>
        <form
          onSubmit={submitFormData}
          class="bg-white shadow rounded p-4 mb-4"
        >
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="name"
            >
              Name
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={inputName()}
              onInput={(e) => setInputName(e.currentTarget.value)}
              placeholder="Enter your name"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="email"
            >
              Email
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={inputEmail()}
              onInput={(e) => setInputEmail(e.currentTarget.value)}
              placeholder="Enter your email"
            />
          </div>
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={postLoading()}
          >
            {postLoading() ? "Submitting..." : "Submit Data (POST)"}
          </button>
        </form>

        {postError() && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {postError()}
          </div>
        )}

        {postResponse() && (
          <div class="bg-white shadow rounded p-4">
            <h3 class="text-lg font-semibold mb-2">POST Response:</h3>
            <pre class="bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(postResponse(), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
