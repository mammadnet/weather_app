import requests
from flask import Flask, render_template, g
from dotenv import load_dotenv
import os

from Weather import Weather

load_dotenv()
app = Flask(__name__)


default_item = ['landon', 'bukan', 'paris']

weather = Weather(os.getenv('WEATHER_API_KEY'))

@app.route('/')
def index():    
    cities_weather = weather.current(*default_item)
    return render_template('home.html', weathers=cities_weather)

@app.route('/api/<city>')
def city_weather(city):
    data = weather.current(city)
    print(data)
    return data[0]

@app.route('/search/<patern>')
def search(patern):
    pass
    


if __name__ == '__main__':
    app.run(debug=True)