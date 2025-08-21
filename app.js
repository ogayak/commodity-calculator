// Shared logic for calculator and history

window.saveToHistory = function(historyEntry) {
    let history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    history.unshift(historyEntry);
    localStorage.setItem('calculationHistory', JSON.stringify(history));
}

window.getHistory = function() {
    return JSON.parse(localStorage.getItem('calculationHistory') || '[]');
}

window.deleteHistory = function(id) {
    let history = window.getHistory();
    history = history.filter(entry => entry.id !== id);
    localStorage.setItem('calculationHistory', JSON.stringify(history));
}

window.formatNumber = function(n) {
    return n.toLocaleString('en-NG');
}

// Download/Print receipt from history (by id)
window.downloadReceipt = function(id) {
    const history = window.getHistory();
    const entry = history.find(e => e.id === id);
    if (!entry) return;
    window.printCustomReceipt(
        entry.commodities,
        entry.timestamp,
        entry.deliveryDate,
        entry.deliveryLocation,
        entry.paidInFull
    );
}

// Download/Print receipt for calculator (current list)
window.printCustomReceipt = function(commodities, dateString, deliveryDate, deliveryLocation, paidInFull) {
    if (!commodities || commodities.length === 0) return;
    let now = dateString || new Date().toLocaleString();

    let paidHtml = paidInFull
      ? `<span class="paid-status success">Payment Successful</span>`
      : `<span class="paid-status pending">Payment Pending</span>`;

    let html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;border-radius:9px;padding:28px 20px 14px 20px;width:420px;">
        <div style="display:flex;align-items:center;gap:18px;margin-bottom:9px;">
            <div style="font-size:2.7em;background:#e3f0ff;border-radius:50%;padding:8px 18px;">&#128179;</div>
            <div>
                <h2 style="margin:0 0 2px 0;">Payment Receipt</h2>
                <div style="color:#4b6584;font-size:1em;margin-bottom:3px;">Transaction Date: ${now}</div>
            </div>
        </div>
        <div style="margin-bottom:13px;font-size:1.1em;color:#222;">
            <div><b>Delivery Date:</b> ${deliveryDate || '-'}</div>
            <div><b>Delivery Location:</b> ${deliveryLocation || '-'}</div>
            <div><b>Status:</b> ${paidHtml}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:15px;">
            <thead>
                <tr>
                    <th style="border-bottom:1px solid #eee;padding:7px 2px;text-align:left;">Commodity</th>
                    <th style="border-bottom:1px solid #eee;padding:7px 2px;text-align:left;">Price (₦)</th>
                    <th style="border-bottom:1px solid #eee;padding:7px 2px;text-align:left;">Quantity</th>
                    <th style="border-bottom:1px solid #eee;padding:7px 2px;text-align:left;">Total (₦)</th>
                </tr>
            </thead>
            <tbody>
                ${commodities.map(c => `
                    <tr>
                        <td style="border-bottom:1px solid #eee;padding:7px 2px;">${c.name}</td>
                        <td style="border-bottom:1px solid #eee;padding:7px 2px;">${window.formatNumber(c.price)}</td>
                        <td style="border-bottom:1px solid #eee;padding:7px 2px;">${window.formatNumber(c.quantity)}</td>
                        <td style="border-bottom:1px solid #eee;padding:7px 2px;">${window.formatNumber(c.price * c.quantity)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div style="font-weight:bold;margin-top:10px;font-size:1.2em;">
            Grand Total: ₦${window.formatNumber(commodities.reduce((sum, c) => sum + (c.price * c.quantity), 0))}
        </div>
    </div>
    `;

    let printWindow = window.open('', '', 'height=700,width=500');
    printWindow.document.write('<html><head><title>Receipt</title></head><body>');
    printWindow.document.write(html);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}