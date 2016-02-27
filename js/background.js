/*
 * YASB - Yet Another Shoe Bot
 *
 * Copyright (c) 2014-2016 Daniel Escobedo.
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

/*global chrome */

// Initialialize Variables, Badge Name and Color
chrome.storage.local.set({'yasbActive': true, 'sizeSelected': false});
chrome.browserAction.setBadgeText({ text: "BOT" });
setBadgeColor('#ffeb3b');

// Set icon color
function setBadgeColor(badgeColor) {
  chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
}

// Popup Listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.badgeColor) {
    setBadgeColor(request.badgeColor);
  }
});
