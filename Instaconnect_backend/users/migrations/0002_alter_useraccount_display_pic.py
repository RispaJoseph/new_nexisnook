# Generated by Django 4.2.5 on 2023-09-26 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useraccount',
            name='display_pic',
            field=models.ImageField(blank=True, default='NewInstaConnect/instaconnectfrontend/src/images/Default-Profile-Picture1.png', null=True, upload_to='user/'),
        ),
    ]