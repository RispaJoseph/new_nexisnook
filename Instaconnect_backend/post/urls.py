from django.urls import path
from .views import *


urlpatterns = [

    path('home/',PostHomeView.as_view(),name='home'),
    path('explore/',PostListView.as_view(),name='explore'),
    path('profile/<str:email>/',ProfileView.as_view(),name='profile'),
    path('create-post/',CreatePostView.as_view(),name='create-posts'),
    path('update-post/<int:pk>/',UpdatePostView.as_view(),name='update-post'),
    path('report-post/<int:pk>/',ReportPostView.as_view(),name='report-post'),
    path('delete-post/<int:pk>',DeletePostView.as_view(),name='delete-post'),

    path('post-detail/<int:pk>/', PostDetail.as_view(), name='post-detail'),
    path('like/<int:pk>/', LikeView.as_view(), name='like-post'),
    path('create-comment/<int:pk>/', CreateComment.as_view(), name='add-comment'),
    path('delete-comment/<int:pk>/', DeleteComment.as_view(), name='delete-comment'),

    path('search-request/',SearchViewSet.as_view(),name='search-request'),
    path('follow-user/<int:pk>/',FollowUserView.as_view(),name='follow'),
    path('check-follow-status/<str:email>/',CheckFollowStatus.as_view(),name='check-follow-status'),
    path('network/',MyNetworkView.as_view(),name='network'),
    
    path('notifications/',NotificationsView.as_view(),name='notifications'),
    path('notifications-seen/<int:pk>/',NotificationsSeenView.as_view(),name='notifications-seen'),

]

