const express = require('express');
const router = express.Router();
const { Record } = require('../models');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');

/**
 * GET /api/export/json
 * 
 * Exports all records as JSON
 */
router.get('/json', async (req, res) => {
    try {
        const records = await Record.findAll({
            order: [['saved_at', 'DESC']]
        });

        const data = records.map(record => ({
            id: record.id,
            name: record.name,
            location_input: record.location_input,
            lat: parseFloat(record.lat),
            lon: parseFloat(record.lon),
            display_name: record.display_name,
            start_date: record.start_date,
            end_date: record.end_date,
            saved_at: record.saved_at,
            weather_snapshot: record.weather_snapshot
        }));

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="weather-records-${new Date().toISOString().split('T')[0]}.json"`);
        res.json(data);

    } catch (error) {
        console.error('Error exporting JSON:', error);
        res.status(500).json({
            error: 'Failed to export records',
            message: error.message
        });
    }
});

/**
 * GET /api/export/csv
 * 
 * Exports all records as CSV
 */
router.get('/csv', async (req, res) => {
    try {
        const records = await Record.findAll({
            order: [['saved_at', 'DESC']]
        });

        const headers = ['ID', 'Name', 'Location Input', 'Display Name', 'Latitude', 'Longitude', 'Start Date', 'End Date', 'Temperature (°C)', 'Description', 'Saved At'];
        const rows = records.map(record => {
            const snapshot = record.weather_snapshot;
            const temp = snapshot?.current?.temp_c || 'N/A';
            const desc = snapshot?.current?.description || 'N/A';
            
            return [
                record.id,
                `"${record.name.replace(/"/g, '""')}"`,
                `"${record.location_input.replace(/"/g, '""')}"`,
                `"${record.display_name.replace(/"/g, '""')}"`,
                parseFloat(record.lat),
                parseFloat(record.lon),
                record.start_date,
                record.end_date || '',
                temp,
                `"${desc.replace(/"/g, '""')}"`,
                record.saved_at.toISOString()
            ].join(',');
        });

        const csvContent = [
            headers.join(','),
            ...rows
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="weather-records-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csvContent);

    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({
            error: 'Failed to export records',
            message: error.message
        });
    }
});

/**
 * GET /api/export/pdf
 * 
 * Exports all records as PDF
 */
router.get('/pdf', async (req, res) => {
    try {
        const records = await Record.findAll({
            order: [['saved_at', 'DESC']]
        });

        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="weather-records-${new Date().toISOString().split('T')[0]}.pdf"`);
        
        doc.pipe(res);

        // Header
        doc.fontSize(20).text('Weather Records Export', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Records
        records.forEach((record, index) => {
            if (index > 0) {
                doc.moveDown();
                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
                doc.moveDown();
            }

            const snapshot = record.weather_snapshot;
            
            doc.fontSize(16).text(`${index + 1}. ${record.name}`, { underline: true });
            doc.moveDown(0.5);
            
            doc.fontSize(12);
            doc.text(`Location: ${record.display_name}`);
            doc.text(`Date Range: ${record.start_date}${record.end_date ? ` - ${record.end_date}` : ''}`);
            doc.text(`Coordinates: ${parseFloat(record.lat).toFixed(4)}, ${parseFloat(record.lon).toFixed(4)}`);
            
            if (snapshot && snapshot.current) {
                doc.text(`Temperature: ${snapshot.current.temp_c}°C`);
                doc.text(`Condition: ${snapshot.current.description}`);
                doc.text(`Humidity: ${snapshot.current.humidity}%`);
                doc.text(`Wind Speed: ${snapshot.current.wind_m_s} m/s`);
            }
            
            doc.text(`Saved: ${record.saved_at.toLocaleString()}`);
            
            // Check if we need a new page
            if (doc.y > 750) {
                doc.addPage();
            }
        });

        doc.end();

    } catch (error) {
        console.error('Error exporting PDF:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to export records',
                message: error.message
            });
        }
    }
});

/**
 * GET /api/records/:id/export?format=json|csv|pdf
 * 
 * Exports a single record
 * Note: This route must be registered before /api/export/* routes
 */
router.get('/records/:id/export', async (req, res) => {
    try {
        const { id } = req.params;
        const { format } = req.query;
        
        const record = await Record.findByPk(id);
        
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        const snapshot = record.weather_snapshot;

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="record-${id}.json"`);
            res.json({
                id: record.id,
                name: record.name,
                location_input: record.location_input,
                lat: parseFloat(record.lat),
                lon: parseFloat(record.lon),
                display_name: record.display_name,
                start_date: record.start_date,
                end_date: record.end_date,
                saved_at: record.saved_at,
                weather_snapshot: record.weather_snapshot
            });
        } else if (format === 'csv') {
            const headers = ['ID', 'Name', 'Location Input', 'Display Name', 'Latitude', 'Longitude', 'Start Date', 'End Date', 'Temperature (°C)', 'Description', 'Saved At'];
            const temp = snapshot?.current?.temp_c || 'N/A';
            const desc = snapshot?.current?.description || 'N/A';
            const row = [
                record.id,
                `"${record.name.replace(/"/g, '""')}"`,
                `"${record.location_input.replace(/"/g, '""')}"`,
                `"${record.display_name.replace(/"/g, '""')}"`,
                parseFloat(record.lat),
                parseFloat(record.lon),
                record.start_date,
                record.end_date || '',
                temp,
                `"${desc.replace(/"/g, '""')}"`,
                record.saved_at.toISOString()
            ].join(',');

            const csvContent = [headers.join(','), row].join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="record-${id}.csv"`);
            res.send(csvContent);
        } else if (format === 'pdf') {
            const doc = new PDFDocument({ margin: 50 });
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="record-${id}.pdf"`);
            
            doc.pipe(res);

            doc.fontSize(20).text(record.name, { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Saved: ${record.saved_at.toLocaleString()}`, { align: 'center' });
            doc.moveDown(2);

            doc.fontSize(14).text('Location Information', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12);
            doc.text(`Display Name: ${record.display_name}`);
            doc.text(`Location Input: ${record.location_input}`);
            doc.text(`Coordinates: ${parseFloat(record.lat).toFixed(4)}, ${parseFloat(record.lon).toFixed(4)}`);
            doc.text(`Date Range: ${record.start_date}${record.end_date ? ` - ${record.end_date}` : ''}`);
            doc.moveDown();

            if (snapshot && snapshot.current) {
                doc.fontSize(14).text('Weather Information', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(12);
                doc.text(`Temperature: ${snapshot.current.temp_c}°C`);
                doc.text(`Feels Like: ${snapshot.current.feels_like_c}°C`);
                doc.text(`Condition: ${snapshot.current.description}`);
                doc.text(`Humidity: ${snapshot.current.humidity}%`);
                doc.text(`Wind Speed: ${snapshot.current.wind_m_s} m/s`);
                doc.text(`Sunrise: ${snapshot.current.sunrise}`);
                doc.text(`Sunset: ${snapshot.current.sunset}`);
            }

            doc.end();
        } else {
            return res.status(400).json({ error: 'Invalid format. Use json, csv, or pdf' });
        }

    } catch (error) {
        console.error('Error exporting record:', error);
        res.status(500).json({
            error: 'Failed to export record',
            message: error.message
        });
    }
});

module.exports = router;
