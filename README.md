
# 📜 MiniState – Requirements

## Purpose

The MiniState library is designed to provide a clear, declarative, and component-centric approach to managing state across a UI, ensuring that state changes are predictable, isolated within components, and entirely driven by `data-*` attributes as the single source of truth.

## Requirements for the MiniState Library

### Predefined States Outside Components

**Purpose:** Predefined states should be defined outside of components to ensure separation of concerns and prevent tight coupling between component structure and application logic.

**Behavior:**
- Predefined states must be initialized globally or in a separate configuration script, not inside individual components.
- This ensures that state definitions are reusable and maintainable, promoting a clean and modular architecture.

### Declarative DOM Data Attributes as the Single Source of Truth

**Purpose:** The `data-*` attributes within each component are the single source of truth for state management. These attributes are defined only within the component's scope (i.e., within the root `div` or child elements of the component).

**Behavior:**
- The state of each component is represented by its `data-*` attributes.
- These `data-*` attributes serve as the state variables and are the only authoritative source for determining the state of a component.
- This approach is entirely declarative, ensuring that components' state is described explicitly in the HTML, rather than manipulated imperatively.

### Transactional State Changes with Predefined State Matching

**Purpose:** Ensure state changes are controlled, predictable, and aligned with predefined application states.

**Behavior:**
- State changes are transactional and must match predefined states to be valid.
- Upon a valid state change request, the MiniState library updates `data-*` attributes and, consequently, the bound DOM properties.

### Component Structure

MiniTemplate’s components are modular, with component IDs, scoped CSS, and collision-free JavaScript. Here’s an example of how a component is structured, showcasing the best practices for performance and maintainability:

**Code Example:**

```html
<div id="button_default" class="btn" aria-label="Button Component">
    Click Me
    <script>
        // local state
        (() => {
            let clicked = false;
            document.getElementById('button_default').addEventListener('click', () => {
                clicked = !clicked;
                console.log('Button clicked:', clicked);
            });
        })();
    </script>
</div>
```

## Predefined State Examples

To ensure predictable and controlled state changes, MiniState supports predefined state configurations. Here’s an example of defining and initializing predefined states for components:

```html
<script>
  const predefinedStates = {
    "SIDEBAR_HIDDEN": {
      "sidebarComponent.data-state": "hidden",
      "toggleButton.data-text": "Show Sidebar"
    },
    "SIDEBAR_VISIBLE": {
      "sidebarComponent.data-state": "visible",
      "toggleButton.data-text": "Hide Sidebar"
    }
  };

  MiniState.init(predefinedStates);
</script>
```

## Examples of MiniState Integration in Components

### Declarative DOM Data Attributes as the Single Source of Truth

This example shows how to use `data-*` attributes to manage the state of a sidebar component.

```html
<div id="sidebarComponent" data-state="hidden" class="bg-neutral w-64 h-full hidden">
  <script>
    MiniState.initComponentState("sidebarComponent");
    MiniState.watch("sidebarComponent.data-state", (value) => {
      MiniState.requestLocalStateChange("toggleButton.data-text", value === "hidden" ? "Show Sidebar" : "Hide Sidebar");
    });
  </script>
</div>
```

### Transactional State Changes with Predefined State Matching

This example shows how to update a button's text based on the current state of the sidebar.

```html
<div id="buttonComponent" data-click="false">
  <button id="toggleButton" class="btn btn-primary">Show Sidebar</button>
  <script>
    MiniState.watch("sidebarComponent.data-state", (value) => {
      MiniState.requestLocalStateChange("toggleButton.data-text", value === "hidden" ? "Show Sidebar" : "Hide Sidebar");
    });
  </script>
</div>
```

### Component-Centric Data Binding

This example shows how to use the `wire` method to bind a `data-*` attribute to a DOM property.

```html
<div id="buttonComponent" data-click="false">
  <button id="toggleButton" class="btn btn-primary">Show Sidebar</button>
  <script>
    MiniState.wire("toggleButton", "data-click", "textContent");
  </script>
</div>
```

### Event-Driven Asynchronous Operations

This example shows how to trigger an asynchronous operation, such as fetching data.

```html
<div id="fetchComponent">
  <button id="fetchButton" data-loading="false">Fetch Data</button>
  <script>
    MiniState.registerEvent("fetchButton", "click", "fetchComponent.data-loading");
  </script>
</div>
```

### Reactive State Watching Without Direct UI Updates

This example shows how to use the `watch` method to reactively respond to state changes.

