import requests

url = "https://yahoofinance-stocks1.p.rapidapi.com/stock-prices"

querystring = {"EndDateInclusive":"2022-05-03","StartDateInclusive":"2022-05-03","Symbol":"MSFT","OrderBy":"Ascending"}

headers = {
	"X-RapidAPI-Host": "yahoofinance-stocks1.p.rapidapi.com",
	"X-RapidAPI-Key": "331b087aadmsh6bf3287f966ae6bp1b1f6ajsnf2ff7eccd5c3"
}

response = requests.request("GET", url, headers=headers, params=querystring)
data = response.json()["results"][0]


date = data["date"]
price_open = data["open"]
price_close = data["close"]
price_high = data["high"]
price_low = data["low"]
volume = data["volume"]

print(date)