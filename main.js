document.addEventListener("DOMContentLoaded", function () {
  getTimerMarketOpening();
  getData();
  handleFormSubmissions();
  getDataFromLoad();
});

const KEY = "currencyData";
const hottestCurrency = "EUR";
let storedArrRates = [];

function getTimerMarketOpening() {
  const marketOpenHour = 9;
  const marketCloseHour = 17;
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();
  const timer = document.querySelector('.js--time');
  const info = document.querySelector('.js--info');
  const containerTimer = document.querySelector('.timer');
  const hours = document.querySelector('.js--hours');
  const minutes = document.querySelector('.js--minutes');
  const seconds = document.querySelector('.js--seconds');
  let timerId = 0;

  const upDateTimer = () => {
    timerId = setInterval(() => {
      if(+seconds.innerHTML > 0) {
        seconds.innerHTML = +seconds.innerHTML - 1;
      } else if (+minutes.innerHTML > 0) {
        minutes.innerHTML = +minutes.innerHTML - 1;
        seconds.innerHTML = "59";
      } else if(+hours.innerHTML > 0) {
        hours.innerHTML = +hours.innerHTML - 1;
        minutes.innerHTML = "59";
        seconds.innerHTML = "59";
      } else {
        stop();
      }
      setTimer();
    }, 1000);
  }

  const setTimer = () => {
    const hour = hours.innerHTML.toString().padStart(2, "0");
    const min = minutes.innerHTML.toString().padStart(2, "0");
    const sec = seconds.innerHTML.toString().padStart(2, "0");
    timer.textContent = `${hour}:${min}:${sec}`;
  }

  const stop = () => {
    if (+hours.innerHTML === 0 && +minutes.innerHTML === 0 && +seconds.innerHTML === 0) {
      clearInterval(timerId);
      info.innerText = 'The market is now closed. It will open at 9am and close at 5pm local time.';
    }
  }

  if (currentHours < marketOpenHour || currentHours >= marketCloseHour) {
    info.innerText = 'The market is currently closed. It will open at 9am and close at 5pm local time.';
    containerTimer.appendChild(info);
    hours.innerHTML = '00:';
    minutes.innerHTML = '00:';
    seconds.innerHTML = '00';
  } else {
    const remainingHours = marketCloseHour - currentHours - 1;
    const remainingMinutes = 59 - currentMinutes;
    const remainingSeconds = 59 - currentSeconds;
    
    hours.innerHTML = remainingHours.toString().padStart(2, "0");
    minutes.innerHTML = remainingMinutes.toString().padStart(2, "0");
    seconds.innerHTML = remainingSeconds.toString().padStart(2, "0");

    info.innerText = 'Time until the market closes';
    upDateTimer();
  }
}

async function getData() {
  try {
    let data = localStorage.getItem(KEY);
    if (!data) {
      const res = await fetch(
        "https://raw.githubusercontent.com/olhasashchuk/olhasashchuk.github.io/main/data/currency.json"
      );
      data = await res.json();
      localStorage.setItem(KEY, JSON.stringify(data));
      createTable(data);
      createRates(data);
    } else {
      data = JSON.parse(data);
    }
    storedArrRates = data;
  } catch (error) {
    console.log(error);
  }
}

function getDataFromLoad() {
  const arrRates = JSON.parse(localStorage.getItem(KEY));
  if (arrRates !== null) {
    storedArrRates = arrRates; // Update storedArrRates with data from local storage
    createTable(arrRates);
    createRates(arrRates);
  }
}

// Function to create the table
function createTable(dataRates) {
  const tableCurrencyCol = document.querySelector(".table-col-currency");
  const tableCurrencyRow = document.querySelector(".table-row-currency");

  if (!tableCurrencyCol || !tableCurrencyRow) return;

  const addedColumns = new Set();
  
  // Function to create table headers
  const createTableHeaders = (dataRates, tableCurrencyCol, addedColumns) => {
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
  const createTableRows = (dataRates, tableCurrencyRow, addedColumns) => {
    // Clear existing rows before adding new ones
    tableCurrencyRow.innerHTML = "";
    dataRates.forEach((item) => {
      const row = document.createElement("tr");
      const newNameRow = document.createElement("th");
      newNameRow.scope = "row";
      newNameRow.innerText = item.base;
      row.appendChild(newNameRow);

      addedColumns.forEach((rateKey) => {
        const newRate = document.createElement("td");
        if (item.newRates && item.newRates[rateKey]) {
          newRate.innerText = item.newRates[rateKey].toFixed(5);
        } else if (item.rates[rateKey]) {
          newRate.innerText = item.rates[rateKey].toFixed(5);
        } else {
          newRate.innerText = ""; // Fill with rate value or empty if not present
        }
        row.appendChild(newRate);
      });

      tableCurrencyRow.appendChild(row);
    });
  }
  createTableHeaders(dataRates, tableCurrencyCol, addedColumns);
  createTableRows(dataRates, tableCurrencyRow, addedColumns);
}

// Function to create rate select elements
function createRates(dataRates) {
  const selectCurrencyFrom = document.querySelectorAll(".select_currency_from");
  const selectCurrencyTo = document.querySelectorAll(".select_currency_to");
  if (!selectCurrencyFrom.length || !selectCurrencyTo.length) return;

  const addedCurrenciesFrom = new Set();
  const addedCurrenciesTo = new Set();

  // Function to populate select elements for currency rates
  const populateSelectElements = (dataRates, currencyElements, addedCurrencies, isBase = false) => {
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

  populateSelectElements(dataRates, selectCurrencyFrom, addedCurrenciesFrom, true);
  populateSelectElements(dataRates, selectCurrencyTo, addedCurrenciesTo, false);
}

// Function to handle form submissions
function handleFormSubmissions() {
  document
    .querySelector(".formRate--js")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      addRate();
    });

  document
    .querySelector(".formUpdateRate--js")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      updateRate();
    });

  document
    .querySelector(".formConvert--js")
    .addEventListener("input", function (event) {
      event.preventDefault();
      getConvert();
    });

  document
    .querySelector(".btn-switch-currency")
    .addEventListener("click", switchValueCurrency);

  document
    .querySelector(".formSearchRate--js")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      searchRate();
    });
}

