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
/*globals $, validKey, chrome, footlocker */

chrome.runtime.sendMessage({isActive: ""}, function (response) {
    
    if ((response.checkKey && response.checkSize) || (response.client === "personal" && response.checkSize)) {
        window.addEventListener('load', function () {

            var shoeSize,
                continueCheckout,
                addedToCart = false,
                footlocker;

            // Retrieve settings.
            chrome.runtime.sendMessage({localStorage: ""}, function (response) {
                var localStorage = response.localStorage;
                shoeSize = localStorage.size;
                continueCheckout = localStorage.checkout;
            });

            //footlocker.com
            function footlockercom() {
                return window.setInterval(function () {

                    var errorClose,
                        sizes,
                        makeActive,
                        addToCartBtn;

                    // Check to see if "Item added to cart" popup window is opened.
                    if (document.getElementById("miniAddToCartWrapper") !==  null) {

                        // If shoe has not been added to cart, close pop up window, otherwise continue.
                        if (document.getElementById("miniAddToCart_error") ===  null) {
                            addedToCart = true;

                            // Continue to checkout if option is enabled.
                            if (continueCheckout === "true") {
                                window.location = "https://www.footlocker.com/checkout/";
                            }
                        } else {
                            errorClose = document.getElementById("miniAddToCart_close");
                            errorClose.click();
                        }
                    } else if (addedToCart === false || document.getElementById("miniAddToCartError") !==  null) {

                        // Select shoe size set from settings.
                        sizes = document.getElementById("product_sizes");

                        // Check URL to see if on footlocker.com shoe product page.
                        if (window.location.href.indexOf("product") !== -1) {

                            // If page does not have shoes available, reload until they become available.
                            if (sizes === null && document.getElementById("select_size") === null) {
                                location.reload();
                            }
                        }

                        sizes.value = shoeSize;

                        $('#QV_size').val(shoeSize);
                        $("#pdp_selectedSize").val(shoeSize);
                        sizes.click();

                        // If "Add To Cart" button is not active, make active to proceed.
                        makeActive = document.getElementsByName("pdp_addtocart");
                        makeActive[0].setAttribute("class", "active_step");

                        addToCartBtn = document.getElementsByClassName("active_step");
                        addToCartBtn[0].click();
                    }
                }, 1000);
            }

            footlocker = footlockercom();

            window.setInterval(function () {
                if (addedToCart === true) {
                    window.clearInterval(footlocker);
                }
            }, 100);

        }, false);
    }
});