from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect

import json
from .digital_filter import *




@csrf_protect
@csrf_exempt
def home(request):
    print("home")
    return render(request, 'home.html')


@csrf_protect
@csrf_exempt
def filter_response(request):
    if request.method == 'POST':
        req = json.loads(request.body)

        zeros = req['zeros']
        poles = req['poles']

        complex_zeros = []
        complex_poles = []

        for z in zeros:
            print(z)
            complex_zeros.append(complex(z['x'], z['y']))
        for p in poles:
            complex_poles.append(complex(p['x'], p['y']))

        digital_filter = DigitalFilter(complex_zeros, complex_poles)
        normalized_freq, magnitude, phase = digital_filter.response()

        # plot in frontend normalized_freq (0.0 => pi) in x_axis, magnitude or phase in y_axis
        return JsonResponse(
            {
                'normalizedFrequency': list(normalized_freq),
                'magnitudeResponse': list(magnitude),
                'phaseResponse': list(phase)
            }
        )
