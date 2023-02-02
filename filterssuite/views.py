from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect



@csrf_protect
@csrf_exempt
def home(request):
    print("home")
    return render(request, 'home.html')