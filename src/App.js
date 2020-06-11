import React, { useEffect, useState } from "react";
import "./App.css";
import Currencyrow from "./Currencyrow";

const base_url = "https://api.exchangeratesapi.io/latest";

function App() {
  const [currencyOptions, setOptions] = useState([]);

  const [fromCurrency, setFromCurrency] = useState([]);
  const [toCurrency, setToCurrency] = useState([]);
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [exchangeRates, setExchangeRates] = useState();

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRates;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRates;
  }

  useEffect(() => {
    fetch(base_url)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRates(data.rates[firstCurrency]);
      });
  }, []);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }
  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }
  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${base_url}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => setExchangeRates(data.rates[toCurrency]));
    }
  }, [fromCurrency, toCurrency]);

  return (
    <>
      <h3>Convert your currency</h3>
      <div className="main">
        <div className="inner">
          <div className="inputs">
            <p className="convert">Convert FROM</p>
            <Currencyrow
              currencyOptions={currencyOptions}
              selectedCurrency={fromCurrency}
              onChangeCurrency={(e) => setFromCurrency(e.target.value)}
              amount={fromAmount}
              onChangeAmount={handleFromAmountChange}
            />
            <div className="equal">To</div>
            <Currencyrow
              currencyOptions={currencyOptions}
              selectedCurrency={toCurrency}
              onChangeCurrency={(e) => setToCurrency(e.target.value)}
              amount={toAmount}
              onChangeAmount={handleToAmountChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
