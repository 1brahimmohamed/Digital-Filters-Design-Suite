from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect

import json
from .digital_filter import *


digital_filter = None


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

        global digital_filter

        zeros = req['zeros']
        poles = req['poles']
        all_pass = req['allPass']

        complex_zeros = []
        complex_poles = []
        complex_allPass = []

        for z in zeros:
            complex_zeros.append(complex(z['x'], z['y']))
        for p in poles:
            complex_poles.append(complex(p['x'], p['y']))
        for a in all_pass:
            value = a['filterValue']
            complex_allPass.append(complex(value['re'], value['im']))

        digital_filter = DigitalFilter(complex_zeros, complex_poles)
        if len(all_pass) > 0:
            digital_filter.add_list_all_pass(complex_allPass)
        normalized_freq, magnitude, phase = digital_filter.response()

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


@csrf_protect
@csrf_exempt
def signal_filtering(request):
    if request.method == 'POST':
        global digital_filter

        req = json.loads(request.body)

        real_time_signal = req['signal']
        print(real_time_signal)

        print(digital_filter.get_zeros())
        filtered_signal = digital_filter.apply_filter(real_time_signal)

        # plot in frontend normalized_freq (0.0 => pi) in x_axis, magnitude or phase in y_axis
        return JsonResponse(
            {
                'filteredSignal': list(filtered_signal)
            }
        )