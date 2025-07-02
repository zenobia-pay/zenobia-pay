#!/usr/bin/env tsx

import { Octokit } from "@octokit/rest"
import { execSync } from "child_process"
import { writeFileSync } from "fs"
import yaml from "js-yaml"
import "dotenv/config"

// Check if we're in a Node.js environment
if (typeof process === "undefined" || !process.versions?.node) {
  throw new Error("This script must be run in a Node.js environment")
}

// Configuration
const GITHUB_REPO = "zenobia-pay/core"
const GITHUB_BRANCH = "prod"
const OPENAPI_FILE_PATH = "openapi.yml"
const OUTPUT_TYPES_FILE = "src/types/generated-api.ts"
const OUTPUT_SERVICES_FILE = "src/services/generated-api.ts"

interface GenerateApiOptions {
  githubToken?: string
  outputDir?: string
}

interface OpenApiSchema {
  type?: string
  enum?: unknown[]
  properties?: Record<string, OpenApiSchema>
  required?: string[]
  items?: OpenApiSchema
  $ref?: string
}

interface OpenApiSpec {
  components?: {
    schemas?: Record<string, OpenApiSchema>
  }
  paths?: Record<string, Record<string, OpenApiOperation>>
}

interface OpenApiOperation {
  operationId?: string
  parameters?: OpenApiParameter[]
  requestBody?: {
    content: {
      "application/json": {
        schema: OpenApiSchema
      }
    }
  }
  responses?: {
    "200"?: {
      content?: {
        "application/json"?: {
          schema: OpenApiSchema
        }
      }
    }
  }
}

interface OpenApiParameter {
  name: string
  in: string
}

async function fetchOpenApiSpec(options: GenerateApiOptions = {}) {
  const { githubToken = process.env.GITHUB_TOKEN } = options

  if (!githubToken) {
    throw new Error(
      "GitHub token is required. Set GITHUB_TOKEN environment variable or pass it as an option."
    )
  }

  const octokit = new Octokit({
    auth: githubToken,
  })

  try {
    console.log(
      `Fetching OpenAPI spec from ${GITHUB_REPO}/${GITHUB_BRANCH}/${OPENAPI_FILE_PATH}...`
    )

    const response = await octokit.repos.getContent({
      owner: "zenobia-pay",
      repo: "core",
      path: OPENAPI_FILE_PATH,
      ref: GITHUB_BRANCH,
    })

    if ("content" in response.data) {
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8"
      )
      console.log("✅ Successfully fetched OpenAPI spec")
      return content
    } else {
      throw new Error("Failed to fetch OpenAPI spec content")
    }
  } catch (error) {
    console.error("❌ Error fetching OpenAPI spec:", error)
    throw error
  }
}

function generateTypesFromOpenApi(openApiContent: string): string {
  try {
    console.log("Generating TypeScript types from OpenAPI spec...")

    // Parse YAML to JSON
    const openApiJson = yaml.load(openApiContent) as OpenApiSpec

    // Generate TypeScript types using openapi-typescript
    const types = generateTypesFromSpec(openApiJson)

    console.log("✅ Successfully generated TypeScript types")
    return types
  } catch (error) {
    console.error("❌ Error generating types:", error)
    throw error
  }
}

function generateTypesFromSpec(spec: OpenApiSpec): string {
  let types = `// Auto-generated from OpenAPI spec
// Generated on: ${new Date().toISOString()}
// Source: ${GITHUB_REPO}/${GITHUB_BRANCH}/${OPENAPI_FILE_PATH}

`

  // Generate enums
  if (spec.components?.schemas) {
    for (const [name, schema] of Object.entries(spec.components.schemas)) {
      if (schema.enum) {
        types += `export enum ${name} {\n`
        for (const enumValue of schema.enum) {
          const key =
            typeof enumValue === "string" ? enumValue.toUpperCase() : enumValue
          types += `  ${key} = "${enumValue}",\n`
        }
        types += `}\n\n`
      }
    }
  }

  // Generate interfaces
  if (spec.components?.schemas) {
    for (const [name, schema] of Object.entries(spec.components.schemas)) {
      if (schema.type === "object" && schema.properties) {
        types += `export interface ${name} {\n`
        for (const [propName, propSchema] of Object.entries(
          schema.properties
        )) {
          const type = getTypeScriptType(propSchema, spec.components?.schemas)
          const required = schema.required?.includes(propName) ? "" : "?"
          types += `  ${propName}${required}: ${type}\n`
        }
        types += `}\n\n`
      }
    }
  }

  // Generate API response types
  if (spec.paths) {
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (
          method === "get" ||
          method === "post" ||
          method === "put" ||
          method === "delete"
        ) {
          if (
            operation.responses?.["200"]?.content?.["application/json"]?.schema
          ) {
            const responseSchema =
              operation.responses["200"].content["application/json"].schema
            const responseType = getTypeScriptType(
              responseSchema,
              spec.components?.schemas
            )
            const operationId =
              operation.operationId ||
              `${method}${path.replace(/[^a-zA-Z0-9]/g, "")}`
            types += `export type ${operationId}Response = ${responseType}\n\n`
          }
        }
      }
    }
  }

  return types
}

