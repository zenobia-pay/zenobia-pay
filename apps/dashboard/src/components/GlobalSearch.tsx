import {
  Component,
  createSignal,
  onMount,
  onCleanup,
  Show,
  createEffect,
} from "solid-js"
import { useNavigate } from "@solidjs/router"

interface SearchItem {
  id: string
  name: string
  description: string
  path: string
  category: string
}

interface SearchCategory {
  category: string
  items: SearchItem[]
}

export const GlobalSearch: Component = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = createSignal("")
  const [isSearchOpen, setIsSearchOpen] = createSignal(false)
  const [searchResults, setSearchResults] = createSignal<SearchCategory[]>([])
  const [selectedResultIndex, setSelectedResultIndex] = createSignal(-1)
  const [recentSearches, setRecentSearches] = createSignal<string[]>([])

  // Real search data
  const searchableItems: SearchItem[] = [
    {
      id: "webhooks",
      name: "Webhooks",
      description: "Configure webhook endpoints and event notifications",
      path: "?tab=developers&subtab=webhooks",
      category: "Developers",
    },
    {
      id: "documentation",
      name: "Documentation",
      description: "API reference and integration guides",
      path: "?tab=developers&subtab=docs",
      category: "Developers",
    },
    {
      id: "m2m-credentials",
      name: "M2M Credentials",
      description: "Manage machine-to-machine API credentials",
      path: "?tab=developers&subtab=m2m-credentials",
      category: "Developers",
    },
    {
      id: "transactions",
      name: "Transactions",
      description: "View and manage payment transactions",
      path: "?tab=transactions",
      category: "Payments",
    },
    {
      id: "settings",
      name: "Settings",
      description: "Manage account settings and preferences",
      path: "?tab=settings",
      category: "Settings",
    },
    {
      id: "overview",
      name: "Overview",
      description: "Dashboard and key metrics",
      path: "?tab=overview",
      category: "Core",
    },
  ]

  // Real search implementation
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results = searchableItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
      .reduce((acc: SearchCategory[], item) => {
        const category = acc.find((cat) => cat.category === item.category)
        if (category) {
          category.items.push(item)
        } else {
          acc.push({
            category: item.category,
            items: [item],
          })
        }
        return acc
      }, [])

    setSearchResults(results)
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd+K or Ctrl+K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setIsSearchOpen(true)
    }

    // Escape to close search
    if (e.key === "Escape") {
      setIsSearchOpen(false)
    }

    if (isSearchOpen()) {
      // Arrow keys to navigate results
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedResultIndex((prev) => {
          const flatResults = searchResults().flatMap(
            (category) => category.items
          )
          return Math.min(prev + 1, flatResults.length - 1)
        })
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedResultIndex((prev) => Math.max(prev - 1, -1))
      }

      // Enter to select result
      if (e.key === "Enter" && selectedResultIndex() >= 0) {
        e.preventDefault()
        const flatResults = searchResults().flatMap(
          (category) => category.items
        )
        const selected = flatResults[selectedResultIndex()]
        if (selected) {
          handleResultSelect(selected)
        }
      }
    }
  }

  const handleResultSelect = (result: SearchItem) => {
    // Save to recent searches
    setRecentSearches((prev) => {
      const newSearches = [
        result.name,
        ...prev.filter((s) => s !== result.name),
      ].slice(0, 5)
      localStorage.setItem("recentSearches", JSON.stringify(newSearches))
      return newSearches
    })

    setIsSearchOpen(false)
    setSearchQuery("")
    navigate(result.path)
  }

  // Handle search input changes
  const handleSearchInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    const query = input.value
    setSearchQuery(query)
    performSearch(query)
    setSelectedResultIndex(-1)
  }

  // Close search when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const searchModal = document.getElementById("search-modal")
    if (searchModal && !searchModal.contains(e.target as Node)) {
      setIsSearchOpen(false)
    }
  }

  // Function to focus the search input
  const focusSearchInput = () => {
    const input = document.querySelector(
      "#search-modal input"
    ) as HTMLInputElement
    if (input) {
      input.focus()
    }
  }

  // Focus input when search opens
  createEffect(() => {
    if (isSearchOpen()) {
      // Small delay to ensure the modal is rendered
      setTimeout(focusSearchInput, 0)
    }
  })

  // Initialize event listeners
  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)

    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  })

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown)
    document.removeEventListener("mousedown", handleClickOutside)
  })

  return (
    <>
      {/* Search Trigger Button */}
      <div
        class="flex w-full md:max-w-md cursor-pointer"
        onClick={() => setIsSearchOpen(true)}
      >
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            class="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search... (⌘K)"
            readOnly
          />
          <div class="absolute inset-y-0 right-2 flex items-center">
            <kbd class="hidden sm:inline-flex items-center px-1.5 text-xs text-gray-500 border border-gray-300 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <Show when={isSearchOpen()}>
        <div class="fixed inset-0 bg-gray-900/50 z-50 flex items-start justify-center pt-16 px-4">
          <div
            id="search-modal"
            class="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden"
          >
            {/* Search Input */}
            <div class="p-4 border-b border-gray-200 flex items-center">
              <svg
                class="h-5 w-5 text-gray-400 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search across Zenobia Pay..."
                class="flex-1 outline-none text-base bg-transparent"
                value={searchQuery()}
                onInput={handleSearchInput}
                autofocus
              />
              <kbd class="hidden sm:inline-flex h-5 items-center px-1.5 text-xs font-semibold text-gray-800 border border-gray-300 rounded">
                ESC
              </kbd>
            </div>

            {/* Search Results */}
            <div class="max-h-96 overflow-y-auto">
              {searchQuery() === "" && recentSearches().length > 0 ? (
                <div class="p-4">
                  <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Recent Searches
                  </h3>
                  <ul class="space-y-1">
                    {recentSearches().map((search) => (
                      <li
                        class="p-2 hover:bg-gray-50 rounded transition-colors flex items-center cursor-pointer"
                        onClick={() => {
                          setSearchQuery(search)
                          performSearch(search)
                        }}
                      >
                        <svg
                          class="h-4 w-4 mr-2 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span class="text-sm">{search}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : searchResults().length > 0 ? (
                <div>
                  {searchResults().map((category, categoryIndex) => (
                    <div class="px-4 py-3 border-b border-gray-100 last:border-b-0">
                      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {category.category}
                      </h3>
                      <ul class="space-y-1">
                        {category.items.map((item, itemIndex) => {
                          const flatIndex =
                            searchResults()
                              .slice(0, categoryIndex)
                              .reduce((acc, cat) => acc + cat.items.length, 0) +
                            itemIndex

                          return (
                            <li
                              class={`p-2 rounded transition-colors cursor-pointer ${
                                selectedResultIndex() === flatIndex
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => handleResultSelect(item)}
                              onMouseEnter={() =>
                                setSelectedResultIndex(flatIndex)
                              }
                            >
                              <div class="font-medium text-sm">{item.name}</div>
                              <div class="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : searchQuery() ? (
                <div class="py-8 text-center text-gray-500">
                  <p>No results found for "{searchQuery()}"</p>
                </div>
              ) : (
                <div class="p-4">
                  <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Quick Links
                  </h3>
                  <div class="grid grid-cols-2 gap-2">
                    {searchableItems.map((item) => (
                      <div
                        class="p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        onClick={() => handleResultSelect(item)}
                      >
                        <div class="text-sm font-medium">{item.name}</div>
                        <div class="text-xs text-gray-500 mt-1">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Footer */}
            <div class="p-3 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
              <div class="flex items-center">
                <kbd class="inline-flex h-5 items-center px-1.5 text-xs font-semibold text-gray-800 border border-gray-300 rounded mr-1">
                  ↑
                </kbd>
                <kbd class="inline-flex h-5 items-center px-1.5 text-xs font-semibold text-gray-800 border border-gray-300 rounded mr-2">
                  ↓
                </kbd>
                <span>to navigate</span>
              </div>
              <div class="flex items-center">
                <kbd class="inline-flex h-5 items-center px-1.5 text-xs font-semibold text-gray-800 border border-gray-300 rounded mr-2">
                  enter
                </kbd>
                <span>to select</span>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  )
}
