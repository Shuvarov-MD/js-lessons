'use strict';

//Lesson 02
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


//Lesson 03
money = +prompt('Ваш месячный доход?', '');
addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', '');
deposit = confirm('Есть ли у вас депозит в банке?');
let expenses1 = prompt('Введите обязательную статью расходов?', ''),
  amount1 = +prompt('Во сколько это обойдется?', ''),
  expenses2 = prompt('Введите обязательную статью расходов?', ''),
  amount2 = +prompt('Во сколько это обойдется?', '');

//Вычислияем бюджет на месяц
let budgetMonth = money - (amount1 + amount2);
console.log(`Бюджет на месяц: ${budgetMonth}`);

//Достижение цели
console.log('Цель будет достигнута за: ' + Math.ceil(mission / budgetMonth) + ' месяцев');

//Бюджет на день
budgetDay = Math.floor(budgetMonth / 30);
console.log(`Бюджет на день: ${budgetDay}`);

//Определение уровня дохода
if (budgetDay >= 1200) {
  console.log('У вас высокий уровень дохода');
} else if (budgetDay >= 600 && budgetDay < 1200) {
  console.log('У вас средний уровень дохода');
} else if (budgetDay >= 0 && budgetDay < 600) {
  console.log('К сожалению у вас уровень дохода ниже среднего');
} else {
  console.log('Что то пошло не так');
}