document.addEventListener("DOMContentLoaded", getData);

async function getData() {
  try {
      const res = await fetch(
          "https://raw.githubusercontent.com/olhasashchuk/olhasashchuk.github.io/main/data/currency.json"
        )
      const data = await res.json();
      createTable(data);
      createRates(data);
  } catch (error) {
      console.log(error);
  }
}


// Function to create table headers
function createTableHeaders(dataRates, tableCurrencyCol, addedColumns) {
  dataRates.forEach((item) => {
    Object.keys(item.rates).forEach((rateKey) => {
      if (!addedColumns.has(rateKey)) {
        addedColumns.add(rateKey);
        const newColumnHeader = document.createElement("th");
        newColumnHeader.scope = "col";
        newColumnHeader.innerText = rateKey;
        tableCurrencyCol.appendChild(newColumnHeader);
      }
    });
  });
}

// Function to create table rows
function createTableRows(dataRates, tableCurrencyRow, addedColumns) {
  dataRates.forEach((item) => {
    const row = document.createElement("tr");
    const newNameRow = document.createElement("th");
    newNameRow.scope = "row";
    newNameRow.innerText = item.base;
    row.appendChild(newNameRow);

    addedColumns.forEach((rateKey) => {
      const newRate = document.createElement("td");
      newRate.innerText = item.rates[rateKey]
        ? item.rates[rateKey].toFixed(5)
        : ""; // Fill with rate value or empty if not present
      row.appendChild(newRate);
    });

    tableCurrencyRow.appendChild(row);
  });
}

// Function to create the table
function createTable(dataRates) {
  const tableCurrencyCol = document.querySelector(".table-col-currency");
  const tableCurrencyRow = document.querySelector(".table-row-currency");

  if (!tableCurrencyCol || !tableCurrencyRow) return;

  const addedColumns = new Set();

  createTableHeaders(dataRates, tableCurrencyCol, addedColumns);
  createTableRows(dataRates, tableCurrencyRow, addedColumns);
}

// Function to populate select elements for currency rates
function populateSelectElements(
  dataRates,
  currencyElements,
  addedCurrencies,
  isBase = false
) {
  dataRates.forEach((item) => {
    const currencyKey = isBase ? [item.base] : Object.keys(item.rates);
    currencyKey.forEach((key) => {
      if (!addedCurrencies.has(key)) {
        addedCurrencies.add(key);
        let newOption = document.createElement("option");
        newOption.value = key;
        newOption.innerText = key;
        currencyElements.forEach((element) =>
          element.appendChild(newOption.cloneNode(true))
        );
      }
    });
  });
}

// Function to create rate select elements
function createRates(dataRates) {
  const selectCurrencyFrom = document.querySelectorAll(".select_currency_from");
  const selectCurrencyTo = document.querySelectorAll(".select_currency_to");
  if (!selectCurrencyFrom.length || !selectCurrencyTo.length) return;

  const addedCurrenciesFrom = new Set();
  const addedCurrenciesTo = new Set();

  populateSelectElements(
    dataRates,
    selectCurrencyFrom,
    addedCurrenciesFrom,
    true
  );
  populateSelectElements(dataRates, selectCurrencyTo, addedCurrenciesTo, false);
}
