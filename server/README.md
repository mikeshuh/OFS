### This document provides instructions on the usage of current available commands

In the following documentation, the url for the server is localhost:5000. Adapt the commands listed if your server is running on a different port

1. Client requests
- Register for an account: ```POST: localhost:5000/api/users/register```, the request body is required to have the following attributes
- - firstName
- - lastName
- - password
- - email
- Login to an account: ```POST: localhost:5000/api/users/login```, the request body is required to have the following attributes
- - email
- - password
- __For the following commands, login is required. This means a token has to be sent to the server for Authentication.__
- Logout for an account: ```POST: localhost:5000/api/users/logout```
- Get the profile of a specific user: ```GET: localhost:5000/api/users/profile/:userID```. 
- - userID should match the information for the token sent
- Update the profile of a specific user: ```PUT: localhost:5000/api/users/profile/:userID```
- - userID should match the information for the token sent
- Change the password of a specific user: ```PUT: localhost:5000/api/users/change-password/:userID```, the request body is required to have the following attributes
- - currentPassword
- - newPassword 
- - userID should match the information for the token sent
- Delete a user: ```DELETE: localhost:5000/api/users/delete/:userID```
- - userID should match the information for the token sent

2. Product requests
- Get all products: ```GET: localhost:5000/api/products```
- Get a specific product: ```GET: localhost:5000/api/products/:productId```
- Get product by category: ```GET: localhost:5000/api/products/category/:category```
- __For the following commands, login and admin privilege is required. This means a token has to be sent to the server for Authentication, and the user on the token must be an admin.__
- Create a new products: ```POST: localhost:5000/api/products/create-product```, the request body is required to have the following attribute
- - productId
- - name
- - price
- - pounds
- - quantity
- - imageBinary"
- Update a product: ```PUT: localhost:5000/api/products/update-product/:productId```, the request body is required to have the following attribute
- - productId
- - name
- - price
- - pounds
- - quantity
- - imageBinary
- Delete a product: ```DELETE: localhost:5000/api/products/delete-product/:productId```

3. Mapbox requests:
- Get the geocode for a location: ```GET: localhost:5000/api/delivery/geocode```, the request body is required to have the following attribute
- - streetId
- - city
- - zipCode
- Get the navigation information for origin to destination: ```GET: localhost:5000/api/delivery/route```, the request body is required to have the following attribute
- - origin: {streetId,city,zipCode}
- - destination: {streetId,city,zipCode}

