from django.urls import include, path
from rest_framework import routers
from api import views
from knox import views as knox_views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet) #generates routes for a standard set of create/retrieve/update/destroy style actions

urlpatterns = [
    path('', include(router.urls)),
    path('academy/', views.AcademyApiView.as_view()),
    path('auth/login/', views.LoginApiView.as_view()), #authenticates user and generates token
    path('auth/user/', views.UserApiView.as_view()),
    path('auth/logout/', knox_views.LogoutView.as_view(), name='knox_logout') #expires token
]