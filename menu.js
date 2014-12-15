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
/*globals setMenu, chrome */

var displayAuth,
    settings;
var displayToggle = document.querySelector('li');
var cursorToggle = document.querySelector('a');
var settingsText = document.querySelector('li:last-of-type > a');
var settingsToggle = document.querySelector('li:last-of-type');

// If YASB is active, display menu, item text, and color accordingly.
function setMenu(activated, sizeSelected, client) {

    if ((activated && client === "consumer") || client === "individual") {
        if (sizeSelected) {
            displayAuth.innerHTML = 'Enabled';
            displayAuth.style.color = 'green';
            displayToggle.style.border = 'none'; // Remove button interface.
            cursorToggle.style.cursor = 'default';
        } else {
            displayToggle.style.display = 'none'; // Hide 'Enabled/Disabled' button
            settingsText.innerHTML = 'Select Size';
            settingsText.style.color = 'rgb(180, 180, 0)';
        }
    } else {
        displayAuth.innerHTML = 'Disabled';
        displayAuth.style.color = 'red';
        settingsToggle.style.display = 'none'; // Hide 'Settings'
    }
}

// Dynamically modify menu.
document.addEventListener('DOMContentLoaded', function () {

    chrome.runtime.sendMessage({isActivated: ""}, function (response) {
        setMenu(response.activated, response.checkSize, response.client);
    });

    displayAuth = document.getElementById('toggle');
    settings = document.getElementById('settings');

    // "Enabled/Disabled" button actions.
    displayAuth.onclick = function () {

        chrome.runtime.sendMessage({isActive: ""}, function (response) {
            if (!response.checkKey && response.client === "consumer") {
                window.close();
            }
        });
        
        chrome.runtime.sendMessage({displayAuth: ""}, function (response) {
            setMenu(response.activated, response.checkSize, response.client);
        });
    };

    // "Settings" button actions.
    settings.onclick = function () {
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    };
});
