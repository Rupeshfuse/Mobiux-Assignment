const fs = require('fs');
const path = require('path');
const {
    calculateTotalSales,
    calculateMonthWiseSales,
    findMostPopularItem,
    findMostRevenueGeneratingItem,
    calculatePopularItemStats
} = require('./utils');

function processCSV(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const sales = lines.slice(1)
        .filter(line => line.trim() !== '')
        .map(line => {
            const values = line.split(',');
            const date = new Date(values[0]);
            if (isNaN(date.getTime())) {
                return null;
            }
            return {
                date,
                sku: values[1],
                unitPrice: parseFloat(values[2]),
                quantity: parseInt(values[3]),
                totalPrice: parseFloat(values[4])
            };
        })
        .filter(sale => sale !== null);

    const totalSales = calculateTotalSales(sales);
    const monthWiseSales = calculateMonthWiseSales(sales);
    const mostPopularItems = findMostPopularItem(sales);
    const mostRevenueItems = findMostRevenueGeneratingItem(sales);
    const popularItemStats = calculatePopularItemStats(sales, mostPopularItems);

    console.log('Total Sales: $' + totalSales.toFixed(2));
    console.log('\nMonth-wise Sales:');
    Object.entries(monthWiseSales).forEach(([month, sales]) => {
        console.log(`${month}: $${sales.toFixed(2)}`);
    });
    console.log('\nMost Popular Items:');
    Object.entries(mostPopularItems).forEach(([month, item]) => {
        const totalOrders = sales.filter(sale =>
            `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}` === month &&
            sale.sku === item
        ).reduce((sum, sale) => sum + sale.quantity, 0);
        console.log(`${month}: ${item} (${totalOrders} orders)`);
    });
    console.log('\nItems Generating Most Revenue:');
    Object.entries(mostRevenueItems).forEach(([month, item]) => {
        const totalRevenue = sales.filter(sale =>
            `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}` === month &&
            sale.sku === item
        ).reduce((sum, sale) => sum + sale.totalPrice, 0);
        console.log(`${month}: ${item} ($${totalRevenue.toFixed(2)})`);
    });
    console.log('\nPopular Item Stats:');
    Object.entries(popularItemStats).forEach(([month, stats]) => {
        console.log(`${month}:`);
        console.log(`  Item: ${stats.item}`);
        console.log(`  Min: ${stats.min}`);
        console.log(`  Max: ${stats.max}`);
        console.log(`  Avg: ${stats.avg.toFixed(2)}`);
    });
}

const filePath = path.join(__dirname, 'abc.csv');
processCSV(filePath);

