from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import RegisterSerializer, ProfileSerializer

class SignupAPI(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created"}, status=201)
        return Response(serializer.errors, status=400)


class ProfileAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# from django.shortcuts import render
# from .forms import CustomUserCreationForm
# from django.views.generic import CreateView, DetailView
# from django.urls import reverse_lazy
# from django.contrib.auth.mixins import LoginRequiredMixin 
# from .models import User

# class SignUpView(CreateView):
#     form_class = CustomUserCreationForm
#     success_url = reverse_lazy('login')
#     template_name = 'users/signup.html'

# class UserProfile(LoginRequiredMixin, DetailView):
#     model = User
#     template_name = 'users/profile.html'
#     context_object_name = 'user_profile'
#     login_url = reverse_lazy('login') 
    
#     def get_object(self):
#         return self.request.user
    
