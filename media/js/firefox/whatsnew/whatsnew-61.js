/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
This iteration of /whatsnew has multiple states:

1. User is not logged in to Sync (or UITour JS fails/times out):
    Display the FxA iframe

2. User is logged in to Sync, but does not have any mobile devices set up:
    Display App/Play store badges for Firefox Mobile

    i. Send to Device widget is available in the user's locale:
        Display the Send to Device widget, configured for Firefox Mobile
    ii. Send to Device widget is *not* available in the user's locale:
        Display a QR code for Firefox Mobile

3. User is logged in to Sync, and *does* have a mobile device set up:

    i. If they're in Germany, Austria, or Switzerland:
        a. Send to Device widget is available in the user's locale:
            Display the Send to Device widget, configured for Klar
        b. Send to Device widget is *not* available in the user's locale:
            Display a QR code for Klar
    ii. If they're in any other country *or* geolocation fails
        a. Send to Device widget is available in the user's locale:
            Display the Send to Device widget, configured for Focus
        b. Send to Device widget is *not* available in the user's locale:
            Display a QR code for Focus

*/

(function(Mozilla, $) {
    'use strict';

    var client = Mozilla.Client;
    var mainContent = document.querySelector('.main-content');
    var $strings = $('#strings');

    function showFxa() {
        // Show the content
        mainContent.classList.add('show-fxa');

        // Set the title
        document.title = $strings.data('fxaccount-title');

        // initialize the FxA iframe
        Mozilla.Client.getFirefoxDetails(function(data) {
            Mozilla.FxaIframe.init({
                distribution: data.distribution,
                gaEventName: 'whatsnew-fxa'
            });
        });
    }

    function showFirefoxMobile() {
        // Show the content
        mainContent.classList.add('show-fx-mobile');

        // Set the title
        document.title = $strings.data('fxmobile-title');

        var form = new Mozilla.SendYourself('send-firefox');
        form.init();
    }


    function showFocus(countryCode) {
        var logoFx = document.getElementById('logo-fx');
        var logoFocus = document.getElementById('logo-focus');

        // Show the content
        mainContent.classList.add('show-focus');

        // Set the title
        document.title = $strings.data('fxfocus-title');

        // swap out Firefox logo for Focus logo
        logoFx.classList.replace('showing', 'hiding');

        setTimeout(function() {
            logoFocus.classList.replace('hiding', 'showing');
        }, 150);

        var form = new Mozilla.SendYourself('send-focus');
        form.init(countryCode);
    }


    function showKlar(countryCode) {
        var logoFx = document.getElementById('logo-fx');
        var logoFocus = document.getElementById('logo-focus');

        // Show the content
        mainContent.classList.add('show-klar');

        // Set the title
        document.title = $strings.data('fxfocus-title');

        // swap out Firefox logo for Focus logo
        logoFx.classList.replace('showing', 'hiding');

        setTimeout(function() {
            logoFocus.classList.replace('hiding', 'showing');
        }, 150);

        var form = new Mozilla.SendYourself('send-klar');
        form.init(countryCode);
    }


    // bug 1419573 - only show "Your Firefox is up to date" if it's the latest version.
    if (client.isFirefoxDesktop) {
        client.getFirefoxDetails(function(data) {
            if (data.isUpToDate) {
                document.querySelector('.main-header').classList.add('show-up-to-date-message');
            }
        });
    }

    client.getFxaDetails(function(details) {
        // Focus is known as Klar in Austria, Switzerland, and Germany.
        var klarCountryCodes = ['at', 'ch', 'de'];

        // if user is not signed in to FxA, show the FxA form
        if (!details.setup) {
            showFxa();
        // if the user is signed in to FxA but doesn't have any mobile devices set up, show Fx mobile content
        } else if (details.mobileDevices === 'unknown' || details.mobileDevices === 0) {
            showFirefoxMobile();
        // if user is signed in to FxA and has mobile devices set up, perform geo lookup
        // to determine whether to show Focus or Klar content
        } else {
            $.get('/country-code.json')
                .done(function(data) {
                    if (data && data.country_code) {
                        if (klarCountryCodes.includes(data.country_code.toLowerCase())) {
                            showKlar(data.country_code.toLowerCase());
                        } else {
                            showFocus(data.country_code.toLowerCase());
                        }
                    // if for some reason data isn't as expected, show Focus content
                    } else {
                        showFocus();
                    }
                })
                .fail(function () {
                    // something went wrong - show Focus content
                    showFocus();
                });
        }
    });
})(window.Mozilla, window.jQuery);