// Function to add a new column to the currency table
function addDataColTableCurrency(dataRow, dataCol, rate) {
  const tableCurrencyCol = document.querySelector(".table-col-currency");
  const tableCurrencyRow = document.querySelector(".table-row-currency");

  let existingHeader = Array.from(tableCurrencyCol.querySelectorAll("th")).find(
    (header) => header.innerText === dataCol
  );

  if (!existingHeader) {
    let newColumnHeader = document.createElement("th");
    newColumnHeader.scope = "col";
    newColumnHeader.innerText = dataCol;
    tableCurrencyCol.appendChild(newColumnHeader);

    const rows = document.querySelectorAll(".table-row-currency tr");
    rows.forEach((row) => {
      row.appendChild(document.createElement("td"));
    });
  }

  let existingRow = Array.from(tableCurrencyRow.querySelectorAll("tr")).find(
    (row) => {
      return (
        row.querySelector("th") && row.querySelector("th").innerText === dataRow
      );
    }
  );

  if (existingRow) {
    const colIndex = Array.from(
      tableCurrencyCol.querySelectorAll("th")
    ).findIndex((header) => header.innerText === dataCol);
    if (colIndex > -1) {
      let cell = existingRow.querySelectorAll("td")[colIndex - 1]; // -1 because row header is the first element
      cell.innerText = rate.toFixed(5);
    }
  }
}

// Function to add a new currency rate
function addRate() {
  const currencyFrom = document
    .querySelector(".currency-from")
    .value.toUpperCase()
    .trim();
  const currencyTo = document
    .querySelector(".currency-to")
    .value.toUpperCase()
    .trim();
  const rate = parseFloat(document.getElementById("currency_rate").value);
  const existingRate = storedArrRates.find(
    (ratesObj) => ratesObj.base === currencyFrom
  );

  // Function to add a new option to a select element
  const addNewDataCurrency = (data, idElement) => {
    const selectData = document.getElementById(idElement);
    const existingOption = Array.from(selectData.options).find(
      (option) => option.value === data.toUpperCase()
    );
    if (!existingOption) {
      let newData = document.createElement("option");
      newData.value = data.toUpperCase();
      newData.innerText = data.toUpperCase();
      selectData.appendChild(newData);
    }
  }

  // Function to add a new row to the currency table
  const addDataRowTableCurrency = (dataRow) => {
    const tableCurrencyRow = document.querySelector(".table-row-currency");

    let existingRow = Array.from(tableCurrencyRow.querySelectorAll("tr")).find(
      (row) => {
        return (
          row.querySelector("th") && row.querySelector("th").innerText === dataRow
        );
      }
    );

    if (!existingRow) {
      let newRow = document.createElement("tr");
      let newNameRow = document.createElement("th");
      newNameRow.scope = "row";
      newNameRow.innerText = dataRow;
      newRow.appendChild(newNameRow);

      const numCols = document.querySelectorAll(".table-col-currency th").length;
      for (let i = 0; i < numCols - 1; i++) {
        // -1 because first column is the row header
        newRow.appendChild(document.createElement("td"));
      }
      tableCurrencyRow.appendChild(newRow);
    }
  }

  if (existingRate) {
    if (existingRate.rates[currencyTo]) {
      alert(`This currency conversion rate already exists`);
    } else {
      existingRate.rates[currencyTo] = rate;
      addDataColTableCurrency(currencyFrom, currencyTo, rate);
      addNewDataCurrency(currencyTo, "update-currency_to");
      addNewDataCurrency(currencyTo, "datalistOptions_convert_to");
    }
  } else {
    const currency = {
      timestamp: Date.now(),
      base: currencyFrom,
      rates: { [currencyTo]: rate },
    };
    storedArrRates.push(currency);
    addDataRowTableCurrency(currencyFrom);
    addDataColTableCurrency(currencyFrom, currencyTo, rate);
    addNewDataCurrency(currencyFrom, "update-currency_from");
    addNewDataCurrency(currencyFrom, "datalistOptions_convert_from");
    addNewDataCurrency(currencyTo, "update-currency_to");
    addNewDataCurrency(currencyTo, "datalistOptions_convert_to");
  }

  // Save the updated array to localStorage
  localStorage.setItem(KEY, JSON.stringify(storedArrRates));
}

