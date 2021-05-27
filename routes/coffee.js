const routes = require("express").Router();
const Coffee = require("../models/Coffee");
var ObjectId = require("mongoose").Types.ObjectId;


/**
 * @swagger
 * coffee/all/:
 *   get:
 *     summary: Get all coffees or pods using the sent filters
 *     description: Retrieve a list of coffee and pods by sending the product_type as query params. and also you can filter using pack_size,coffee_flavor,water_line_compatible.
 *     parameters:
 *      - in: path
 *        name: product_type
 *        type: string
 *        required: true
 *        description: the product type like ESPRESSO_POD
 *      - in: path
 *        name: pack_size
 *        type: integer
 *        required: false
 *        description: the pods pack size like 84
 *      - in: path
 *        name: coffee_flavor
 *        type: string
 *        required: false
 *        description: the the pods flavor like COFFEE_FLAVOR_VANILLA
 *      - in: path
 *        name: water_line_compatible
 *        type: boolean
 *        required: false
 *        description: the the water line compatiblity like true or false
 *     responses:
 *       200:
 *         description: A list of coffee or pods.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: string
 *                    description: the api return message
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: returned list of coffee or pods
 *  
 *                    
*/
routes.get("/all/", (req, res) => {

  // filters in coffee machine screen => {product_type , water_line_compatible}
  // filters in  pods screen => {product_type,coffee_flavor,pack_size}
  let product_type = req.query.product_type,
  pack_size = req.query.pack_size,
  coffee_flavor = req.query.coffee_flavor,
  water_line_compatible = req.query.water_line_compatible,
  filter={
      product_type: product_type ? {$regex: product_type} : null ,
      pack_size,
      coffee_flavor,
      water_line_compatible
    };
  
  // remove the undefined from the object
  Object.keys(filter).forEach(key => filter[key] === undefined ? delete filter[key] : {});

if(Object.keys(filter).length === 0 ) // no query prams is sent
  return res.status(400).json({ message: "query pramaters are missing" }); // return a bad request resopone
else if(!('product_type' in filter)) // product type is requeired
  return res.status(400).json({ message: "Product type is required" }); // return a bad request resopone

// generate a find query to the database
  Coffee.find(filter)
    .lean()
    .exec((err, coffees) => {
      if (err) {
        res.status(500).json({ message: "Data call  Error" });
      } else {

        // Note: returned coffees will be in form of array
        if (coffees && coffees.length > 0) {
          res.contentType("json");
          const finalArr = coffees.map(x=> x.sku_code)
          res.status(200).json({
            message: "Successfully retrieved all the coffees",
            data: finalArr
          });
        } else {
          res.status(404).json({
            message: "No coffees found",
            data: []
          });
        }
      }
    });
});

/**
 *  Add a new coffee
 */
routes.post("/add", (req, res) => {
  // check for errors
  req.assert("sku_code", "SKU must be not empty").notEmpty();
  req.assert("product_type", "product_type must be not empty").notEmpty();
  req.assert("water_line_compatible", "must be boolean").isBoolean();
  req.assert("pack_size", "must be number").isNumeric();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return res.status(401).json({ message: errors });
  }

  let coffeeReq = req.body;
  console.log(coffeeReq);
  const coffee = new Coffee(coffeeReq);

  // save image uri if sent

  coffee.save(err => {
    if (err) {
      console.log(err);
      if (err.code == "11000") {
        res.status(422).json({ message: "Coffee id already exists!! " });
      } else {
        res.status(404).json({ message: "Error saving coffee" });
      }
    } else {
      res.status(200).json({
        message: "Coffee Saved Successfully",
        data: { id: coffee._id.toString() }
      });
    }
  });
});


module.exports = routes;
