from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage
from django.http import JsonResponse
from .models import Profile

@login_required
def list_users(request):
    users = User.objects.all()
    return render(request, 'users.html', {'users': users})

@login_required
def update_user(request, user_id):
    user = User.objects.get(id=user_id)
    
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()

        if not username or not email:
            messages.error(request, 'All fields are required.')
            return render(request, 'users.html', {'user': user})

        user.username = username
        user.email = email
        user.save()

        messages.success(request, 'User updated successfully!')
        return redirect('user_list')

    return render(request, 'users.html', {'user': user})


@login_required
def delete_user(request, user_id):
    user = User.objects.get(id=user_id)

    if request.method == 'POST':
        user.delete()
        messages.success(request, 'User deleted successfully!')
        return redirect('user_list')

    return render(request, 'users.html', {'user': user})