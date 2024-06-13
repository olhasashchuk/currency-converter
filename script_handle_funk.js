//timeout to show an announcement when the market works
window.addEventListener('DOMContentLoaded', () => {
   setTimeout (() => {
      alert('The market opens at 9am and closes at 5pm local time.')
   }, 2000)
})

const hottestCurrency = 'EUR';

// Exchange rates array
const arrRates = [
   {
      timestamp: 1718286366537,
      base: "USD",
      rates: { 
         "USD": 1.00000, 
         "EUR": 0.92269, 
         "GBP": 0.78377,
         "JPY": 156.80,
         "CHF": 0.8937,
         "CAD": 1.3750,
         "AUD": 1.5059 
      }
   },
   {
      timestamp: 1718286366537,
      base: "EUR",
      rates: { 
         "EUR": 1.00000, 
         "USD": 1.08369, 
         "GBP": 0.84918,
         "JPY": 168.60,
         "CHF": 0.96132,
         "CAD": 1.47901,
         "AUD": 1.61953 
      }
   },
   {
      timestamp: 1718286366537,
      base: "GBP",
      rates: { 
         "GBP": 1.00000, 
         "USD": 1.27619, 
         "EUR": 1.17773,
         "JPY": 200.05,
         "CHF": 1.14041,
         "CAD": 1.75461,
         "AUD": 1.92152
      }
   },
   {
      timestamp: 1718286366537,
      base: "JPY",
      rates: { 
         "JPY": 1.00000, 
         "USD": 0.63785, 
         "EUR": 0.59305,
         "GBP": 0.49980,
         "CHF": 0.56990,
         "CAD": 0.87695,
         "AUD": 0.96015
      }
   },
   {
      timestamp: 1718286366537,
      base: "CHF",
      rates: { 
         "CHF": 1.00000, 
         "EUR": 1.04040, 
         "USD": 1.11901, 
         "GBP": 0.87682,
         "JPY": 175.45,
         "CAD": 1.53862,
         "AUD": 1.68532 
      }
   },
   {
      timestamp: 1718286366537,
      base: "CAD",
      rates: { 
         "CAD": 1.00000, 
         "EUR": 0.67611, 
         "USD": 0.72712, 
         "GBP": 0.56991,
         "JPY": 113.95,
         "CHF": 0.64893,
         "AUD": 1.09572
      }
   },
   {
      timestamp: 1718286366537,
      base: "AUD",
      rates: { 
         "AUD": 1.00000, 
         "EUR": 0.61702, 
         "USD": 0.66341, 
         "GBP": 0.52011,
         "JPY": 103.95,
         "CHF": 0.59263,
         "CAD": 0.91254
      }
   }
]

console.log(arrRates);


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
      existingRate.newRates = { ...existingRate.newRates, [updateCurrencyTo]: newRate };

   }
   addDataColTableCurrency(updateCurrencyFrom, updateCurrencyTo, newRate);
}

// Function to convert currency
function getConvert() {
   const amount = document.getElementById('amount').value;
   const convertCurrencyFrom = document.getElementById('convert-currency_from').value;
   const convertCurrencyTo = document.getElementById('convert-currency_to').value;

   if (isNaN(amount) || amount <= 0) {
      document.getElementById("result").innerText = 0;
      return;
   }

   let existingRate = arrRates.find(rateObj => rateObj.base === convertCurrencyFrom);
   const newRate = existingRate.newRates ? existingRate.newRates[convertCurrencyTo] : null;
   const rate = existingRate.rates ? existingRate.rates[convertCurrencyTo] : null;
   
   if (existingRate) {
      if (newRate) {
         const convertedAmount = amount * newRate;
         document.getElementById("result").innerText = convertedAmount.toFixed(5);
      } else if (rate){
         const convertedAmount = amount * rate;
         document.getElementById("result").innerText = convertedAmount.toFixed(5);
      } else {
         alert ("This currency is not available");
      }
   } else {
      alert ("This currency is not available");
   }

   checkRate (newRate, rate, convertCurrencyFrom, convertCurrencyTo, hottestCurrency)
}


// Function to search currency
function searchRate() {
   const searchCurrencyFrom = document.getElementById('search-currency_from').value.toUpperCase();
   const searchCurrencyTo = document.getElementById('search-currency_to').value.toUpperCase();

   let existingRate = arrRates.find(rateObj => rateObj.base === searchCurrencyFrom);
   const newRate = existingRate.newRates ? existingRate.newRates[searchCurrencyTo] : null;
   const rate = existingRate.rates ? existingRate.rates[searchCurrencyTo] : null;
   if (existingRate) {
      if (newRate) {
         document.getElementById('search-result').innerText = `Exchange rate from ${searchCurrencyFrom} to ${searchCurrencyTo} is ${newRate.toFixed(5)}.`;
      } else if (rate){
         document.getElementById('search-result').innerText = `Exchange rate from ${searchCurrencyFrom} to ${searchCurrencyTo} is ${rate.toFixed(5)}.`;
      } else {
         document.getElementById('search-result').innerText = `Exchange rate from ${searchCurrencyFrom} to ${searchCurrencyTo} is not available.`;
      }
   } else {
      document.getElementById('search-result').innerText = `Exchange rate from ${searchCurrencyFrom} is not available.`;
   }

   checkRate (newRate, rate, searchCurrencyFrom, searchCurrencyTo, hottestCurrency)
}

// function watcher to periodically check a specific currency conversion
function checkRate (newRate, rate, currencyFrom, currencyTo, hottestCurrency) {
   setTimeout (() => {
      if (newRate <= rate * 0.7) {
         alert(`You are interested in converting ${currencyFrom} to ${currencyTo} but the rate today is very bad, 1 ${currencyFrom} is ${newRate.toFixed(5)} ${currencyTo}`)
      } 
      if (newRate >= rate * 1.2 && !(newRate === rate*2)) {
         alert(`Exchange rate from ${currencyFrom} to ${currencyTo} is ${newRate.toFixed(5)}. You can convert with maximum gain`)
      }
      if (currencyTo === hottestCurrency) {
         if(newRate === rate*2){         
            alert(`Exchange rate from ${currencyFrom} to ${currencyTo} is ${newRate.toFixed(5)}. Currency conversion reaching the double value`)
         }
      }
   }, 2000)
}
