from digital_filter import *
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect




@csrf_protect
@csrf_exempt
def home(request):
    print("home")
    return render(request, 'home.html')


@csrf_protect
@csrf_exempt
def create(request):
    if request.method == 'POST':
        # file = request.FILES['file']

        # temp zeros & poles
        zeros = [{1, 2}, {0.2, 1}]
        poles = [{0.1, 2}, {2, 1}]
        modified_zeros = []
        modified_poles = []

        # digital_filter = DigitalFilter()

        return JsonResponse(
            {
                'Status': "Saved Successfully",
            }
        )