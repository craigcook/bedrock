# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import pytest

from pages.firefox.welcome.page13 import FirefoxWelcomePage13


@pytest.mark.skip_if_not_firefox(reason="Welcome pages are shown to Firefox only.")
@pytest.mark.nondestructive
def test_vpn_button_displayed(base_url, selenium):
    page = FirefoxWelcomePage13(selenium, base_url).open()
    assert page.is_get_vpn_button_displayed
