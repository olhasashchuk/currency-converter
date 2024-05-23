const arrRates = []

document.querySelector('.formRate--js').addEventListener('submit', getRate);
document.querySelector('.formConvert--js').addEventListener('submit', getConvert)

function getRate(event) {
   event.preventDefault();
   const currencyFrom = document.getElementById('currency_from').value;
   const currencyTo = document.getElementById('currency_to').value;
   const date = document.getElementById('currency_date').value;
   const rate = +(document.getElementById('currency_rate').value);
   
   let existingRate = arrRates.find(rateObj => rateObj.base === currencyFrom);

   if (existingRate) {
      existingRate.rates[currencyTo] = rate; //update existing currency conversion with a new rate
   } else {
      arrRates.push({
         timestamp: Date.now(),
         base: currencyFrom,
         date: date,
         rates: { [currencyTo]: rate }
      });
   }
   console.log(arrRates) 
}

function getConvert(event) {
   event.preventDefault();
   const amount = +(document.getElementById('amount').value);
   const convertCurrencyFrom = document.getElementById('convert-currency_from').value;
   const convertCurrencyTo = document.getElementById('convert-currency_to').value;
   let convertedAmount = null;

   function getKeyObj(obj, currencyNameTo) {
      for (const key in obj) {
         if (key === currencyNameTo) {
            return key;
         }
      }
      return null;
   }
 
   function getValueObj(obj, key) {
      return obj[key];
   }

   for (let i = 0; i < arrRates.length; i++) {
      const rateItem = arrRates[i];
      if (convertCurrencyFrom === rateItem.base) {
         const key = getKeyObj(rateItem.rates, convertCurrencyTo);
         if (key === convertCurrencyTo) {
            const valueRate = getValueObj(rateItem.rates, key);
            convertedAmount = amount * valueRate;
            document.getElementById("result").innerHTML = convertedAmount;
            break; 
         }
      }
   }
}
