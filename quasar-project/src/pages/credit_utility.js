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

const computeMensuality_noSave_Months=(nb_mens,taeg_p,amount_p,monthly_rate_p=0)=>{
  var monthly_rate=0.0;
  if(monthly_rate_p==0 )
  {
    monthly_rate=computeMonthly_rate(taeg_p);
  }
  else
  {
    monthly_rate=monthly_rate_p;
  }
  return (amount_p * monthly_rate * (1 + monthly_rate) ** (nb_mens)) /
  ((1 + monthly_rate) ** (nb_mens) - 1);
}
const computeMensuality_noSave=(year_p,taeg_p,amount_p,monthly_rate_p=0)=>{
  return computeMensuality_noSave_Months(year_p*12,taeg_p,amount_p,monthly_rate_p);
}
const month_names = [
  'Janvier',
  'Fevrier',
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
const getMonthNbr=(evt_month_in)=>{
  var count=1;
  while(count<month_names.length)
  {
    if(evt_month_in==month_names[count-1])
    {
      return count;
    }
    count++;
  }
}

const computeAmort=(starting_year,starting_month,amount,nb_mens,monthly_rate,mens)=>{
  var currentYear = starting_year;
  var curentMonth = starting_month;
  var capital_to_pay = amount;
  var capital_paid = 0;
  var interests_to_pay = 0;
  var interests_paid = 0;
  var amort_monthly = [];
  var mensuality_count = 1;
  //amort_monthly.push([month_names[curentMonth-1] + '-' + currentYear, amount, 0]);//start situation
  curentMonth++;
  console.log(amort_monthly[amort_monthly.length-1]);
  while (mensuality_count <= nb_mens) {
    interests_to_pay = monthly_rate * capital_to_pay;
    interests_paid += interests_to_pay;
    capital_paid = mens - interests_to_pay;
    capital_to_pay -= capital_paid;

    amort_monthly.push([
      month_names[curentMonth-1] + '-' + currentYear.toString(),
      Math.round(capital_to_pay * 100) / 100,
      Math.round(interests_paid * 100) / 100,
    ]);
    console.log(amort_monthly[amort_monthly.length-1]);
    mensuality_count++;
    curentMonth++;
    if (curentMonth % 13 == 0) {
      currentYear++; //next year
      curentMonth = 1; //return to january next year
    }
  }
  return [amort_monthly,interests_paid];
}

const computeCredit_init = () => {
  const y_nb = SessionStorage.getItem('years');
  const amount = SessionStorage.getItem('amount');
  const mens = SessionStorage.getItem('mensuality');
  const monthly_rate = SessionStorage.getItem('monthly_rate');
  const starting_year=Number((SessionStorage.getItem('startingDate')).slice(0,4));
  const starting_month=Number((SessionStorage.getItem('startingDate')).slice(5,7));
  var ret=computeAmort(starting_year,starting_month,amount,y_nb*12,monthly_rate,mens);
  SessionStorage.set('amort_monthly', ret[0]);
  SessionStorage.set('total_cost_init',Math.round(ret[1]*100)/100);
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
const get_nb_mens_diff=(start_y,start_m,cur_y,cur_m)=>{
  if(start_y>cur_y)
  {
    console.log('start_y>cur_y');
    return 0;
  }
  if(start_y==cur_y)
  {
    if(start_m>cur_m)
    {
      console.log('start_y==cur_y and start_m>cur_m');
      return 0;
    }
    return cur_m-start_m;
  }
  else
  {
    var count=12-start_m;
    count+=12*(cur_y-(start_y+1));
    count+=cur_m;
    return count;
  }
}
const apply_events_chain=()=>{
  if(SessionStorage.has('events'))
  {
    var mens=0;
    var amort_init=SessionStorage.getItem('amort_monthly');
    var taeg = SessionStorage.getItem('taeg');
    var monthly_rate=SessionStorage.getItem('monthly_rate');
    var nb_mens_spent=0;
    var nb_mens_to_pay=0;
    var events=sortEvents(SessionStorage.getItem('events'));
    for(var i = 0; i< events.length;i++)
    {
      if(i==0)//first event : capital left to pay based on int simu
      {
        nb_mens_spent=get_nb_mens_diff(Number(SessionStorage.getItem('startingDate').slice(0,4)),Number(SessionStorage.getItem('startingDate').slice(5,7)),events[i].year,events[i].month);
        nb_mens_to_pay=get_nb_mens_diff(events[i].year,events[i].month,events[i].end_year,events[i].end_month);
        if(events[i].type=='Augmenter mensualité' || events[i].type=='Réduire mensualité')
        {
          mens=events[i].new_mens;
        }
        else
        {
          mens=computeMensuality_noSave_Months(nb_mens_to_pay,taeg,amort_init[nb_mens_spent][1],monthly_rate);
        }
        var j=0;
        while(j<amort_init.length && amort_init[j][0]!=(events[i].month_str+'-'+events[i].year_str))
        {
          events[i].amortEvt.push(amort_init[j]);
          j++;
        }
        //extract total interests paid just before the modulation
        const interests_paid_before_mod=amort_init[j-1][2];
        var specific_amort=computeAmort(events[i].year,events[i].month,amort_init[nb_mens_spent][1],nb_mens_to_pay,monthly_rate,mens);
        var k=0;//do not consider init
        while(k<specific_amort[0].length-1)
        {
          events[i].amortEvt.push(specific_amort[0][k]);
          events[i].amortEvt[k+j][2]+=interests_paid_before_mod;
          k++;
        }
      }
      else//capital left to pay based on previous event
      {
          console.log('TOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
      }
    }
    SessionStorage.set('events',events);
  }
}
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
//returns the last event end date and amort at input date if events were saved
//or the origin end date and amort at the input date if no events were saved
const returnBaseData=(evt_year_in_fmt,evt_month_in_fmt)=>{
  if(SessionStorage.has('events'))
  {
    //retreive and sort events
    events=sortEvents(SessionStorage.getItem('events'));
    event_=events[events.length-1];
    //get the capital left to pay at date
    var index=get_nb_mens_diff(event_.year,event_.month,evt_year_in_fmt,evt_month_in_fmt);
    if(index==0)
    {
      return {end_year:0,end_month:0,capital_left:0};
    }
    return {end_year:event_.end_year,end_month:event_.end_month,capital_left:amortEvt[index][1]};
  }
  else
  {
    var origin_y =SessionStorage.getItem('years');
    var amort_init=SessionStorage.getItem('amort_monthly');
    var origin_full_year=Number(SessionStorage.getItem('startingDate').slice(0,4));
    var origin_start_month=Number(SessionStorage.getItem('startingDate').slice(5,7));//load for an integer number of year : start month=end_month
    var origin_end_year=origin_full_year+Number(origin_y);
    var index=get_nb_mens_diff(origin_full_year,origin_start_month,evt_year_in_fmt,evt_month_in_fmt);
    return {end_year:origin_end_year,end_month:origin_start_month,capital_left:amort_init[index][1]};
  }
}
const provideMensOptions=(evt_type_in,evt_year_in,evt_month_in)=>{
  var toreturn =[];
  var origin_y =SessionStorage.getItem('years');
  var taeg =SessionStorage.getItem('taeg');
  var ret=returnBaseData(evt_year_in,evt_month_in);
  console.log(ret);
  var mensualities_to_end=0;
  if(evt_type_in=='Augmenter mensualité')
  {
    for(let i=1;i<(ret.end_year-evt_year_in);i++)
    {
      //compute mensualities left
      mensualities_to_end=get_nb_mens_diff(evt_year_in,evt_month_in,ret.end_year-i,ret.end_month);
      console.log(mensualities_to_end);
      toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end,taeg,ret.capital_left)*100)/100).toString() +' ('+(ret.end_year-i).toString()+')');
    }
  }
  else if(evt_type_in=='Réduire mensualité')
  {
    for(let i=1;i<origin_y;i++)//max twince the duration
    {
      mensualities_to_end=get_nb_mens_diff(evt_year_in,evt_month_in,ret.end_year+i,ret.end_month);
      console.log(mensualities_to_end);
      toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end,taeg,ret.capital_left)*100)/100).toString() +' ('+(ret.end_year+i).toString())+')';
    }
  }
  return toreturn;
}
export { computeMensuality, computeCredit_init, month_names, sortEvents,provideYearOptions ,provideMensOptions,apply_events_chain,getMonthNbr};
