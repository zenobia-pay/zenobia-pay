import { Title } from "@solidjs/meta";
import { Show, ErrorBoundary, createResource } from "solid-js";
import { useParams } from "@solidjs/router";

interface Item {
  itemId: string;
  name: string;
  brandName?: string;
  size?: string;
  color?: string | null;
  material?: string | null;
  year?: string | null;
  imageUrls?: string[];
  description?: string;
  metadata?: Record<string, any>;
}

async function fetchItem(id: string): Promise<Item> {
  "use server";

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

  return await response.json();
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
  const [item] = createResource(async () => {
    const result = await props.data;
    return result?.data ?? result;
  });

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
                    {item()?.name || `Item`}
                  </h1>
                </div>

                {/* Content */}
                <div class="p-6 space-y-6">
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

                  {/* Image Gallery */}
                  <Show
                    when={
                      item()?.imageUrls &&
                      Array.isArray(item()?.imageUrls) &&
                      (item()?.imageUrls?.length || 0) > 0
                    }
                  >
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900 mb-2">
                        Images
                      </h2>
                      <div class="flex flex-wrap gap-4">
                        {item()?.imageUrls?.map((url: string) => (
                          <img
                            src={url}
                            alt={item()?.name || `Item image`}
                            class="w-40 h-40 object-cover rounded border shadow-sm bg-gray-100"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    </div>
                  </Show>

                  {/* Brand Name */}
                  <Show when={item()?.brandName}>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900 mb-2">
                        Brand
                      </h2>
                      <p class="text-gray-700">{item()?.brandName}</p>
                    </div>
                  </Show>

                  {/* Size */}
                  <Show when={item()?.size}>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900 mb-2">
                        Size
                      </h2>
                      <p class="text-gray-700">{item()?.size}</p>
                    </div>
                  </Show>

                  {/* Color */}
                  <Show when={item()?.color}>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900 mb-2">
                        Color
                      </h2>
                      <p class="text-gray-700">{item()?.color}</p>
                    </div>
                  </Show>

                  {/* Material */}
                  <Show when={item()?.material}>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900 mb-2">
                        Material
                      </h2>
                      <p class="text-gray-700">{item()?.material}</p>
                    </div>
                  </Show>

                  {/* Year */}
                  <Show when={item()?.year}>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900 mb-2">
                        Year
                      </h2>
                      <p class="text-gray-700">{item()?.year}</p>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </Show>
        </ErrorBoundary>
      </div>
    </main>
  );
}
