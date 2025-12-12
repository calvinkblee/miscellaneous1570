## Introduction

This tutorial shows you how to add a Google map with a marker to a web page using custom HTML elements. Here is the map you'll create using this tutorial. A marker is positioned at Ottumwa, Iowa.

## Get started

These are the steps we'll cover for creating a Google map with a marker using HTML:

1. [Get an API key](https://developers.google.com/maps/documentation/javascript/add-google-map-wc-tut#key)
2. [Create HTML, CSS, and JS](https://developers.google.com/maps/documentation/javascript/add-google-map-wc-tut#step-2)
3. [Add a map](https://developers.google.com/maps/documentation/javascript/add-google-map-wc-tut#step-3)
4. [Add a marker](https://developers.google.com/maps/documentation/javascript/add-google-map-wc-tut#step-4)

You need a web browser. Choose a well-known one like Google Chrome (recommended), Firefox, Safari or Edge, based on your platform from the[list of supported browsers](https://developers.google.com/maps/documentation/javascript/browsersupport).

## Step 1: Get an API key

This section explains how to authenticate your app to the Maps JavaScript API using your own API key.

Follow these steps to get an API key:

1. Go to the[Google Cloud console](https://console.cloud.google.com/project/_/google/maps-apis/overview).

2. Create or select a project.

3. Click**Continue**to enable the API and any related services.

4. On the**Credentials** page, get an**API key**(and set the API key restrictions). Note: If you have an existing unrestricted API key, or a key with browser restrictions, you may use that key.

5. To prevent quota theft and secure your API key, see[Using API Keys](https://cloud.google.com/docs/authentication/api-keys).

6. Enable billing. See[Usage and Billing](https://developers.google.com/maps/documentation/javascript/usage-and-billing)for more information.

7. You are now ready to use your API key.

## Step 2: Create HTML, CSS, and JS

Here's the code for a basic HTML web page:  

```javascript
<html>
  <head>
    <title>Add a Map with Markers using HTML</title>

    <!-- TODO: Add bootstrap script tag. -->
  </head>
  <body>
    <!-- TODO: Add a map with markers. -->
  </body>
</html>
```

In order to load a map, you must add a`script`tag containing the bootstrap loader for the Maps JavaScript API, as shown in the following snippet (add your own API key):  

```html
<script
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=maps,marker"
    defer
></script>
```

Since the HTML page should be freestanding, add the CSS code directly to the page:  

```html
<html>
  <head>
    <title>Add a Map with Markers using HTML</title>
    <style>
      gmp-map {
        height: 100%;
      }
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
    <script
      src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=maps,marker"
      defer
    ></script>
  </head>
  <body>
    <!-- TODO: Add a map with markers. -->
  </body>
</html>
```

## Step 3: Add a map

To add a Google map to the page, copy the`gmp-map`HTML element and paste it within the`body`of the HTML page:  

```javascript
<gmp-map center="41.027748173921374, -92.41852445367961" zoom="13" map-id="DEMO_MAP_ID" style="height: 400px"></gmp-map>
```

This creates a map centered on Ottumwa, Iowa, but there is no marker yet.

## Step 4: Add a marker

To add a marker to the map, use the`gmp-advanced-marker`HTML element. Copy the following snippet, and paste over the entire`gmp-map`you added in the previous step.

<br />

```html
<gmp-map
  center="41.027748173921374, -92.41852445367961"
  zoom="13"
  map-id="DEMO_MAP_ID"
>
  <gmp-advanced-marker
    position="41.027748173921374, -92.41852445367961"
    title="Ottumwa, IA"
  ></gmp-advanced-marker>
</gmp-map>https://github.com/googlemaps-samples/js-api-samples/blob/2cc7a5b61fd80785adc0f72533cf3760fc64705e/dist/samples/web-components-markers/docs/index.html#L30-L39
```

<br />

The preceding code adds a marker to the map. A map ID is required to use Advanced Markers (`DEMO_MAP_ID`is fine to use).

[Try the finished example on JSFiddle](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/web-components-markers/jsfiddle).

## Tips and troubleshooting

- You can customize the map with custom[styling](https://developers.google.com/maps/documentation/javascript/cloud-customization).
- Use the**Developer Tools Console**in your web browser to test and run your code, read error reports and solve problems with your code.
- Use the following keyboard shortcuts to open the console in Chrome:  
  Command+Option+J (on Mac), or Control+Shift+J (on Windows).
- Follow the steps below to get the latitude and longitude coordinates for a location on Google Maps.

  1. Open Google Maps in a browser.
  2. Right-click the exact location on the map for which you require coordinates.
  3. Select**What's here**from the context menu that appears. The map displays a card at the bottom of the screen. Find the latitude and longitude coordinates in the last row of the card.
- You can convert an address into latitude and longitude coordinates using the Geocoding service. The developer guides provide detailed information on[getting started with the Geocoding service](https://developers.google.com/maps/documentation/javascript/geocoding#GetStarted).

## Full example code

Following is the final map, and full example code that was used for this tutorial.

<br />

```html
<html>
  <head>
    <title>Add a Map with Markers using HTML</title>
    <style>
      gmp-map {
        height: 100%;
      }
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
    <script type="module" src="./index.js"></script>
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8&libraries=maps,marker&v=weekly"
      defer
    ></script>
  </head>
  <body>
    <gmp-map
      center="41.027748173921374, -92.41852445367961"
      zoom="13"
      map-id="DEMO_MAP_ID"
    >
      <gmp-advanced-marker
        position="41.027748173921374, -92.41852445367961"
        title="Ottumwa, IA"
      ></gmp-advanced-marker>
    </gmp-map>
  </body>
</html>https://github.com/googlemaps-samples/js-api-samples/blob/2cc7a5b61fd80785adc0f72533cf3760fc64705e/dist/samples/web-components-markers/docs/index.html#L8-L42
```

<br />