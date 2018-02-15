/*
	Author: LAB

	Singleton for Visualizer config
    "opinionated global", might mutate

    LICENSE: MIT
*/

"use strict";
var app = app || {};

(function() {
    const {Color, Gradient, Helper} = app;

    // Label - Color - Disable Gradient
    const values = Object.seal({
        'mirrorWave': [
            'Mirror Wave', 'CrimsonThought'
        ],
        'mirrorBar': [
            'Mirror Bar', 'Red'
        ],
        'lineWave': [
            'Line Wave', 'Black'
        ],
        'bezierWave': [
            'Bezier Wave', 'white'
        ],
        'ponchoEye': ['Poncho Eye', 'Black', true]
    });

    // Fill - Stroke - Fillblank
    const checkbox = Object.seal({
        'lineWave': [],
        'mirrorBar': ['Cut'],
        'ponchoEye': [],
        'bezierWave': ['Fill'],
        'mirrorWave': ['Cut', 'Fill', 'Stroke']
    })

    const color = Object.seal({
        'Black': new Color(0, 0, 0),
        'Red': new Color(255, 63, 52),
        'Green': new Color(11, 232, 129),
        'Blue': new Color(75, 207, 250),
        'Yellow': new Color(255, 168, 1),
        'Pink': new Color(239, 87, 119),
        'White': new Color(255, 255, 255)
    })

    const colors = Object.keys(color);

    const gradient = {
        CrimsonThought : {}
    };

    let gradients = [];

    const getColorsAndGradients = () => [
        ...colors,
        ...gradients
    ]

    function initializeGradient(ctx) {
        // Hack to bind the value of BRW with the value of new instance
        gradient.CrimsonThought.value = (new Gradient(ctx, [
            color.Black,
            color.Red,
            color.White
        ])).value;

        gradients = Object.keys(gradient);
        Object.seal(gradients);
    }

    app.VisualizerConfig = {
        values,
        checkbox,
        color,
        colors,
        gradient,
        gradients,
        initializeGradient,
        getColorsAndGradients
    }
}());
