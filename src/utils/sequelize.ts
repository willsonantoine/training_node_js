import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  host: "localhost",
  database: "training_1",
  username: "root",
  password: "root",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((err) => {
    console.log(`error: ${err}`);
  });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(`Database synced`);
  }) 
  .catch((err) => {
    console.log(`error: ${err}`);
  });

export default sequelize;
