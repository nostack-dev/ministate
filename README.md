# 📜 MiniState – Streamlined Approach

## Purpose
The MiniState library is designed to provide a minimal, declarative, and component-centric approach to managing state across a UI, ensuring that state changes are predictable, isolated within components, and driven by HTML's native properties and events as the single source of truth.

## Goals of MiniState

### Declarative, Clean API
- MiniState watches DOM changes directly without redundant `data-*` attributes or excessive wiring.
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
- **Text and Content:** `textContent`, `innerHTML`, `value`
- **User Interactions:** `click`, `input`, `change`, `submit`
- **Styling and Visibility:** `className`, `classList`
- **Form States:** `checked`, `selected`, `disabled`
- **API Requests:** `fetch` (custom property for managing asynchronous requests)

### Unified, Intuitive Watch Syntax
**Purpose:** The `watch` function has been simplified to accept the element ID as the first argument and the specific property or event as the second, making the setup clear and easy.

**Example:**
```javascript
MiniState.watch("toggleButton", "textContent", (value) => {
  console.log("Button text changed:", value);
});
```

### Automatic Change Detection with Class Toggling Support
**Purpose:** MiniState supports visibility toggling using `classList`, aligned with frameworks like Tailwind CSS. Visibility is managed by adding or removing a `hidden` class.

**Example:**
```javascript
MiniState.requestLocalStateChange("myElement", "classList", myElement.classList.contains("hidden") ? "" : "hidden");
```

### Declarative API for Asynchronous Operations (`fetch`)
**Purpose:** The `fetch` property allows declarative tracking of API request states (e.g., loading, success, error), making asynchronous operations integral to MiniState’s functionality without custom setup.

**Example:**
```javascript
MiniState.watch("dataComponent", "fetch", (status) => {
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
  <button id="toggleButton">Toggle State</button>
  <script>
    MiniState.watch("toggleButton", "click", () => {
      console.log("Button clicked");
    });
  </script>
</div>
```

## Summary of Benefits
- **Simplified Code:** MiniState watches only necessary changes, reducing setup complexity.
- **Enhanced Readability:** The concise watch API improves readability by focusing on essential attributes and events.
- **Declarative Asynchronous Support:** With `fetch` added, MiniState seamlessly handles API states within the component lifecycle.
- **HTML Alignment:** The approach is closely aligned with HTML standards, ensuring compatibility and ease of use for developers.

## Properties Whitelist

```js
const allowedWatchProperties = [
  "textContent",   // Text within elements
  "innerHTML",     // HTML content within elements
  "value",         // Value of form fields like <input> and <textarea>
  "click",         // Click events for interactive elements
  "input",         // Input events for text inputs
  "change",        // Change events for form fields
  "submit",        // Submit events for forms
  "className",     // CSS class changes, supports toggling specific classes (e.g., Tailwind's 'hidden')
  "classList",     // Allows toggling individual classes directly
  "checked",       // Checked state for checkboxes and radio buttons
  "selected",      // Selected state for dropdown options
  "disabled",      // Disabled state for form controls
  "fetch"          // Custom fetch state for API requests
];
```

## Fully Declarative Setup
- Ensure a fully declarative setup, with no reliance on `document.getElementById` or similar direct DOM querying methods.
- All state changes and DOM interactions must derive solely from HTML attributes and declarative bindings.

## Component Scope and Local State Isolation
- Components should manage and watch only their own state changes, without altering other components' states directly.
- Components should only request changes to their internal state without controlling the outcome of the state change.

## Predefined States as Part of the API
- `predefinedStates` should be part of the API, allowing developers to define and configure them outside the MiniState library for flexible, user-defined state management.

## Transactional State Changes with Full State Match Requirement
- State transitions should apply only after a full predefined state match, avoiding partial state updates unless the entire transition is valid.

## No Hardcoded Values in MiniState Library
- Avoid hardcoded values or CSS class toggling (e.g., 'hidden') in the library to ensure full customization.

## Error Handling for Naming Conventions
- Implement error handling to verify correct naming conventions for component IDs, child element IDs, and properties, avoiding misconfiguration.

## Embedded `<script>` Tags in Components
- Each component must have an embedded `<script>` tag inside the root `<div>` element (e.g., `<div id="myComponent"><script>...</script></div>`).

## No Direct DOM Access within Components
- Components must not directly invoke document functions, such as `document.getElementById`. Instead, they should rely solely on MiniState API methods like `watch`, `wire`, and `requestLocalStateChange` to manage their state and interactions.

