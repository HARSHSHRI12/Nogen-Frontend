// src/components/Output.jsx
import React from 'react';

function Output({ result }) {
  return (
    <div>
      <h3>Output</h3>
      <pre>{result}</pre>  {/* Output will be shown here */}
    </div>
  );
}

export default Output;
