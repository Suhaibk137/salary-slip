function calculatePayslip() {
    const basic = parseFloat(document.getElementById("basic").value) || 0;
    const hra = parseFloat(document.getElementById("hra").value) || 0;
    const incentives = parseFloat(document.getElementById("incentives").value) || 0;
    const grossEarnings = basic + hra + incentives;
    document.getElementById("gross-earnings").innerText = `₹${grossEarnings.toFixed(2)}`;

    const incomeTax = parseFloat(document.getElementById("income-tax").value) || 0;
    const providentFund = parseFloat(document.getElementById("provident-fund").value) || 0;
    const lop = parseFloat(document.getElementById("lop").value) || 0;
    const totalDeductions = incomeTax + providentFund + lop;
    document.getElementById("total-deductions").innerText = `₹${totalDeductions.toFixed(2)}`;

    const netPayable = grossEarnings - totalDeductions;
    document.getElementById("total-net-payable").innerText = `₹${netPayable.toFixed(2)}`;
    document.getElementById("employee-net-pay").innerText = `₹${netPayable.toFixed(2)}`;
    document.getElementById("amount-in-words").innerText = `Amount In Words: ${convertNumberToWords(netPayable)} Only`;
}

function convertNumberToWords(amount) {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Lakh", "Crore"];

    if (amount === 0) return "Zero Rupees";

    let words = "";
    let i = 0;

    while (amount > 0) {
        let part = amount % 1000;
        
        if (part > 0) {
            let partWords = "";

            if (part > 99) {
                partWords += units[Math.floor(part / 100)] + " Hundred ";
                part %= 100;
            }

            if (part > 10 && part < 20) {
                partWords += teens[part - 10] + " ";
            } else {
                partWords += tens[Math.floor(part / 10)] + " ";
                partWords += units[part % 10] + " ";
            }

            words = partWords + thousands[i] + " " + words;
        }

        amount = Math.floor(amount / 1000);
        i++;
    }

    return words.trim() + " Rupees";
}

function finalizePayslip() {
    // Convert inputs to plain text for final appearance
    document.querySelectorAll('input').forEach(input => {
        const span = document.createElement('span');
        span.innerText = input.value;
        input.replaceWith(span);
    });
    // Generate PDF
    generatePDF();
}

function generatePDF() {
    const element = document.getElementById('payslip-container');
    const employeeName = document.getElementById('employee-name').innerText || 'Employee';
    const payPeriod = document.getElementById('pay-period').value;

    // Format the pay period to a readable month and year if it's in the YYYY-MM format
    let formattedPayPeriod = "Month-Year";
    if (payPeriod) {
        const date = new Date(payPeriod + "-01"); // Add day to make it a valid date
        formattedPayPeriod = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    // Set the filename with employee name and month of payslip
    const fileName = `Payslip_${employeeName}_${formattedPayPeriod}.pdf`;

    html2pdf().from(element).set({
        filename: fileName,
        margin: 1,
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();
}

function makeEditable() {
    // Reloads the page to reset form fields to editable mode
    location.reload();
}
