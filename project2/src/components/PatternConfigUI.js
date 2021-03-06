/*
	Author: LAB

	Visualizer UI
	Used to Generate the UI to control each Pattern config

    LICENSE: MIT
*/

"use strict";
var app = app || {};

(function() {
    const {PatternConfig, Interface, Helper, Global} = app;

    app.PatternConfigUI = class {

        constructor(patternInstance) {
            this.patternInstance = patternInstance;
        }

        // Generate a column of a viz UI
        generateCol(v, onChange) {
            const instance = this.patternInstance[v];

            const [label, isEnabled] = PatternConfig.value[v];

            const bodyEl = Helper.createElement(`<div class="flex-inline-row flex-wrap margin-top-double margin-bottom-double"></div>`);

            const patternToggleEl = Interface.generateCheckBox(label, v, (e) => {
                instance.disabled = !e.target.checked;
                onChange();
            }, !!isEnabled, 'margin-right');

            bodyEl.appendChild(patternToggleEl);

            const patternConfig = instance.config;

            if (PatternConfig.select[v]) {
                PatternConfig.select[v].forEach(([selectLabel, selectConfig, selectOption, selectOptions]) => {
                    const selectDefault = patternConfig[selectConfig];
                    const checkBoxEl = Interface.generateSelect(`Select value for ${selectLabel}`, selectOptions, selectDefault, (e) => {
                        // TODO: make alpha tweakable
                        patternConfig[selectConfig] = selectOption[e.target.value];
                        instance.updateCache();
                        onChange();
                    });

                    bodyEl.appendChild(checkBoxEl);
                });
            }

            return bodyEl;
        }

        // Generate and mount the config UI onto the parentEl
        mount(parentEl, onChange) {
            PatternConfig.values.map((v) => {
                parentEl.appendChild(this.generateCol(v, onChange));
            });
        }
    };
}());
