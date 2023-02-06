"""
 *
 * File Name  : urls.py
 * Description: Declaration of project endpoints
 * Author    :  Ibrahim Mohamed
 *
 """
from django.urls import path
from . import views


# APIs Application Routes

urlpatterns = [
    path("home/", views.home, name="home"),
    path("get-filter-response/", views.filter_response, name="get-filter-response"),
    path("get-allpass-response/", views.test_all_pass, name="get-allpass-response"),
    path("filter-signal/", views.signal_filtering, name="filter-signal"),
]
