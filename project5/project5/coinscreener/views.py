from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
import json
from django.shortcuts import render
from django.urls import reverse
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import requests

from .models import User, Portfolio, Comments


def index(request):
    return render(request, "coinscreener/index.html")

@csrf_exempt
@login_required
def portfolio(request):
    logged_user = request.user
    users_assets = list(Portfolio.objects.filter(username=logged_user).values("asset_id"))

    """ this algoritm finds double ids on transactions query above and create a list of ids where ids dont repeat
        exp. ['xrp','sol','btc','sol','sol','btc','xrp'] ==> ['xrp','sol','btc'] """
    #start
    users_assets_grouped = []
    for x in users_assets:
        if x['asset_id'] not in users_assets_grouped:
            users_assets_grouped.append(x['asset_id'])

    """ now find net sum of quantities, average buying prices and create a dict to match this quantity and symbol of it.
        exp. buy 10 lot and sell 5 lot of xrp => portfolio{'xrp', '5'}
        after that, send a request to coingecko API to see your portfolio's coins' current prices, 24h hour changes etc."""

    portfolio = {} #this dict contains all the data. (quantity, avg_price etc.)
    for i in users_assets_grouped:
        quantity_list = list(Portfolio.objects.filter(username=logged_user, asset_id=i).values("quantity", "asset_name", "price"))

        r = requests.get(f"https://api.coingecko.com/api/v3/coins/{i}?community_data=false&developer_data=false&sparkline=false")
        response_json = r.json()
        current_price = response_json["market_data"]["current_price"]["usd"]
        change_24h = response_json["market_data"]["price_change_percentage_24h"]

        lots_sum = 0
        avg_price_numerator = 0
        for j in range(len(quantity_list)):
            lots_sum = lots_sum + quantity_list[j]["quantity"]
            avg_price_numerator = avg_price_numerator + (quantity_list[j]["quantity"] * quantity_list[j]["price"])

        if lots_sum > 0:
            avg_price = round((avg_price_numerator / lots_sum), 3)
            profit_loss = round((float(current_price) - float(avg_price)) * float(lots_sum), 4)
            portfolio[quantity_list[0]["asset_name"]] = {
                "quantity": float(lots_sum), "avg_price": avg_price, "current_price": current_price, "change_24h": change_24h, "profit_loss": profit_loss,
                }
    #finish
    return JsonResponse({"portfolio": portfolio})
    # return render(request, "coinscreener/index.html", { "assets": portfolio })
    # return render(request, "coinscreener/portfolio.html", { "assets": portfolio })

@csrf_exempt
@login_required
def add_transaction(request):
    if request.method == "POST":
        asset_name = json.loads(request.body)["asset_name"]
        asset_id = json.loads(request.body)["asset_id"]
        asset_symbol = json.loads(request.body)["asset_symbol"]
        price = float(json.loads(request.body)["price"])
        transaction_type = json.loads(request.body)["transaction_type"]
        if transaction_type == "Sell":
            quantity = float(json.loads(request.body)["quantity"]) * -1
        else:
            quantity = float(json.loads(request.body)["quantity"])
        add_transaction = Portfolio(username=request.user, asset_name=asset_name ,asset_id=asset_id ,asset_symbol=asset_symbol, quantity=quantity, price=price,total_spent=price*quantity ,type=transaction_type)
        add_transaction.save()
        return render(request, "coinscreener/portfolio.html")

@csrf_exempt
@login_required
def comment_process(request):
    # queryall comments for specific asset
    if request.method == "POST" and json.loads(request.body)["function"] == "query_comments":
        asset_id = json.loads(request.body)["asset_id"]
        comments = Comments.objects.filter(asset_id = asset_id)
        return JsonResponse([data.serialize() for data in comments ], safe=False)
    # add comment for specific asset
    if request.method == "POST" and json.loads(request.body)["function"] == "add_comment":
        logged_user = str(request.user)
        asset_id = json.loads(request.body)["asset_id"]
        comment_value = json.loads(request.body)["comment_value"]
        comment_type = json.loads(request.body)["comment_type"]

        adding = Comments(username=logged_user, asset_id=asset_id, comment=comment_value, type=comment_type)
        adding.save()

        return JsonResponse({"status": "ok"})

def login_view(request):
    if request.method == "POST":
        # checks user's credential for log in process
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "coinscreener/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "coinscreener/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirmation = request.POST['confirmation']

        # Ensure password matches confirmation
        if password != confirmation:
            return render(request, "coinscreener/register.html", {
                "message": "Passwords must match." })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "coinscreener/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "coinscreener/register.html")
