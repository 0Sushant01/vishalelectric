from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from .models import Complaint
from .serializers import ComplaintListSerializer, ComplaintDetailSerializer
from .permissions import IsOwnerOrAdmin

class ComplaintListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ComplaintDetailSerializer
        return ComplaintListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'OWNER']:
            return Complaint.objects.all().order_by('-created_at')
        return Complaint.objects.filter(customer=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class ComplaintDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = ComplaintDetailSerializer
    queryset = Complaint.objects.all()
