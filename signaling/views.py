from django.shortcuts import render

# Create your views here.
from django.utils.safestring import mark_safe
import json 

def index(request):
	return render(request, 'signaling/index.html', {})
	