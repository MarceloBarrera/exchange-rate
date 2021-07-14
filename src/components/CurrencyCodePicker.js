import { useDispatch } from "react-redux";
import { changeCurrencyCode } from "../store/rates";

export function CurrencyCodePicker({ supportedCurrencies, currencyCode }) {
  const dispatch = useDispatch();
  function onChange(e) {
    dispatch(changeCurrencyCode(e.target.value));
  }
  return (
    <select className="currencyCode" value={currencyCode} onChange={onChange}>
      {supportedCurrencies.map((code) => (
        <option key={code} value={code}>
          {code}
        </option>
      ))}
    </select>
  );
}