```html
<div id="reactiveComponent" data-active="false">
  <script>
    MiniState.watch("reactiveComponent.data-active", (value) => {
      console.log("Component active state: ", value);
    });
  </script>
</div>
```

### Cleanup Mechanisms for Watchers and Asynchronous Operations

This example shows how to use the `watch` method with a cleanup mechanism.

```html
<div id="cleanupComponent">
  <script>
    const unsubscribe = MiniState.watch("sidebarComponent.data-state", (value) => {
      console.log("Sidebar state changed.", value);
    });
    unsubscribe();
  </script>
</div>
```
### More Examples
```html
<!-- Sidebar Component -->
<div id="sidebarComponent" data-class="hidden" class="bg-neutral w-64 h-full fixed top-0 left-0 flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-10 hidden">
  <div class="h-16 flex items-center justify-between px-4">
    <button class="toggleSidebarButton text-accent" aria-label="Toggle Sidebar">☰</button>
  </div>

  <nav class="flex-1 p-4">
    <ul class="menu w-full">
      <li>Sidebar Entry</li>
    </ul>
  </nav>

  <script>
    MiniState.wire("sidebarComponent", "data-class", "classList", { toggleClass: "hidden" });

    MiniState.watch("buttonComponent.data-click", (value) => {
      MiniState.requestStateChange("sidebarComponent.data-class", value === "true" ? "" : "hidden");
    });
  </script>
</div>

<!-- Button Component -->
<div id="buttonComponent" data-click="false" class="flex justify-center items-center w-full h-full">
  <button id="toggleButton" class="btn btn-primary" data-text="Show Sidebar">Show Sidebar</button>

  <script>
    MiniState.wire("toggleButton", "data-text", "textContent");
    MiniState.registerEvent("toggleButton", "click", "buttonComponent.data-click");

    MiniState.watch("buttonComponent.data-click", (value) => {
      MiniState.requestStateChange("toggleButton.data-text", value === "true" ? "Hide Sidebar" : "Show Sidebar");
    });
  </script>
</div>
```



## Fully Declarative Setup
- Ensure a fully declarative setup, with no reliance on `document.getElementById` or similar direct DOM querying methods.
- All state changes and DOM interactions must derive solely from `data-*` attributes and declarative bindings.

## Component Scope and Local State Isolation
- Components should only manage and watch their own state changes, without altering other components' states directly.
- Components should only request changes to their internal state without controlling the outcome of the state change.

## Predefined States as Part of the API
- `predefinedStates` should be part of the API, allowing developers to define and configure them outside the MiniState library for flexible, user-defined state management.

## Transactional State Changes with Full State Match Requirement
- State transitions should apply only after a full predefined state match, avoiding partial state updates unless the entire transition is valid.

## No Hardcoded Values in MiniState Library
- Avoid hardcoded values or CSS class toggling (e.g., 'hidden') in the library to ensure full customization.

## Error Handling for Naming Conventions
- Implement error handling to verify correct naming conventions for component IDs, child element IDs, and data attributes, avoiding misconfiguration.

## Declarative Event and Element Binding
- Components should use declarative bindings for events and elements, without requiring imperative `bind` calls within scripts.
- Bind events and elements using `data-bind="element"` or `data-bind="event"` in HTML attributes.

## Data Attributes as State and Event Triggers
- Treat events and state changes as external triggers managed through `data-*` attributes, without distinguishing between them.

## Hierarchical Naming for Child IDs
- Use a hierarchical format for child IDs within components (e.g., `toggleButton` without component prefixes).

## Universal State Representation with `data-response`
- Use `data-response` to represent the final response or output, with intermediate states marked by attributes like `data-idle`, `data-ongoing`, etc.

## Marker Attribute for Fetch Status
- Introduce a marker attribute to indicate fetch status.

## Standardized State Name for Loading
- Use `loading` as a universal state name for in-progress or loading states.

## Console Logging for State Transitions Only
- Limit console logging to final state transitions or complete state objects, avoiding unnecessary logs.

## Uniform API Naming Conventions
- Ensure consistent naming conventions across the API (e.g., avoid using `content` for one element and `placeholder` for another) to maintain uniformity.

## Final State Indicated by `data-response` Only
- Use `data-response` solely for final outputs, such as API responses or completed actions, without including placeholders or intermediate values.

## Embedded `<script>` Tags in Components
- Each component must have an embedded `<script>` tag inside the root `<div>` element (e.g., `<div id="myComponent"><script>...</script></div>`).

## Component State Derived from HTML
- Component state must be derived directly from `data-*` attributes in HTML as the single source of truth, with no imperative initialization in `init` or components.