function getTypeScriptType(
  schema: OpenApiSchema,
  components?: Record<string, OpenApiSchema>
): string {
  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop()
    return refName || "any"
  }

  if (schema.type === "string") {
    if (schema.enum) {
      return schema.enum.map((e) => `"${e}"`).join(" | ")
    }
    return "string"
  }

  if (schema.type === "number" || schema.type === "integer") {
    return "number"
  }

  if (schema.type === "boolean") {
    return "boolean"
  }

  if (schema.type === "array") {
    const itemType = getTypeScriptType(schema.items!, components)
    return `${itemType}[]`
  }

  if (schema.type === "object") {
    if (schema.properties) {
      let objType = "{\n"
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const type = getTypeScriptType(propSchema, components)
        const required = schema.required?.includes(propName) ? "" : "?"
        objType += `  ${propName}${required}: ${type}\n`
      }
      objType += "}"
      return objType
    }
    return "Record<string, any>"
  }

  return "any"
}

function generateApiService(openApiContent: string): string {
  try {
    console.log("Generating API service from OpenAPI spec...")

    const spec = yaml.load(openApiContent) as OpenApiSpec
    let service = `// Auto-generated API service from OpenAPI spec
// Generated on: ${new Date().toISOString()}
// Source: ${GITHUB_REPO}/${GITHUB_BRANCH}/${OPENAPI_FILE_PATH}

import { api } from "./api"
import type {
`

    // Import types
    if (spec.components?.schemas) {
      for (const [name, schema] of Object.entries(spec.components.schemas)) {
        if (schema.type === "object" || schema.enum) {
          service += `  ${name},\n`
        }
      }
    }

    service += `} from "../types/generated-api"

export const generatedApi = {
`

    // Generate API methods
    if (spec.paths) {
      for (const [path, methods] of Object.entries(spec.paths)) {
        for (const [method, operation] of Object.entries(methods)) {
          if (
            method === "get" ||
            method === "post" ||
            method === "put" ||
            method === "delete"
          ) {
            const operationId =
              operation.operationId ||
              `${method}${path.replace(/[^a-zA-Z0-9]/g, "")}`

            service += `  ${operationId}: async (`

            // Add parameters
            const params: string[] = []
            if (operation.parameters) {
              for (const param of operation.parameters) {
                if (param.in === "path") {
                  params.push(`${param.name}: string`)
                } else if (param.in === "query") {
                  params.push(`${param.name}?: string`)
                }
              }
            }

            if (operation.requestBody) {
              params.push(
                `data: ${getTypeScriptType(operation.requestBody.content["application/json"].schema, spec.components?.schemas)}`
              )
            }

            service += params.join(", ")
            service += `) => {\n`
            service += `    return api.${method.toLowerCase()}(\`${path}\`${operation.requestBody ? ", data" : ""})\n`
            service += `  },\n\n`
          }
        }
      }
    }

    service += `}\n`
    console.log("✅ Successfully generated API service")
    return service
  } catch (error) {
    console.error("❌ Error generating API service:", error)
    throw error
  }
}

async function main() {
  try {
    console.log("🚀 Starting API generation...")

    // Fetch OpenAPI spec
    const openApiContent = await fetchOpenApiSpec()

    // Generate types
    const types = generateTypesFromOpenApi(openApiContent)

    // Generate API service
    const service = generateApiService(openApiContent)

    // Write files
    writeFileSync(OUTPUT_TYPES_FILE, types)
    writeFileSync(OUTPUT_SERVICES_FILE, service)

    console.log(`✅ Generated files:`)
    console.log(`   - ${OUTPUT_TYPES_FILE}`)
    console.log(`   - ${OUTPUT_SERVICES_FILE}`)

    // Format files with prettier if available
    try {
      execSync(
        "npx prettier --write " +
          OUTPUT_TYPES_FILE +
          " " +
          OUTPUT_SERVICES_FILE,
        {
          stdio: "inherit",
        }
      )
      console.log("✅ Formatted generated files")
    } catch {
      console.log("⚠️  Prettier not available, skipping formatting")
    }

    console.log("🎉 API generation completed successfully!")
  } catch (error) {
    console.error("❌ API generation failed:", error)
    process.exit(1)
  }
}

// Run the script
main()
