from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Stage, Language, Checkpoint, FileUpload, Textbook, TextbookCheckpoint

# Define an inline admin descriptor for UserProfile model
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, )

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Stage)
admin.site.register(Language)
admin.site.register(Checkpoint)
admin.site.register(Textbook)
admin.site.register(FileUpload)
admin.site.register(TextbookCheckpoint)