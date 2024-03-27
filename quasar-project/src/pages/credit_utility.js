
import { simu } from 'src/stores/store';
import { month_names,get_nb_mens_diff,getMonthNbr} from './date_utility';
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
const apply_events_chain=()=>{
  if(simu.value.events.length!=0)
  {
    var nb_mens_spent=0;
    var nb_mens_to_pay=0;
    simu.value.events=sortEvents(simu.value.events);
    for(var i = 0; i< simu.value.events.length;i++)
    {
      simu.value.events[i].amortEvt=[];
      if(i==0)//first event : capital left to pay based on int simu
      {
        nb_mens_spent=get_nb_mens_diff(Number(simu.value.credit.startingDate.slice(0,4)),Number(simu.value.credit.startingDate.slice(5,7)),simu.value.events[i].year,simu.value.events[i].month);
        nb_mens_to_pay=simu.value.credit.year*12-nb_mens_spent+simu.value.events[i].mensDiff;
        var j=0;
        while(j<simu.value.credit.amort.length && simu.value.credit.amort[j][0]!=(simu.value.events[i].month_str+'-'+simu.value.events[i].year_str))
        {
          simu.value.events[i].amortEvt.push(simu.value.credit.amort[j]);
          j++;
        }
        //extract total interests paid just before the modulation
        const interests_paid_before_mod=simu.value.credit.amort[j-1][2];
        var specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,simu.value.credit.amort[nb_mens_spent-1][1],nb_mens_to_pay,simu.value.events[i].new_mens);
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
        nb_mens_to_pay=simu.value.events[i-1].amortEvt.length-nb_mens_spent +simu.value.events[i].mensDiff;
        var j=0;
        while(j<simu.value.events[i-1].amortEvt.length && simu.value.events[i-1].amortEvt[j][0]!=(simu.value.events[i].month_str+'-'+simu.value.events[i].year_str))
        {
          simu.value.events[i].amortEvt.push(simu.value.events[i-1].amortEvt[j]);
          j++;
        }
        //extract total interests paid just before the modulation
        const interests_paid_before_mod=simu.value.events[i-1].amortEvt[j-1][2];
        var specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,simu.value.events[i-1].amortEvt[nb_mens_spent-1][1],nb_mens_to_pay,simu.value.events[i].new_mens);
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
    var endDate=event_.amortEvt[event_.amortEvt.length-1][0]
    var e_m=getMonthNbr(endDate.split('-')[0])+1;
    var e_y=Number(endDate.split('-')[1]);
    if(e_m==13)
    {
      e_y++;
      e_m=1;
    }
    return {end_year:e_y,end_month:e_m,capital_left:event_.amortEvt[index-1][1]};
  }
  else
  {
    var origin_end_year=origin_full_year+Number(simu.value.credit.year);
    var index=get_nb_mens_diff(origin_full_year,origin_start_month,evt_year_in_fmt,evt_month_in_fmt);
    return {end_year:origin_end_year,end_month:origin_start_month,capital_left:simu.value.credit.amort[index-1][1]};
  }
}
const provideModOptions=(evt_type_in,evt_year_in,evt_month_in)=>{
  var toreturn =[];
  var ret=returnBaseData(evt_year_in,evt_month_in);
  console.log(ret);
  var mensualities_to_end=0;
  mensualities_to_end=get_nb_mens_diff(evt_year_in,evt_month_in,ret.end_year,ret.end_month);
  if(mensualities_to_end>=0)
  {
    if(evt_type_in==optionsEvtType[1])//duree - mens +
    {
      for(let i=1;i<mensualities_to_end;i++)
      {
        toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end-i,simu.value.credit.rate,ret.capital_left)*100)/100).toString() +'€ (-'+i.toString()+' mois)');
      }
    }
    else if(evt_type_in==optionsEvtType[0])//duree+ mens -
    {
      for(let i=1;i<mensualities_to_end;i++)//max twince the duration
      {
        toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end+i,simu.value.credit.rate,ret.capital_left)*100)/100).toString() +'€ (+'+i.toString()+' mois)');
      }
    }
    return toreturn;
  }
  else
  {
    toreturn.push('Credit terminé à la date de l\'évènement');
  }

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
var optionsEvtType = [
  'Augmenter la durée - réduire la mensualité',
  'Réduire la durée - augmenter la mensualité',
];

const getLatestMensuality=function(){
  var latest_year=Number(simu.value.credit.startingDate.split('/')[0])+Number(simu.value.credit.year);
  var latest_month=Number(simu.value.credit.startingDate.split('/')[1]);
  var evt_latest_y=0;
  var evt_latest_m=0;
  if(simu.value.events.length!=0)
  {
    for(var i=0;i<simu.value.events.length;i++)
    {
      evt_latest_y=Number(simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][0].split('-')[1]);
      if(evt_latest_y>latest_year)
      {
        latest_year=evt_latest_y;
        evt_latest_m=Number(simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][0].split('-')[0]);
        if(evt_latest_m>latest_month)
        {
          latest_month=evt_latest_m;
        }
      }
    }
  }
  return {l_y:latest_year,l_m:latest_month};
}
export { computeMensuality, computeCredit_init,  sortEvents,provideModOptions,apply_events_chain,getChartXAxis,optionsEvtType,returnBaseData,getLatestMensuality};
