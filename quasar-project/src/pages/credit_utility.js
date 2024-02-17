
import { simu } from 'src/stores/store';
const computeMensuality = () => {
  simu.value.credit.mensuality=computeMensuality_noSave(simu.value.credit.year,simu.value.credit.rate,simu.value.credit.amount);
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
  var monthly_rate=computeMonthly_rate(Number(simu.value.credit.rate));
  while (mensuality_count < nb_mens) {
    interests_to_pay = Math.round((monthly_rate * capital_to_pay)*100)/100;
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
  interests_to_pay = mens - capital_to_pay;
  interests_paid += interests_to_pay;
  amort_monthly.push([
      month_names[curentMonth-1] + '-' + currentYear.toString(),
      0,
      Math.round(interests_paid * 100) / 100,
    ]);
    console.log(amort_monthly[amort_monthly.length-1]);
  return [amort_monthly,interests_paid];
}

const computeCredit_init = () => {

  const starting_year=Number(simu.value.credit.startingDate.slice(0,4));
  const starting_month=Number(simu.value.credit.startingDate.slice(5,7));
  var ret=computeAmort(starting_year,starting_month,simu.value.credit.amount,simu.value.credit.year*12,simu.value.credit.mensuality);
  simu.value.credit.amort= ret[0];
  simu.value.credit.total_cost=Math.round(ret[1]*100)/100;
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
  if(simu.value.events.length!=0)
  {
    var mens=0;
    var nb_mens_spent=0;
    var nb_mens_to_pay=0;
    simu.value.events=sortEvents(simu.value.events);
    for(var i = 0; i< simu.value.events.length;i++)
    {
      simu.value.events[i].amortEvt=[];
      if(i==0)//first event : capital left to pay based on int simu
      {
        nb_mens_spent=get_nb_mens_diff(Number(simu.value.credit.startingDate.slice(0,4)),Number(simu.value.credit.startingDate.slice(5,7)),simu.value.events[i].year,simu.value.events[i].month);
        nb_mens_to_pay=get_nb_mens_diff(simu.value.events[i].year,simu.value.events[i].month,simu.value.events[i].end_year,simu.value.events[i].end_month);
        if(simu.value.events[i].type=='Augmenter mensualité' || simu.value.events[i].type=='Réduire mensualité')
        {
          mens=simu.value.events[i].new_mens;
        }
        else
        {
          mens=computeMensuality_noSave_Months(nb_mens_to_pay,simu.value.credit.rate,simu.value.credit.amort[nb_mens_spent-1][1]);
          simu.value.events[i].new_mens=mens;
        }
        var j=0;
        while(j<simu.value.credit.amort.length && simu.value.credit.amort[j][0]!=(simu.value.events[i].month_str+'-'+simu.value.events[i].year_str))
        {
          simu.value.events[i].amortEvt.push(simu.value.credit.amort[j]);
          j++;
        }
        //extract total interests paid just before the modulation
        const interests_paid_before_mod=simu.value.credit.amort[j-1][2];
        var specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,simu.value.credit.amort[nb_mens_spent-1][1],nb_mens_to_pay,mens);
        var k=0;
        while(k<specific_amort[0].length)
        {
          simu.value.events[i].amortEvt.push(specific_amort[0][k]);
          simu.value.events[i].amortEvt[k+j][2]+=interests_paid_before_mod;
          k++;
        }
      }
      else//capital left to pay based on previous event
      {
        nb_mens_spent=get_nb_mens_diff(Number(simu.value.credit.startingDate.slice(0,4)),Number(simu.value.credit.startingDate.slice(5,7)),simu.value.events[i].year,simu.value.events[i].month);
        nb_mens_to_pay=get_nb_mens_diff(simu.value.events[i].year,simu.value.events[i].month,simu.value.events[i].end_year,simu.value.events[i].end_month);
        if(simu.value.events[i].type=='Augmenter mensualité' || simu.value.events[i].type=='Réduire mensualité')
        {
          mens=simu.value.events[i].new_mens;
        }
        else
        {
          mens=computeMensuality_noSave_Months(nb_mens_to_pay,simu.value.credit.rate,simu.value.events[i-1].amortEvt[nb_mens_spent-1][1]);
          simu.value.events[i].new_mens=mens;
        }
        var j=0;
        while(j<simu.value.events[i-1].amortEvt.length && simu.value.events[i-1].amortEvt[j][0]!=(simu.value.events[i].month_str+'-'+simu.value.events[i].year_str))
        {
          simu.value.events[i].amortEvt.push(simu.value.events[i-1].amortEvt[j]);
          j++;
        }
        //extract total interests paid just before the modulation
        const interests_paid_before_mod=simu.value.events[i-1].amortEvt[j-1][2];
        var specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,simu.value.events[i-1].amortEvt[nb_mens_spent-1][1],nb_mens_to_pay,mens);
        var k=0;
        while(k<specific_amort[0].length)
        {
          simu.value.events[i].amortEvt.push(specific_amort[0][k]);
          simu.value.events[i].amortEvt[k+j][2]+=interests_paid_before_mod;
          k++;
        }
      }
    }
  }
}
const provideYearOptions=(evt_type_in,evt_year_in)=>{
  var origin_y =simu.value.credit.year;
  if(simu.value.events.length==0)
  {
    var origin_full_date=Number(simu.value.credit.startingDate.slice(0,4));
    var origin_end_date=origin_full_date+Number(origin_y);
  }
  else
  {
    var origin_end_date=simu.value.events[simu.value.events.length-1].end_year;

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
    for(let i=2;i<(origin_end_date-evt_year_in);i++) //cannot decrease more than current event year
    {
      toreturn.push(i.toString()+' ans ('+(origin_end_date-i).toString()+')');
    }
  }
  return toreturn;
};
//returns the last event end date and amort at input date if events were saved
//or the origin end date and amort at the input date if no events were saved
const returnBaseData=(evt_year_in_fmt,evt_month_in_fmt)=>{
  var origin_full_year=Number(simu.value.credit.startingDate.slice(0,4));
  var origin_start_month=Number(simu.value.credit.startingDate.slice(5,7));//load for an integer number of year : start month=end_month
  if(simu.value.events.length!=0)
  {
    //retreive and sort events
    simu.value.events=sortEvents(simu.value.events);
    var event_=simu.value.events[simu.value.events.length-1];
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
    var origin_end_year=origin_full_year+Number(simu.value.credit.year);
    var index=get_nb_mens_diff(origin_full_year,origin_start_month,evt_year_in_fmt,evt_month_in_fmt);
    return {end_year:origin_end_year,end_month:origin_start_month,capital_left:simu.value.credit.amort[index-1][1]};
  }
}
const provideMensOptions=(evt_type_in,evt_year_in,evt_month_in)=>{
  var toreturn =[];
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
      toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end,simu.value.credit.rate,ret.capital_left)*100)/100).toString() +' ('+(ret.end_year-i).toString()+')');
    }
  }
  else if(evt_type_in=='Réduire mensualité')
  {
    for(let i=1;i<simu.value.credit.year;i++)//max twince the duration
    {
      mensualities_to_end=get_nb_mens_diff(evt_year_in,evt_month_in,ret.end_year+i,ret.end_month);
      console.log(mensualities_to_end);
      toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end,simu.value.credit.rate,ret.capital_left)*100)/100).toString() +' ('+(ret.end_year+i).toString()+')');
    }
  }
  return toreturn;
}
const getChartXAxis=()=>{
  if(simu.value.events.length!=0)
  {
    //find longest event
    var current=0;
    var latest=0;
    var max=0;
    for(var i=0;i<simu.value.events.length;i++)
    {
      current=simu.value.events[i].amortEvt.length;
      if(current>latest)
      {
        latest=current;
        max=i;
      }
    }
    if(latest<simu.value.credit.amort.length)
    {
      return simu.value.credit.amort;
    }
    else
    {
      return simu.value.events[max].amortEvt;
    }
  }
  else
  {
    return simu.value.credit.amort;
  }
}
export { computeMensuality, computeCredit_init, month_names, sortEvents,provideYearOptions ,provideMensOptions,apply_events_chain,getMonthNbr,getChartXAxis};
