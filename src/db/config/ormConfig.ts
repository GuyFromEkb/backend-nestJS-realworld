import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

const ormConfig: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "mediumclone",
  password: "123",
  database: "mediumclone",
};

const postgresDataSource = new DataSource({
  ...ormConfig,
  synchronize: false,
  entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/**/*{.ts,.js}"],
});

postgresDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

// default export for runner in package.json
export default postgresDataSource;
