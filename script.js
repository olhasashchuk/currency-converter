// Exchange rates array
const arrRates = [
   {
      timestamp: Date.now(),
      base: 'USD',
      rates: { 'USD': 1.00000, 'EUR': 0.92269, 'GBP': 0.78377 }
   },
   {
      timestamp: Date.now(),
      base: 'EUR',
      rates: { 'EUR': 1.00000, 'USD': 1.08369, 'GBP': 0.84918 }
   },
   {
      timestamp: Date.now(),
      base: 'GBP',
      rates: { 'GBP': 1.00000, 'USD': 1.27619, 'EUR': 1.17773 }
   }
];

console.log(arrRates);

// Function to create table headers
function createTableHeaders(tableCurrencyCol, addedColumns) {
   arrRates.forEach(item => {
      Object.keys(item.rates).forEach(rateKey => {
         if (!addedColumns.has(rateKey)) {
            addedColumns.add(rateKey);
            let newColumnHeader = document.createElement("th");
            newColumnHeader.scope = "col";
            newColumnHeader.innerText = rateKey;
            tableCurrencyCol.appendChild(newColumnHeader);
         }
      });
   });
}

// Function to create table rows
function createTableRows(tableCurrencyRow, addedColumns) {
   arrRates.forEach(item => {
      let row = document.createElement("tr");
      let newNameRow = document.createElement("th");
      newNameRow.scope = "row";
      newNameRow.innerText = item.base;
      row.appendChild(newNameRow);

      addedColumns.forEach(rateKey => {
         let newRate = document.createElement("td");
         newRate.innerText = item.rates[rateKey] ? item.rates[rateKey].toFixed(5) : ''; // Fill with rate value or empty if not present
         row.appendChild(newRate);
      });

      tableCurrencyRow.appendChild(row);
   });
}

// Function to create the table
function createTable() {
   const tableCurrencyCol = document.querySelector('.table-col-currency');
   const tableCurrencyRow = document.querySelector('.table-row-currency');

   if (!tableCurrencyCol || !tableCurrencyRow) return;

   const addedColumns = new Set();

   createTableHeaders(tableCurrencyCol, addedColumns);
   createTableRows(tableCurrencyRow, addedColumns);
}

createTable();

// Function to populate select elements for currency rates
function populateSelectElements(currencyElements, addedCurrencies, isBase = false) {
   arrRates.forEach(item => {
      const currencyKey = isBase ? [item.base] : Object.keys(item.rates);
      currencyKey.forEach(key => {
         if (!addedCurrencies.has(key)) {
            addedCurrencies.add(key);
            let newOption = document.createElement("option");
            newOption.value = key;
            newOption.innerText = key;
            currencyElements.forEach(element => element.appendChild(newOption.cloneNode(true)));
         }
      });
   });
}

// Function to create rate select elements
function createRates() {
   const selectCurrencyFrom = document.querySelectorAll('.select_currency_from');
   const selectCurrencyTo = document.querySelectorAll('.select_currency_to');
   if (!selectCurrencyFrom.length || !selectCurrencyTo.length) return;

   const addedCurrenciesFrom = new Set();
   const addedCurrenciesTo = new Set();

   populateSelectElements(selectCurrencyFrom, addedCurrenciesFrom, true);
   populateSelectElements(selectCurrencyTo, addedCurrenciesTo, false);
}

createRates();

// Function to handle form submissions
function handleFormSubmissions() {
   document.querySelector('.formRate--js').addEventListener('submit', function(event) {
      event.preventDefault();
      addRate();
      console.log(arrRates);
   });

   document.querySelector('.formUpdateRate--js').addEventListener('submit', function(event) {
      event.preventDefault();
      updateRate();
      console.log(arrRates);
   });

   document.querySelector('.formConvert--js').addEventListener('input', function(event) {
      event.preventDefault();
      getConvert();
   });

   document.querySelector('.formSearchRate--js').addEventListener('submit', function(event) {
      event.preventDefault();
      searchRate();
   });
}

handleFormSubmissions();

// Function to add a new option to a select element
function addNewDataCurrency(data, idElement) {
   const selectData = document.getElementById(idElement);
   const existingOption = Array.from(selectData.options).find(option => option.value === data.toUpperCase());
   if (!existingOption) {
      let newData = document.createElement("option");
      newData.value = data.toUpperCase();
      newData.innerText = data.toUpperCase();
      selectData.appendChild(newData);
   }
}

// Function to add a new row to the currency table
function addDataRowTableCurrency(dataRow) {
   const tableCurrencyRow = document.querySelector('.table-row-currency');

   let existingRow = Array.from(tableCurrencyRow.querySelectorAll("tr")).find(row => {
      return row.querySelector("th") && row.querySelector("th").innerText === dataRow;
   });

   if (!existingRow) {
      let newRow = document.createElement("tr");
      let newNameRow = document.createElement("th");
      newNameRow.scope = "row";
      newNameRow.innerText = dataRow;
      newRow.appendChild(newNameRow);

      const numCols = document.querySelectorAll('.table-col-currency th').length;
      for (let i = 0; i < numCols - 1; i++) { // -1 because first column is the row header
         newRow.appendChild(document.createElement("td"));
      }

      tableCurrencyRow.appendChild(newRow);
   }
}

