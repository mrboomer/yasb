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

/*global $, chrome*/

var $yasbButton = $('.yasb-toggle'),
    $settingsButton = $('.settings');

// Menu State
function setMenu(active, sizeSelected) {
  if (active) {
    $settingsButton.show();
    if (sizeSelected) {
      chrome.runtime.sendMessage({badgeColor: '#66bb6a'});
      if ($yasbButton.hasClass('yellow')) { $yasbButton.removeClass('yellow'); }
      else if ($yasbButton.hasClass('red lighten-1')) { $yasbButton.removeClass('red lighten-1'); }
      $yasbButton.addClass('green lighten-1').html('Enabled');
    }
    else {
      chrome.runtime.sendMessage({badgeColor: '#ffeb3b'});
      if ($yasbButton.hasClass('green')) { $yasbButton.removeClass('green'); }
      else if ($yasbButton.hasClass('red lighten-1')) { $yasbButton.removeClass('red lighten-1'); }
      $yasbButton.addClass('yellow').html('Enabled');
      $settingsButton.html('Select Size');
    }
  }
  else {
    chrome.runtime.sendMessage({badgeColor: '#ef5350'});
    if ($yasbButton.hasClass('green')) { $yasbButton.removeClass('green'); }
    else if ($yasbButton.hasClass('yellow')) { $yasbButton.removeClass('yellow'); }
    $yasbButton.addClass('red lighten-1').html('Disabled');
    $settingsButton.hide();
  }
}

function getStorage(callback) {
  chrome.storage.local.get(['yasbActive', 'sizeSelected', 'shoeSize'], function(response) {
    callback(response);
  });
}

function loadMenu(response) {
  setMenu(response.yasbActive, response.sizeSelected);
}

function toggle(response) {
  var yasbActive = !response.yasbActive;
  setMenu(yasbActive, response.sizeSelected);
  chrome.storage.local.set({'yasbActive': yasbActive});
}


/*

function isSizeSelected(response) {
  if (response.shoeSize) {
    setMenu(response.yasbActive, true);
    chrome.storage.local.set({'sizeSelected': true});
  }
  else {
    setMenu(response.yasbActive, false);
    chrome.storage.local.set({'sizeSelected': false});
  }
}

*/


// Toggle YASB
$yasbButton.click(function() {
  getStorage(toggle);
});

// Open Settings
$settingsButton.click(function() {
  chrome.runtime.openOptionsPage();
});

$(function () {
  getStorage(loadMenu);
});
