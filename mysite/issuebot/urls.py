from django.urls import path, re_path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    re_path(r'^get_issue_info/$', views.get_issue_info, name='get_issue_info'),
]
