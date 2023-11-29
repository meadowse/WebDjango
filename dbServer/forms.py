#для работы с таблицей
from .models import InfoAbLE
from django.forms import ModelForm, TextInput, Textarea


class InfoAbLEForm(ModelForm):
    class Meta:
        model = InfoAbLE
        fields = ["ITN", "name", "legalAddres", "positionOfHead","NameOfHead","ITNofHead", "PfoneNumbers","Post", "Site"]
        widgets={
                 "ITN": TextInput(attrs={
            'class': 'form-control', 'placeholder':' введите инн'
            }),
                "name": TextInput(attrs={
                    'class': 'form-control', 'placeholder': 'введите имя'
                }),
            "legalAddres": TextInput(attrs={
                    'class': 'form-control', 'placeholder': 'введите адрес'
                }),
            "positionOfHead": TextInput(attrs={
                    'class': 'form-control', 'placeholder': 'введите должность управляющего'
                }),
            "NameOfHead": TextInput(attrs={
                    'class': 'form-control', 'placeholder': 'введите имя управляющего'
                }),
            "ITNofHead": TextInput(attrs={
                    'class': 'form-control', 'placeholder': 'введите инн управляющего'
                }),
            "PfoneNumbers": TextInput(attrs={
                    'class': 'form-control', 'placeholder': 'введите номер управляющего'
                })
        }
