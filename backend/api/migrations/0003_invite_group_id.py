# Generated by Django 5.1.1 on 2024-10-19 22:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_rename_user_id_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='invite',
            name='group_id',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='invite_origin', to='api.group'),
            preserve_default=False,
        ),
    ]
