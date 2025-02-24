import redis
import json

class Cache:
    
    def __init__(self, expire_time, host='localhost', port=6379, password=None):    
        self.r = redis.Redis(host, port, password=password,decode_responses=True)
        self.r.config_set('maxmemory', '200mb')
        self.r.config_set('maxmemory-policy', 'allkeys-lru')
        
        self.expire_time = expire_time
        
    
    def add(self, data):
        key = data['location']['name'].lower()
        data_dumped = json.dumps(data)
        value = data_dumped
        self.r.setex(name=key, time=self.expire_time, value=value)
        
    def get(self,key):
        data = self.r.get(key.lower())
        if data:
            return json.loads(data)
        else:
            return None