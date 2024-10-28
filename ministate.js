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
    getCurrentState() {
      return currentState;
    },

    defineState(stateName, stateDefinition) {
      states[stateName] = stateDefinition;
    },

    updateState(stateName, stateDefinition) {
      if (states[stateName]) {
        states[stateName] = stateDefinition;
      } else {
        console.error(`State "${stateName}" does not exist.`);
      }
    },

    removeState(stateName) {
      if (states[stateName]) {
        delete states[stateName];
      } else {
        console.error(`State "${stateName}" does not exist.`);
      }
    },

    defineTransition(fromState, toState, condition) {
      if (!stateTransitions[fromState]) stateTransitions[fromState] = [];
      stateTransitions[fromState].push({ toState, condition });
    },

    updateTransition(fromState, toState, condition) {
      if (stateTransitions[fromState]) {
        const transition = stateTransitions[fromState].find(t => t.toState === toState);
        if (transition) {
          transition.condition = condition;
        } else {
          console.error(`Transition from "${fromState}" to "${toState}" does not exist.`);
        }
      } else {
        console.error(`State "${fromState}" does not have any transitions.`);
      }
    },

    removeTransition(fromState, toState) {
      if (stateTransitions[fromState]) {
        const index = stateTransitions[fromState].findIndex(t => t.toState === toState);
        if (index !== -1) {
          stateTransitions[fromState].splice(index, 1);
        } else {
          console.error(`Transition from "${fromState}" to "${toState}" does not exist.`);
        }
      } else {
        console.error(`State "${fromState}" does not have any transitions.`);
      }
    },

    async initializeState(initialStateKey) {
      if (!states[initialStateKey]) {
        console.error(`State "${initialStateKey}" does not exist.`);
        return;
      }
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
