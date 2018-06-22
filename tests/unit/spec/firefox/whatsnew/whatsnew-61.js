/* For reference read the Jasmine and Sinon docs
 * Jasmine docs: http://pivotal.github.io/jasmine/
 * Sinon docs: http://sinonjs.org/docs/
 */

/* global describe, beforeEach, afterEach, it, expect */

describe('whatsnew-61.js', function () {
    'use strict';

    describe('init', function () {

        it('should call showFxa if user is not logged in to FxA', function () {
            spyOn(Mozilla.WNP61, 'showFxa');

            Mozilla.WNP61.init({
                setup: false
            });

            expect(Mozilla.WNP61.showFxa).toHaveBeenCalled();
        });

        it('should call showFirefoxMobile if user is logged in to FxA but has no mobile devices set up', function () {
            spyOn(Mozilla.WNP61, 'showFirefoxMobile');

            Mozilla.WNP61.init({
                setup: true,
                mobileDevices: 0
            });

            expect(Mozilla.WNP61.showFirefoxMobile).toHaveBeenCalled();
        });

        it('should call geolocate if user is logged in to FxA and does have mobile devices set up', function () {
            spyOn(Mozilla.WNP61, 'geolocate');

            Mozilla.WNP61.init({
                setup: true,
                mobileDevices: 1
            });

            expect(Mozilla.WNP61.geolocate).toHaveBeenCalled();
        });
    });

    describe('showFocusOrKlar', function () {

        it('should call showFocus if country is not tagged for Klar', function () {
            spyOn(Mozilla.WNP61, 'showFocus');

            Mozilla.WNP61.showFocusOrKlar('pl');

            expect(Mozilla.WNP61.showFocus).toHaveBeenCalled();
        });

        it('should call showFocus if no country code is provided', function () {
            spyOn(Mozilla.WNP61, 'showFocus');

            Mozilla.WNP61.showFocusOrKlar();

            expect(Mozilla.WNP61.showFocus).toHaveBeenCalled();
        });

        it('should call showKlar if country is tagged for Klar', function () {
            spyOn(Mozilla.WNP61, 'showKlar');

            Mozilla.WNP61.showFocusOrKlar('de');

            expect(Mozilla.WNP61.showKlar).toHaveBeenCalled();
        });
    });
});
