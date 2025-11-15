from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from .models import Item

def item_list(request):
    items = Item.objects.filter(sold=False)
    return render(request, 'item_list.html', {'items': items})

def item_detail(request, pk):
    item = get_object_or_404(Item, pk=pk)
    return render(request, 'item_detail.html', {'item': item})

def item_create(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        price = request.POST.get('price')
        if title and description and price:
            item = Item(
                user=request.user,
                title=title,
                description=description,
                price=price
            )
            item.save()
            return redirect('item_detail', pk=item.pk)
        else:
            # Handle missing fields
            return render(request, 'item_form.html', {'error': 'All fields are required.'})
    return render(request, 'item_form.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('item_list')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')
