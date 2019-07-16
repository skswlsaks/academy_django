from django.db import models
#from django.contrib.auth.models import AbstractUser
#from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_delete
from django.dispatch import receiver

#THIS REPLLACES THE DEFAULT USER TO USE `EMAIL` INSTEAD OF `USERNAME` FOR LOGIN
#class User(AbstractUser):
#    username = models.CharField(max_length=255, blank=True, null=True)
#    email = models.EmailField(_('email address'), unique=True)
#
#    USERNAME_FIELD = 'email'
#    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
#
#    def __str__(self):
#        return "{}".format(self.email)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    #user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    #dob = models.DateField()
    classroom = models.CharField(max_length=255, default="room1")
    isTeacher = models.BooleanField(default=False)
    mobile_number = models.CharField(max_length=20, default="01012345678")

class Stage(models.Model):
    name = models.CharField(max_length=255)

class Language(models.Model):
    name = models.CharField(max_length=255)
    max_level = models.PositiveIntegerField(default=5)

class Checkpoint(models.Model):
    name = models.CharField(max_length=255)

class FileUpload(models.Model):
    file = models.FileField(upload_to='textbooks/', blank=False, null=False) #file itself is not saved in db, only the reference (path) is stored

@receiver(post_delete, sender=FileUpload)
def submission_delete(sender, instance, **kwargs):
    instance.file.delete(False) #Passing “false” to instance.file.delete ensures that FileField does not save the model

class Textbook(models.Model):
    name = models.CharField(max_length=255)
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='textbooks')
    level = models.PositiveIntegerField(default=1)
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE, related_name='textbooks')
    checkpoints = models.ManyToManyField(Checkpoint, blank=True, related_name='textbooks', through="TextbookCheckpoint")
    file = models.ForeignKey(FileUpload, on_delete=models.CASCADE)
    author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

@receiver(post_delete, sender=Textbook)
def delete_reverse(sender, **kwargs):
    try:
        if kwargs['instance'].file:
            kwargs['instance'].file.delete() #delete file from FileUpload table when Textbook is deleted
    except:
        pass

class TextbookCheckpoint(models.Model):
    textbook = models.ForeignKey(Textbook, on_delete=models.CASCADE)
    checkpoint = models.ForeignKey(Checkpoint, on_delete=models.CASCADE)