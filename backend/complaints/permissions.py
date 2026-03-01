from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object, Admins, or Owners to view it.
    Admins and Owners are allowed to update objects.
    Customers may only view their own objects (handled by view queryset) and are restricted
    from object-level updates here.
    """

    def has_object_permission(self, request, view, obj):
        # Allow any read request for admins/owners, or if it belongs to the customer
        if request.method in permissions.SAFE_METHODS:
            if request.user.role in ['ADMIN', 'OWNER']:
                return True
            return obj.customer == request.user

        # Updates and deletes are restricted to ADMIN or OWNER roles
        return request.user.role in ['ADMIN', 'OWNER']
