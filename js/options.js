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

/*global $, chrome, Materialize */

var $shoeSizeInput = $('#shoe-size'),
    $cartInput = $('#to-cart'),
    $checkoutInput = $('#to-checkout'),
    $saveSettings = $('#save');

// Display description and extension version number
var manifest = chrome.runtime.getManifest();
$('.description').html(manifest.description);
$('span').html(manifest.version);

function getState(callback) {
  chrome.storage.local.get(['yasbActive', 'sizeSelected', 'shoeSize', 'checkout'], function(response) {
    callback(response);
  });
}

function loadState(response) {
  if (response.sizeSelected) {
    $shoeSizeInput.val(response.shoeSize);
    $shoeSizeInput.material_select();
  }
  if (response.checkout) { $checkoutInput.prop('checked', response.checkout); }
}

function saveState(response) {
  var shoeSize = $shoeSizeInput.val(),
      cart = $cartInput.val(),
      checkout = $checkoutInput.val();
  if (shoeSize) {
    chrome.storage.local.set({'shoeSize': shoeSize, 'sizeSelected': true});
    if (response.yasbActive) { chrome.runtime.sendMessage({badgeColor: '#66bb6a'}); }
  }

  if ($cartInput.is(':checked')) {
    chrome.storage.local.set({'cart': true});
  }
  else {
    chrome.storage.local.set({'cart': false});
  }

  if ($checkoutInput.is(':checked')) {
    chrome.storage.local.set({'checkout': true});
  }
  else {
    chrome.storage.local.set({'checkout': false});
  }
}

$cartInput.change(function() {
  if (this.checked) {
    $checkoutInput.prop('checked', false);
  }
});

$checkoutInput.change(function() {
  if (this.checked) {
    $cartInput.prop('checked', false);
  }
});

// Save Settings
$saveSettings.click(function() {
  getState(saveState);
  Materialize.toast('Settings Saved!', 4000);
});

$(function () {
  getState(loadState);
  $('select').material_select();
});
