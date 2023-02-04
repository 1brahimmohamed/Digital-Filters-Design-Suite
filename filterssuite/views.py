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

        # temporary zeros & poles
        zeros = [{1, 2}, {0.2, 1}]
        poles = [{0.1, 2}, {2, 1}]
        complex_zeros = []
        complex_poles = []

        for z in zeros:
            complex_zeros.append(complex(list(z)[0], list(z)[1]))
        for p in poles:
            complex_poles.append(complex(list(p)[0], list(p)[1]))

        digital_filter = DigitalFilter(complex_zeros, complex_poles)
        normalized_freq, magnitude, phase = digital_filter.response()

        # plot in frontend normalized_freq (0.0 => pi) in x_axis, magnitude or phase in y_axis

        return JsonResponse(
            {
                'Status': "Saved Successfully",
            }
        )
