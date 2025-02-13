import redis

class Cache:
    
    def __init__(self, expire_time, host='localhost', port=6379):
        self.r = redis.Redis(host, port, decode_responses=True)
        self.r.config_set('maxmemory', '200mb')
        self.r.config_set('maxmemory-policy', 'allkeys-lru')
        
        self.expire_time = expire_time
        
    
    def add(self, key, value):
        self.r.setex(name=key, time=self.expire_time, value=value)
        
    def get(self,key):
        return self.r.get(key)