const { DataTypes } = require('sequelize');

/**
 * Record Model
 * 
 * Stores weather snapshots with location and date range information
 * Schema: id, name, location_input, lat, lon, display_name, start_date, end_date, saved_at, weather_snapshot(JSON)
 */
module.exports = (sequelize) => {
    const Record = sequelize.define('Record', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        location_input: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lat: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
            validate: {
                min: -90,
                max: 90
            }
        },
        lon: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
            validate: {
                min: -180,
                max: 180
            }
        },
        display_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        saved_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        weather_snapshot: {
            type: DataTypes.TEXT,
            allowNull: false,
            // Store as JSON string
            get() {
                const value = this.getDataValue('weather_snapshot');
                return value ? JSON.parse(value) : null;
            },
            set(value) {
                this.setDataValue('weather_snapshot', JSON.stringify(value));
            }
        }
    }, {
        tableName: 'records',
        timestamps: false // Using saved_at instead
    });

    return Record;
};


