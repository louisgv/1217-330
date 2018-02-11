/*
	Author: LAB

	Filter class
	Used to manage static filter

    LICENSE: MIT
*/

"use strict";
var app = app || {};

(function() {
    const {Helper, Global} = app;

    // Label - Color -
    app.VisualizerUIValues = {
        'wave': ['Wave', 'Black'],
        'mirrorBar': [
            'Mirror Bar', 'Red'
        ],
        'ponchoEye': [
            'Poncho Eye', 'White'
        ],
        'mirrorWave': [
            'Mirror Wave', 'Black'
        ],
    }

    // Fill - Stroke - Fillblank
    app.VisualizerUIDrawConfig = {
        'wave': [],
        'mirrorBar': [],
        'ponchoEye': [],
        'mirrorWave': [true, true, true],
    }

    app.VisualizerUIColors = {
        'Black': [
            0, 0, 0
        ],
        'White': [
            255, 255, 255
        ],
        'Red': [
            255, 0, 0
        ],
        'Green': [
            0, 255, 0
        ],
        'Blue': [0, 0, 255]
    }

    app.VisualizerUI = class {

        constructor(visualizerInstance) {
            this.visualizerInstance = visualizerInstance;
        }

        // Generate a column of a viz UI
        generateCol(viz) {
            const [label, defaultColor, fsConfig] = app.VisualizerUIValues[viz];
            const [strokeConfig, fillConfig, cutConfig] = app.VisualizerUIDrawConfig[viz];

            const bodyEl = Helper.createElement(`<div class="flex-row tool-row"></div>`);

            const vizToggleEl = this.generateCheckBox(label, viz, (e) => {
                this
                    .visualizerInstance[viz]
                    .disabled = !e.target.checked;
            });

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

            if (fillConfig) {
                const checkBoxEl = this.generateCheckBox('Fill', `${viz}-fill`, (e) => {
                    vizConfig.fill = e.target.checked;
                }, vizConfig.fill);

                bodyEl.appendChild(checkBoxEl);
            }

            if (strokeConfig) {
                const checkBoxEl = this.generateCheckBox('Stroke', `${viz}-stroke`, (e) => {
                    vizConfig.stroke = e.target.checked;
                }, vizConfig.stroke);

                bodyEl.appendChild(checkBoxEl);
            }

            if (cutConfig) {
                const checkBoxEl = this.generateCheckBox('Cut', `${viz}-blank-cut`, (e) => {
                    vizConfig.blankCut = e.target.checked;
                }, vizConfig.blankCut);

                bodyEl.appendChild(checkBoxEl);
            }

            return bodyEl;
        }

        // Generate a checkbox element
        generateCheckBox(label, id, callback, checked = true) {
            const checkBoxEl = Helper.createElement(
                `
                <div class="checkbox-container tool-col">
                    <label class="checkbox">
                        ${label}
                        <input type="checkbox" id="${id}" ${checked
                    ? 'checked'
                    : ''}/>
                        <span class="checkmark"></span>
                    </label>
                </div>
                `
            );

            checkBoxEl
                .querySelector(`#${id}`)
                .addEventListener('change', callback);

            return checkBoxEl;
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
