# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

# Generated by Django 4.2.16 on 2024-09-27 17:51

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("sitemaps", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="sitemapurl",
            name="lastmod",
        ),
    ]
