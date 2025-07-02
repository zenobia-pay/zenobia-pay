import { Component, createSignal, createEffect } from "solid-js"
import { authService } from "../../services/auth"

/**
 * Admin user profile page
 */
const Profile: Component = () => {
  const [user, setUser] = createSignal<any>(null)
  const [loading, setLoading] = createSignal(true)

  createEffect(async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setLoading(false)
    }
  })

  return (
    <div class="space-y-6">
      <h1 class="text-2xl font-semibold">Your Profile</h1>

      {loading() ? (
        <div class="card bg-base-100 shadow">
          <div class="card-body items-center">
            <div class="flex justify-center py-8">
              <span class="loading loading-spinner loading-lg"></span>
            </div>
          </div>
        </div>
      ) : user() ? (
        <div class="grid gap-6 md:grid-cols-2">
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h2 class="card-title">Account Information</h2>
              <div class="flex items-center gap-4 mb-4">
                <div class="avatar placeholder">
                  <div class="bg-primary text-primary-content rounded-full w-24">
                    <span class="text-xl">
                      {user()?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold">
                    {user()?.name || "User"}
                  </h3>
                  <p class="opacity-70">
                    {user()?.email || "No email available"}
                  </p>
                </div>
              </div>
              <div class="divider"></div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="font-medium">User ID:</span>
                  <span class="opacity-70">{user()?.sub || "Unknown"}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Account Created:</span>
                  <span class="opacity-70">
                    {user()?.createdAt
                      ? new Date(user().createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
              <div class="card-actions justify-end mt-4">
                <button class="btn btn-primary">Edit Profile</button>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h2 class="card-title">Security Settings</h2>
              <ul class="space-y-4">
                <li class="flex justify-between items-center">
                  <div>
                    <h3 class="font-medium">Password</h3>
                    <p class="text-sm opacity-70">Last changed: Never</p>
                  </div>
                  <button class="btn btn-sm">Change</button>
                </li>
                <li class="flex justify-between items-center">
                  <div>
                    <h3 class="font-medium">Two-Factor Authentication</h3>
                    <p class="text-sm opacity-70">Not enabled</p>
                  </div>
                  <button class="btn btn-sm">Enable</button>
                </li>
                <li class="flex justify-between items-center">
                  <div>
                    <h3 class="font-medium">Login Sessions</h3>
                    <p class="text-sm opacity-70">1 active session</p>
                  </div>
                  <button class="btn btn-sm">Manage</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div class="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error loading profile. Please try again later.</span>
        </div>
      )}
    </div>
  )
}

export default Profile
