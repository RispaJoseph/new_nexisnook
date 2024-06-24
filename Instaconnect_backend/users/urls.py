from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView

from .views import *

urlpatterns = [

    path('',getRoutes,name='getRoutes'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('users/me/',RetrieveUserView.as_view() ,name='getRoutes'),
    path('register/',RegisterUser.as_view(),name='register'),
    path('forgot-password/',ForgotPasswordView.as_view(),name='forgot-password'),
    path('change-password/<int:id>/',ChangePasswordView.as_view(),name='change-password'),
    path('user-update/',UpdateUserView.as_view(),name='register'),
    
    path('userslist/',UsersList.as_view(),name='userslist'),
    path('blockuser/<str:id>',BlockUser.as_view(),name='userslist'),
    path('postslist/',PostsList.as_view(),name='postlist'),
    path('blockpost/<str:id>/',BlockPost.as_view(),name='blockpost'),
    path('reportedposts/',ReportedPostList.as_view(),name='reportedposts'),
]

