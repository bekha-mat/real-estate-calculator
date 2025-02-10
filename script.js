document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("button[onclick='calculate()']").addEventListener("click", calculate);
    document.querySelector("button[onclick='exportToExcel()']").addEventListener("click", exportToExcel);
});

function toggleMortgageFields() {
    let buyerType = document.getElementById("buyerType").value;
    document.getElementById("mortgageFields").style.display = buyerType === "mortgage" ? "block" : "none";
}

function calculate() {
    let propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    let propertySize = parseFloat(document.getElementById('propertySize').value) || 0;
    let buyerType = document.getElementById('buyerType').value;
    let downPaymentPercent = parseFloat(document.getElementById('downPayment').value) || 0;
    let mortgageRate = parseFloat(document.getElementById('mortgageRate').value) || 0;
    let loanTenure = parseFloat(document.getElementById('loanTenure').value) || 0;
    let rentalIncome = parseFloat(document.getElementById('rentalIncome').value) || 0;
    let serviceChargePerSqft = parseFloat(document.getElementById('serviceCharge').value) || 0;
    let appreciationRate = parseFloat(document.getElementById('appreciationRate').value) || 0;

    let pricePerSqft = propertyPrice / propertySize;
    let annualServiceCharge = serviceChargePerSqft * propertySize;
    let downPayment = (downPaymentPercent / 100) * propertyPrice;
    let dldFee = propertyPrice * 0.04;
    let totalExpenses = dldFee + annualServiceCharge;
    let potentialCapitalAppreciation = propertyPrice * (Math.pow(1 + appreciationRate / 100, 5) - 1);
    
    if (buyerType === "mortgage") {
        let monthlyRate = (mortgageRate / 100) / 12;
        let numPayments = loanTenure * 12;
        let mortgageAmount = propertyPrice - downPayment;
        let monthlyMortgage = (mortgageAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
        totalExpenses += (monthlyMortgage * 12);
    }
    
    let netIncome = (rentalIncome * 5) - totalExpenses;
    let roi = (netIncome / (downPayment + dldFee)) * 100;
    let roiClass = roi >= 7 ? "green" : "red";
    
    let results = [
        { name: "Total Down Payment", value: `AED ${downPayment.toFixed(2)}` },
        { name: "DLD Fee (4%)", value: `AED ${dldFee.toFixed(2)}` },
        { name: "Price per Sqft", value: `AED ${pricePerSqft.toFixed(2)}` },
        { name: "Annual Service Charge", value: `AED ${annualServiceCharge.toFixed(2)}` },
        { name: "Potential Capital Appreciation (5 Years)", value: `AED ${potentialCapitalAppreciation.toFixed(2)}` },
        { name: "ROI (%)", value: `<span class='${roiClass}'>${roi.toFixed(2)}%</span>` }
    ];
    
    let resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";
    results.forEach(row => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.name}</td><td>${row.value}</td>`;
        resultsBody.appendChild(tr);
    });
}

function exportToExcel() {
    let table = document.getElementById("resultsTable");
    let rows = [];
    
    for (let i = 0, row; row = table.rows[i]; i++) {
        let rowData = [];
        for (let j = 0, col; col = row.cells[j]; j++) {
            rowData.push(col.innerText);
        }
        rows.push(rowData.join(","));
    }
    
    let csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "real_estate_calculations.csv");
    document.body.appendChild(link);
    link.click();
}
