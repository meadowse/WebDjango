# from django.test import TestCase
#
# # Create your tests here.

import requests


BASE_URL = 'https://rasilka.ru'
for i in range(20):
    response = requests.get(f"{BASE_URL}/77277571808")
    print(response)
