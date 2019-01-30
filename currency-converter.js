const axios = require('axios');

const fromConvert = document.querySelector(".fromConvert");
const toConvert = document.querySelector(".toConvert");
const amountConvert = document.querySelector(".amountConvert");
const resultConvert = document.querySelector(".convert-result-total");
const button = document.querySelector(".convert-button");

// async download currency info
const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const response = await axios.get('http://www.apilayer.net/api/live?access_key=0112c99f2b00565df94ae04c44316fc3'); // доступ к API с данными валют
        const rate = response.data.quotes;
        const baseCurrency = response.data.source;
        const usd = 1 / rate[`${baseCurrency}${fromCurrency}`]; 
        const exchangeRate = usd * rate[`${baseCurrency}${toCurrency}`];

        return exchangeRate;
        } catch (error) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
        }
};

// async download country info
const getCountries = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map(country => country.name);
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
};

// convert function
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const countries = await getCountries(toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);
  
    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};

amountConvert.addEventListener('keydown', function(){
    let isDigit = false;
    let isControl = false;
    if(event.key >=0 || event.key <= 9){
        isDigit = true;
    }
    if(event.key=='Backspace' || event.key=='ArrowLeft' || event.key=='ArrowRight'){
        isControl = true;
    }
    if(!isDigit && !isControl){
        event.preventDefault();
    }
})

button.addEventListener("click", function(){
    event.preventDefault();
    convertCurrency(fromConvert.value, toConvert.value, amountConvert.value)
    .then((message) => {
        fromConvert.value = "";
        toConvert.value = "";
        amountConvert.value = "";
        resultConvert.innerHTML = message;
    }).catch((error) => {
      console.log(error.message);
    });
});
