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

/* globals $, chrome, window, document, setInterval, clearInterval */

function loadSettings(callback) {
  chrome.storage.local.get(['yasbActive', 'sizeSelected', 'shoeSize', 'cart', 'checkout'], function(response) {
    callback(response);
  });
}

function yasbAlert(message) {
  var modal = document.createElement('div');
  modal.setAttribute("class", "remodal-bg");
  modal.innerHTML = '' +
    '<div id="yasb" data-remodal-id="modal">' +
      '<button data-remodal-action="close" class="remodal-close"></button>' +
      '<img src="' + chrome.extension.getURL("img/yasb-64.png") + '">' +
      '<h1>YASB Notice</h1>' +
      '<div id="yasb-message"></div>' +
    '</div>';
  $('body').prepend(modal);

  var $messageDiv = $('#yasb-message');
  switch (message) {
    case "size-unavailable":
      $messageDiv.html('<p>This shoe is not available in the size you selected.</p>');
      break;
  }

  $('[data-remodal-id=modal]').remodal().open();
}

function runYasb(response) {
  if (response.yasbActive && response.sizeSelected) {
    $(function(){
      var shoeSize = response.shoeSize,
          continueCart = response.cart,
          continueCheckout = response.checkout;

      // FinishLine.com
      var finishlinecom = setInterval(function() {

        if(window.location.href.indexOf('finishline') > -1 && window.location.href.indexOf('product') > -1) {
          var $cartWindow = $('#ui-dialog-title-addToCartModal'),
              strippedShoeSize = shoeSize.replace(/^(0+)/g, ''),
              $itemSize = $('#productSizes.isShoe .size:contains("' + strippedShoeSize + '")');

          if($cartWindow.length) {
            // Stop Function Call
            clearInterval(finishlinecom);

            // Continue to Cart/Shopping Cart if Selected in Settings
            if (continueCart || continueCheckout) {
              window.location.href = "/store/checkout/cart.jsp";
            }

            return;
          }
          else {
            if ($itemSize.length && !$itemSize.hasClass('unavailable')) {
              // Size Avaibale - Select Shoe Size
              $itemSize.click();

              // Add Shoe to Cart
              $('#buttonAddToCart').click();
            }
            else {
              // Size Unavaibale - Stop YASB
              clearInterval(finishlinecom);

              // Notify User
              yasbAlert('size-unavailable');

              return;
            }
          }
        }
        else if (window.location.href.indexOf('finishline') > -1 && window.location.href.indexOf('checkout/cart') > -1) {
          // Stop Function Call
          clearInterval(finishlinecom);

          // Continue to Checkout if Selected in Settings
          if (continueCheckout) {
            $('[name="Checkout"]').click();
          }

          return;
        }
        else {
          // End if not on Product Page
          clearInterval(finishlinecom);
          return;
        }
      }, 250);

      // Adidas.com
      var adidascom = setInterval(function() {

        if(window.location.href.indexOf('adidas') > -1 && $('form[name="addProductForm"]').length) {
          var $cartWindow = $('.dialog_minicartoverlay'),
              strippedShoeSize = shoeSize.replace(/^0+/,'').replace(/\.?0*$/,''),
              $itemSize = $('form[name="addProductForm"] .ffSelectMenuMid > ul > li span:contains("' + strippedShoeSize + '"):first');

          if($cartWindow.length) {
            // Stop Function Call
            clearInterval(adidascom);

            // Continue to Cart if Selected in Settings
            if (continueCart) {
              window.location.href = "/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show";
            }

            // Continue to Checkout if Selected in Settings
            if (continueCheckout) {
              window.location.href = "https://www.adidas.com/us/checkout-start";
            }

            return;
          }
          else {
            if ($itemSize.length && !$itemSize.hasClass('unavailable')) {
              // Size Avaibale - Select Shoe Size
              $itemSize.click();

              // Add Shoe to Cart
              $('[name="add-to-cart-button"]').click();
            }
            else {
              // Size Unavaibale - Stop YASB
              clearInterval(adidascom);

              // Notify User
              yasbAlert('size-unavailable');

              return;
            }
          }
        }
        else {
          // End if not on Product Page
          clearInterval(adidascom);
          return;
        }
      }, 250);

    });
  }
}

loadSettings(runYasb);
