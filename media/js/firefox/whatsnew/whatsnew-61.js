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
    Display App/Play store badges for Focus

    i. Send to Device widget is available in the user's locale:
        Display the Send to Device widget, configured for Focus
    ii. Send to Device widget is *not* available in the user's locale:
        Display a QR code for Focus
*/

(function(Mozilla) {
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
        var widgetId = 'send-firefox';

        // Show the content
        mainContent.classList.add('show-fx-mobile');

        // Set the title
        document.title = $strings.data('fxmobile-title');

        // initialize Send to Device widget if present/available
        if (widgetId) {
            var form = new Mozilla.SendYourself(widgetId);
            form.init();
        }
    }


    function showFocus() {
        var widgetId = 'send-focus';
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

        // initialize Send Yourself widget if present/available
        if (widgetId) {
            var form = new Mozilla.SendYourself(widgetId);
            form.init();
        }
    }

/* eslint-disable */
    function showKlar() {
        var widgetId = 'send-klar';
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

        // initialize Send Yourself widget if present/available
        if (widgetId) {
            var form = new Mozilla.SendYourself(widgetId);
            form.init();
        }
    }
/* eslint-enable */

    // bug 1419573 - only show "Your Firefox is up to date" if it's the latest version.
    if (client.isFirefoxDesktop) {
        client.getFirefoxDetails(function(data) {
            if (data.isUpToDate) {
                document.querySelector('.main-header').classList.add('show-up-to-date-message');
            }
        });
    }

    client.getFxaDetails(function(details) {
        // if user is not signed in to FxA, show the FxA form
        if (!details.setup) {
            showFxa();
        // if the user is signed in to FxA but doesn't have any mobile devices set up, show Fx mobile content
        } else if (details.mobileDevices === 'unknown' || details.mobileDevices === 0) {
            showFirefoxMobile();
        // if user is signed in to FxA and has mobile devices set up, show Focus content
        } else {
        // TODO: geo lookup - if in Germany/Austria/Switzerland { showKlar() } else {
            showFocus();
        }
    });
})(window.Mozilla);
