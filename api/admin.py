from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

# Define an inline admin descriptor for UserProfile model
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

# Define a new User admin
class UserAdmin(BaseUserAdmin):
#    fieldsets = (
#        (None, {'fields': ('email', 'password')}),
#        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
#        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
#                                       'groups', 'user_permissions')}),
#        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
#    )
#    add_fieldsets = (
#        (None, {
#            'classes': ('wide',),
#            'fields': ('email', 'password1', 'password2'),
#        }),
#    )
#    list_display = ('email', 'first_name', 'last_name', 'is_staff')
#    search_fields = ('email', 'first_name', 'last_name')
#    ordering = ('email',)
    inlines = (UserProfileInline, )

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)