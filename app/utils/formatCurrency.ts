export function formatCurrency(amount: number, currency = 'IDR') {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}
