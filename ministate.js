const MiniState = (() => {
  const appState = JSON.parse(localStorage.getItem('state')) || {};
  const elementBindings = {};
  const stateWatchers = {};
  const states = {};
  const stateTransitions = {};
  let currentState = "";

  const persistState = () => {
    localStorage.setItem('state', JSON.stringify(appState));
  };

  return {
    defineState(stateName, stateDefinition) {
      states[stateName] = stateDefinition;
    },

    defineTransition(fromState, toState, condition) {
      if (!stateTransitions[fromState]) stateTransitions[fromState] = [];
      stateTransitions[fromState].push({ toState, condition });
    },

    async initializeState(initialStateKey = "SIDEBAR_HIDDEN") {
      currentState = initialStateKey;
      await this.applyStateDefinition(states[initialStateKey]);
      console.log("Initial State:", currentState, JSON.stringify(appState, null, 2));
    },

    async bindElement(elementId, dataAttribute, domProperty) {
      elementBindings[`${elementId}.${dataAttribute}`] = domProperty;
      const stateKey = `${elementId}.${dataAttribute}`;
      const currentValue = appState[stateKey];
      await this.updateElement(elementId, dataAttribute, currentValue);

      this.observeState(stateKey, async (newValue) => {
        await this.updateElement(elementId, dataAttribute, newValue);
      });
    },

    async updateElement(elementId, dataAttribute, newValue) {
      const element = document.getElementById(elementId);
      if (!element) return;

      const domProperty = elementBindings[`${elementId}.${dataAttribute}`];
      if (domProperty === "classList.hidden") {
        newValue === "hidden" ? element.classList.add("hidden") : element.classList.remove("hidden");
      } else {
        element[domProperty] = newValue;
      }
      persistState();
    },

    async transitionState(newState) {
      if (currentState === newState) return;

      const allowedTransitions = stateTransitions[currentState] || [];
      const validTransition = allowedTransitions.find(t => t.toState === newState && (!t.condition || t.condition()));

      if (validTransition) {
        currentState = newState;
        await this.applyStateDefinition(states[newState]);
        console.log("Transitioned to State:", currentState, JSON.stringify(appState, null, 2));
      } else {
        console.error(`Transition from "${currentState}" to "${newState}" not allowed.`);
      }
    },

    async applyStateDefinition(stateDefinition) {
      for (const [stateKey, value] of Object.entries(stateDefinition)) {
        await this.changeState(stateKey, value);
      }
    },

    async changeState(stateKey, newValue) {
      if (appState[stateKey] !== newValue) {
        appState[stateKey] = newValue;
        if (stateWatchers[stateKey]) {
          for (const callback of stateWatchers[stateKey]) {
            await callback(newValue);
          }
        }
        persistState();
      }
    },

    observeState(stateKey, callback) {
      if (!stateWatchers[stateKey]) stateWatchers[stateKey] = [];
      stateWatchers[stateKey].push(callback);
    },

    bindEvent(elementId, eventType, stateKeyToChange) {
      const element = document.getElementById(elementId);
      if (!element) return;

      element.addEventListener(eventType, async () => {
        const currentValue = appState[stateKeyToChange] === "true";
        await this.changeState(stateKeyToChange, (!currentValue).toString());
      });
    }
  };
})();

// Define initial states
MiniState.defineState("SIDEBAR_HIDDEN", {
  "sidebarComponent.data-class": "hidden",
  "buttonComponent.toggleButton.data-text": "Show Sidebar",
  "buttonComponent.data-click": "false"
});

MiniState.defineState("SIDEBAR_VISIBLE", {
  "sidebarComponent.data-class": "",
  "buttonComponent.toggleButton.data-text": "Hide Sidebar",
  "buttonComponent.data-click": "true"
});

// Define transitions between states
MiniState.defineTransition("SIDEBAR_HIDDEN", "SIDEBAR_VISIBLE", async () => true);
MiniState.defineTransition("SIDEBAR_VISIBLE", "SIDEBAR_HIDDEN", async () => true);

document.addEventListener('DOMContentLoaded', async () => {
  await MiniState.initializeState("SIDEBAR_HIDDEN");
});