// Function to add a new column to the currency table
function addDataColTableCurrency(dataRow, dataCol, rate) {
   const tableCurrencyCol = document.querySelector('.table-col-currency');
   const tableCurrencyRow = document.querySelector('.table-row-currency');

   let existingHeader = Array.from(tableCurrencyCol.querySelectorAll("th")).find(header => header.innerText === dataCol);

   if (!existingHeader) {
      let newColumnHeader = document.createElement("th");
      newColumnHeader.scope = "col";
      newColumnHeader.innerText = dataCol;
      tableCurrencyCol.appendChild(newColumnHeader);

      const rows = document.querySelectorAll('.table-row-currency tr');
      rows.forEach(row => {
         row.appendChild(document.createElement("td"));
      });  
   }

   let existingRow = Array.from(tableCurrencyRow.querySelectorAll("tr")).find(row => {
      return row.querySelector("th") && row.querySelector("th").innerText === dataRow;
   });

   if (existingRow) {
      const colIndex = Array.from(tableCurrencyCol.querySelectorAll("th")).findIndex(header => header.innerText === dataCol);
      if (colIndex > -1) {
         let cell = existingRow.querySelectorAll("td")[colIndex - 1]; // -1 because row header is the first element
         cell.innerText = rate;
      }
   }
}

// Function to add a new currency rate
function addRate() {
   const currencyFrom = document.querySelector('.currencyName_from').value.toUpperCase().trim();
   const currencyTo = document.querySelector('.currencyName_to').value.toUpperCase().trim();
   const rate = document.getElementById('currency_rate').value;

   const existingRate = arrRates.find(ratesObj => ratesObj.base === currencyFrom);

   if (existingRate) {
      if (existingRate.rates[currencyTo] !== undefined) {
         alert(`This currency conversion rate already exists`);
      } else {
         existingRate.rates[currencyTo] = rate;
         addDataColTableCurrency(currencyFrom, currencyTo, rate);
         addNewDataCurrency(currencyTo, 'update-currency_to');
         addNewDataCurrency(currencyTo, 'datalistOptions_convert_to');
      }
   } else {
      arrRates.push({
         timestamp: Date.now(),
         base: currencyFrom,
         rates: { [currencyTo]: rate }
      });
      addDataRowTableCurrency(currencyFrom);
      addDataColTableCurrency(currencyFrom, currencyTo, rate);
      addNewDataCurrency(currencyFrom, 'update-currency_from');
      addNewDataCurrency(currencyFrom, 'datalistOptions_convert_from');
      addNewDataCurrency(currencyTo, 'update-currency_to');
      addNewDataCurrency(currencyTo, 'datalistOptions_convert_to');
   }
}

// Function to update an existing currency rate
function updateRate() {
   const newRate = parseFloat(document.getElementById('update-currency_rate').value);
   const updateCurrencyFrom = document.getElementById('update-currency_from').value;
   const updateCurrencyTo = document.getElementById('update-currency_to').value;

   let existingRate = arrRates.find(rateObj => rateObj.base === updateCurrencyFrom);
   if (existingRate) {
      existingRate.rates[updateCurrencyTo] = newRate;
   }
   addDataColTableCurrency(updateCurrencyFrom, updateCurrencyTo, newRate);
}

// Function to convert currency
function getConvert() {
   const amount = document.getElementById('amount').value;
   const convertCurrencyFrom = document.getElementById('convert-currency_from').value;
   const convertCurrencyTo = document.getElementById('convert-currency_to').value;

   let existingRate = arrRates.find(rateObj => rateObj.base === convertCurrencyFrom);
   if (existingRate) {
      const rate = existingRate.rates[convertCurrencyTo];
      if (rate) {
      const convertedAmount = amount * rate;
         if (convertedAmount !== null) {
            document.getElementById("result").innerText = convertedAmount.toFixed(5);
         }
      } else {
         alert ("This currency is not available");
      }
   } else {
      alert ("This currency is not available");
   }

   if (!amount) {
      document.getElementById("result").innerText = 0;
   }
}


// Function to search currency
function searchRate() {
   const searchCurrencyFrom = document.getElementById('search-currency_from').value.toUpperCase();
   const searchCurrencyTo = document.getElementById('search-currency_to').value.toUpperCase();

   let existingRate = arrRates.find(rateObj => rateObj.base === searchCurrencyFrom);
   if (existingRate) {
      const rate = existingRate.rates[searchCurrencyTo];
      if (rate) {
         document.getElementById('search-result').innerText = `Exchange rate from ${searchCurrencyFrom} to ${searchCurrencyTo} is ${rate.toFixed(5)}.`;
      } else {
         document.getElementById('search-result').innerText = `Exchange rate from ${searchCurrencyFrom} to ${searchCurrencyTo} is not available.`;
      }
   } else {
      document.getElementById('search-result').innerText = `Exchange rate from ${searchCurrencyFrom} is not available.`;
   }
}