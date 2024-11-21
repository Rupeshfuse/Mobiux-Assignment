function calculateTotalSales(sales) {
    return sales.reduce((total, sale) => {
        const saleTotal = isNaN(sale.totalPrice) ? 0 : sale.totalPrice;
        return total + saleTotal;
    }, 0);
}

function calculateMonthWiseSales(sales) {
    const monthWiseSales = {};
    sales.forEach(sale => {
        if (sale.date instanceof Date && !isNaN(sale.date.getTime())) {
            const monthYear = `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}`;
            monthWiseSales[monthYear] = (monthWiseSales[monthYear] || 0) + (isNaN(sale.totalPrice) ? 0 : sale.totalPrice);
        }
    });
    return monthWiseSales;
}

function findMostPopularItem(sales) {
    const itemQuantities = {};
    sales.forEach(sale => {
        if (sale.date instanceof Date && !isNaN(sale.date.getTime())) {
            const monthYear = `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}`;
            if (!itemQuantities[monthYear]) {
                itemQuantities[monthYear] = {};
            }
            itemQuantities[monthYear][sale.sku] = (itemQuantities[monthYear][sale.sku] || 0) + (isNaN(sale.quantity) ? 0 : sale.quantity);
        }
    });

    const mostPopularItems = {};
    for (const [month, items] of Object.entries(itemQuantities)) {
        const entries = Object.entries(items);
        if (entries.length > 0) {
            mostPopularItems[month] = entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
        }
    }
    return mostPopularItems;
}

function findMostRevenueGeneratingItem(sales) {
    const itemRevenues = {};
    sales.forEach(sale => {
        if (sale.date instanceof Date && !isNaN(sale.date.getTime())) {
            const monthYear = `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}`;
            if (!itemRevenues[monthYear]) {
                itemRevenues[monthYear] = {};
            }
            itemRevenues[monthYear][sale.sku] = (itemRevenues[monthYear][sale.sku] || 0) + (isNaN(sale.totalPrice) ? 0 : sale.totalPrice);
        }
    });

    const mostRevenueItems = {};
    for (const [month, items] of Object.entries(itemRevenues)) {
        const entries = Object.entries(items);
        if (entries.length > 0) {
            mostRevenueItems[month] = entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
        }
    }
    return mostRevenueItems;
}

function calculatePopularItemStats(sales, mostPopularItems) {
    const stats = {};
    for (const [month, item] of Object.entries(mostPopularItems)) {
        const itemSales = sales.filter(sale =>
            sale.date instanceof Date &&
            !isNaN(sale.date.getTime()) &&
            `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}` === month &&
            sale.sku === item
        );
        const quantities = itemSales.map(sale => isNaN(sale.quantity) ? 0 : sale.quantity);
        if (quantities.length > 0) {
            stats[month] = {
                item,
                min: Math.min(...quantities),
                max: Math.max(...quantities),
                avg: quantities.reduce((a, b) => a + b, 0) / quantities.length
            };
        }
    }
    return stats;
}

module.exports = {
    calculateTotalSales,
    calculateMonthWiseSales,
    findMostPopularItem,
    findMostRevenueGeneratingItem,
    calculatePopularItemStats
};

