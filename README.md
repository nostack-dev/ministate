# 📜 MiniState – Easy State Machine

## Purpose
The MiniState library is designed to provide a minimal, declarative, and component-centric approach to managing state across a UI, ensuring that state changes are predictable, isolated within components, and driven by predefined watch-properties as the single source of truth.

## Goals of MiniState
- MiniState uses a curated list of properties and events to keep the API streamlined, covering common use cases without unnecessary complexity.

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
  "data-fetch",         // Custom fetch state for API requests
];
```

## Key Features of the New MiniState API

### Simplified Watching with Standard Properties and Events
**Purpose:** MiniState tracks changes using a restricted set of properties and events. This whitelist allows only essential HTML-conform properties and events, keeping MiniState intuitive and minimalistic.

**Allowed Watch Properties and Events:**
- **Text and Content:** `data-textContent`, `data-innerHTML`, `data-value`
- **User Interactions:** `data-click`, `data-input`, `data-change`, `data-submit`
- **Styling and Visibility:** `data-className`, `data-classList`
- **Form States:** `data-checked`, `data-selected`, `data-disabled`
- **API Requests:** `data-fetch` (property for managing asynchronous requests)

### Unified, Intuitive Watch Syntax
**Purpose:** The `watch` function has been simplified to accept the element ID as the first argument and the specific property or event as the second, making the setup clear and easy.

**Callback Signatures:**
- **Single Parameter:** For properties/events that return a single value.
  ```javascript
  MiniState.watch("toggleButton", "data-textContent", (value) => {
    console.log("Button text changed:", value);
  });
  ```
  
- **Fetch:** For Async API-Calls without callback value
  ```javascript
  MiniState.watch("dataComponent", "data-fetch", () => {
   const url = "https://example.org/products.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
      const json = await response.json();
      MiniState.requestLocalStateChange("myDataElement", "data-textContent", json.dataText);
    } catch (error) {
      console.error(error.message);
    }
  });
  ```

**Example:**
```javascript
MiniState.watch("toggleButton", "data-textContent", (value) => {
  console.log("Button text changed:", value);
});
```
### Automatic Change Detection with ClassList Add and Remove
**Purpose:** MiniState supports using `data-classList`, aligned with frameworks like Tailwind CSS. Visibility is managed by adding or removing a `hidden` class.

**Example:**
```javascript
MiniState.watch("myComponent", "data-classList", (currentClasses) => {
  const newClasses = currentClasses.includes("hidden") 
    ? currentClasses.replace("hidden", "").trim() 
    : `${currentClasses} hidden`.trim();
  MiniState.requestLocalStateChange("myComponent", "data-classList", newClasses);
});
```

### Declarative API for Asynchronous Operations (`data-fetch`)
**Purpose:** Trigger data-fetch watch callback using: MiniState.requestLocalStateChange('dataDisplay', 'data-fetch', 'true');
```html
 <!-- dataComponent -->
<div id="dataComponent">
  <div id="dataDisplay" data-fetch="false" data-textContent="No data fetched yet">
    No data fetched yet
  </div>
  <script>
    // Watch for fetch status changes
    MiniState.watch('dataComponent', 'data-fetch', async () => {
      const url = "https://example.org/products.json";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        MiniState.requestLocalStateChange('dataDisplay', 'data-textContent', json.title);
      } catch (error) {
        console.error(error.message);
      }
    });
  </script>
</div>
```

## Summary of Benefits
- **Simplified Code:** MiniState watches only necessary changes, reducing setup complexity.
- **Enhanced Readability:** The concise watch API improves readability by focusing on essential attributes and events.
- **Declarative Asynchronous Support:** With `data-fetch` added, MiniState seamlessly handles API states within the component lifecycle.
- **HTML Alignment:** The approach is closely aligned with HTML standards, ensuring compatibility and ease of use for developers.

## Fully Declarative Setup
- Ensure a fully declarative setup, with no reliance on `document.getElementById` or similar direct DOM querying methods inside components.
- All state changes and DOM interactions must derive solely from HTML attributes (`data-*`) and declarative bindings.

## Component Scope and Local State Isolation
- Components can always watch their own state changes and the state of other components.
- Components can request changes to their internal state without setting it directly; they only request it. They can never request changes to other components' state.

## Predefined States as Part of the API
- `predefinedStates` Setup for predefined states (mandatory):
```html
      const predefinedStates = {
        'BUTTON_ACTIVE': {
          'myButton.data-value': 'true',
          'myButton.data-text': 'Deactivate Button',
          'sidebarComponent.data-class': '' // Show Sidebar
        },
        'BUTTON_INACTIVE': {
          'myButton.data-value': 'false',
          'myButton.data-text': 'Activate Button',
          'sidebarComponent.data-class': 'hidden' // Hide Sidebar
        },
        // Additional states can be defined here
      };
```

## Predefined Transitions as Part of the API
- `predefinedTransitions` should be part of the API, allowing developers to define what state can transition to what other state.
```html
   const predefinedTransitions = {
        'BUTTON_ACTIVE': 'BUTTON_INACTIVE', // transitions allowed from state BUTTON_ACTIVE to BUTTON_INACTIVE
        'BUTTON_INACTIVE': 'BUTTON_ACTIVE'  // transitions allowed from state BUTTON_INACTIVE to BUTTON_ACTIVE
         // Additional states can be defined here
      };
```
## Transactional State Changes with Full State Match Requirement
- State transitions should apply only after a full predefined state match, avoiding partial state updates unless the entire transition is valid. This is done by remembering all `data-*` attributes that were changed in their values to their current active state. For this, we use a pending state object that locks changed individual state until the transition is matched, then the lock is released and pending state equals current state again. Other than that, there are no separate transition conditions.

## Error Handling for Naming Conventions
- Implement error handling to verify correct naming conventions for component IDs, child element IDs, and properties, avoiding misconfiguration. Every child HTML element inside a div that has a valid component ID is considered a component if it also contains a script tag within its hierarchy.

## Embedded `<script>` Tags in Components
- Each component must have an embedded `<script>` tag inside the root `<div>` element (e.g., `<div id="myComponent"><script>...</script></div>`).

## No Direct DOM Access within Components
- Components must not directly invoke document functions, such as `document.getElementById`. Instead, they should rely solely on MiniState’s two API methods, `watch` and `requestLocalStateChange`, to manage their state and interactions.
- **Callback Usage:** `watch` uses a callback with a provided value and optional data like `(value, data) => { ... }`, allowing the watched value to be injected into the component for small conditional checks.

## No DOM Changes without Transition Match
- All DOM changes made by the MiniState library should be committed only after a successful Transition (transaction).
- MiniState ensures that a state transition is valid by fully matching predefined state conditions before applying changes.
- **Implementation:** MiniState uses a dedicated `updateDOM` method that executes only after a predefined state is fully matched by the `pendingState` object (comparing `data-*` attributes of all changes to current state attributes).

### MiniState API
- This approach adheres to a decoupled, component-based design where components request changes exclusively to their local state using `MiniState.requestLocalStateChange(...)`, rather than modifying the state directly.
- MiniState evaluates these requests and determines if the state should be updated.
- Components can monitor their own and other components' states using `MiniState.watch(..., (value) => { ... })`, which helps maintain an organized system with clear boundaries for state management.
- **Prohibited Actions:** Direct imperative calls to `document`, `window`, or other browser DOM APIs are prohibited within components.

**Example:**
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
      const newClassVal = value === "true" ? "hidden" : "";
      MiniState.requestLocalStateChange("myComponent", "data-classList", newClassVal);
    }
    });
  </script>
</div>
