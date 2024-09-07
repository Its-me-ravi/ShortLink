## **Overview**

The URL Shortening Service API allows users to shorten URLs, track visit analytics, and fetch detailed statistics on shortened URLs. The API supports custom short codes, expiration times for shortened URLs, and analytics like total visits, unique visitors, and device types.

---

## **Base URL**

```plaintext
http://localhost:4000/api/v1
```

---

## **Authentication**

Currently, this API does not require authentication. Future versions may support API keys for added security.

---

## **Endpoints**

1. **POST /link**
    
    * **Description**: Shorten a URL with an optional custom short code and expiration time.
        
    * **Request Body**:
        
        * `originalUrl` (string) \[required\]: The URL to shorten.
            
        * `customCode` (string) \[optional\]: Custom short code. If not provided, a random code will be generated.
            
        * `expiresIn` (number) \[optional\]: Time in seconds after which the short link will expire.
            
    * **Response**:
        
        * `originalUrl` (string): The original URL.
            
        * `shortCode` (string): The generated or custom short code.
            
        * `expiresAt` (Date): The expiration date/time, if provided.
            
    * **Example**:
        
        * **Request**:
            
            ```json
            {
              "originalUrl": "https://example.com",
              "customCode": "myCustomCode",
              "expiresIn": 3600
            }

            ```
            
        * **Response**:
            
            ```json
            {
              "originalUrl": "https://example.com",
              "shortCode": "myCustomCode",
              "expiresAt": "2024-09-07T18:00:00.000Z"
            }
            ```
            
2. **GET /link/:customCode**
    
    * **Description**: Redirects to the original URL based on the provided short code and tracks analytics like visit count, referrer, and device type.
        
    * **Request Parameters**:
        
        * `shortCode` (string) \[required\]: The unique short code for the URL.
            
    * **Response**: Redirects to the original URL (302 status).
        
    * **Example**:
        
        * **Request**:
            
            ```plaintext
            GET /link/myCustomCode
            ```
            
        * **Response**: Redirects to [`https://example.com`](https://example.com)
            
3. **GET /link/**
    
    **/analytics**
    
    * **Description**: Fetches analytics data for the given short code, including total visits, unique visitors, and device-specific breakdowns.
        
    * **Request Parameters**:
        
        * `shortCode` (string) \[required\]: The unique short code for the URL.
            
    * **Response**:
        
        * `originalUrl` (string): The original URL.
            
        * `totalVisits` (number): Total number of visits.
            
        * `uniqueVisitors` (number): Unique visitor count (tracked via IP).
            
        * `visitsByDevice` (object): Breakdown of visits by device type (desktop, mobile, tablet).
            
        * `referrers` (object): A list of referrers and the number of visits from each.
            
        * `visitLogs` (array): Detailed logs of visits, including timestamp, device type, and referrer.
            
    * **Example**:
        
        * **Request**:
            
            ```plaintext
            GET /link/myCustomCode/analytics
            ```
            
        * **Response**:
            
            ```plaintext
           {
              "originalUrl": "https://example.com",
              "totalVisits": 150,
              "uniqueVisitors": 120,
              "visitsByDevice": {
                "desktop": 100,
                "mobile": 40,
                "tablet": 10
              },
              "referrers": {
                "Direct": 80,
                "https://google.com": 50,
                "https://facebook.com": 20
              },
              "visitLogs": [
                {
                  "timestamp": "2024-09-07T12:00:00.000Z",
                  "ipAddress": "192.168.1.1",
                  "deviceType": "desktop",
                  "referrer": "Direct"
                },
                {
                  "timestamp": "2024-09-07T12:05:00.000Z",
                  "ipAddress": "192.168.1.2",
                  "deviceType": "mobile",
                  "referrer": "https://google.com"
                }
              ]
            }
            ```
            

---

## **Requirements**

### **1\. Prerequisites**

* **Node.js**: The API is built using Node.js, so ensure Node.js is installed on your machine.
    
* **MongoDB**: A MongoDB instance must be running for the service to store URL and visit data.
    
* **Dependencies**: The following Node.js modules are required:
    
    * `express`: Web framework for handling requests.
        
    * `mongoose`: MongoDB ODM for database operations.
        
    * `nanoid`: Generates unique short codes.
        
    * `useragent`: Parses user-agent strings to determine device types.
        

### **2\. Project Setup**

* Clone the repository.
    
* Install dependencies:
    
    ```plaintext
    npm install
    ```
    
* Set up your MongoDB connection string in the environment variables.
    

---

## **Rate Limiting**

To prevent abuse, the API uses rate limiting. Each IP address is limited to a certain number of requests per minute (e.g., 100 requests per minute). If you exceed the limit, the API will return a `429 Too Many Requests` status code.

---

## **Error Codes**

| Status Code | Description |
| --- | --- |
| 400 | Bad Request: Invalid input or missing required parameters. |
| 404 | Not Found: The short code does not exist. |
| 500 | Internal Server Error: Something went wrong on the server. |
| 429 | Too Many Requests: Rate limit exceeded. |

---


## **Changelog**

### Version 1.0.0

* Initial release of URL shortening service.
    
* Features: URL shortening, custom short codes, expiration, visit analytics.
    

---

This documentation gives a clear understanding of how to interact with the API and what to expect from each endpoint.