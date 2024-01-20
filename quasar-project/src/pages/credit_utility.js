import { Quasar, SessionStorage } from 'quasar';
import { useQuasar } from 'quasar';
const computeMensuality = () => {
  const y_nb = SessionStorage.getItem('years');
  const rate = SessionStorage.getItem('taeg');
  const amount = SessionStorage.getItem('amount');
  var monthly_rate = computeMonthly_rate(rate);
  var mensuality =computeMensuality_noSave(y_nb,rate,amount,monthly_rate);

  SessionStorage.set('monthly_rate', monthly_rate);
  SessionStorage.set('mensuality', mensuality);
  SessionStorage.set(
    'mensuality_str',
    'Mensuality : ' + (Math.round(mensuality * 100) / 100).toString()
  );
};
const computeMonthly_rate=(rate)=>{
  return (1 + rate / 100) ** (1 / 12) - 1;
}
const computeMensuality_noSave=(year_p,taeg_p,amount_p,monthly_rate_p=0)=>{
  var monthly_rate=0.0;
  if(monthly_rate_p==0 )
  {
    monthly_rate=computeMonthly_rate(taeg_p);
  }
  else
  {
    monthly_rate=monthly_rate_p;
  }
  return (amount_p * monthly_rate * (1 + monthly_rate) ** (year_p * 12)) /
  ((1 + monthly_rate) ** (year_p * 12) - 1);
}
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
  const starting_year=Number((SessionStorage.getItem('startingDate')).slice(0,4));
  const starting_month=Number((SessionStorage.getItem('startingDate')).slice(5,7));
  var currentYear = starting_year;
  var curentMonth = starting_month;
  var capital_to_pay = amount;
  var capital_paid = 0;
  var interests_to_pay = 0;
  var interests_paid = 0;
  var amort_monthly = [];
  var mensuality_count = 1;
  amort_monthly.push([month_names[curentMonth-1] + '-' + currentYear, amount, 0]);
  while (mensuality_count < y_nb * 12) {
    interests_to_pay = monthly_rate * capital_to_pay;
    interests_paid += interests_to_pay;
    capital_paid = mens - interests_to_pay;
    capital_to_pay -= capital_paid;
    curentMonth++;
    amort_monthly.push([
      month_names[curentMonth-1] + '-' + currentYear.toString(),
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
const provideYearOptions=(evt_type_in)=>{
  var origin_y =SessionStorage.getItem('years');
  var origin_full_date=Number(SessionStorage.getItem('startingDate').slice(0,4));
  var origin_end_date=origin_full_date+Number(origin_y);
  var toreturn=[];
  if(evt_type_in=='Augmenter la durée')
  {
    toreturn.push('1 an ('+(origin_end_date+1).toString()+')');
    for(let i=2;i<origin_y;i++)//multiply by two the length of credit maximum
    {
        toreturn.push(i.toString()+' ans ('+(origin_end_date+i).toString()+')');
    }
  }
  else if(evt_type_in=='Réduire la durée')
  {
    toreturn.push('1 an ('+(origin_end_date-1).toString()+')');
    for(let i=2;i<(origin_end_date-Number(new Date().getFullYear()));i++) //cannot decrease more than current year
    {
      toreturn.push(i.toString()+' ans ('+(origin_end_date-i).toString()+')');
    }
  }
  return toreturn;
};
const provideMensOptions=(evt_type_in)=>{
  var toreturn =[];
  var origin_y =SessionStorage.getItem('years');
  var taeg =SessionStorage.getItem('taeg');
  var amount=SessionStorage.getItem('amount');
  var origin_full_date=Number(SessionStorage.getItem('startingDate').slice(0,4));
  var origin_end_date=origin_full_date+Number(origin_y);
  if(evt_type_in=='Augmenter mensualité')
  {
    for(let i=1;i<(origin_end_date-Number(new Date().getFullYear()));i++)
    {
      toreturn.push((Math.round(computeMensuality_noSave((origin_y-i),taeg,amount)*100)/100).toString() +'(fin en '+(origin_end_date-i).toString()+')');
    }
  }
  else if(evt_type_in=='Réduire mensualité')
  {
    for(let i=1;i<origin_y;i++)//max twince the duration
    {
      toreturn.push((Math.round(computeMensuality_noSave((origin_y+i),taeg,amount)*100)/100).toString() +'(fin en '+(origin_end_date+i).toString())+')';
    }
  }
  return toreturn;
}
export { computeMensuality, computeCredit, month_names, sortEvents,provideYearOptions ,provideMensOptions};
