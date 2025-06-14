const express = require("express")

const cors = require('cors')


const app = express()

app.use(cors())
app.use(express.json())

const products = [
    {id:1, name: "keyboard", description:"this is Nubow red swich keyboard.", weigh: 1},
    {id:2, name: "mouse", description:"this is Nubow wireless mouse.", weigh: 0.2},
    {id:3, name: "monitor", description:"this is LG monitor", weigh: 4},
]

app.get("/product/:id", (req, res) =>{

    const product = products.find(product => product.id === parseInt(req.params.id))

    if(!product) return res.status(404).json({error:'Product not found.'})

        res.json(product)

})

app.post('/products', (req, res) => {
    const {name, description, weigh} = req.body;

    if (!name || !description || !weigh){
        res.status(400).json({error: "Missing required fields."})
    }

    const newProduct = {
        id: products.length + 1,
        name,
        description: description,
        weigh: weigh,
    };
    products.push(newProduct)

    res.status(201).json(newProduct);
})

app.put('/products/:id', (req, res) => {
    const product = products.find(product => product.id === parseInt(req.params.id));
    if (!product){
        return res.status(404).json({error:"Product not found."})
    }

    const updateProduct = {
        name: req.body.name,
        description: req.body.description,
        weigh: req.body.weigh,
    }

    product.name = updateProduct.name
    product.description = updateProduct.description
    product.weigh = updateProduct.weigh

    res.json(product)

})


app.get('/products', (req, res) => {
    res.json(products);
});



app.delete('/products/:id', (req, res) => {
    const productIdex = products.findIndex(product => product.id === parseInt(req.params.id));
    if(productIdex === -1){
        res.status(400).json({error: "Product not found."})
    }

    const deleteProduct = products.splice(productIdex, 1)

    res.json({message: "Delete product successfull.", product: deleteProduct[0]});
})


app.listen(3000, () => {
    console.log(`Server is running in http://localhost:${3000}`)
})