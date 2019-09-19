# Docker LightHouse Express

An API to run LightHouse test and block requests ( WIP )

## How to start

### Build the image 
 
```Make build```

### Make the report folder writable 

Make the sure the ```/report``` folder is writable. 

```chmod 777 -R /report``` 

When LightHouse saves a test the result has to be saved on your machine.
By default the folder used for saving tests is ```/report``` relative to where you clonned the project.

### Run the image

```Make run ```

The image should run on port ```3000```


## API


### Run a test

```JSON
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

```JSON
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


### Run a test and set a performance budget

```JSON
curl -X POST \
  http://localhost:3000/runOriginalTest \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://google.fr/",
    "budgets": [
        {
            "resourceCounts": [
                {
                    "resourceType": "total",
                    "budget": 8
                },
                {
                    "resourceType": "stylesheet",
                    "budget": 1
                },
                {
                    "resourceType": "image",
                    "budget": 1
                },
                {
                    "resourceType": "media",
                    "budget": 0
                },
                {
                    "resourceType": "font",
                    "budget": 2
                },
                {
                    "resourceType": "script",
                    "budget": 1
                },
                {
                    "resourceType": "document",
                    "budget": 0
                },
                {
                    "resourceType": "other",
                    "budget": 1
                },
                {
                    "resourceType": "third-party",
                    "budget": 0
                }
            ],
            "resourceSizes": [
                {
                    "resourceType": "total",
                    "budget": 100
                },
                {
                    "resourceType": "stylesheet",
                    "budget": 0
                },
                {
                    "resourceType": "image",
                    "budget": 30
                },
                {
                    "resourceType": "media",
                    "budget": 0
                },
                {
                    "resourceType": "font",
                    "budget": 75
                },
                {
                    "resourceType": "script",
                    "budget": 30
                },
                {
                    "resourceType": "document",
                    "budget": 1
                },
                {
                    "resourceType": "other",
                    "budget": 2
                },
                {
                    "resourceType": "third-party",
                    "budget": 0
                }
            ],
            "timings": [
                {
                    "metric": "first-contentful-paint",
                    "budget": 2000,
                    "tolerance": 100
                },
                {
                    "metric": "first-cpu-idle",
                    "budget": 2000,
                    "tolerance": 100
                },
                {
                    "metric": "interactive",
                    "budget": 2000,
                    "tolerance": 100
                }
            ]
        }
    ]
}'
```

Returns : 

```json
{
    "originalTestResult": {
        "ok": true,
        "report": "google.fr_2019-09-19__13-47-36.original.html",
        "reportJSON": "google.fr_2019-09-19__13-47-36.original.json"
    }
}
```


### Get the reports 

Get all reports : 

```
curl -X GET  'http://localhost:300/reports/'
```

Get a specific report HTML format: 

```
curl -X GET 'http://localhost:3000/report/?report=www.google.com_2018-11-25__16-13-47.blocked.report.html'
```

Returns an HTML file JSON format :

```
curl -X GET 'http://localhost:3000/report/?report=www.google.com_2018-11-25__16-13-47.blocked.report.json'
```

Returns a JSON


## Dev 

create a ```variables.env``` file in ```app```

set the ```REPORTS_PATH``` :

````
REPORTS_PATH=/Users/abrossault/Documents/code/playground/docker-LightHouse/docker-google-lighthouse-express/report/
````

### Run the tests

cd ```app/``` ```npm run test```

## Todo 

- [ ] Create more settings possibility with by using the [JSON config file](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md)
