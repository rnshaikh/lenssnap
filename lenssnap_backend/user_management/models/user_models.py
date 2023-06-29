from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.password_validation import validate_password
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, first_name=None, last_name=None, **kwargs):

        if password:
            validate_password(password)
        UserManager.normalize_email(email)
        user = self.model(email=email, password=password, **kwargs)

        if password:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, first_name, last_name, **kwargs):

        user = self.create_user(email, password, first_name, last_name,**kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):

    """
        user model for storing users
    """
    username = None
    first_name = models.CharField(max_length=125)
    last_name = models.CharField(max_length=125)
    email = models.EmailField(unique=True)
    last_login = models.DateTimeField(default=timezone.now, blank=True)
    date_joined = models.DateTimeField(default=timezone.now, blank=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    picture = models.URLField(blank=True, null=True)
    bio = models.CharField(max_length=2045, blank=True, null=True)
    password = models.CharField(max_length=256, blank=True, null=True)

    REQUIRED_FIELDS = ['first_name', 'last_name']
    USERNAME_FIELD = 'email'
    objects = UserManager()

    def __str__(self):
        return self.email
