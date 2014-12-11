/*
 * YASB - Yet Another Shoe Bot
 *
 * Copyright (c) 2014-2015 Daniel Escobedo.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/*jslint devel: true, sloppy: true */
/*globals saveSettings, restoreSettings, saveValue, loadValue, saveState, loadState */

// Disable the "Save" button when a shoe size selecion has not been made.
function checkSize() {
    if (document.getElementById("size").value == "")
        document.getElementById("save").disabled = true;
    else
        document.getElementById("save").disabled = false;
}

function saveSettings() {
    
    saveValue("size");
    saveState("checkout");

    // Alert user if the option to automatically redirect to checkout is enabled.
	if (document.getElementById("checkout").checked) {
		alert("Shoe size updated.\nYou may now begin shopping.\n\nWhen shoes get added to cart, you will automatically be redirected to CHECKOUT.");
	} else {
		alert("Shoe size updated.\nYou may now begin shopping.");
	}
}

function restoreSettings() {
	loadValue("size");
	loadState("checkout");
    checkSize();
}

function saveValue(id) {
	localStorage[id] = document.getElementById(id).value.trim();
}

function loadValue(id) {
	if (localStorage[id] !== undefined) {
		document.getElementById(id).value = localStorage[id];
    }
}

// Save "Checkout" setting.
function saveState(id) {
	localStorage[id] = document.getElementById(id).checked;
}

// Load "Checkout" setting.
function loadState(id) {
	if (localStorage[id] !== undefined) {
		document.getElementById(id).checked = localStorage[id] === "true" ? true : false;
    }
}

document.addEventListener('DOMContentLoaded', restoreSettings);
document.querySelector('#size').addEventListener('click', checkSize);
document.querySelector('#save').addEventListener('click', saveSettings);
