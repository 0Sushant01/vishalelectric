from django.urls import path
from .views import ComplaintListCreateView, ComplaintDetailView, AnalyticsView

urlpatterns = [
    path('', ComplaintListCreateView.as_view(), name='complaint-list-create'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('<int:pk>/', ComplaintDetailView.as_view(), name='complaint-detail'),
]
