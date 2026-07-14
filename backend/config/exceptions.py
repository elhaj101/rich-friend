"""
DRF exception handler that converts errors into the frontend's contract:
a JSON body of {"error": "<code>"} where <code> is one of the ApiErrorCode
values in frontend/src/lib/api.ts.
"""

from rest_framework import exceptions, status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


class ApiError(exceptions.APIException):
    """Raise anywhere in a view/serializer to return {"error": code} directly."""

    def __init__(self, code: str, http_status: int = status.HTTP_400_BAD_REQUEST):
        self.status_code = http_status
        self.detail = code
        super().__init__(detail=code)


def api_exception_handler(exc, context):
    if isinstance(exc, ApiError):
        return Response({"error": str(exc.detail)}, status=exc.status_code)

    response = drf_exception_handler(exc, context)
    if response is None:
        return None  # let Django render a 500

    if isinstance(exc, (exceptions.NotAuthenticated, exceptions.AuthenticationFailed)):
        code = "unauthorized"
    elif isinstance(exc, exceptions.PermissionDenied):
        code = "unauthorized"
    elif isinstance(exc, exceptions.ValidationError):
        code = "missing_fields"
    else:
        code = "unknown"

    response.data = {"error": code}
    return response
