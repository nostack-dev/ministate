# 📜 MiniState – State Control Made Easy

## Requirements for the MiniState Library

### Tailwind CSS and DaisyUI Integration

**Purpose:** The MiniState library requires the use of Tailwind CSS and DaisyUI to maintain a consistent and maintainable design language across components.

**Behavior:**

- Tailwind CSS and DaisyUI are mandatory for styling components.
- Only `classList` items from Tailwind CSS or DaisyUI are used for styling; no inline styles, `<style>` tags, or other styling options are allowed.
- Script tags within components should not be used for styling purposes; styling must be fully declarative using class names provided by Tailwind CSS or DaisyUI.

### Declarative DOM Data Attributes as the Single Source of Truth

**Purpose:** The `data-*` attributes within each component are the single source of truth for state management. These attributes are defined only within the component's scope (i.e., within the root `div` or child elements of the component).

**Example:**

```html
<div id="button_default" class="btn" aria-label="Button Component" data-state="default">
    Click Me
    <script>
        // local state
        (() => {
            // Function stub for future logic
        })();
    </script>
</div>
```

**Behavior:**

- The state of each component is represented by its `data-*` attributes.
- These `data-*` attributes serve as the state variables and are the only authoritative source for determining the state of a component.
- This approach is entirely declarative, ensuring that components' state is described explicitly in the HTML, rather than manipulated imperatively through direct DOM operations.

### Component-Centric Data Binding

**Purpose:** Each component is solely responsible for binding its own `data-*` attributes to specific DOM elements within its own component tree.

**Behavior:**

- The `wire` method is invoked exclusively within a component to bind a `data-*` attribute to a DOM property of another DOM element that is part of the same component's DOM subtree.
- No cross-component bindings are allowed; bindings are strictly encapsulated within individual components.
- We only wire inside components. We only wire component attributes that are part of the component's HTML DOM tree.

### Dynamic and Non-Hardcoded State Initialization

**Purpose:** Ensure flexibility and scalability by avoiding hardcoded state keys within the library.

**Behavior:**

- The `init` method dynamically initializes state based on the `data-*` attributes present in the DOM elements of each component.
- No hardcoded state keys; all state keys are derived programmatically from the component's `data-*` attributes.

### Separation of Concerns Between Components and State Management

**Purpose:** Maintain a clear boundary between UI components and the state management logic to enhance maintainability and scalability.

**Behavior:**

- Components do not handle asynchronous operations (e.g., data fetching) directly.
- All asynchronous operations are managed internally within the MiniState library in response to specific state change requests.

### Event-Driven Asynchronous Operations

**Purpose:** Trigger asynchronous operations declaratively in response to user interactions or other events.

**Behavior:**

- When a specific event occurs (e.g., a user clicks a button), the MiniState library handles the asynchronous operation (e.g., a Fetch API call) internally.
- The asynchronous operation is triggered by a state change request from the component, ensuring that all data fetching logic remains within the state management layer.

### Transactional State Changes with Predefined State Matching

**Purpose:** Ensure that state changes occur in a controlled, predictable manner that aligns with predefined application states.

**Behavior:**

- State changes are transactional, meaning they must match predefined states to be considered valid.
- Predefined combinations of local states of the components must match in order to transition to a predefined state.
- Partial changes of local state do not affect the DOM. A state must fully match a predefined state for the transaction to complete.
- Without a full match, no transaction is considered complete, and without transaction completeness, no changes to the `data-*` attributes of the components are made.
- The `data-*` attributes of components are the state variables and the single source of truth for this approach.
- Upon a valid state change request, the MiniState library updates the corresponding `data-*` attributes and, consequently, the bound DOM properties.
- No direct state mutations outside of these controlled transactions are permitted.

### Reactive State Watching Without Direct UI Updates

**Purpose:** Allow components to reactively respond to state changes without directly manipulating the UI.

**Behavior:**

- Components can watch specific state keys relevant to them.
- When a watched state changes, the component requests a state change to update its local state.
- Components do not directly update the UI; instead, they rely on the MiniState library to handle DOM updates based on state changes.
- We only watch inside components. We do not watch outside components.

### Internal Notification Mechanism for State Changes

