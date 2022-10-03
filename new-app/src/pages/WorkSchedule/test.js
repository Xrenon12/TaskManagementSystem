import React, { Component, useEffect, useState } from 'react';

import './style.css';

const Test = () => {

    const DateIn = new Date(('2022-09-01 12:00:00 - 2022-10-01 12:00:00').split(' - ')[0])
    const DateOut = new Date(('2022-09-01 12:00:00 - 2022-10-01 12:00:00').split(' - ')[1])

    var getDaysArray = function(start, end) {
        for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
            // console.log(dt.getDate()+1)
            arr.push(new Date(dt));
        }
        return arr;
    };

    const result = getDaysArray(DateIn, DateOut)
    console.log(result)
    
  return (
    <div >
        
    </div>
  );
} 

export default Test;