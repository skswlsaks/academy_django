from rest_framework import serializers
from rest_framework.fields import empty
from .models import UserProfile, Stage, Language, Checkpoint, FileUpload, Textbook, TextbookCheckpoint
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction

#README: https://www.erol.si/2015/09/django-rest-framework-nestedserializer-with-relation-and-crud/
class RelationModelSerializer(serializers.ModelSerializer):
    def __init__(self, instance=None, data=empty, **kwargs):
        self.is_relation = kwargs.pop('is_relation', False)
        super(RelationModelSerializer, self).__init__(instance, data, **kwargs)
 
    def validate_empty_values(self, data):
        if self.is_relation:
            model = getattr(self.Meta, 'model')
            model_pk = model._meta.pk.name
 
            if not isinstance(data, dict):
                error_message = self.default_error_messages['invalid'].format(datatype=type(data).__name__)
                raise serializers.ValidationError(error_message)
 
            if not model_pk in data:
                raise serializers.ValidationError({model_pk: model_pk + ' is required'})
 
            try:
                instance = model.objects.get(pk=data[model_pk])
                return True, instance
            except:
                raise serializers.ValidationError({model_pk: model_pk + ' is not valid'})
 
        return super(RelationModelSerializer, self).validate_empty_values(data)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('mobile_number', 'classroom', 'isTeacher')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = UserProfileSerializer(required=True)

    class Meta:
        model = User
        #NOTE: we will be using first_name field to store the FULL NAME
        fields = ('email', 'username', 'first_name', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.save()

        profile.classroom = profile_data.get('classroom', profile.classroom)
        profile.save()

        return instance

class AuthUserSerializer(serializers.HyperlinkedModelSerializer):
    profile = UserProfileSerializer(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'email', 'profile')

class UserOnlyNameSerializer(RelationModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
        
class StageSerializer(RelationModelSerializer):
    class Meta:
        model = Stage
        fields = ('id', 'name')

class LanguageSerializer(RelationModelSerializer):
    class Meta:
        model = Language
        fields = ('id', 'name', 'max_level')

class CheckpointSerializer(RelationModelSerializer):
    class Meta:
        model = Checkpoint
        fields = ('id', 'name')

class FileUploadSerializer(RelationModelSerializer):
    class Meta:
        model = FileUpload
        fields =  ('id', 'file')

class TextbookCheckpointSerializer(RelationModelSerializer):
    id = serializers.ReadOnlyField(source='checkpoint.id')
    name = serializers.ReadOnlyField(source='checkpoint.name')

    class Meta:
        model = TextbookCheckpoint
        fields =  ('id', 'name')

class TextbookSerializer(RelationModelSerializer):
    stage = StageSerializer(read_only=False, is_relation=True)
    language = LanguageSerializer(read_only=False, is_relation=True)
    checkpoints = CheckpointSerializer(many=True, is_relation=True)
    author = UserOnlyNameSerializer(read_only=False, is_relation=True)
    file = FileUploadSerializer(read_only=False, is_relation=True)

    class Meta:
        model = Textbook
        fields =  ('id', 'name', 'level', 'stage', 'language', 'checkpoints', 'author', 'file', 'created_at', 'updated_at')
    
    #overrides Serializer.to_representation method
    #sorts nested checkpoints serialized data by id
    # def to_representation(self, instance):
    #     response = super().to_representation(instance)
    #     response['checkpoints'] = sorted(response['checkpoints'], key=lambda checkpoint: checkpoint['id'])
    #     return response

    @transaction.atomic
    def update(self, instance, validated_data):
        checkpoints_data = validated_data.pop('checkpoints')
        TextbookCheckpoint.objects.filter(textbook=instance).delete()

        for item in validated_data:
            if Textbook._meta.get_field(item):
                setattr(instance, item, validated_data[item])

        for checkpoint_instance in checkpoints_data:
            TextbookCheckpoint.objects.create(textbook=instance, checkpoint=checkpoint_instance)

        instance.save()
        return instance
       
    @transaction.atomic
    def create(self, validated_data):
        checkpoints_data = validated_data.pop('checkpoints')
        textbook_instance = Textbook.objects.create(**validated_data)

        for checkpoint_instance in checkpoints_data:
            TextbookCheckpoint.objects.create(textbook=textbook_instance, checkpoint=checkpoint_instance)

        textbook_instance.save()
        return textbook_instance

    #E.g:
    #POST or PUT request to: /api/textbook/
    #JSON data:
    # {
    #     "name": "버거 만들기",
    #     "level": 3,
    #     "language": {
    #         "id": "1"
    #     },
    #     "stage": {
    #         "id": "1"
    #     },
    #     "checkpoints" : [
    #         { "id": 1 },
    #         { "id": 3 },
    #         { "id": 2 }
    #     ],
    #     "author": {
    #         "id": "1"
    #     }
    # }