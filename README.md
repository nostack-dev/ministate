# 📜 MiniState – State Control Made Easy

## Purpose
The MiniState library is designed to provide a clear, declarative, and component-centric approach to managing state across a UI, ensuring that state changes are predictable, isolated within components, and entirely driven by `data-*` attributes as the single source of truth.

## Requirements for the MiniState Library

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

### Dynamic and Non-Hardcoded State Initialization
**Purpose:** Ensure flexibility and scalability by avoiding hardcoded state keys within the library.

**Behavior:**
- The `init` method dynamically initializes state based on the `data-*` attributes present in the DOM elements of each component.
- No hardcoded state keys; all state keys are derived programmatically.

### Component-Centric Data Binding
**Purpose:** Each component is solely responsible for binding its own `data-*` attributes to specific DOM elements within its own component tree.

**Behavior:**
- The `wire` method is invoked exclusively within a component to bind a `data-*` attribute to a DOM property of another DOM element that is part of the same component's DOM subtree.
- No cross-component bindings are allowed; bindings are strictly encapsulated within individual components.
- `watch`, `wire`, and `requestLocalStateChange` functions and callbacks must only be used within a component's scope.

### Tailwind CSS and DaisyUI Integration
**Purpose:** The MiniState library requires the use of Tailwind CSS and DaisyUI to maintain a consistent and maintainable design language across components.

**Behavior:**
- Tailwind CSS and DaisyUI are mandatory for styling components.
- Only `classList` items from Tailwind CSS or DaisyUI are used for styling; no inline styles, `<style>` tags, or other styling options are allowed.
- Script tags within components should not be used for styling purposes; styling must be fully declarative using class names provided by Tailwind CSS or DaisyUI.

### Separation of Concerns Between Components and State Management
**Purpose:** Maintain a clear boundary between UI components and the state management logic to enhance maintainability.

**Behavior:**
- Components do not handle asynchronous operations (e.g., data fetching) directly.
- All asynchronous operations are managed internally within the MiniState library in response to specific state change requests.

### Event-Driven Asynchronous Operations
**Purpose:** Trigger asynchronous operations declaratively in response to user interactions or other events.

**Behavior:**
- Asynchronous operations are triggered by state change requests within the library in response to component events.

### Reactive State Watching Without Direct UI Updates
**Purpose:** Allow components to reactively respond to state changes without directly manipulating the UI.

**Behavior:**
- Components watch specific state keys and request state changes to update their local state without directly updating the UI.

### Internal Notification Mechanism for State Changes
**Purpose:** Facilitate communication between the state management layer and components depending on specific state keys.

**Behavior:**
- MiniState notifies all components watching affected state keys, allowing them to request further state changes.

### No Direct UI Manipulation by Components
**Purpose:** Uphold the declarative nature of state management by preventing components from directly altering the UI based on state changes.

**Behavior:**
- UI updates are managed by MiniState, with no direct DOM manipulations in response to state changes.

### Robust Error Handling and User Feedback
**Purpose:** Provide consistent feedback during asynchronous operations.

**Behavior:**
- MiniState manages error states and updates relevant `data-*` attributes to reflect error conditions.

### Scalability and Reusability
**Purpose:** Support an increasing number of components and state bindings without performance degradation.

**Behavior:**
- Supports easy addition of new components and bindings with minimal boilerplate.

### Cleanup Mechanisms for Watchers and Asynchronous Operations
**Purpose:** Prevent memory leaks and manage watchers' and asynchronous operations' lifecycle.

**Behavior:**
- MiniState provides methods to unsubscribe watchers and clean up asynchronous operations.

## Requirements Checklist

1. Utilize `data-*` attributes within each component as the single source of truth for state management.
2. Ensure state changes are transactional, fully matching predefined states to update the DOM.
3. Initialize state dynamically based on `data-*` attributes without hardcoding state keys.
4. Bind `data-*` attributes only within a component's own DOM subtree using the `wire` method.
5. Use Tailwind CSS and DaisyUI exclusively for styling without inline styles or `<style>` tags.
6. Maintain separation of concerns by handling asynchronous operations within MiniState.
7. Perform asynchronous operations internally within MiniState in response to state change requests.
8. Components can watch specific state keys and request state changes without updating the UI.
9. Notify components internally about state changes they are watching to enable transitions.
10. Prevent components from performing direct DOM manipulations; UI updates handled by MiniState.
11. Handle errors within MiniState, updating `data-*` attributes for feedback.
12. Ensure easy addition of components and bindings for scalability and reusability.
13. Provide cleanup methods for watchers and asynchronous operations to prevent memory leaks.

