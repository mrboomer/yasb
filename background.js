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
/*globals requestKey, validKey, sizeSelected, setIconColor, chrome */

var enabled = true;
var activationKey = "yasb"; // Update this key to value desired.

// Distinguishable badge name for icon.
chrome.browserAction.setBadgeText({text: "BOT"});

// If YASB has been activated, switch 'BOT' icon to green.
if (validKey()) {
    chrome.browserAction.setBadgeBackgroundColor({color: [0, 128, 0, 100]});
}

// Asks user for key.
function requestKey() {

	var userKey = prompt("Please enter your activation key:", "");
	localStorage.activationKey = userKey;

	// Check for empty entry.
	if (userKey === "") {
		requestKey();
	} else if (userKey) {
        
		// Check if user key is valid.
		if (validKey()) {
            setIconColor();
			alert("YASB has been activated successfully.");
			chrome.tabs.create({ url: chrome.extension.getURL("options.html") });
		} else {
			alert("Invalid activation key.");
			requestKey();
		}
	} else {
		alert("Please try again later.");
	}
}

// Compare locally stored key to user key, if any.
function validKey() {
	return localStorage.activationKey === activationKey;
}

// Check if shoe size has been selected
function sizeSelected() {
    if (localStorage.size === undefined || localStorage.size === "") {
        return false;
    } else {
        return true;
    }
}

// When activated, set icon color depending if shoe size has been selected.
function setIconColor() {
    if (validKey() && sizeSelected()) {
        chrome.browserAction.setBadgeBackgroundColor({color: [0, 128, 0, 100]});
    } else {
        chrome.browserAction.setBadgeBackgroundColor({color: [180, 180, 0, 100]});
    }
}

// Listen for toolbar menu actions.
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    
    // Check to see if YASB has been activated to adjust toolbar icon's color.
	if (request.isActivated !== undefined) {
		if (validKey()) {
            setIconColor();
            sendResponse({activated: enabled,
                          checkSize: sizeSelected()});
		} else {
			sendResponse({activated: !enabled,
                          checkSize: sizeSelected()});
		}
	}

	// Adjust the way "#toggle" behaves.
	if (request.displayAuth !== undefined) {
        
        // Set text/colors accordingly.
        if (!validKey()) {
            requestKey();
            if (!validKey()) {
                sendResponse({activated: !enabled,
                              checkSize: sizeSelected()});
            } else {
                setIconColor();
                sendResponse({activated: enabled,
                              checkSize: sizeSelected()});
            }
        }
    }

    if (request.localStorage !== undefined) {
        sendResponse({localStorage: localStorage});
    }
    
    if (request.activate !== undefined) {
        sendResponse({checkKey: validKey(),
                      checkSize: sizeSelected()});
    }
    
    if (request.iconColor !== undefined) {
        sendResponse({setColor: setIconColor()});
    }
    
});
