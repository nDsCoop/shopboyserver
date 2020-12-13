import express from 'express';
import Product from '../models/productModel';
import { isAuth, isAdmin } from '../util';
// import { getToken } from '../util';
//import { signin } from '../../frontend/src/actions/userActions';

const router = express.Router();

 router.get("/", async (req, res) => {
    const products = await Product.find({});
    res.send(products); 
 });

 router.get("/:id", async (req, res) => {
    const product = await Product.findOne({_id: req.params.id});
    if (product) {
        res.send(product); 
    } else {
        res.status(404).send({ message: 'Product not found.'});
    }
 });
 

 router.put("/:id",  isAuth, isAdmin, async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.brand = req.body.brand;
        product.category = req.body.category;
        product.countInStock = req.body.countInStock;
        product.descriptions = req.body.descriptions;
        const updateProduct = await product.save();
        if (updateProduct) {
          return res.status(201).send({ message: 'Already Product Update ', data : updateProduct });
        }
    }
        return res.status(501).send({ message: 'Error in Update Product.'});
});

 router.post("/", isAuth,  async (req, res) => {
     const product = new Product({
        name: req.body.name,
        image: req.body.image,
        brand: req.body. brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        descriptions: req.body.descriptions,
    });
    const newProduct = await product.save();
    if(newProduct) {
    return res.status(201).send({ message: 'New Product Created', data : newProduct });
    }
    return res.status(501).send({ message: 'Error in Created Product.'});
})
router.delete("/:id", isAuth, isAdmin, async( req, res) => {
    const deleteProduct = await Product.findById(req.params.id);
    if (deleteProduct) {
        await deleteProduct.remove();
        res.send({ message: "Product Deleted!"});
    } else {
        res.send ("Error in Deletion");
    }
});
export default router;

