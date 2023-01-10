from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path("login", views.login_view, name='login'),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),

    # API ROUTES
    path("add_transaction", views.add_transaction, name="add_transaction"),
    path("portfolio", views.portfolio, name='portfolio'),
    path("comment_process", views.comment_process, name='comment_process')
]