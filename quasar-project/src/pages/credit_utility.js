import { SessionStorage } from 'quasar';

const computeMensuality = () => {
  const y_nb = SessionStorage.getItem('years');
  const rate = SessionStorage.getItem('taeg');
  const amount = SessionStorage.getItem('amount');
  var mensuality =computeMensuality_noSave(y_nb,rate,amount);
  SessionStorage.set('mensuality', mensuality);

};
const computeMonthly_rate=(rate)=>{
  return rate/(100.00*12.00);
}
//https://www.angelotti.fr/infos-pratiques/blog/comment-calculer-les-mensualites-d-un-pret-immobilier
const computeMensuality_noSave_Months=(nb_mens,taeg_p,amount_p)=>{
  taeg_p=taeg_p/100.00;
  var mensuality= ((amount_p * taeg_p)/12)/(1-(1+(taeg_p/12))**(-nb_mens));
  return Math.round(mensuality * 100) / 100;
}
const computeMensuality_noSave=(year_p,taeg_p,amount_p)=>{
  return computeMensuality_noSave_Months(year_p*12,taeg_p,amount_p);
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

const computeAmort=(starting_year,starting_month,amount,nb_mens,mens)=>{
  var currentYear = starting_year;
  var curentMonth = starting_month;
  var capital_to_pay = amount;
  var capital_paid = 0;
  var interests_to_pay = 0;
  var interests_paid = 0;
  var amort_monthly = [];
  var mensuality_count = 1;
  console.log(amort_monthly[amort_monthly.length-1]);
  var monthly_rate=computeMonthly_rate(Number(SessionStorage.getItem('taeg')));
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
  const starting_year=Number((SessionStorage.getItem('startingDate')).slice(0,4));
  const starting_month=Number((SessionStorage.getItem('startingDate')).slice(5,7));
  var ret=computeAmort(starting_year,starting_month,amount,y_nb*12,mens);
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
    var nb_mens_spent=0;
    var nb_mens_to_pay=0;
    var events=sortEvents(SessionStorage.getItem('events'));
    for(var i = 0; i< events.length;i++)
    {
      events[i].amortEvt=[];
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
          mens=computeMensuality_noSave_Months(nb_mens_to_pay,taeg,amort_init[nb_mens_spent][1]);
          events[i].new_mens=mens;
        }
        var j=0;
        while(j<amort_init.length && amort_init[j][0]!=(events[i].month_str+'-'+events[i].year_str))
        {
          events[i].amortEvt.push(amort_init[j]);
          j++;
        }
        //extract total interests paid just before the modulation
        const interests_paid_before_mod=amort_init[j-1][2];
        var specific_amort=computeAmort(events[i].year,events[i].month,amort_init[nb_mens_spent-1][1],nb_mens_to_pay,mens);
        var k=0;
        while(k<specific_amort[0].length-1)
        {
          events[i].amortEvt.push(specific_amort[0][k]);
          events[i].amortEvt[k+j][2]+=interests_paid_before_mod;
          k++;
        }
      }
      else//capital left to pay based on previous event
      {
        nb_mens_spent=get_nb_mens_diff(Number(SessionStorage.getItem('startingDate').slice(0,4)),Number(SessionStorage.getItem('startingDate').slice(5,7)),events[i].year,events[i].month);
        nb_mens_to_pay=get_nb_mens_diff(events[i].year,events[i].month,events[i].end_year,events[i].end_month);
        if(events[i].type=='Augmenter mensualité' || events[i].type=='Réduire mensualité')
        {
          mens=events[i].new_mens;
        }
        else
        {
          mens=computeMensuality_noSave_Months(nb_mens_to_pay,taeg,events[i-1].amortEvt[nb_mens_spent][1]);
          events[i].new_mens=mens;
        }
        var j=0;
        while(j<events[i-1].amortEvt.length && events[i-1].amortEvt[j][0]!=(events[i].month_str+'-'+events[i].year_str))
        {
          events[i].amortEvt.push(events[i-1].amortEvt[j]);
          j++;
        }
        //extract total interests paid just before the modulation
        const interests_paid_before_mod=events[i-1].amortEvt[j-1][2];
        var specific_amort=computeAmort(events[i].year,events[i].month,events[i-1].amortEvt[nb_mens_spent-1][1],nb_mens_to_pay,mens);
        var k=0;
        while(k<specific_amort[0].length-1)
        {
          events[i].amortEvt.push(specific_amort[0][k]);
          events[i].amortEvt[k+j][2]+=interests_paid_before_mod;
          k++;
        }
      }
    }
    SessionStorage.set('events',events);
  }
}
const provideYearOptions=(evt_type_in)=>{
  var origin_y =SessionStorage.getItem('years');
  if(!SessionStorage.has('events'))
  {
    var origin_full_date=Number(SessionStorage.getItem('startingDate').slice(0,4));
    var origin_end_date=origin_full_date+Number(origin_y);
  }
  else
  {
    var events=SessionStorage.getItem('events');
    var origin_end_date=events[events.length-1].end_year;

  }
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
  var origin_full_year=Number(SessionStorage.getItem('startingDate').slice(0,4));
  var origin_start_month=Number(SessionStorage.getItem('startingDate').slice(5,7));//load for an integer number of year : start month=end_month
  if(SessionStorage.has('events'))
  {
    //retreive and sort events
    var events=sortEvents(SessionStorage.getItem('events'));
    var event_=events[events.length-1];
    //get the capital left to pay at date
    var index=get_nb_mens_diff(origin_full_year,origin_start_month,evt_year_in_fmt,evt_month_in_fmt);
    if(index==0)
    {
      return {end_year:0,end_month:0,capital_left:0};
    }
    return {end_year:event_.end_year,end_month:event_.end_month,capital_left:event_.amortEvt[index-1][1]};
  }
  else
  {
    var origin_y =SessionStorage.getItem('years');
    var amort_init=SessionStorage.getItem('amort_monthly');
    var origin_end_year=origin_full_year+Number(origin_y);
    var index=get_nb_mens_diff(origin_full_year,origin_start_month,evt_year_in_fmt,evt_month_in_fmt);
    return {end_year:origin_end_year,end_month:origin_start_month,capital_left:amort_init[index-1][1]};
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
      toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end,taeg,ret.capital_left)*100)/100).toString() +' ('+(ret.end_year+i).toString()+')');
    }
  }
  return toreturn;
}
const getChartXAxis=()=>{
  var amort_monthly=SessionStorage.getItem('amort_monthly');
  if(SessionStorage.has('events'))
  {
    var events=SessionStorage.getItem('events')
    //find longest event
    var current=0;
    var latest=0;
    var max=0;
    for(var i=0;i<events.length;i++)
    {
      current=events[i].amortEvt.length;
      if(current>latest)
      {
        latest=current;
        max=i;
      }
    }
    if(latest<amort_monthly.length)
    {
      return amort_monthly;
    }
    else
    {
      return events[max].amortEvt;
    }
  }
  else
  {
    return amort_monthly;
  }
}
export { computeMensuality, computeCredit_init, month_names, sortEvents,provideYearOptions ,provideMensOptions,apply_events_chain,getMonthNbr,getChartXAxis};