// Function to update an existing currency rate
function updateRate() {
  const newRate = parseFloat(
    document.getElementById("update-currency_rate").value
  );
  const updateCurrencyFrom = document.getElementById(
    "update-currency_from"
  ).value;
  const updateCurrencyTo = document.getElementById("update-currency_to").value;

  let existingRate = storedArrRates.find(
    (rateObj) => rateObj.base === updateCurrencyFrom
  );
  if (existingRate) {
    existingRate.newRates = {
      ...existingRate.newRates,
      [updateCurrencyTo]: newRate,
    };

    localStorage.setItem(KEY, JSON.stringify(storedArrRates));
  }

  addDataColTableCurrency(updateCurrencyFrom, updateCurrencyTo, newRate);
}

// Function to convert currency
function getConvert() {
  const amount = parseFloat(document.querySelector("#amount").value);
  const convertCurrencyFrom = document.querySelector(
    "#convert-currency_from"
  ).value;
  const convertCurrencyTo = document.querySelector(
    "#convert-currency_to"
  ).value;

  if (isNaN(amount) || amount <= 0) {
    document.querySelector("#result").innerText = 0;
    return;
  }

  const existingRate = storedArrRates.find(
    (rateObj) => rateObj.base === convertCurrencyFrom
  );
  if (!existingRate) {
    alert("This currency is not available");
    return;
  }

  const newRate = existingRate.newRates
    ? existingRate.newRates[convertCurrencyTo]
    : null;
  const rate = existingRate.rates
    ? existingRate.rates[convertCurrencyTo]
    : null;

  if (existingRate) {
    if (newRate || rate) {
      const finalRate = newRate || rate;
      const convertedAmount = amount * finalRate;
      document.querySelector("#result").innerText = convertedAmount.toFixed(5);
    } else {
      alert("This currency is not available");
    }
  }
  checkRate(
    newRate,
    rate,
    convertCurrencyFrom,
    convertCurrencyTo,
    hottestCurrency
  );
}

function switchValueCurrency() {
  const convertCurrencyFrom = document.querySelector(
    "#convert-currency_from"
  ).value;
  const convertCurrencyTo = document.querySelector(
    "#convert-currency_to"
  ).value;

  if (convertCurrencyFrom && convertCurrencyTo) {
    document.querySelector("#convert-currency_from").value = convertCurrencyTo;
    document.querySelector("#convert-currency_to").value = convertCurrencyFrom;
  }
}

// Function to search currency
function searchRate() {
  const searchCurrencyFrom = document
    .getElementById("search-currency_from")
    .value.toUpperCase();
  const searchCurrencyTo = document
    .getElementById("search-currency_to")
    .value.toUpperCase();

  const existingRate = storedArrRates.find(
    (rateObj) => rateObj.base === searchCurrencyFrom
  );

  if (!existingRate) {
    document.getElementById(
      "search-result"
    ).innerText = `Exchange rate from ${searchCurrencyFrom} is not available.`;
    return;
  }

  const newRate = existingRate.newRates
    ? existingRate.newRates[searchCurrencyTo]
    : null;
  const rate = existingRate.rates ? existingRate.rates[searchCurrencyTo] : null;

  if (existingRate) {
    if (newRate || rate) {
      const finalRate = newRate || rate;
      document.getElementById(
        "search-result"
      ).innerText = `Exchange rate from ${searchCurrencyFrom} to ${searchCurrencyTo} is ${finalRate.toFixed(
        5
      )}.`;
    } else {
      document.getElementById(
        "search-result"
      ).innerText = `Exchange rate from ${searchCurrencyFrom} to ${searchCurrencyTo} is not available.`;
    }
  }

  checkRate(
    newRate,
    rate,
    searchCurrencyFrom,
    searchCurrencyTo,
    hottestCurrency
  );
}

// function watcher to periodically check a specific currency conversion
function checkRate(newRate, rate, currencyFrom, currencyTo, hottestCurrency) {
  setTimeout(() => {
    if (newRate <= rate * 0.7) {
      alert(
        `You are interested in converting ${currencyFrom} to ${currencyTo} but the rate today is very bad, 1 ${currencyFrom} is ${newRate.toFixed(
          5
        )} ${currencyTo}`
      );
    }
    if (newRate >= rate * 1.2 && !(newRate === rate * 2)) {
      alert(
        `Exchange rate from ${currencyFrom} to ${currencyTo} is ${newRate.toFixed(
          5
        )}. You can convert with maximum gain`
      );
    }
    if (currencyTo === hottestCurrency) {
      if (newRate === rate * 2) {
        alert(
          `Exchange rate from ${currencyFrom} to ${currencyTo} is ${newRate.toFixed(
            5
          )}. Currency conversion reaching the double value`
        );
      }
    }
  }, 2000);
}


