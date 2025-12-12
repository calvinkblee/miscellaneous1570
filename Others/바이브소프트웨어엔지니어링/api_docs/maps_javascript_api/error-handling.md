This page describes how to handle errors when using the Maps JavaScript API, and the Place class.

The Google Maps JavaScript API uses the following classes for errors:

- [`MapsNetworkError`](https://developers.google.com/maps/documentation/javascript/reference/errors#MapsNetworkError)represents a network error from a web service (can include[RPCStatus](https://developers.google.com/maps/documentation/javascript/reference/errors#RPCStatus)errors).
- [`MapsRequestError`](https://developers.google.com/maps/documentation/javascript/reference/errors#MapsRequestError)represents a request error from a web service (i.e. the equivalent of a 4xx code in HTTP).
- [`MapsServerError`](https://developers.google.com/maps/documentation/javascript/reference/errors#MapsServerError)represents a server-side error from a web service (i.e. the equivalent of a 5xx code in HTTP).

The`MapsNetworkError`,`MapsRequestError`, and`MapsServerError`classes belong to the[maps core library](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#CoreLibrary). Learn more about[libraries](https://developers.google.com/maps/documentation/javascript/libraries).
| **Note:**Errors returned by the classes listed above comprise only one kind of possible error. It is possible to encounter errors that are not represented by these classes, for example, client-side validation errors, errors related to API keys or quota, and other unexpected errors.

Each of these classes contains the following properties:

- [`code`](https://developers.google.com/maps/documentation/javascript/reference/errors#MapsNetworkError.code)
- [`endpoint`](https://developers.google.com/maps/documentation/javascript/reference/errors#MapsNetworkError.endpoint)

The`code`property identifies the type of error; the`endpoint`property identifies the endpoint that returned the error (for example`PLACES_DETAILS`). Since`MapsNetworkError`is a subclass of`Error`, other properties including`name`and`message`are also available.

The following snippet shows the structure of a Maps error message:  

```javascript
  MapsRequestError: PLACES_GET_PLACE: INVALID_ARGUMENT: Error fetching fields: The provided Place ID: ChIJN5Nz71W3j4ARhx5bwpTQEGg**** is not valid.
  [error.name     ] [error.endpoint ] [error.code     ]
                    [error.message --->                ... ]
  
```

The raw error includes everything in the error string;`error.message`includes the entire error string excluding`error.name`.

The following snippet demonstrates error handling when using the Place class. This example uses a try/catch block to handle each of the three error types. Similar code can be used to handle errors for any Maps JavaScript API class.  

```javascript
async function getPlaceDetails() {
    const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
    const { MapsNetworkError, MapsRequestError, MapsServerError } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;

    // Use place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJN5Nz71W3j4ARhx5bwpTQEGg****', // Pass a bad Place ID to trigger an error.
    });

    // Error handling for fetchFields.
    try {
        // Call fetchFields, passing the desired data fields.
        await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
    } catch (error: any) {
        if (error && error instanceof google.maps.MapsRequestError) {
            // HTTP 4xx request error.
            console.error('fetchFields failed: MapsRequestError - check the request parameters', error);
        } else if (error && error instanceof google.maps.MapsServerError) {
            // HTTP 5xx server-side error.
            console.error('fetchFields failed: MapsServerError', error);
        } else if (error && error instanceof google.maps.MapsNetworkError) {
            // Network error.
            console.error('fetchFields failed: MapsNetworkError', error);
        }  else {
            console.error('fetchFields failed: An unknown error occurred', error);
        }
    }
    // ...
}
```