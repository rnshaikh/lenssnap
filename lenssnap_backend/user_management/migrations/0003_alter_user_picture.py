# Generated by Django 4.2.2 on 2023-06-27 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0002_rename_avatar_user_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='picture',
            field=models.URLField(),
        ),
    ]