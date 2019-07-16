from rest_framework import permissions

class IsLoggedInUserOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user or request.user.is_staff

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        return request.user and request.user.is_staff

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.profile and request.user.profile.isTeacher

    def has_object_permission(self, request, view, obj):
        return request.user and request.user.profile and request.user.profile.isTeacher