import fs from "fs";

export class ProductsManagerFiles{
    constructor(path){
        this.pathFile = path;
    };

    fileExist(){
        return fs.existsSync(this.pathFile);
    }

    async getProducts(){
        try {
            if(this.fileExist()){
                const contenidoString = await fs.promises.readFile(this.pathFile,"utf-8");
                const products = JSON.parse(contenidoString);
                return products;
            } else {
                throw new Error("No se pudieron obtener los productos");
            }
        } catch (error) {
            throw error;
        }
    };

    async getProductById(productId){
        try {
            if(this.fileExist()){
                const contenidoString = await fs.promises.readFile(this.pathFile,"utf-8");
                const products = JSON.parse(contenidoString);
                const product = products.find(p=>p.id === productId);
                if(!product){
                    throw new Error("El producto no existe");
                }
                return product;
            } else {
                throw new Error("No se pudo obtener el producto");
            }
        } catch (error) {
            throw error;
        }
    };

    generateId = async () => {
        try {
          if (fs.existsSync(this.path)) {
            const productlist = await fs.promises.readFile(this.path, "utf-8");
            const productlistJs = JSON.parse(productlist);
            const counter = productlistJs.length;
            if (counter == 0) {
              return 1;
            } else {
              return productlistJs[counter - 1].id + 1;
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      };
    
      
      addProduct = async (obj) => {
        const {title, description, price, thumbnail,category,status=true, code, stock}=obj
        if (!title || !description || !price || !category || !code ||!status || !stock) {
          console.error("INGRESE TODOS LOS DATOS DEL PRODUCTO");
          return;
        } else {
          const listadoProductos=await this.getProducts({})
          const codigorepetido = listadoProductos.find(
            (elemento) => elemento.code === code
          );
          if (codigorepetido) {
            console.error("EL CODIGO DEL PRODUCTO QUE DESEA AGREGAR ES REPETIDO");
            return;
          } else {
            const id = await this.generateId();
            const productnew = {
              id,
              title,
              description,
              price,
              category,
              status,
              thumbnail,
              code,
              stock,
            };
            listadoProductos.push(productnew);
            await fs.promises.writeFile(this.path,
              JSON.stringify(listadoProductos, null, 2)
            );
          }
        }
      };
    
      
      updateProduct = async (id,obj) => {
        const {pid}=id
        const {title, description, price, category,thumbnail, status,code, stock}=obj
             if(title===undefined || description===undefined || price===undefined || category===undefined || status===undefined || code===undefined||stock===undefined){
          console.error("INGRESE TODOS LOS DATOS DEL PRODUCTO PARA SU ACTUALIZACION");
          return;
        } else {
          const listadoProductos = await this.getProducts({});
          const codigorepetido = listadoProductos.find( (i) => i.code === code);
          if (codigorepetido) {
            console.error(
              "EL CODIGO DEL PRODUCTO QUE DESEA ACTUALIZAR ES REPETIDO"
            );
            return;
          } else {
            const listadoProductos = await this.getProducts({});
            const newProductsList = listadoProductos.map((elemento) => {
              if (elemento.id === parseInt(pid)) {
                        const updatedProduct = {
                          ...elemento,
                          title,
                          description,
                          price,
                          category,
                          status,
                          thumbnail,
                          code,
                          stock
                        };
                return updatedProduct;
              } else {
                return elemento;
              }
            });
            await fs.promises.writeFile(this.path,JSON.stringify(newProductsList, null, 2));
         
          }
        }
      };
    
      
      deleteProduct = async (id) => {
        const{pid}=id
        const allproducts = await this.getProducts({});
        const productswithoutfound = allproducts.filter(
          (elemento) => elemento.id !==  parseInt(pid)
        );
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(productswithoutfound, null, 2)
        );
      };
    }