from django.db import models
#from django.contrib.auth.models import AbstractUser
#from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.contrib.auth.models import User

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
    classroom = models.CharField(max_length=255)
    isTeacher = models.BooleanField(default=False)