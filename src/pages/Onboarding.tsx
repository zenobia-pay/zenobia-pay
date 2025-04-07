import { Component, createEffect, createSignal, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { api } from "../services/api"
import { EntityType, TaxIdType } from "../types/api"
import { auth0Utils } from "../services/api"
import { auth0Config } from "../config/auth0"
import { useAuth } from "../context/AuthContext"
import { authService } from "../services/auth"

const Onboarding: Component = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = createSignal("")
  const [lastName, setLastName] = createSignal("")
  const [merchantDisplayName, setMerchantDisplayName] = createSignal("")
  const [legalBusinessName, setLegalBusinessName] = createSignal("")
  const [entityType, setEntityType] = createSignal<EntityType>(EntityType.LLC)
  const [taxId, setTaxId] = createSignal("")
  const [taxIdType, setTaxIdType] = createSignal<TaxIdType>(TaxIdType.EIN)
  const [incorporationDate, setIncorporationDate] = createSignal("")
  const [address1, setAddress1] = createSignal("")
  const [address2, setAddress2] = createSignal("")
  const [city, setCity] = createSignal("")
  const [state, setState] = createSignal("")
  const [zip5, setZip5] = createSignal("")
  const [country, setCountry] = createSignal("US")
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [success, setSuccess] = createSignal(false)
  const [successMessage, setSuccessMessage] = createSignal("")
  const [isSigningOut, setIsSigningOut] = createSignal(false)

  const auth = useAuth()
  const userProfile = auth.userProfile()

  createEffect(() => {
    if (userProfile?.hasOnboarded) {
      navigate("/")
    }
  })

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await auth.signOut()
      // The user will be redirected to Auth0 logout page
    } catch (error) {
      console.error("Sign out error:", error)
      setIsSigningOut(false)
    }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!firstName() || !lastName()) {
      setError("First name and last name are required")
      return
    }

    if (!merchantDisplayName() || !legalBusinessName()) {
      setError("Business name and legal business name are required")
      return
    }

    if (!taxId()) {
      setError("Tax ID is required")
      return
    }

    // Validate tax ID has 9 digits
    if (!/^\d{9}$/.test(taxId())) {
      setError("Tax ID must be 9 digits")
      return
    }

    if (!incorporationDate()) {
      setError("Incorporation date is required")
      return
    }

    // Validate incorporation date format (YYYY-MM-DD)
    if (
      !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(incorporationDate())
    ) {
      setError("Incorporation date must be in YYYY-MM-DD format")
      return
    }

    // Validate address fields
    if (!address1() || !city() || !state() || !zip5() || !country()) {
      setError("All address fields except Address Line 2 are required")
      return
    }

    // Validate ZIP code format (5 digits)
    if (!/^\d{5}$/.test(zip5())) {
      setError("ZIP code must be 5 digits")
      return
    }

    setIsSubmitting(true)
    setSuccess(false)
    setSuccessMessage("")

    try {
      const onboardingData = {
        firstName: firstName(),
        lastName: lastName(),
        merchantDisplayName: merchantDisplayName(),
        legalBusinessName: legalBusinessName(),
        entityType: entityType(),
        taxId: taxId(),
        taxIdType: taxIdType(),
        incorporationDate: incorporationDate(),
        address: {
          address1: address1(),
          address2: address2() || undefined,
          city: city(),
          state: state(),
          country: country(),
          zip5: zip5(),
        },
      }

      await api.submitMerchantOnboarding(onboardingData)
      console.log("Merchant onboarding submitted successfully")

      // Show success message
      setSuccess(true)
      setSuccessMessage(
        "Onboarding completed successfully! Preparing your dashboard..."
      )

      // Give the user a moment to see the success message before refreshing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Try to refresh the token silently to get the updated roles
      try {
        console.log("Attempting to refresh authentication token...")

        await authService.silentLogin()
      } catch (refreshError) {
        console.error("Failed to refresh token silently:", refreshError)

        // Fallback: If all else fails, redirect to login
        sessionStorage.setItem("redirectPath", "/")
        navigate("/login")
      }
    } catch (err) {
      console.error("Failed to submit merchant onboarding:", err)
      setError("Failed to complete onboarding. Please try again.")
      setSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-end mb-2">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut()}
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center"
          >
            {isSigningOut() ? "Signing out..." : "Sign out"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Onboarding
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Please provide the following information to set up your merchant
          account.
          <br />
          <span class="mt-1 inline-block text-gray-500 group relative cursor-help">
            Why do we need this?
            <span class="invisible group-hover:visible absolute bg-gray-800 text-white text-xs rounded p-2 shadow-lg left-1/2 top-6 w-64">
              We're required to collect this information to keep your account
              compliant with legal and regulatory requirements.
            </span>
          </span>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Show success message if submission was successful */}
          <Show when={success()}>
            <div class="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <p class="text-sm font-medium text-green-800">
                    {successMessage()}
                  </p>
                </div>
              </div>
            </div>
          </Show>

          <form class="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div class="border-b pb-4">
              <h3 class="text-lg font-medium text-gray-800 mb-4">
                Personal Information
              </h3>

              {/* First Name */}
              <div class="mb-4">
                <div class="flex items-center">
                  <label
                    for="firstName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <div class="relative ml-2 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5 text-gray-500 cursor-help"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div class="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 shadow-lg -left-6 -top-14 w-48">
                      First name, as it appears on your ID
                    </div>
                  </div>
                </div>
                <div class="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName()}
                    onInput={(e) => setFirstName(e.currentTarget.value)}
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <div class="flex items-center">
                  <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <div class="relative ml-2 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5 text-gray-500 cursor-help"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div class="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 shadow-lg -left-6 -top-14 w-48">
                      Last name, as it appears on your ID
                    </div>
                  </div>
                </div>
                <div class="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName()}
                    onInput={(e) => setLastName(e.currentTarget.value)}
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Business Information Section */}
            <div class="border-b pb-4">
              <h3 class="text-lg font-medium text-gray-800 mb-4">
                Business Information
              </h3>

              {/* Business Display Name */}
              <div class="mb-4">
                <div class="flex items-center">
                  <label
                    for="merchantDisplayName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Business Name
                  </label>
                  <div class="relative ml-2 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5 text-gray-500 cursor-help"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div class="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 shadow-lg -left-6 -top-14 w-48">
                      The name customers will see on receipts and statements
                    </div>
                  </div>
                </div>
                <div class="mt-1">
                  <input
                    id="merchantDisplayName"
                    name="merchantDisplayName"
                    type="text"
                    required
                    value={merchantDisplayName()}
                    onInput={(e) =>
                      setMerchantDisplayName(e.currentTarget.value)
                    }
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Legal Business Name */}
              <div class="mb-4">
                <div class="flex items-center">
                  <label
                    for="legalBusinessName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Legal Business Name
                  </label>
                  <div class="relative ml-2 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5 text-gray-500 cursor-help"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div class="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 shadow-lg -left-6 -top-14 w-48">
                      Your full legal business name as registered with
                      government entities
                    </div>
                  </div>
                </div>
                <div class="mt-1">
                  <input
                    id="legalBusinessName"
                    name="legalBusinessName"
                    type="text"
                    required
                    value={legalBusinessName()}
                    onInput={(e) => setLegalBusinessName(e.currentTarget.value)}
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Entity Type */}
              <div class="mb-4">
                <label
                  for="entityType"
                  class="block text-sm font-medium text-gray-700"
                >
                  Entity Type
                </label>
                <div class="mt-1">
                  <select
                    id="entityType"
                    name="entityType"
                    value={entityType()}
                    onChange={(e) =>
                      setEntityType(e.currentTarget.value as EntityType)
                    }
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value={EntityType.SOLE_PROPRIETORSHIP}>
                      Sole Proprietorship
                    </option>
                    <option value={EntityType.PARTNERSHIP}>Partnership</option>
                    <option value={EntityType.LLP}>
                      Limited Liability Partnership (LLP)
                    </option>
                    <option value={EntityType.LLC}>
                      Limited Liability Company (LLC)
                    </option>
                    <option value={EntityType.C_CORP}>C Corporation</option>
                    <option value={EntityType.S_CORP}>S Corporation</option>
                    <option value={EntityType.B_CORP}>B Corporation</option>
                    <option value={EntityType.NON_PROFIT}>Non-Profit</option>
                  </select>
                </div>
              </div>

              {/* Tax ID */}
              <div class="mb-4">
                <div class="flex items-center">
                  <label
                    for="taxId"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Tax ID (9 digits)
                  </label>
                  <div class="relative ml-2 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5 text-gray-500 cursor-help"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div class="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 shadow-lg -left-6 -top-14 w-48">
                      9-digit Tax ID (EIN or TIN)
                    </div>
                  </div>
                </div>
                <div class="mt-1">
                  <input
                    id="taxId"
                    name="taxId"
                    type="text"
                    required
                    pattern="^\d{9}$"
                    maxLength={9}
                    placeholder="123456789"
                    value={taxId()}
                    onInput={(e) => setTaxId(e.currentTarget.value)}
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Tax ID Type */}
              <div class="mb-4">
                <label
                  for="taxIdType"
                  class="block text-sm font-medium text-gray-700"
                >
                  Tax ID Type
                </label>
                <div class="mt-1">
                  <select
                    id="taxIdType"
                    name="taxIdType"
                    value={taxIdType()}
                    onChange={(e) =>
                      setTaxIdType(e.currentTarget.value as TaxIdType)
                    }
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value={TaxIdType.EIN}>
                      Employer Identification Number (EIN)
                    </option>
                    <option value={TaxIdType.TIN}>
                      Tax Identification Number (TIN)
                    </option>
                  </select>
                </div>
              </div>

              {/* Incorporation Date */}
              <div>
                <div class="flex items-center">
                  <label
                    for="incorporationDate"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Incorporation Date
                  </label>
                  <div class="relative ml-2 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5 text-gray-500 cursor-help"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div class="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 shadow-lg -left-6 -top-14 w-48">
                      Date when your business was legally established
                    </div>
                  </div>
                </div>
                <div class="mt-1">
                  <input
                    id="incorporationDate"
                    name="incorporationDate"
                    type="date"
                    required
                    value={incorporationDate()}
                    onInput={(e) => setIncorporationDate(e.currentTarget.value)}
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Business Address Section */}
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-4">
                Business Address
              </h3>

              {/* Address Line 1 */}
              <div class="mb-4">
                <label
                  for="address1"
                  class="block text-sm font-medium text-gray-700"
                >
                  Address Line 1
                </label>
                <div class="mt-1">
                  <input
                    id="address1"
                    name="address1"
                    type="text"
                    required
                    value={address1()}
                    onInput={(e) => setAddress1(e.currentTarget.value)}
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Address Line 2 */}
              <div class="mb-4">
                <label
                  for="address2"
                  class="block text-sm font-medium text-gray-700"
                >
                  Address Line 2 (Optional)
                </label>
                <div class="mt-1">
                  <input
                    id="address2"
                    name="address2"
                    type="text"
                    value={address2()}
                    onInput={(e) => setAddress2(e.currentTarget.value)}
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* City and State */}
              <div class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 mb-4">
                <div>
                  <label
                    for="city"
                    class="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div class="mt-1">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={city()}
                      onInput={(e) => setCity(e.currentTarget.value)}
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="state"
                    class="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <div class="mt-1">
                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={state()}
                      onInput={(e) => setState(e.currentTarget.value)}
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Postal Code and Country */}
              <div class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 mb-4">
                <div>
                  <label
                    for="zip5"
                    class="block text-sm font-medium text-gray-700"
                  >
                    ZIP Code (5 digits)
                  </label>
                  <div class="mt-1">
                    <input
                      id="zip5"
                      name="zip5"
                      type="text"
                      required
                      pattern="^\d{5}$"
                      maxLength={5}
                      placeholder="12345"
                      value={zip5()}
                      onInput={(e) => setZip5(e.currentTarget.value)}
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="country"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div class="mt-1">
                    <select
                      id="country"
                      name="country"
                      required
                      value={country()}
                      onChange={(e) => setCountry(e.currentTarget.value)}
                      disabled={true}
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                    >
                      <option value="US">United States</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            <Show when={error()}>
              <div class="text-red-600 text-sm">{error()}</div>
            </Show>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting() || success()}
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting() ? "Submitting..." : "Complete Onboarding"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
