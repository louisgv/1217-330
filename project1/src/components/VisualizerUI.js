/*
	Author: LAB

	Filter class
	Used to manage static filter

    LICENSE: MIT
*/

"use strict";
var app = app || {};

(function() {
    const {Interface, Helper, Global} = app;

    // Label - Color -
    app.VisualizerUIValues = {
        'wave': [
            'Wave', 'Black'
        ],
        'mirrorBar': [
            'Mirror Bar', 'Red'
        ],
        'ponchoEye': [
            'Poncho Eye', 'Black'
        ],
        'mirrorWave': ['Mirror Wave', 'Black']
    }

    // Fill - Stroke - Fillblank
    app.VisualizerUIDrawCheckBox = {
        'wave': [],
        'mirrorBar': ['Cut'],
        'ponchoEye': [],
        'mirrorWave': ['Cut', 'Fill', 'Stroke']
    }

    app.VisualizerUIColors = {
        'Black': [
            0, 0, 0
        ],
        'Red': [
            255, 63, 52
        ],
        'Green': [
            11, 232, 129
        ],
        'Blue': [
            75, 207, 250
        ],
        'Yellow': [
            255, 168, 1
        ],
        'Pink': [
            239, 87, 119
        ],
        'White': [255, 255, 255]
    }

    app.VisualizerUI = class {

        constructor(visualizerInstance) {
            this.visualizerInstance = visualizerInstance;
        }

        // Generate a column of a viz UI
        generateCol(viz) {
            const [label, defaultColor, fsConfig] = app.VisualizerUIValues[viz];

            const bodyEl = Helper.createElement(`<div class="flex-inline-row tool-row"></div>`);

            const vizToggleEl = Interface.generateCheckBox(label, viz, (e) => {
                this
                    .visualizerInstance[viz]
                    .disabled = !e.target.checked;
            }, true, 'tool-col');

            bodyEl.appendChild(vizToggleEl);

            const optionLabelEl = Helper.createElement(
                `<label class="select-container tool-col"></label>`
            );

            const optionsEl = Helper.createElement(`<select name='options'></select>`);

            Object
                .keys(app.VisualizerUIColors)
                .map((color) => {
                    const optionEl = Helper.createElement(
                        `<option ${color === defaultColor
                            ? 'selected'
                            : ''} value='${color}'>${color}</option>`
                    );

                    optionsEl.appendChild(optionEl);
                });

            const vizConfig = this
                .visualizerInstance[viz]
                .config;

            optionsEl.addEventListener('change', (e) => {
                // TODO: make alpha tweakable
                vizConfig.color = app.VisualizerUIColors[e.target.value];
            });

            optionLabelEl.appendChild(optionsEl);

            bodyEl.appendChild(optionLabelEl);

            app
                .VisualizerUIDrawCheckBox[viz]
                .forEach((checkBoxLabel) => {
                    const checkBoxConfig = checkBoxLabel.toLowerCase();

                    const checkBoxEl = Interface.generateCheckBox(
                        checkBoxLabel,
                        `${viz}-${checkBoxConfig}`,
                        (e) => {
                            vizConfig[checkBoxConfig] = e.target.checked;
                        },
                        vizConfig[checkBoxConfig],
                        'tool-col'
                    );

                    bodyEl.appendChild(checkBoxEl);
                })

            return bodyEl;
        }

        // Generate and mount the viz UI onto the parentEl
        mount(parentEl) {
            Object
                .keys(app.VisualizerUIValues)
                .map((viz) => {
                    parentEl.appendChild(this.generateCol(viz));
                });
        }
    }
}());

/*

<div class="flex-row tool-row">
    <div class="checkbox-container tool-col">
        <label class="checkbox">
            Mirror Bar
            <input type="checkbox" id="mirrorBar" checked/>
            <span class="checkmark"></span>
        </label>
    </div>
    <label class="select-container tool-col">
        <select name='options'>
            <option value='option-1'>Option 1</option>
            <option value='option-2'>Option 2</option>
            <option value='option-3'>Option 3</option>
        </select>
    </label>
</div>
*/