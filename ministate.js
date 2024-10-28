    const MiniState = (() => {
      const elementBindings = {};
      const stateWatchers = {};
      const states = {};
      const stateTransitions = {};
      let currentState = "";
      let isInitializing = true;  // Flag to avoid redundant logs during initialization

      // Reads state directly from the DOM attributes
      const deriveStateFromDOM = () => {
        const derivedState = {};
        for (const [key, domProperty] of Object.entries(elementBindings)) {
          const [elementId, dataAttribute] = key.split('.');
          const element = document.getElementById(elementId);
          if (element) {
            derivedState[key] = element.getAttribute(dataAttribute) || "";
          }
        }
        return derivedState;
      };

      const matchFullState = (stateDefinition) => {
        const domState = deriveStateFromDOM();
        return Object.entries(stateDefinition).every(([key, value]) => domState[key] === value);
      };

      return {
        getCurrentState() {
          return currentState;
        },

        defineState(stateName, stateDefinition) {
          states[stateName] = stateDefinition;
        },

        defineTransition(fromState, toState, condition) {
          if (!stateTransitions[fromState]) stateTransitions[fromState] = [];
          stateTransitions[fromState].push({ toState, condition });
        },

        async initializeState(initialStateKey) {
          if (!states[initialStateKey]) {
            console.error(`State "${initialStateKey}" does not exist.`);
            return;
          }
          currentState = initialStateKey;
          await this.applyStateDefinition(states[initialStateKey]);
          console.log("Initialized to State:", currentState, JSON.stringify(deriveStateFromDOM(), null, 2));
          isInitializing = false;  // Turn off initialization flag after initial state set
        },

        async bindElement(elementId, dataAttribute, domProperty) {
          elementBindings[`${elementId}.${dataAttribute}`] = domProperty;
          const stateKey = `${elementId}.${dataAttribute}`;
          const element = document.getElementById(elementId);
          if (!element) return;

          // Initialize directly from the DOM
          await this.updateElement(elementId, dataAttribute, element.getAttribute(dataAttribute) || "");

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
          if (!isInitializing) console.log("Current DOM State:", JSON.stringify(deriveStateFromDOM(), null, 2));
        },

        async transitionState(newState) {
          if (currentState === newState) return;

          const allowedTransitions = stateTransitions[currentState] || [];
          const validTransition = allowedTransitions.find(t => t.toState === newState && (!t.condition || t.condition()));

          if (validTransition) {
            currentState = newState;
            await this.applyStateDefinition(states[newState]);
            console.log("Transitioned to State:", currentState, JSON.stringify(deriveStateFromDOM(), null, 2));
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
          const [elementId, dataAttribute] = stateKey.split('.');
          const element = document.getElementById(elementId);
          if (element) {
            element.setAttribute(dataAttribute, newValue);
            if (stateWatchers[stateKey]) {
              for (const callback of stateWatchers[stateKey]) {
                await callback(newValue);
              }
            }
          }
          this.checkForFullStateTransition();
        },

        checkForFullStateTransition() {
          for (const [stateName, stateDefinition] of Object.entries(states)) {
            if (matchFullState(stateDefinition)) {
              this.transitionState(stateName);
              break;
            }
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
            const currentValue = deriveStateFromDOM()[stateKeyToChange];
            const newValue = currentValue === "true" ? "false" : "true";
            await this.requestLocalStateChange(stateKeyToChange, newValue);
          });
        },

        async requestLocalStateChange(stateKey, newValue) {
          await this.changeState(stateKey, newValue);
        }
      };
    })();
