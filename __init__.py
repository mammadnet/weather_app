from flask import Flask,Response, render_template, send_from_directory
from dotenv import load_dotenv
import os

from Weather import Weather
from Cache import Cache

load_dotenv()
app = Flask(__name__)

weather = Weather(os.getenv('WEATHER_API_KEY'))
cache = Cache(expire_time=60*30)

@app.route('/')
def index():    
    return render_template('home.html')

@app.route('/api/<city>')
def city_weather(city):
    data = get_data(city)
    return data[0]

@app.route('/api/default-items')
def default_item():
    items = os.getenv('DEFAULT_ITEMS')
    return Response(items, mimetype='application/json')
    
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
    
    
@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'favicon.ico')


if __name__ == '__main__':
    app.run(debug=True)