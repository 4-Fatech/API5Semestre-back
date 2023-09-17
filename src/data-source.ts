import { DataSource } from "typeorm";
import 'dotenv/config';

  const AppDataSource = new DataSource({
    type: "mongodb", 
    url: `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.CLUSTER}.j50t7ao.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
    synchronize: true, 
    logging: true, 
    entities: ["src/entities/*.ts"], 
    subscribers: [],
    maxQueryExecutionTime: 2000,
    useUnifiedTopology: true
});



AppDataSource.initialize()
    .then(() => {
        console.log(`Data Source inicializado!`)
    })
    .catch((error) => {
        console.error("Erro na inicialização do Data Source:", error)
    });

export default AppDataSource;