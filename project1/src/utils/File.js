/*
	Author: LAB
	File reader handle

	LICENSE: GPLv3
*/

"use strict";
var app = app || {};

app.File = {
    read(fileBlob, progressCallback) {
		const reader = new FileReader();

		return new Promise(function(resolve, reject) {
			reader.onloadend = ({ target }) => {
				resolve(target);
			};

			reader.onprogress = progressCallback;

			reader.onerror = error => {
				reject(error);
			};

			reader.readAsDataURL(fileBlob);
		});
	}
}
