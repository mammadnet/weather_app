import urllib.parse
import requests
import urllib


class Weather:
    
    path = {
        'current': 'current.json',
        'forecast': 'forecast.json',
        'search': 'search.json',
    }
    
    def __init__(self, key:str):
        self.key = key
        self.baseUrl = 'http://api.weatherapi.com/v1/'
        
    
    def _make_url(self, path:str, params:dict) -> str:
        params['key'] = self.key
        url = self.baseUrl + path + '?' + urllib.parse.urlencode(params)
        return url
        
    # Return current weather of cities
    def current(self, city):
        path = Weather.path['current']
        
        params = {'q':city}
        url = self._make_url(path, params)
        print("-->", city, url)
        
        res = requests.get(url)
        
        return res.json()
    
    def forcast(slef, city:str):
        # TODO
        pass
    
    def search(self, word:str) -> list:
        path = Weather.path['search']
        params = {'q': word}
        url = self._make_url(path, params)
        
        res = requests.get(url)
        return res.json()


        