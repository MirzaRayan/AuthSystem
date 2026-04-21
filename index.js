import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
})
import DB_Connection from "./src/db/index.js";
import app from "./app.js";



DB_Connection().then(() => {
    app.listen(process.env.PORT,() => {
        console.log('Server is running on PORT:',process.env.PORT);
    })  
}).catch((error) => {
    console.log('Errrr!!',error);
    throw error
})