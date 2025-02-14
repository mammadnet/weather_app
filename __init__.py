from flask import Flask, render_template
from dotenv import load_dotenv
import os

from Weather import Weather
from Cache import Cache

load_dotenv()
app = Flask(__name__)


default_item = ['landon', 'bukan', 'paris']

weather = Weather(os.getenv('WEATHER_API_KEY'))
cache = Cache(expire_time=60*30)

@app.route('/')
def index():    
    cities_weather = get_data(*default_item)
    return render_template('home.html', weathers=cities_weather)

@app.route('/api/<city>')
def city_weather(city):
    data = get_data(city)
    print(data)
    return data[0]

@app.route('/search/<patern>')
def search(patern):
    pass


def get_data(*cities):
    res = []
    for city in cities:
        cached = cache.get(city)
        if cached:
            res.append(cached)
        else:
            fetched = weather.current(city)
            cache.add(fetched)
            res.append(fetched)
    return res
    
    


if __name__ == '__main__':
    app.run(debug=True)