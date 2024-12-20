# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

# Generated by Django 4.2.16 on 2024-10-25 09:48

from django.db import migrations

ORIGINAL_SLUG = "no-Logging-vpn-from-mozilla"
FIXED_SLUG = "no-logging-vpn-from-mozilla"


def forwards(apps, schema_editor):
    ContentfulEntry = apps.get_model("contentful.ContentfulEntry")
    ContentfulEntry.objects.filter(slug=ORIGINAL_SLUG).update(slug=FIXED_SLUG)


def backwards(apps, schema_editor):
    ContentfulEntry = apps.get_model("contentful.ContentfulEntry")
    ContentfulEntry.objects.filter(slug=FIXED_SLUG).update(slug=ORIGINAL_SLUG)


class Migration(migrations.Migration):
    dependencies = [
        ("contentful", "0008_alter_contentfulentry_content_type_and_more"),
    ]

    operations = [
        migrations.operations.RunPython(
            code=forwards,
            reverse_code=backwards,
        ),
    ]
