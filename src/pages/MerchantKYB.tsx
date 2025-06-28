import { Component, createSignal } from "solid-js"
import { api } from "../services/api"
import type { MerchantKYBRequest } from "../types/api"

const MerchantKYB: Component = () => {
  const [legalName, setLegalName] = createSignal("")
  const [businessName, setBusinessName] = createSignal("")
  const [entityType, setEntityType] = createSignal("")
  const [taxId, setTaxId] = createSignal("")
  const [taxIdType, setTaxIdType] = createSignal<"tin" | "ein" | "ssn">("ein")
  const [accountHolderName, setAccountHolderName] = createSignal("")
  const [incorporationDate, setIncorporationDate] = createSignal("")

  // Address fields
  const [address1, setAddress1] = createSignal("")
  const [address2, setAddress2] = createSignal("")
  const [city, setCity] = createSignal("")
  const [state, setState] = createSignal("")
  const [zip5, setZip5] = createSignal("")
  const [country, setCountry] = createSignal("US")

  // Contact fields
  const [contactType, setContactType] = createSignal<
    "email" | "phone" | "website"
  >("email")
  const [contactValue, setContactValue] = createSignal("")

  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [success, setSuccess] = createSignal(false)

  const entityTypeOptions = [
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "partnership", label: "Partnership" },
    {
      value: "limited_liability_partnership",
      label: "Limited Liability Partnership",
    },
    { value: "limited_liability_company", label: "Limited Liability Company" },
    { value: "c_corporation", label: "C Corporation" },
    { value: "s_corporation", label: "S Corporation" },
    { value: "b_corporation", label: "B Corporation" },
    { value: "nonprofit_corporation", label: "Nonprofit Corporation" },
  ]

  const validateForm = (): string | null => {
    if (!legalName().trim()) {
      return "Legal name is required"
    }
    if (legalName().length > 255) {
      return "Legal name must be 255 characters or less"
    }

    if (businessName() && businessName().length > 255) {
      return "Business name must be 255 characters or less"
    }

    if (!entityType()) {
      return "Entity type is required"
    }

    if (!taxId().trim()) {
      return "Tax ID is required"
    }

    if (!/^\d{9}$/.test(taxId())) {
      return "Tax ID must be 9 digits"
    }

    if (!accountHolderName().trim()) {
      return "Account holder name is required"
    }

    if (accountHolderName().length > 255) {
      return "Account holder name must be 255 characters or less"
    }

    if (!incorporationDate()) {
      return "Incorporation date is required"
    }

    if (
      !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(incorporationDate())
    ) {
      return "Incorporation date must be in YYYY-MM-DD format"
    }

    if (
      !address1().trim() ||
      !city().trim() ||
      !state().trim() ||
      !zip5().trim()
    ) {
      return "Address fields are required"
    }

    if (!/^\d{5}$/.test(zip5())) {
      return "ZIP code must be 5 digits"
    }

    if (!contactValue().trim()) {
      return "Contact information is required"
    }

    if (contactValue().length > 255) {
      return "Contact value must be 255 characters or less"
    }

    // Validate contact value format based on type
    if (
      contactType() === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue())
    ) {
      return "Please enter a valid email address"
    }

    if (contactType() === "phone" && !/^\+?[\d\s\-()]+$/.test(contactValue())) {
      return "Please enter a valid phone number"
    }

    if (contactType() === "website" && !/^https?:\/\/.+/.test(contactValue())) {
      return "Please enter a valid website URL starting with http:// or https://"
    }

    return null
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      const kybData: MerchantKYBRequest = {
        legal_name: legalName().trim(),
        business_name: businessName().trim() || undefined,
        entity_type: entityType(),
        tax_id: taxId().trim(),
        tax_id_type: taxIdType(),
        account_holder_name: accountHolderName().trim(),
        incorporation_date: incorporationDate(),
        addresses: [
          {
            address1: address1().trim(),
            address2: address2().trim() || undefined,
            city: city().trim(),
            state: state().trim(),
            country: country(),
            zip5: zip5().trim(),
          },
        ],
        contacts: [
          {
            type: contactType(),
            value: contactValue().trim(),
          },
        ],
      }

      await api.submitMerchantKYB(kybData)

      setSuccess(true)

      // Reset form on success
      setLegalName("")
      setBusinessName("")
      setEntityType("")
      setTaxId("")
      setTaxIdType("ein")
      setAccountHolderName("")
      setIncorporationDate("")
      setAddress1("")
      setAddress2("")
      setCity("")
      setState("")
      setZip5("")
      setCountry("US")
      setContactType("email")
      setContactValue("")
    } catch (err) {
      console.error("Failed to submit KYB data:", err)
      setError("Failed to submit KYB information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Merchant KYB Verification
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Please provide your business information for verification.
        </p>
      </div>

      {success() ? (
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  class="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">
                KYB Information Submitted Successfully!
              </h3>
              <p class="mt-2 text-sm text-gray-600">
                Your KYB information has been submitted and is being reviewed.
                You will receive an update within the next 24 hours.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6" onSubmit={handleSubmit}>
              {/* Legal Name */}
              <div>
                <label
                  for="legalName"
                  class="block text-sm font-medium text-gray-700"
                >
                  Legal Name *
                </label>
                <input
                  id="legalName"
                  type="text"
                  required
                  value={legalName()}
                  onInput={(e) => setLegalName(e.currentTarget.value)}
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Legal business name as registered"
                  maxlength="255"
                />
              </div>

              {/* Business Name */}
              <div>
                <label
                  for="businessName"
                  class="block text-sm font-medium text-gray-700"
                >
                  Business Name (Trade Name)
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={businessName()}
                  onInput={(e) => setBusinessName(e.currentTarget.value)}
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Trade name or DBA"
                  maxlength="255"
                />
              </div>

              {/* Entity Type */}
              <div>
                <label
                  for="entityType"
                  class="block text-sm font-medium text-gray-700"
                >
                  Entity Type *
                </label>
                <select
                  id="entityType"
                  required
                  value={entityType()}
                  onChange={(e) => setEntityType(e.currentTarget.value)}
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select entity type</option>
                  {entityTypeOptions.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Tax ID */}
              <div>
                <label
                  for="taxId"
                  class="block text-sm font-medium text-gray-700"
                >
                  Tax ID (EIN/TIN/SSN) *
                </label>
                <input
                  id="taxId"
                  type="text"
                  required
                  value={taxId()}
                  onInput={(e) => setTaxId(e.currentTarget.value)}
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="9-digit tax ID"
                  pattern="\d{9}"
                  maxlength="9"
                />
              </div>

              {/* Tax ID Type */}
              <div>
                <label
                  for="taxIdType"
                  class="block text-sm font-medium text-gray-700"
                >
                  Tax ID Type *
                </label>
                <select
                  id="taxIdType"
                  required
                  value={taxIdType()}
                  onChange={(e) =>
                    setTaxIdType(e.currentTarget.value as "tin" | "ein" | "ssn")
                  }
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="ein">
                    EIN (Employer Identification Number)
                  </option>
                  <option value="tin">
                    TIN (Taxpayer Identification Number)
                  </option>
                  <option value="ssn">SSN (Social Security Number)</option>
                </select>
              </div>

              {/* Account Holder Name */}
              <div>
                <label
                  for="accountHolderName"
                  class="block text-sm font-medium text-gray-700"
                >
                  Account Holder Name *
                </label>
                <input
                  id="accountHolderName"
                  type="text"
                  required
                  value={accountHolderName()}
                  onInput={(e) => setAccountHolderName(e.currentTarget.value)}
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Name of account holder"
                  maxlength="255"
                />
              </div>

              {/* Incorporation Date */}
              <div>
                <label
                  for="incorporationDate"
                  class="block text-sm font-medium text-gray-700"
                >
                  Incorporation Date *
                </label>
                <input
                  id="incorporationDate"
                  type="date"
                  required
                  value={incorporationDate()}
                  onInput={(e) => setIncorporationDate(e.currentTarget.value)}
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Address Section */}
              <div class="border-t pt-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  Business Address *
                </h3>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div class="sm:col-span-2">
                    <label
                      for="address1"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Address Line 1 *
                    </label>
                    <input
                      id="address1"
                      type="text"
                      required
                      value={address1()}
                      onInput={(e) => setAddress1(e.currentTarget.value)}
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Street address"
                    />
                  </div>

                  <div class="sm:col-span-2">
                    <label
                      for="address2"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Address Line 2
                    </label>
                    <input
                      id="address2"
                      type="text"
                      value={address2()}
                      onInput={(e) => setAddress2(e.currentTarget.value)}
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Suite, unit, etc."
                    />
                  </div>

                  <div>
                    <label
                      for="city"
                      class="block text-sm font-medium text-gray-700"
                    >
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={city()}
                      onInput={(e) => setCity(e.currentTarget.value)}
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label
                      for="state"
                      class="block text-sm font-medium text-gray-700"
                    >
                      State *
                    </label>
                    <input
                      id="state"
                      type="text"
                      required
                      value={state()}
                      onInput={(e) => setState(e.currentTarget.value)}
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label
                      for="zip5"
                      class="block text-sm font-medium text-gray-700"
                    >
                      ZIP Code *
                    </label>
                    <input
                      id="zip5"
                      type="text"
                      required
                      value={zip5()}
                      onInput={(e) => setZip5(e.currentTarget.value)}
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="12345"
                      pattern="\d{5}"
                      maxlength="5"
                    />
                  </div>

                  <div>
                    <label
                      for="country"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Country *
                    </label>
                    <select
                      id="country"
                      required
                      value={country()}
                      onChange={(e) => setCountry(e.currentTarget.value)}
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="US">United States</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div class="border-t pt-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  Contact Information *
                </h3>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      for="contactType"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Contact Type *
                    </label>
                    <select
                      id="contactType"
                      required
                      value={contactType()}
                      onChange={(e) =>
                        setContactType(
                          e.currentTarget.value as "email" | "phone" | "website"
                        )
                      }
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="website">Website</option>
                    </select>
                  </div>

                  <div>
                    <label
                      for="contactValue"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Contact Value *
                    </label>
                    <input
                      id="contactValue"
                      type={contactType() === "email" ? "email" : "text"}
                      required
                      value={contactValue()}
                      onInput={(e) => setContactValue(e.currentTarget.value)}
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={
                        contactType() === "email"
                          ? "email@example.com"
                          : contactType() === "phone"
                            ? "+1 (555) 123-4567"
                            : "https://example.com"
                      }
                      maxlength="255"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error() && (
                <div class="rounded-md bg-red-50 p-4">
                  <div class="flex">
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">
                        {error()}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting()}
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting() ? "Submitting..." : "Submit KYB Information"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MerchantKYB
