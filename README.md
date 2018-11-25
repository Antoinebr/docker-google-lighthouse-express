# Docker LightHouse Express

An API to run LightHouse test and block requests ( WIP )

## How to start

### Build the image 
 
``` bash BUILD.sh ```

Make the /report folder is writable 

``` bash RUN.sh ```

This will work but generate error because the Database is missing, to install the db use the ```docker-compose```



create a ```docker-compose.yml```


```yml
db:
  image: mariadb
  ports:
    - 3304:3306
  volumes:
    - "./data/:/var/lib/mysql"
  environment: 
    MYSQL_ROOT_PASSWORD: yourPassword

lightHouse:
  image: antoine/docker-lighthouse-express
  links:
    - db:mysql
  ports:
    - 3000:3498
  cap_add:
    - SYS_ADMIN
  volumes:
    - /Users/yourUserName/Documents/report:/home/chrome/reports

```

Run  ```docker-compose up```

## API

All the original tests are cached for 60min ( we keep track of this with the database )

### Run a test

```bash
curl -X POST \
  http://localhost:3000/runOriginalTest \
  -H 'Content-Type: application/json' \
  -d '{
	"url": "https://google.com/"
}'
```

Returns :

```JSON
{
    "originalTestResult": {
        "ok": true,
        "report": "monbraceletnato.fr_2018-11-25__17-45-52.original.report.html",
        "reportJSON": "monbraceletnato.fr_2018-11-25__17-45-52.original.report.json"
    }
}
```

### Run a test and block requests

```bash
curl -X POST \
  http://localhost:3000/runtest \
  -H 'Content-Type: application/json' \
  -d '{
	"url": "https://google.com/",
	  "blockedRequests": [
        "netmng.com",
        "googleadservices.com",
        "google-analytics.com",
        "googletagmanager.com",
        "facebook.net",
        "youtube.com"
    ]
}
'
```

Returns : 

```JSON 
{
    "originalTestResult": {
        "report": "www.google.com_2018-11-25__16-09-30.original.report.html",
        "reportJSON": "www.google.com_2018-11-25__16-09-30.original.report.json",
        "ok": true
    },
    "blockedTestResult": {
        "ok": true,
        "report": "www.google.com_2018-11-25__16-13-47.blocked.report.html",
        "reportJSON": "www.google.com_2018-11-25__16-13-47.blocked.report.json"
    }
}
```


### Get the reports 

```
curl -X GET 'http://localhost:3000/report/?report=www.google.com_2018-11-25__16-13-47.blocked.report.html'
```

Returns an HTML file