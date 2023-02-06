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
        all_pass = req['allPass']

        complex_zeros = []
        complex_poles = []
        complex_allPass = []

        for z in zeros:
            print(z)
            complex_zeros.append(complex(z['x'], z['y']))
        for p in poles:
            complex_poles.append(complex(p['x'], p['y']))
        for a in all_pass:
            value = a['filterValue']
            complex_allPass.append(complex(value['re'], value['im']))

        digital_filter_orig = DigitalFilter(complex_zeros, complex_poles)
        if len(all_pass) > 0:
            digital_filter_orig.add_list_all_pass(complex_allPass)
        normalized_freq, magnitude, phase = digital_filter_orig.response()

        # plot in frontend normalized_freq (0.0 => pi) in x_axis, magnitude or phase in y_axis
        return JsonResponse(
            {
                'normalizedFrequency': list(normalized_freq),
                'magnitudeResponse': list(magnitude),
                'phaseResponse': list(phase)
            }
        )


@csrf_protect
@csrf_exempt
def test_all_pass(request):
    if request.method == 'POST':
        req = json.loads(request.body)

        all_pass_value = req['value']
        all_pass_filter = DigitalFilter(complex(all_pass_value['re'], all_pass_value['im']))
        all_pass_filter.add_all_pass()
        normalized_freq, _, all_pass_phase = all_pass_filter.response()

        # plot in frontend normalized_freq (0.0 => pi) in x_axis, magnitude or phase in y_axis
        return JsonResponse(
            {
                'normalizedFrequency': list(normalized_freq),
                'allPassResponse': list(all_pass_phase)
            }
        )
