# Generated by Django 4.2.2 on 2023-07-16 11:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0005_follower'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='follower',
            options={'ordering': ('-created_at',)},
        ),
        migrations.AlterUniqueTogether(
            name='follower',
            unique_together={('followed_by', 'followed_to')},
        ),
    ]