import express from "express"; //importamos el modulo "express"
import { ProductManager } from "./persistence/productManager.js"; //importamos el modulo que administra nuestros productos

//creamos una instancia de la clase "ProductManager" y la guardamos en una variable, para que a posterior podamos acceder a los
//productos y utilizarlos en las respuestas que va entregar nuestro servidor ante las distintas peticiones de los clientes.
const managerProductService = new ProductManager("./src/files/products.json")

//creamos nuestro servidor con "express"
const app = express();

// creamos nuestro puerto o punto de acceso del servidor.
const port = 8080;

//aplicamos el metodo "listen" para escuchar la peticiones de los clientes en ese puerto o punto de acceso.
app.listen(port, ()=> console.log("Servidor Funcionando"));

//aplicamos el metodo ".use" para poder hacer uso de rutas dinamicas atraves de "req.query".
app.use(express.urlencoded({extended:true}));

//creamos una ruta "products", y aplicamos "async" a nuetros callbacks para poder manejar las peticiones de todos los productos, 
//ya que los productos que se encuentran administrados por funciones y metodos asincronas en el "productManager".
app.get("/products", async (req, res) => {
        try {
                //obtenemos nuestros productos y los guardamos en la variable products
                const products = await managerProductService.getProducts();
                //creamos el query param , que es el "limit" que es limite de resultados que el cliente quiere obtener de la peticion
                //de productos,para filtrar el numero de productos .
                const limit = req.query.limit;
                //convertimos a "limit" de string a numero
                const limitNum = parseInt(limit);
                //hacemos una validacion: si el cliente coloca un numero limite, el cliente obtiene ese numero de productos como respuesta.
                //pero sino coloca limite, va a recibir todos los productos.
                if(limit){
                 //utilizamos el metodo "slice" para obtener una parte del arreglo segun el numero limite que elija el cliente.
                 const prodcutsLimit = products.slice(0,limitNum);
                 res.send(prodcutsLimit);

                }else{
                    //respondemos la peticion enviando el contenido guardado en prodcuts
                    res.send(products)
                }
                
                

        } catch(error){
            throw error(error.message)
        }
    
});
//creamos una ruta por parametro "pid" para que el cliente solicite ver el producto que el quiere, por medio de su "id"
app.get("/products/:pid", async (req, res) => {

    try{
        //obtenemos nuestros productos y los guardamos en la variable products
        const products = await managerProductService.getProducts();
        //convertimos a numero el valor del "req.param", para poder hacer la comparacion en el "find"
        const id = parseInt(req.params.pid);
            
        const product = products.find(prod => prod.id === id)
        //validamos a "prodcut" ya que si existe => un true y nos muestra el producto peticionado por el cliente, y sino,
        //(osea nos da "false") nos muestra que "El producto no existe".
        if(product){
            res.send(product);
        } else {
            res.send("El producto no existe");
        }

    } catch(error){
        throw error(error.message)
    }
    
});


