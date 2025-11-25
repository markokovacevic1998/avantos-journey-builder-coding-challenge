# Journey Builder - Form Dependency Graph

A Next.js application for visualizing and managing form dependencies in a graph structure, with support for field prefill configuration from various sources.

This application is built as a coding challenge for the Avantos.ai.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

The application requires two services to run:

1. **Mock API Server** - Serves graph data
2. **Next.js Application** - The main UI

#### Option 1: Run in Separate Terminals

**Terminal 1 - Mock Server:**

```bash
npm run server
```

Server runs on `http://localhost:3333`

**Terminal 2 - Next.js App:**

```bash
npm run dev
```

Application runs on `http://localhost:3000`

#### Option 2: Use a Process Manager

For convenience, you can use tools like `concurrently` or `npm-run-all` to run both services simultaneously.

## 📁 Project Architecture

The project follows a clean, layered architecture with clear separation of concerns:

```
src/
├── app/                   # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main graph visualization page
│
├── components/            # React components
│   ├── graph/             # Graph visualization components
│   │   ├── NodesCanvas.tsx    # Renders form nodes
│   │   └── EdgesCanvas.tsx    # Renders connections
│   ├── prefill/           # Prefill configuration UI
│   │   ├── PrefillPanel.tsx   # Main prefill configuration panel
│   │   └── PrefillSelector.tsx # Source selection interface
│   └── ui/                # Reusable UI components
│       └── Modal.tsx      # Modal dialog component
│
├── context/               # React Context providers
│   └── GraphContext.tsx   # Global graph state management
│
└── lib/                   # Core business logic
    ├── api/               # API layer
    │   └── getRawGraphData.ts  # Fetches raw graph data
    │
    ├── domain/            # Domain logic & types
    │   ├── types.ts            # TypeScript type definitions
    │   ├── cleanGraphData.ts   # Data transformation
    │   ├── graphUtils.ts       # Graph traversal algorithms
    │   ├── prefill.ts          # Prefill type definitions
    │   ├── prefillProviders.ts # Provider pattern implementation
    │   └── globalSources.ts   # Global data sources
    │
    └── hooks/             # Custom React hooks
        ├── useGraphLayout.ts   # Graph layout calculations
        ├── useGraphBounds.ts   # Bounding box calculations
        └── usePrefillConfig.ts # Prefill state management
```

### Data Flow

1. **Data Fetching**: `getRawGraphData()` fetches raw JSON from the API
2. **Data Transformation**: `cleanGraphData()` transforms raw data into internal graph structure
3. **State Management**: `GraphContext` provides global access to graph data
4. **Visualization**: Components consume context and render the graph
5. **User Interactions**: User actions update prefill configuration via hooks

### Key Concepts

#### Graph Structure

The application models forms as nodes in a directed graph:

- **Nodes**: Represent forms with fields and metadata
- **Edges**: Represent dependencies (prerequisites) between forms
- **Upstream**: Forms that must be completed before the current form
- **Downstream**: Forms that depend on the current form

#### Layout Algorithm

The graph uses a custom layout algorithm (`useGraphLayout`) that:

- Calculates node positions based on dependencies
- Handles port positions for edge connections
- Maintains visual hierarchy

## 🔌 Provider Pattern

The application uses a **Provider Pattern** to abstract different sources of prefill data. This pattern allows the system to support multiple data sources while maintaining a consistent interface.

### Architecture

The provider pattern is implemented in `src/lib/domain/prefillProviders.ts`:

```typescript
interface PrefillSourceProvider {
  id: string;
  label: string;
  getForms: (
    graph: ActionGraph,
    formId: string
  ) => PrefillFormNode[] | undefined;
  getFields?: (form: PrefillFormNode) => { id: string; label: string }[];
}
```

### Available Providers

1. **Direct Upstream Provider** (`directUpstreamProvider`)
   - Returns forms that are direct prerequisites of the selected form
   - Used for immediate dependency relationships

2. **Transitive Upstream Provider** (`transitiveUpstreamProvider`)
   - Returns forms that are indirect prerequisites (prerequisites of prerequisites)
   - Used for deeper dependency chains

3. **Global Provider** (`globalProvider`)
   - Returns global data sources (e.g., user settings, app configuration)
   - Not tied to the graph structure

### How It Works

1. **Registration**: All providers are registered in the `prefillProviders` array
2. **Selection**: `PrefillSelector` component iterates through all providers
3. **Data Retrieval**: Each provider's `getForms()` method is called with the current graph and form ID
4. **Field Extraction**: Provider's `getFields()` method extracts available fields from selected forms
5. **Configuration**: User selections are stored as `FieldPrefillConfig` objects

### Benefits

- **Extensibility**: New data sources can be added by implementing the `PrefillSourceProvider` interface
- **Separation of Concerns**: Each provider encapsulates its own data retrieval logic
- **Testability**: Providers can be tested independently
- **Flexibility**: Different providers can use different strategies (graph traversal, API calls, static data)

### Example: Adding a New Provider

```typescript
export const customProvider: PrefillSourceProvider = {
  id: "custom",
  label: "Custom Source",

  getForms(graph, formId) {
    // Your custom logic here
    return customForms;
  },

  getFields(form) {
    return form.fields.map((f) => ({
      id: f.id,
      label: f.label || f.id,
    }));
  },
};

// Register it
export const prefillProviders: PrefillSourceProvider[] = [
  // ... existing providers
  customProvider,
];
```

## 🛠️ Development

### Available Scripts

- `npm run server` - Start Mock API server
- `npm run dev` - Start Next.js development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### TypeScript

The project is fully typed with TypeScript. Type definitions are centralized in `src/lib/domain/types.ts` and `src/lib/domain/prefill.ts`.

### State Management

- **Global State**: React Context (`GraphContext`) for graph data
- **Local State**: React hooks (`useState`, `usePrefillConfig`) for component-specific state
- **Derived State**: Custom hooks for computed values (layout, bounds)

## 📝 Notes

- The mock server serves static JSON data from `server/graph.json`
- Graph traversal uses memoization for performance (see `graphUtils.ts`)
- The application uses Tailwind CSS for styling
- All components are client-side rendered (`"use client"`)

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit Tests**: Test core domain logic (`graphUtils`, `prefillProviders`, `cleanGraphData`)
- **Hook Tests**: Test React hooks (`usePrefillConfig`)
- **Component Tests**: Test React components (`PrefillPanel`, `PrefillSelector`)

Run tests with:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### Test Structure

Tests are located alongside the code they test:

- `src/lib/domain/__tests__/` - Domain logic tests
- `src/lib/hooks/__tests__/` - Hook tests
- `src/components/**/__tests__/` - Component tests

## 🤝 Contributing

When adding new features:

1. Follow the existing architecture patterns
2. Add appropriate TypeScript types
3. Write tests for new functionality
4. Update this README if architecture changes
5. Ensure providers follow the `PrefillSourceProvider` interface
