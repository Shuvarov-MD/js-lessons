'use strict';

let money = 50000,
  income = 'фриланс',
  addExpenses = 'Интернет, такси, коммуналка',
  deposit = true,
  mission = 1e6,
  period = 12;

console.log(typeof money);
console.log(typeof income);
console.log(typeof deposit);

console.log(addExpenses.length);

console.log(`Период равен ${period} месяцев`);
console.log(`Цель заработать ${mission} рублей/долларов/гривен/юани`);

console.log(addExpenses.toLowerCase().split(', '));

let budgetDay = money / 30;
console.log(budgetDay);