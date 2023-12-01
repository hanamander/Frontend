import { Component } from 'react';

// import Main from "./components/main";
import Layout from './components/layout';
import "./App.css";

// function dateFormat(date)
// {
//     let month = date.getMonth() + 1;
//     let day = date.getDate();
//     let hour = date.getHours();
//     let minute = date.getMinutes();
//     let second = date.getSeconds();

//     month = month >= 10 ? month : '0' + month;
//     day = day >= 10 ? day : '0' + day;
//     hour = hour >= 10 ? hour : '0' + hour;
//     minute = minute >= 10 ? minute : '0' + minute;
//     second = second >= 10 ? second : '0' + second;

//     return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
// }

// function test() 
// {
//     const sn = 123
//     const start_time = new Date();
//     let measure_time = new Date(start_time); // 복사
//     measure_time = start_time; // 참조

//     // let a = 1;
//     // let b = a;
//     // b = 2;
//     // console.log(typeof(a));

//     // number === object?
//     // int 변수
//     // Integer 객체

//     for (let i = 0; i < 10; ++i)
//     {
//         measure_time.setSeconds(measure_time.getSeconds() + 10);
//         const rand1 = (Math.random() * 101).toFixed(1);
//         console.log(`INSERT INTO sample_table (sn, start_time, measure_time, score) VALUES (${sn},${dateFormat(start_time)},${dateFormat(measure_time)},${rand1})`);
//     }
// }

// test();

class App extends Component 
{
    render()
    {
        return (
            <Layout />
        );
    }
}

export default App;