import { Title } from "@solidjs/meta";
import { Show, ErrorBoundary } from "solid-js";
import { useParams } from "@solidjs/router";

interface Item {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

async function fetchItem(id: string): Promise<Item> {
  const response = await fetch("https://api.zenobiapay.com/get-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "NONE",
    },
    body: JSON.stringify({ itemId: id }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch item: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Server-side rendering with caching
export const route = {
  load: async ({ params }: { params: { id: string } }) => {
    try {
      const item = await fetchItem(params.id);
      return {
        headers: {
          "Cache-Control":
            "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          "CDN-Cache-Control": "public, max-age=86400",
          "Vercel-CDN-Cache-Control": "public, max-age=86400",
        },
        data: item,
      };
    } catch (error) {
      return {
        status: 404,
        headers: {
          "Cache-Control": "no-cache",
        },
      };
    }
  },
  ssr: true,
};

export default function ItemPage(props: any) {
  const params = useParams();
  // Access the server-loaded data from props
  const item = () => props.data;

  return (
    <main class="min-h-screen bg-gray-50 pt-16">
      <Title>Item {params.id} - Verified</Title>

      <div class="container mx-auto px-4 py-8">
        <ErrorBoundary
          fallback={(err) => (
            <div class="max-w-2xl mx-auto">
              <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <h1 class="text-xl font-semibold text-red-800 mb-2">
                  Error Loading Item
                </h1>
                <p class="text-red-700">
                  {err.message || "Failed to load item details"}
                </p>
              </div>
            </div>
          )}
        >
          <Show
            when={item()}
            fallback={
              <div class="max-w-2xl mx-auto">
                <div class="bg-white rounded-lg shadow-sm border p-6">
                  <div class="animate-pulse">
                    <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div class="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            }
          >
            <div class="max-w-2xl mx-auto">
              <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Header */}
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h1 class="text-2xl font-bold text-white">
                    {item()?.name || `Item ${params.id}`}
                  </h1>
                  <p class="text-blue-100 mt-1">ID: {params.id}</p>
                </div>

                {/* Content */}
                <div class="p-6 space-y-6">
                  {/* Status */}
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 mb-2">
                      Status
                    </h2>
                    <span
                      class={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        item()?.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : item()?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item()?.status}
                    </span>
                  </div>

                  {/* Description */}
                  <Show when={item()?.description}>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900 mb-2">
                        Description
                      </h2>
                      <p class="text-gray-700">{item()?.description}</p>
                    </div>
                  </Show>

                  {/* Metadata */}
                  <Show
                    when={
                      item()?.metadata &&
                      Object.keys(item()?.metadata || {}).length > 0
                    }
                  >
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900 mb-2">
                        Metadata
                      </h2>
                      <div class="bg-gray-50 rounded-lg p-4">
                        <pre class="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(item()?.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </Show>

                  {/* Timestamps */}
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Created</h3>
                      <p class="text-sm text-gray-900">
                        {new Date(item()?.createdAt || "").toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">
                        Last Updated
                      </h3>
                      <p class="text-sm text-gray-900">
                        {new Date(item()?.updatedAt || "").toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Show>
        </ErrorBoundary>
      </div>
    </main>
  );
}
