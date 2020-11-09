require('dotenv').config();

const { Sequelize } = require('sequelize');
const Umzug = require('umzug');

const getConnectionUri = () => {
    const { DB_HOST, DB_PASSWORD, DB_USERNAME, DB_NAME } = process.env;
    return `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`.replace(/['"]+/g, '');
};

const sequelize = new Sequelize(getConnectionUri());

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize
    },
    migrations: {
        params: [
            sequelize.getQueryInterface(),
            Sequelize
        ],
        path: './db/migrations',
        pattern: /\.js$/
    },
    logger: console
});

(async () => {
    await umzug.up();
})();
