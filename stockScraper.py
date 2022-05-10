import requests
from bs4 import BeautifulSoup
import csv
from selenium import webdriver
from selenium.webdriver.support.ui import Select

website = 'https://www.adamchoi.co.uk/overs/detailed'
path = '/Users/danielleifer/Documents/Coding/chromedriver'
driver = webdriver.Chrome(path)
driver.get(website)


file = open('stockprices.csv', 'w')

writer = csv.writer(file)

writer.writerow(['Stock', 'Price', 'Change', 'Percent'])

URL_list = ["https://finance.yahoo.com/quote/%5EGSPC?p=%5EGSPC", "https://finance.yahoo.com/quote/%5EDJI?p=%5EDJI", "https://finance.yahoo.com/quote/%5EIXIC?p=%5EIXIC"]


for URL in URL_list:
    page = requests.get(URL)

    soup = BeautifulSoup(page.content, "html.parser")

    stock = soup.find('h1').text
    price = soup.find('fin-streamer' , class_= 'Fw(b) Fz(36px) Mb(-4px) D(ib)').text
    change = soup.find_all('fin-streamer' , class_= 'Fw(500) Pstart(8px) Fz(24px)')
    price_change = change[0].text
    percent_change = change[1].text

    writer.writerow([stock, price, price_change, percent_change])
    