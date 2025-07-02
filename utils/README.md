# API Generation Script

This script fetches the OpenAPI specification from the private GitHub repository and generates TypeScript types and API endpoints. **This script is for local development only and will not affect your Cloudflare Workers deployment.**

## Prerequisites

1. **GitHub Token**: You need a GitHub personal access token with access to the private repository `zenobia-pay/core`.

2. **Environment Variable**: Set the `GITHUB_TOKEN` environment variable:
   ```bash
   export GITHUB_TOKEN=your_github_token_here
   ```

3. **Node.js Environment**: This script must be run in a Node.js environment (not in Cloudflare Workers).

## Usage

Run the script using npm:

```bash
npm run generate-api
```

Or directly with tsx:

```bash
npx tsx utils/generate-api.ts
```

## What it does

1. **Fetches OpenAPI Spec**: Downloads the `openapi.yml` file from the `prod` branch of the `zenobia-pay/core` repository
2. **Generates Types**: Creates TypeScript type definitions in `src/types/generated-api.ts`
3. **Generates API Service**: Creates API service functions in `src/services/generated-api.ts`
4. **Formats Code**: Automatically formats the generated files with Prettier (if available)

## Generated Files

- `src/types/generated-api.ts`: TypeScript interfaces, enums, and response types
- `src/services/generated-api.ts`: API service functions that use the existing `api` service

## Configuration

You can modify the following constants in `utils/generate-api.ts`:

- `GITHUB_REPO`: Repository name (default: "zenobia-pay/core")
- `GITHUB_BRANCH`: Branch name (default: "prod")
- `OPENAPI_FILE_PATH`: Path to OpenAPI file (default: "openapi.yml")
- `OUTPUT_TYPES_FILE`: Output path for types (default: "src/types/generated-api.ts")
- `OUTPUT_SERVICES_FILE`: Output path for services (default: "src/services/generated-api.ts")

## Error Handling

The script will:
- Validate that a GitHub token is provided
- Ensure it's running in a Node.js environment
- Handle authentication errors gracefully
- Provide clear error messages for common issues
- Exit with code 1 on failure

## Integration

The generated API service can be imported and used alongside your existing API service:

```typescript
import { generatedApi } from "./services/generated-api"

// Use the generated API functions
const result = await generatedApi.someOperation()
```

## Deployment Safety

- All script dependencies are in `devDependencies`, so they won't be included in your Cloudflare Workers deployment
- The script includes a Node.js environment check to prevent accidental execution in non-Node environments
- Generated files are committed to your repository and will be available in your deployment