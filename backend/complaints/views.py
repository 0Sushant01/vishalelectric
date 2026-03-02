from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Avg, F
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from .models import Complaint
from accounts.models import User
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
        queryset = Complaint.objects.all() if user.role in ['ADMIN', 'OWNER'] else Complaint.objects.filter(customer=user)
        
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
            
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class ComplaintDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = ComplaintDetailSerializer
    queryset = Complaint.objects.all()

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get(self, request):
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        # Get local time and ensure we are working with correct date boundaries
        now = timezone.localtime()
        
        if end_date_str:
            end_date = end_date_str
        else:
            end_date = now.date().isoformat()
            
        if start_date_str:
            start_date = start_date_str
        else:
            start_date = (now - timedelta(days=7)).date().isoformat()

        complaints = Complaint.objects.filter(
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        )

        # Summary
        total_complaints = complaints.count()
        total_revenue = complaints.aggregate(total=Sum('charge'))['total'] or 0
        total_collected = complaints.aggregate(total=Sum('amount_paid'))['total'] or 0
        pending_amount = total_revenue - total_collected
        average_charge = complaints.aggregate(avg=Avg('charge'))['avg'] or 0

        # Status Breakdown
        status_counts = complaints.values('status').annotate(count=Count('id'))
        status_breakdown = {item['status']: item['count'] for item in status_counts}
        
        # Ensure all statuses map to 0 if not present
        all_statuses = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED']
        for s in all_statuses:
            if s not in status_breakdown:
                status_breakdown[s] = 0

        # Category Breakdown
        category_counts = complaints.values('issue_category').annotate(count=Count('id'))
        category_breakdown = [{'category': item['issue_category'], 'count': item['count']} for item in category_counts]

        # Revenue Trend
        revenue_trend_query = complaints.annotate(month=TruncMonth('created_at')).values('month').annotate(revenue=Sum('charge')).order_by('month')
        revenue_trend = []
        for item in revenue_trend_query:
            if item['month']:
                revenue_trend.append({
                    'month': item['month'].strftime('%Y-%m'),
                    'revenue': item['revenue'] or 0
                })

        # Customers
        total_customers = User.objects.filter(role='CUSTOMER').count()

        return Response({
            "summary": {
                "total_complaints": total_complaints,
                "total_revenue": float(total_revenue),
                "total_collected": float(total_collected),
                "pending_amount": float(pending_amount),
                "average_charge": float(average_charge),
                "total_customers": total_customers
            },
            "status_breakdown": status_breakdown,
            "category_breakdown": category_breakdown,
            "revenue_trend": revenue_trend
        })
