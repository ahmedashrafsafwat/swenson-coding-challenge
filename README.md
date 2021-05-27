# SWENSON backend Task

## Before running the project

please import the data from the `mongodb_exports/dumb/swenson` folder by running the following command

`mongorestore -d swenson --verbose mongodb_exports\dumb\swenson\`

### To run this project you have two ways after cloning this repo

a. using Docker by running this commands:

   `docker-compose build`

   then

   `docker-compose up`

   then start using the APIs, example:

   `http://localhost:3000/coffee/get/?product_type=COFFEE_MACHINE_LARGE`

b. Or Run the following commands:

run `npm install`

run `npm run start` or `nodemon start` (if you have nodemon installed)

### To run the unit test cases run command:

`npm run test`

### To have a look at the API documentation:

1. please run the application first by running `npm run start`
2. then head over to `http://localhost:3000/api-docs/`

### Some query URL examples to test:

`http://localhost:3000/coffee/get/?product_type=COFFEE_MACHINE_LARGE`

`http://localhost:3000/coffee/get/?product_type=COFFEE_POD_LARGE&coffee_flavor=COFFEE_FLAVOR_VANILLA`

`http://localhost:3000/coffee/all/?product_type=POD&pack_size=84`
