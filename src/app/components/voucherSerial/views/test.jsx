import React from "react";
import CurrencyInput from "react-currency-input-field";
export default function test() {
  return (
    <div>
      Hello
      <CurrencyInput
        id="input-example"
        name="input-name"
        placeholder="Please enter a number"
        decimalsLimit={2}
        decimalSeparator="."
        groupSeparator=","
        onValueChange={(value, name) => console.log(value, name)}
      />
    </div>
  );
}
