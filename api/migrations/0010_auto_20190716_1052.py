# Generated by Django 2.2.2 on 2019-07-16 01:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20190716_0427'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileUpload',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='textbooks/')),
            ],
        ),
        migrations.AlterField(
            model_name='textbook',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='textbook',
            name='file',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.FileUpload'),
        ),
    ]
