# 📜 MiniState – Streamlined Approach

## Purpose
The MiniState library is designed to provide a minimal, declarative, and component-centric approach to managing state across a UI, ensuring that state changes are predictable, isolated within components, and driven by HTML's native properties and events as the single source of truth.

## Goals of MiniState

### Declarative, Clean API
- The API is designed to be intuitive and minimal, leveraging existing HTML properties and events.

### Standardized Properties and Events
- MiniState aligns with existing HTML conventions, using familiar properties and events.
- This approach makes the API easy to learn and adopt.

### Focused State Management
- MiniState uses a curated list of properties and events to keep the API streamlined, covering common use cases without unnecessary complexity.

## Key Features of the New MiniState API

### Simplified Watching with Standard Properties and Events
**Purpose:** MiniState tracks changes using a restricted set of properties and events. This whitelist allows only essential HTML-conform properties and events, keeping MiniState intuitive and minimalistic.

**Allowed Watch Properties and Events:**
- **Text and Content:** `data-textContent`, `data-innerHTML`, `data-value`
- **User Interactions:** `data-click`, `dta-input`, `data-change`, `data-submit`
- **Styling and Visibility:** `data-className`, `data-classList`
- **Form States:** `data-checked`, `data-selected`, `data-disabled`
- **API Requests:** `data-fetch` (property for managing asynchronous requests)


### Unified, Intuitive Watch Syntax
**Purpose:** The `watch` function has been simplified to accept the element ID as the first argument and the specific property or event as the second, making the setup clear and easy.

**Example:**
```javascript
MiniState.watch("toggleButton", "data-textContent", (value) => {
  console.log("Button text changed:", value);
});
```

### Automatic Change Detection with Class Toggling Support
**Purpose:** MiniState supports visibility toggling using `data-classList`, aligned with frameworks like Tailwind CSS. Visibility is managed by adding or removing a `hidden` class.

**Example:**
```javascript
MiniState.requestLocalStateChange("myElement", "data-classList", "hidden" ? "" : "hidden");
```

### Declarative API for Asynchronous Operations (`fetch`)
**Purpose:** The `fetch` property allows declarative tracking of API request states (e.g., loading, success, error), making asynchronous operations integral to MiniState’s functionality without custom setup.

**Example:**
```javascript
MiniState.watch("dataComponent", "data-fetch", (status, data) => {
  if (status === "loading") {
    console.log("Fetching data...");
  }
});
```

### No Redundant Attributes or Wiring in the DOM
**Purpose:** MiniState leverages standard HTML properties and events directly in the script, eliminating the need for custom `data-*` attributes or complex wiring configurations.

**Example:**
```html
<div id="buttonComponent">
  <button data-click= "false" id="toggleButton">Toggle State</button>
  <script>
    MiniState.watch("toggleButton", "data-click", (isClicked) => {
      console.log("Button clicked");
    });
  </script>
</div>
```

## Summary of Benefits
- **Simplified Code:** MiniState watches only necessary changes, reducing setup complexity.
- **Enhanced Readability:** The concise watch API improves readability by focusing on essential attributes and events.
- **Declarative Asynchronous Support:** With `data-fetch` added, MiniState seamlessly handles API states within the component lifecycle.
- **HTML Alignment:** The approach is closely aligned with HTML standards, ensuring compatibility and ease of use for developers.

## Properties Whitelist

```js
const allowedWatchProperties = [
  "data-textContent",   // Text within elements
  "data-innerHTML",     // HTML content within elements
  "data-value",         // Value of form fields like <input> and <textarea>
  "data-click",         // Click events for interactive elements
  "data-input",         // Input events for text inputs
  "data-change",        // Change events for form fields
  "data-submit",        // Submit events for forms
  "data-className",     // CSS class changes, supports toggling specific classes (e.g., Tailwind's 'hidden')
  "data-classList",     // Allows toggling individual classes directly
  "data-checked",       // Checked state for checkboxes and radio buttons
  "data-selected",      // Selected state for dropdown options
  "data-disabled",      // Disabled state for form controls
  "data-fetch"          // Custom fetch state for API requests
];
```

## Fully Declarative Setup
- Ensure a fully declarative setup, with no reliance on `document.getElementById` or similar direct DOM querying methods inside Components.
- All state changes and DOM interactions must derive solely from HTML attributes (data-*) and declarative bindings.

## Component Scope and Local State Isolation
- Components can always watch their own state changes and state of other Components.
- Components can request changes to their internal state without setting it directly, they only request it. They can never request change of state for other Components state.

## Predefined States as Part of the API
- `predefinedStates` should be part of the API, allowing developers to define and configure them outside the MiniState library for flexible, user-defined state management.

## Predefined States as Part of the API
- `predefinedTransitions` should be part of the API, allowing developers to define what state can transition to what other state.

## Transactional State Changes with Full State Match Requirement
- State transitions should apply only after a full predefined state match, avoiding partial state updates unless the entire transition is valid. This is done by remembering all data-* attributes that where changed in their values to their current active state. For this, we use pending state object that locks changed individual state until the transition is matched, then the lock is released and pending state equals current state again. Other than that, there are no separate transition conditions.

## Error Handling for Naming Conventions
- Implement error handling to verify correct naming conventions for component IDs, child element IDs, and properties, avoiding misconfiguration. Every Child HTML element inside a div that has a valid component id is considered a component if it contains also a script tag inside the hirarchy.

## Embedded `<script>` Tags in Components
- Each component must have an embedded `<script>` tag inside the root `<div>` element (e.g., `<div id="myComponent"><script>...</script></div>`).

## No Direct DOM Access within Components
- Components must not directly invoke document functions, such as `document.getElementById`. Instead, they should rely solely on MiniState two API methods `watch` and `requestLocalStateChange` to manage their state and interactions.  `watch` uses a callback with a provided value and optional data like (value, data)=> ... so the watched value gets injected into the component for small conditional checks.

## No DOM changes without Transition match
- All DOM changes made by the MiniState library should be commited after successful Transition only (transaction). We never update the DOM without matching a predefined transition. We use a dedicated updateDOM method that executes only after a predefined state is fully matched by pendingState object (data-* attributes of all changes compared to current state attributes).

### MiniState API
- This approach adheres to a decoupled, component-based design where components request changes exclusively to their local state using MiniState.requestLocalStateChange(...), rather than modifying the state directly. MiniState evaluates these requests and determines if the state should be updated. Components can monitor their own and other components' states using MiniState.watch(...(value)=>{...}), which helps maintain an organized system with clear boundaries for state management. Direct imperative calls to document, window, or other browser DOM APIs are prohibited within components.

Example:
```html
<!-- buttonComponent -->
<div id="buttonComponent">
  <button id="myButton" data-value="false">Toggle Button State</button>
  <script>
    // Toggle myButton's value between "true" and "false" on data-click
    MiniState.watch('myButton', 'data-value', (value) => {
      MiniState.requestLocalStateChange('myButton', 'data-value', value === "false" ? "true" : "false");
    });
  </script>
</div>

<!-- sidebarComponent -->
<div id="sidebarComponent" class="hidden">
  <div>Sidebar Content</div>
  <script>
    // Show or hide sidebar based on myButton's value
    MiniState.watch('myButton', 'data-value', (value) => {
      MiniState.requestLocalStateChange('sidebarComponent', 'data-classList', value === "true" ? "hidden" : "");
    });
  </script>
</div>
```
