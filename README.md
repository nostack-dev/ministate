
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

These examples show how the MiniState library integrates seamlessly into components, ensuring modular, maintainable, and collision-free code.
