# Generated by Django 4.2.2 on 2023-07-08 18:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comment_management', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ('-created_at',)},
        ),
    ]