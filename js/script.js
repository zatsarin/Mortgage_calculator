
let actRowIndex;

// Load data and make table when page start 
function load_page() {

    getDataAndStartPage();
    highlight_row();

}


// Add row when page load
function addRow(rowCount) {

    var z = 0;
    while (z < rowCount) { //  rows in the page

        var table = document.getElementById("tab_id");
        var row = table.insertRow(1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        var inputItem1 = document.createElement('input');
        var inputItem2 = document.createElement('input');
        var inputItem3 = document.createElement('input');
        var inputItem4 = document.createElement('input');
        var inputItem5 = document.createElement('input');

        cell1.appendChild(inputItem1);
        cell2.appendChild(inputItem2);
        cell3.appendChild(inputItem3);
        cell4.appendChild(inputItem4);
        cell5.appendChild(inputItem5);

        inputItem1.type = "text";
        inputItem2.type = "number";
        inputItem3.type = "number";
        inputItem4.type = "number";
        inputItem5.type = "number";

        inputItem1.readOnly = true;
        inputItem2.readOnly = true;
        inputItem3.readOnly = true;
        inputItem4.readOnly = true;
        inputItem5.readOnly = true;

        z++;
        highlight_row();
    }
}

// Add row by button click
function addRowButton() {

    var table = document.getElementById("tab_id");
    var row = table.insertRow(1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    var inputItem1 = document.createElement('input');
    var inputItem2 = document.createElement('input');
    var inputItem3 = document.createElement('input');
    var inputItem4 = document.createElement('input');
    var inputItem5 = document.createElement('input');

    cell1.appendChild(inputItem1);
    cell2.appendChild(inputItem2);
    cell3.appendChild(inputItem3);
    cell4.appendChild(inputItem4);
    cell5.appendChild(inputItem5);

    inputItem1.type = "text";
    inputItem2.type = "number";
    inputItem3.type = "number";
    inputItem4.type = "number";
    inputItem5.type = "number";

    highlight_row();
}

// Remove row function
function deleteRow() {

    if (actRowIndex != undefined) {
        document.getElementsByTagName('table')[0].deleteRow(actRowIndex);
        actRowIndex = undefined;
    }
}

// Save data to localstorage
function saveData() {

    const textInput = document.getElementsByTagName("input");
    var arr = Array.from(textInput);

    let counter = 0;
    for (var i = 0; i < arr.length; i++) {
        a = arr[i];

        if (a.value == 0) {
            counter = counter + 1;
        }
    }

    if (counter == 0) {
        localStorage.clear();
        var inputValueArr = [];
        arr.forEach(function (item, i, arr) {
            inputValueArr.push(item.value);
            arr[i].readOnly = true;
        });
        localStorage.setItem("data_array", JSON.stringify(inputValueArr));

    }
    else {
        alert('Some cells is empty');
    }

}

// ReadOnly = false for all inputs
function editRow() {

    var textInput = document.getElementsByTagName("input");
    var arr = Array.from(textInput);
    for (var i = 0; i < arr.length; i++) {
        a = arr[i];
        a.readOnly = false;
    }
}

//  Get value from localstorage and make table
function getDataAndStartPage() {

    var inputValueArr = JSON.parse(localStorage.getItem("data_array"));

    if (inputValueArr.length == 0) {
        addRow(1);
    }
    else {
        var countRows = inputValueArr.length / 5;
        addRow(countRows);

        const textInput = document.getElementsByTagName("input");
        var arr = Array.from(textInput);

        for (var i = 0; i < arr.length; i++) {
            a = arr[i];
            a.value = inputValueArr[i];
        }
    }
}

// Highlight active row
function highlight_row() {

    var table = document.getElementById('tab_id');
    var cells = table.getElementsByTagName('td');

    for (var i = 5; i < cells.length; i++) {
        // Take each cell
        var cell = cells[i];
        // do something on onclick event for cell
        cell.onclick = function () {
            // Get the row id where the cell exists
            var rowId = this.parentNode.rowIndex;

            var rowsNotSelected = table.getElementsByTagName('tr');
            for (var row = 0; row < rowsNotSelected.length; row++) {
                rowsNotSelected[row].style.backgroundColor = "";
                rowsNotSelected[row].classList.remove('selected');
            }
            var rowSelected = table.getElementsByTagName('tr')[rowId];
            rowSelected.className += " selected";

            // Active row index
            actRowIndex = rowSelected.rowIndex;

        }
    }

}

// Full banks list
function readBanksList() {

    var inputValueArr = JSON.parse(localStorage.getItem("data_array"));
    var elements = document.getElementById("banks");
    document.getElementById("banks").innerHTML = "";

    for (var i = 0; i < inputValueArr.length; i += 5) {
        obj = inputValueArr[i];
        var tag = document.createElement("option");
        tag.value = obj;
        elements.appendChild(tag);
    }
}

// Clear data in calc inputs 
function resetButton() {

    const textInput = document.getElementsByTagName("input");
    var arr = Array.from(textInput);

    for (var i = 0; i < arr.length; i++) {
        a = arr[i];
        a.value = "";
    }

    var calcErrorLabel = document.getElementById("error_text-field__label");
    calcErrorLabel.style.color = 'black';
    calcErrorLabel.textContent = "To calculate a monthly payment, fill in all the fields and click the 'Calculate' button";

    var calcInfoLabel = document.getElementById("calc_info-field__label");
    calcInfoLabel.textContent = "$0,00" + " USD";
}

// Validated entered data according to the selected bank and calculate monthly payment
function calculateButton() {

    var dataValueArr = JSON.parse(localStorage.getItem("data_array"));
    var selectedBank = document.getElementById("bank_id");
    var initialLoan = document.getElementById("loan");
    var downPayment = document.getElementById("payment");
    var calcInfoLabel = document.getElementById("calc_info-field__label");
    var calcErrorLabel = document.getElementById("error_text-field__label");
    var interestRate = 0;

    if (initialLoan.value.length == undefined || initialLoan.value.length == 0) {
        calcErrorLabel.style.color = 'rgb(226, 32, 32)';
        calcErrorLabel.textContent = "Please full initial loan field!";
    }
    else {
        if (downPayment.value.length == undefined || downPayment.value.length == 0) {
            calcErrorLabel.style.color = 'rgb(226, 32, 32)';
            calcErrorLabel.textContent = "Please full down payment field!";
        }
        else {
            if (selectedBank.value.length == undefined || selectedBank.value.length == 0) {
                calcErrorLabel.style.color = 'rgb(226, 32, 32)';
                calcErrorLabel.textContent = "Please full bank field!";
            }
            else {
                for (var i = 0; i < dataValueArr.length; i += 5) {
                    obj = dataValueArr[i];

                    if (obj == selectedBank.value) {
                        interestRate = parseInt(dataValueArr[i + 1]); // interest rate
                        countMonthlyPayments = parseInt(dataValueArr[i + 4]); //loan term
                        maxLoan = parseInt(dataValueArr[i + 2]); //maximum loan 
                        minDownPaymentPercent = parseInt(dataValueArr[i + 3]); //minimum down payment
                    };
                }

                if (parseInt(initialLoan.value) > parseInt(downPayment.value)) {
                    if (parseInt(initialLoan.value) <= parseInt(maxLoan)) {
                        var minDownPayment = parseInt(initialLoan.value) * (minDownPaymentPercent / 100);
                        if (parseInt(downPayment.value) >= minDownPayment) {
                            interestRate = interestRate / 100;
                            var pow = Math.pow((1 + interestRate / 12), countMonthlyPayments); // in pow
                            monthlyPayment = (parseInt(initialLoan.value - downPayment.value) * (interestRate / 12) * pow) / (pow - 1);
                            var parseMonthlyPayment = parseFloat(monthlyPayment).toFixed(2) // to digits after decimal

                            calcInfoLabel.textContent = "$" + parseMonthlyPayment + " USD";
                            calcErrorLabel.style.color = 'black';
                            calcErrorLabel.textContent = "";
                        }
                        else {
                            calcErrorLabel.style.color = 'rgb(226, 32, 32)';
                            calcErrorLabel.textContent = "Sum of down payment is smaller than minimum first down payment!";
                        }
                    }
                    else {
                        calcErrorLabel.style.color = 'rgb(226, 32, 32)';
                        calcErrorLabel.textContent = "Amount borrowed more than bank maximum loan!";
                    }
                }
                else {
                    calcErrorLabel.style.color = 'rgb(226, 32, 32)';
                    calcErrorLabel.textContent = "Initial loan must be bigger than down payment!";
                }
            }
        }
    }
}