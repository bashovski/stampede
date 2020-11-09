const { Sequelize } = require('sequelize');

const tableName = 'users';

async function up(queryInterface) {
    await queryInterface.createTable(tableName, {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            length: 128
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            length: 64
        },
        password: {
            type: Sequelize.STRING,
            length: 256,
            allowNull: false
        },
        avatar: {
            type: Sequelize.STRING,
            length: 128,
            allowNull: true
        },
        date_of_birth: {
            type: Sequelize.DATE,
            allowNull: false
        },
        is_verified: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    });
}

async function down(queryInterface) {
    await queryInterface.dropTable(tableName);
}

module.exports = { up, down };
