from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, generics, status
from knox.models import AuthToken
from .models import User, Stage, Language, FileUpload, Textbook, Checkpoint
from .serializers import UserSerializer, LoginSerializer, AuthUserSerializer, StageSerializer, LanguageSerializer, FileUploadSerializer, TextbookSerializer, CheckpointSerializer
from .permissions import IsLoggedInUserOrAdmin, IsAdminUser, IsTeacher
from rest_framework.parsers import FileUploadParser

class AcademyApiView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)
        
class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer

class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer

class FileUploadListView(APIView):
    parser_class = (FileUploadParser,)

    def put(self, request, *args, **kwargs):
      serializer = FileUploadSerializer(data=request.data)

      if serializer.is_valid():
          serializer.save()
          return Response(serializer.data, status=status.HTTP_201_CREATED)
      else:
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileUploadDetailView(APIView):
    def delete(self, request, pk, format=None):
        file = FileUpload.objects.get(pk=pk)
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TextbookViewSet(viewsets.ModelViewSet):
    queryset = Textbook.objects.all().order_by('id')
    serializer_class = TextbookSerializer

class CheckpointViewSet(viewsets.ModelViewSet):
    queryset = Checkpoint.objects.all()
    serializer_class = CheckpointSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [AllowAny]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsLoggedInUserOrAdmin]
        elif self.action == 'list' or self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs): #OVERRIDE create (for registering new users)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "user": AuthUserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class UserApiView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AuthUserSerializer

    def get_object(self):
        return self.request.user

class LoginApiView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": AuthUserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })
