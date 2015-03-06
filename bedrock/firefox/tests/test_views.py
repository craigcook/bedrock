# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
from django.test.client import RequestFactory

from funfactory.urlresolvers import reverse
from nose.tools import eq_, ok_

from bedrock.mozorg.tests import TestCase
from bedrock.firefox import views


class TestFirefoxNew(TestCase):
    def test_frames_allow(self):
        """
        Bedrock pages get the 'x-frame-options: DENY' header by default.
        The firefox/new page needs to be framable for things like stumbleupon.
        Bug 1004598.
        """
        with self.activate('en-US'):
            resp = self.client.get(reverse('firefox.new'))

        ok_('x-frame-options' not in resp)


class TestFeedbackView(TestCase):
    def test_get_template_names_default_unhappy(self):
        view = views.FeedbackView()
        view.request = RequestFactory().get('/')
        eq_(view.get_template_names(), ['firefox/feedback/unhappy.html'])


    def test_get_template_names_happy(self):
        view = views.FeedbackView()
        view.request = RequestFactory().get('/?rating=5')
        eq_(view.get_template_names(), ['firefox/feedback/happy.html'])


    def test_get_template_names_unhappy(self):
        view = views.FeedbackView()
        view.request = RequestFactory().get('/?rating=1')
        eq_(view.get_template_names(), ['firefox/feedback/unhappy.html'])

