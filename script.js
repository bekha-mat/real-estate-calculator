document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("buyerType").addEventListener("change", toggleMortgageFields);
    document.getElementById("propertyType").addEventListener("change", togglePaymentPlan);
});

function toggleMortgageFields() {
    let buyerType = document.getElementById("buyerType").value;
    document.getElementById("mortgageFields").style.display = buyerType === "mortgage" ? "block" : "none";
}

function togglePaymentPlan() {
    let propertyType = document.getElementById("propertyType").value;
    document.getElementById("paymentPlanFields").style.display = propertyType === "offplan" ? "block" : "none";
}

function calculate() {
    let propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    let propertySize = parseFloat(document.getElementById('propertySize').value) || 0;
    let buyerType = document.getElementById('buyerType').value;
    let propertyType = document.getElementById('propertyType').value;
    let rentalIncome = parseFloat(document.getElementById('rentalIncome').value) || 0;
    let serviceChargePerSqft = parseFloat(document.getElementById('serviceCharge').value) || 0;
    let appreciationRate = parseFloat(document.getElementById('appreciationRate').value) || 0;
    let roiOrRoe = document.getElementById("roiOrRoe").value;
    let appreciationYears = parseFloat(document.getElementById("appreciationYears").value) || 1;

    let pricePerSqft = propertyPrice / propertySize;
    let annualServiceCharge = serviceChargePerSqft * propertySize;
    let dldFee = propertyPrice * 0.04;
    let agencyCommission = propertyPrice * 0.02;
    let totalExpenses = dldFee + agencyCommission + annualServiceCharge;

    let potentialCapitalAppreciation = propertyPrice * (Math.pow(1 + appreciationRate / 100, appreciationYears) - 1);

    let netIncome = (rentalIncome * appreciationYears) - totalExpenses;
    let resultValue = roiOrRoe === "ROI" ? (netIncome / totalExpenses) * 100 : (netIncome / propertyPrice) * 100;
    let resultClass = resultValue >= 7 ? "green" : "red";

    let resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = `
        <tr><td>Price per Sqft</td><td>AED ${pricePerSqft.toFixed(2)}</td></tr>
        <tr><td>Annual Service Charge</td><td>AED ${annualServiceCharge.toFixed(2)}</td></tr>
        <tr><td>Potential Capital Appreciation</td><td>AED ${potentialCapitalAppreciation.toFixed(2)}</td></tr>
        <tr><td>${roiOrRoe} (%)</td><td class="${resultClass}">${resultValue.toFixed(2)}%</td></tr>
    `;
}

function exportToExcel() {
    let table = document.getElementById("resultsTable").outerHTML;
    let blob = new Blob([table], { type: "application/vnd.ms-excel" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "real_estate_calculations.xls";
    document.body.appendChild(link);
    link.click();
}