**Purpose:** Facilitate communication between the state management layer and the components that depend on specific state keys.

**Behavior:**

- When a state change occurs, the MiniState library notifies all components that are watching the affected state keys.
- Components owning the watched state can then request further state changes as needed, maintaining a consistent and predictable flow of state transitions.
- We do not request local state changes outside components.

### No Direct UI Manipulation by Components

**Purpose:** Uphold the declarative nature of the state management paradigm by preventing components from directly altering the UI based on state changes.

**Behavior:**

- Components do not perform any direct DOM manipulations in response to state changes.
- All UI updates are automatically handled by the MiniState library based on the bound `data-*` attributes and their corresponding DOM properties.

### Scalability and Reusability

**Purpose:** Ensure that the MiniState library can accommodate an increasing number of components and state bindings without degradation in performance or maintainability.

**Behavior:**

- The architecture supports easy addition of new components and bindings.
- Minimal boilerplate code is required when integrating new components, promoting reusability.

### Robust Error Handling and User Feedback

**Purpose:** Provide clear and consistent feedback to users during asynchronous operations, especially in failure scenarios.

**Behavior:**

- The MiniState library manages error states and updates relevant `data-*` attributes to reflect error conditions.
- Components can watch error-related state keys to display appropriate error messages or fallback UI elements without embedding error handling logic within themselves.

### Cleanup Mechanisms for Watchers and Asynchronous Operations

**Purpose:** Prevent memory leaks and unintended side effects by managing the lifecycle of watchers and asynchronous operations.

**Behavior:**

- The MiniState library provides methods to unsubscribe watchers when components are unmounted or no longer need to observe certain state keys.
- Asynchronous operations can be canceled or cleaned up as necessary to maintain optimal performance.

### Consistent Naming Conventions for State Keys

**Purpose:** Enhance code readability and reduce the likelihood of errors in state key management.

**Behavior:**

- Adopt a standardized naming convention (e.g., camelCase or snake\_case) for all state keys.
- State keys are derived consistently from component `data-*` attributes to ensure clarity and uniformity.

### Requirements Checklist

-

### MiniTemplate Components Best Practices

MiniTemplate's components are designed to be modular and maintainable by using a clear structure that ensures separation of concerns. Below, we provide examples of how components can be implemented with unique component IDs, scoped CSS, and JavaScript encapsulation, following best practices for declarative state management.

MiniTemplate's components are modular, with unique component IDs, scoped CSS, and collision-free JavaScript. Below are some examples showcasing best practices for performance and maintainability:

**Sidebar Component Example:**
This example demonstrates how the sidebar component is structured to be fully controlled via the `MiniState` library. The component state is managed through `data-*` attributes, ensuring that the visibility of the sidebar is determined declaratively. The `MiniState` library handles wiring the `data-class` attribute to update the `classList`, allowing the sidebar to show or hide based on the current state.

```html
<div id="sidebarComponent" data-state="closed" class="bg-neutral w-64 h-full fixed top-0 left-0 flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-10 hidden">
    <div class="h-16 flex items-center justify-between px-4">
        <button class="toggleSidebarButton text-accent" aria-label="Toggle Sidebar">☰</button>
    </div>
    <nav class="flex-1 p-4">
        <ul class="menu w-full">
            <li>sidebar entry</li>
        </ul>
    </nav>
    <script>
        MiniState.wire("sidebarComponent", "data-class", "classList", { toggleClass: "hidden" });
        MiniState.watch("buttonComponent.data-click", (value) => {
            MiniState.requestStateChange("sidebarComponent.data-class", value === "true" ? "" : "hidden");
        });
    </script>
</div>
```

**Button Component Example:**
This example shows how a button component can be used to control the sidebar's visibility. The button's `data-click` state is managed through `MiniState`, and the text displayed on the button updates dynamically based on the sidebar's visibility state. The entire interaction is controlled declaratively, with `MiniState` ensuring consistent and predictable behavior.

```html
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

### MiniTemplate Components Best Practices

MiniTemplate's components are modular, with unique component IDs, scoped CSS, and collision-free JavaScript. Here's an example of how a component is structured, showcasing the best practices for performance and maintainability:

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

