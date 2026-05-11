import React, { useState } from 'react';
import DateBox from 'devextreme-react/date-box';
import { trocaTema } from '../utils/trocatema';

export default function DateComponent() {
  const [date, setDate] = useState(new Date());

  return (

    <div>          
      <DateBox
        type="datetime"
        value={date}
        onValueChanged={(e) => setDate(e.value)}
        displayFormat="dd/MM/yyyy HH:mm"
        showClearButton={true}
      />
    </div>

  );
}