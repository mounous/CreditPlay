import { Quasar, SessionStorage } from 'quasar';
import { useQuasar } from 'quasar';
const computeMensuality = () => {
  //const $q = useQuasar();
  const y_nb = SessionStorage.getItem('years');
  const rate = SessionStorage.getItem('taeg');
  const amount = SessionStorage.getItem('amount');
  var monthly_rate = (1 + rate / 100) ** (1 / 12) - 1;

  var mensuality =
    (amount * monthly_rate * (1 + monthly_rate) ** (y_nb * 12)) /
    ((1 + monthly_rate) ** (y_nb * 12) - 1);
  SessionStorage.set('monthly_rate', monthly_rate);
  SessionStorage.set('mensuality', mensuality);
  SessionStorage.set(
    'mensuality_str',
    'Mensuality : ' + (Math.round(mensuality * 100) / 100).toString()
  );
};
const month_names = [
  'Janv',
  'Fevr',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Aout',
  'Septembre',
  'Octobre',
  'Novembre',
  'Decembre',
];
const computeCredit = () => {
  const y_nb = SessionStorage.getItem('years');
  const amount = SessionStorage.getItem('amount');
  const mens = SessionStorage.getItem('mensuality');
  const monthly_rate = SessionStorage.getItem('monthly_rate');
  var currentYear = new Date().getFullYear();
  var curentMonth = new Date().getMonth();
  var capital_to_pay = amount;
  var capital_paid = 0;
  var interests_to_pay = 0;
  var interests_paid = 0;
  var amort_monthly = [];
  var mensuality_count = 1;
  amort_monthly.push([month_names[curentMonth] + '-' + currentYear, amount, 0]);
  while (mensuality_count < y_nb * 12) {
    interests_to_pay = monthly_rate * capital_to_pay;
    interests_paid += interests_to_pay;
    capital_paid = mens - interests_to_pay;
    capital_to_pay -= capital_paid;
    curentMonth++;
    amort_monthly.push([
      month_names[curentMonth] + '-' + currentYear.toString(),
      Math.round(capital_to_pay * 100) / 100,
      Math.round(interests_paid * 100) / 100,
    ]);
    if (mensuality_count % 12 == 0) {
      currentYear++; //next year
      curentMonth = 0; //return to january next year
    }
    mensuality_count++;
  }
  SessionStorage.set('amort_monthly', amort_monthly);
  SessionStorage.set('total_cost_init',Math.round(interests_paid*100)/100);
};
const sortEvents = (events_in) => {
  function comp(a, b) {
    if (a.year < b.year) {
      return -1;
    }
    if (a.year > b.year) {
      return 1;
    }
    return 0;
  }
  events_in.sort(comp);
  return events_in;
};
export { computeMensuality, computeCredit, month_names, sortEvents };
