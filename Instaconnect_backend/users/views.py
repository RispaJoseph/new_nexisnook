from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view

from rest_framework.views import APIView
from rest_framework import permissions,status,generics
from django.conf import settings
from .serializer import UserSerializer,UserCreateSerializer
from .models import UserAccount
from post.models import *
from post.serializer import *
import json
from django.core.mail import send_mail


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        token['email'] = user.email
        # ...
        usr = UserSerializer(user)
        if usr.data['is_active']:
            return token
        else:
            return Response('You are Blocked by Admin',status=status.HTTP_404_NOT_FOUND)
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token/',
        'api/token/refresh/',
        'api/token/verify/',
        'users/me/',
        'register/'
    ]
    
    return Response(routes)


class RegisterUser(APIView):
    def post(self,request):
        serializer = UserCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        user = serializer.create(serializer.validated_data)
        user = UserSerializer(user)
        return Response(user.data,status=status.HTTP_201_CREATED)
    

class ForgotPasswordView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            print('Password reset email is:', email)
            user_account = UserAccount.objects.filter(email=email).first()
            if user_account:
                reset_link = f"http://localhost:3000/change-password/{user_account.id}"
                subject = 'Password Reset Link'
                message = f'''Hello,\n\nYou have requested to reset your password. 
                            Click the following link to reset your password:\n\n
                            {reset_link}\n\nIf you did not request this, please ignore this email.\n\nThanks!'''
                
                from_email = settings.EMAIL_HOST_USER
                recipient_list = [email]
                
                # Send the email
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
                
                return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Invalid Email'}, status=status.HTTP_404_NOT_FOUND)

        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON data in the request body'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ChangePasswordView(APIView):
    def post(self,request,id):
        try:
            data = json.loads(request.body.decode('utf-8'))
            password = data.get('password')
            password1 = data.get('password1')
            print('Password is:', password,'password1 is:',password1)
            user_account = UserAccount.objects.get(id=id)
            if user_account:
                user_account.set_password(password)
                user_account.save()
                return Response({'message': 'Password Has been changed'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Such User is available'}, status=status.HTTP_404_NOT_FOUND)

        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON data in the request body'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class RetrieveUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user = UserSerializer(user)
        return Response(user.data, status=status.HTTP_200_OK)
    

#==========================UPDATE USER DETAILS ===========================

class UpdateUserView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def post(self,request):
        try:
            user = request.user
            obj = UserAccount.objects.get(id=user.id)
            serializer = self.serializer_class(instance=obj,data = request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.errors,status=status.HTTP_200_OK)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except UserAccount.DoesNotExist:
            return Response('User not found in the database',status=status.HTTP_404_NOT_FOUND)
        

#=====================================ADMIN SIDE FUNCTIONS==============================================

class UsersList(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self,request):
        try:
            user = UserAccount.objects.filter(is_admin = False)
            serializer = UserSerializer(user , many =True)
            return Response(serializer.data , status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class BlockUser(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self,request,id):
        try:
            user = UserAccount.objects.get(id=id)
            if user.is_active:
                user.is_active=False
            else:
                user.is_active=True
            user.save()
            return Response(status=status.HTTP_200_OK)
        except UserAccount.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status= status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostsList(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self,request):
        try:
            posts = Posts.objects.all()
            serializer = PostSerializer(posts,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class BlockPost(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self,request,id):
        try:
            user = request.user
            post = Posts.objects.get(id=id)
            print('post is ',post)
            if post.is_blocked:
                post.is_blocked=False
                Notification.objects.create(
                    from_user=user,
                    to_user = post.author,
                    post = post,
                    notification_type = Notification.NOTIFICATION_TYPES[5][0],
                )
            else:
                post.is_blocked=True
                Notification.objects.create(
                    from_user=user,
                    to_user = post.author,
                    post = post,
                    notification_type = Notification.NOTIFICATION_TYPES[4][0],
                )
            post.save()
            return Response(status=status.HTTP_200_OK)
        except Posts.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReportedPostList(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self,request):
        try:
            queryset = Posts.objects.filter(reported_users__isnull=False).order_by('-created_at')[::-1]
            serializer = PostSerializer(queryset , many = True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        