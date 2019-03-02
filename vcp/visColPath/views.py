from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, cornellians. Welcome to the college pathway visualizing system")
