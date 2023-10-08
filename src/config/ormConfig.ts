import path from "path";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

export const ormConfig: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "mediumclone",
  password: "123",
  database: "mediumclone",
  entities: [path.resolve(__dirname, "..", "**", "*.entity.{js,ts}")],
  synchronize: true,
};
