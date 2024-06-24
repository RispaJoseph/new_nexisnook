from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions,status,generics
from .serializer import * 
from .models import *
from users.models import UserAccount
from django.db.models import Q
from operator import attrgetter
from .signals import follow_notification
from django.shortcuts import get_object_or_404
from django.db.models.functions import Concat
# Create your views here.


class PostListView(generics.ListAPIView):
    permission_classes=[permissions.IsAuthenticated]
    queryset = Posts.objects.filter(is_deleted=False, is_blocked=False).order_by('-created_at')
    serializer_class=PostSerializer

class PostHomeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def get(self,request):
        try:
            user =request.user
            followers=Follow.objects.filter(follower=user)
            posts_by_followers=[]
            post_by_user =Posts.objects.filter(author=user,is_deleted=False,is_blocked=False).order_by('-created_at')
            for follower in followers:
                posts=Posts.objects.filter(author=follower.following,is_deleted=False,is_blocked=False).order_by('-created_at')
                posts_by_followers.extend(posts)
            
            all_users = UserAccount.objects.filter(is_admin=False).order_by('-id')
            all_users_serializer = UserSerializer(all_users , many = True)
            users_following = followers.values_list('following' , flat=True)

            users_not_following = [
                user for user in all_users_serializer.data 
                if user['id'] != request.user.id and user['id'] not in users_following
            ]

            all_posts = list(post_by_user)+posts_by_followers
            all_posts_sorted = sorted(all_posts,key=attrgetter('created_at'),reverse=True)
            serializer = PostSerializer(all_posts_sorted,many=True)

            response_data = {
                'posts':serializer.data,
                'users_not_following':users_not_following
            }
            print('home page is working')
            return Response(response_data,status=status.HTTP_200_OK)
        except Exception as e:
            print(f"An exception occurred: {str(e)}")
            return Response(status=status.HTTP_404_NOT_FOUND)
        

#=========================================POST SECTION===================================

class CreatePostView(APIView):
    permission_classes= [permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def post(self,request,*args,**kwargs):
        try:
            user = request.user
            img = request.data['img']
            body = request.data['body']
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                post = serializer.save(author=user,img=img,body=body)
                for follower in user.followers.all():
                    Notification.objects.create(
                        from_user = user,
                        to_user = follower.follower,
                        post = post,
                        notification_type = Notification.NOTIFICATION_TYPES[1][0],
                    )
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,status=status.HTTP_406_NOT_ACCEPTABLE)
        except Exception as e:
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class DeletePostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self,request,pk):
        try:
            post = Posts.objects.get(id=pk)
            post.is_deleted=True
            post.save()
            return Response(status=status.HTTP_200_OK)
        except Posts.DoesNotExist:
            return Response('No post found!',status=status.HTTP_404_NOT_FOUND)

class UpdatePostView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def post(self,request,pk):
        try:
            user = request.user
            post_object = Posts.objects.get(id=pk)
            serializer =self.serializer_class(post_object,data={'body':request.data.get('body')},partial = True)
            if serializer.is_valid():
                serializer.save()
                print('updated successfully')
                return Response(status=status.HTTP_200_OK)
            else:
                print('else condition')
                return Response(serializer.errors)
        except Posts.DoesNotExist:
            print('except condition')
            return Response('No such post found.')

class ReportPostView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def post(self,request,pk):
        try:
            post = Posts.objects.get(id=pk)
            if request.user in post.reported_users.all():
                return Response('You have already reported this post.' ,status=status.HTTP_200_OK)
            post.reported_users.add(request.user)
            return Response('Post Reported',status=status.HTTP_200_OK)
        except Posts.DoesNotExist:
            return Response('Post not found',status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#=====================================FETCH POST DETAILS===============================

class PostDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request,pk):
        try:
            post = Posts.objects.get(id=pk)
            serializer = PostSerializer(post)
            print('retreive post details')
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            print('couldnt retreive post details')
            return Response(status=status.HTTP_404_NOT_FOUND)
        

#====================================POST LIKE SECTION=================================

class LikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,pk):
        try:
            user = request.user
            post = Posts.objects.get(pk=pk)
            if request.user in post.likes.all():
                post.likes.remove(request.user)
                # Delete the notification associated with unliking the post
                Notification.objects.filter(from_user=user, to_user=post.author, post=post, notification_type=Notification.NOTIFICATION_TYPES[0][0]).delete()
                return Response('Post unliked ', status=status.HTTP_200_OK)
            else:
                post.likes.add(request.user)
                if not post.author == user:
                    Notification.objects.create(
                        from_user = user,
                        to_user = post.author,
                        post = post ,
                        notification_type = Notification.NOTIFICATION_TYPES[0][0],
                    )
                return Response('Post Liked.',status=status.HTTP_200_OK)

        except Posts.DoesNotExist:
            return Response('Post not found',status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

#====================================POST COMMENT SECTION===================================

class CreateComment(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer

    def post(self, request, pk, *args, **kwargs):
        try:
            user = request.user
            post = Posts.objects.get(id=pk)
            body = request.data['body']

            # Check if a notification already exists for this user and post
            existing_notification = Notification.objects.filter(
                from_user=user,
                to_user=post.author,
                post=post,
                notification_type=Notification.NOTIFICATION_TYPES[3][0]
            ).first()

            if not existing_notification:
                serializer = self.serializer_class(data=request.data)
                if serializer.is_valid():
                    serializer.save(user=user, post_id=pk, body=body)
                    
                Notification.objects.create(
                    from_user=user,
                    to_user=post.author,
                    post=post,
                    notification_type=Notification.NOTIFICATION_TYPES[3][0],
                )
                return Response(status=status.HTTP_201_CREATED)
            else:
                # A notification already exists for this user and post, so don't create a new one
                return Response("A notification already exists for this comment.", status=status.HTTP_200_OK)

        except Posts.DoesNotExist:
            return Response('Post not found', status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        
class DeleteComment(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            comment = Comment.objects.get(id=pk, user=request.user)

            # Find and delete the associated notification
            notification_type = Notification.NOTIFICATION_TYPES[3][0]  # Notification type for comments
            post = comment.post

            Notification.objects.filter(
                Q(from_user=request.user, to_user=post.author, post=post, notification_type=notification_type) |
                Q(from_user=post.author, to_user=request.user, post=post, notification_type=notification_type)
            ).delete()

            comment.delete()
            return Response(status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response('No such comment found', status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#=====================================USER PROFILE=====================================

class ProfileView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,email,*args,**kwargs):
        try:
            profile = UserAccount.objects.get(email=email)
            profile_posts = Posts.objects.filter(author=profile,is_deleted=False,is_blocked=False).order_by('-updated_at')
            profile_serializer=UserSerializer(profile)
            post_serializer = PostSerializer(profile_posts,many=True)

            context ={
                'profile_user':profile_serializer.data,
                'profile_posts':post_serializer.data
            }
            return Response(context,status=status.HTTP_200_OK)
        except UserAccount.DoesNotExist:
            return Response("User Not Fount",status=status.HTTP_404_NOT_FOUND)


class MyNetworkView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request):
        current_user = self.request.user
        followers_query = UserAccount.objects.filter(Q(followers__following=current_user) & ~Q(id=current_user.id))
        following_query = UserAccount.objects.filter(Q(following__follower=current_user) & ~Q(id=current_user.id))
        followers = UserSerializer(following_query, many=True)
        following = UserSerializer(followers_query, many=True)
        context={
            'followers':followers.data,
            'following':following.data
        }
        return Response(context,status=status.HTTP_200_OK)
        
#==================================SEARCH USERS==================================================

class SearchViewSet(APIView):
    serializer_class = UserSerializer

    def get(self,request,*args, **kwargs):
        try:
            query = self.request.GET.get('q','')
            if query:
                user_results= UserAccount.objects.filter(
                    models.Q(username__icontains=query) |
                    models.Q(first_name__icontains=query) |
                    models.Q(last_name__icontains=query),is_active=True,is_superuser=False
                )

                post_results = Posts.objects.filter(
                    Q(body__icontains=query,is_deleted=False)
                )
                user_serializer = UserSerializer(user_results,many=True)
                post_serializer = PostSerializer(post_results,many=True)
                user_data = {
                    'users':user_serializer.data,
                }
                post_data = {
                    'posts':post_serializer.data
                }
                response_data = {
                    'user_data':user_data,
                    'post_data':post_data
                }
                return Response(response_data,status=status.HTTP_200_OK)
            else:
                print('no user accoding to the search query')
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print('Error:', str(e))
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#=======================================FOLLOW USER=================================
class FollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,pk):
        try:
            user = request.user
            follows = UserAccount.objects.get(id=pk)
            is_following = Follow.objects.filter(follower = user,following = follows)
            if is_following:
                is_following.delete()
                response_msg = 'Unfollowed Successfully'
                # Delete the notification associated with the unfollowed user
                Notification.objects.filter(from_user=user, to_user=follows, notification_type=Notification.NOTIFICATION_TYPES[2][0]).delete()
            else:
                new_follow = Follow(follower=user,following=follows)
                new_follow.save()
                Notification.objects.create(
                    from_user = user,
                    to_user = follows,
                    notification_type = Notification.NOTIFICATION_TYPES[2][0],
                )
                response_msg = 'Followed Successfully'
                follow_notification.send(sender=self.__class__,follower=user,following=follows)
                print('signal sent successfully')

            is_following_now = Follow.objects.filter(follower = user , following = follows)

            is_following_data = [
                
                {
                    'id':follow.id,
                    'follower_id':follow.follower.id,
                    'following_id':follow.following.id,
                }
                for follow in is_following_now
            ]

            return Response({
                'message':response_msg,
                'is_following':is_following_data,
            },status=status.HTTP_200_OK)
        except UserAccount.DoesNotExist:
            return Response('User not found',status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ================================ NOTIFICATION ===================================

class NotificationsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(to_user=user).exclude(is_seen=True).order_by('-created')

    def get(self,request , *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many = True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NotificationsSeenView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def post(self, request , pk ,*args, **kwargs):
        try:
            notification = get_object_or_404(Notification,pk=pk)
            notification.is_seen = True
            notification.save()
            return Response(status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response("Not found in database",status=status.HTTP_404_NOT_FOUND)
        
    def get(self, request , pk , *args, **kwargs):
        return Response('GET method not allowed for the endpoint ', status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

class CheckFollowStatus(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self,request,email):
        print('check follow status working',email)
        if self.request.user.is_authenticated:
            try:
                profile_user = UserAccount.objects.get(email=email)
                follow_relation = Follow.objects.filter(follower=request.user,following=profile_user).exists()
                return Response({'isFollowing':follow_relation},status=status.HTTP_200_OK)
            except UserAccount.DoesNotExist:
                return Response({'isFollowing':False}, status=status.HTTP_404_NOT_FOUND)
        return Response({'isFollowing':False},status=status.HTTP_401_UNAUTHORIZED)