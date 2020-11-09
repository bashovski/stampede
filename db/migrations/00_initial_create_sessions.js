const { Sequelize } = require('sequelize');

const tableName = 'sessions';

async function up(queryInterface) {
    await queryInterface.createTable(tableName, {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        token: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            length: 128
        },
        expires_at: {
            type: Sequelize.DATE,
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
