
import { simu ,bank} from 'src/stores/store';
import { get_nb_mens_diff, compareDates } from './date_utility';
import {getSortedAccountsFromPoorToHighRate,getSavingsEarlier,compute_savings, BANK_SIO_TYPE_OUT} from './bank_utility'
import {transStr,stringsIDs,transevtmetaType,transSIOspecial ,transMonthName,getMonthNbr} from '../stores/languages'
const EVT_META_TYPE_MOD =0;
const EVT_META_TYPE_REBUY=1;
const EVT_TYPE_MOD_MENS_UP=1;
const EVT_TYPE_MOD_MENS_DOWN=0;
const EVT_TYPE_REBUY_SAVINGS=0;
const EVT_TYPE_REBUY_CREDIT=1;

const computeMensuality = () => {
  simu.value.credit.mensuality=computeMensuality_noSave(simu.value.credit.duration_y,simu.value.credit.rate,simu.value.credit.amount);
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

const computeAmort=(starting_year,starting_month,amount,nb_mens,mens,rate_rebuy=0.0)=>{
  var currentYear = starting_year;
  var curentMonth = starting_month;
  var capital_to_pay = amount;
  var capital_paid = 0;
  var interests_to_pay = 0;
  var interests_paid = 0;
  var amort_monthly = [];
  var mensuality_count = 1;
  var monthly_rate=0.0;
  if(rate_rebuy==0)
  {
    monthly_rate=computeMonthly_rate(Number(simu.value.credit.rate));
  }
  else
  {
    monthly_rate=computeMonthly_rate(rate_rebuy);
  }
  while (mensuality_count < nb_mens) {
    interests_to_pay = Math.round((monthly_rate * capital_to_pay)*100)/100;
    interests_paid += interests_to_pay;
    capital_paid = mens - interests_to_pay;
    capital_to_pay -= capital_paid;

    amort_monthly.push([
      transMonthName(curentMonth-1) + '-' + currentYear.toString(),
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
    transMonthName(curentMonth-1) + '-' + currentYear.toString(),
      0,
      Math.round(interests_paid * 100) / 100,
    ]);
    console.log(amort_monthly[amort_monthly.length-1]);
  return [amort_monthly,interests_paid];
}

const computeCredit_init = () => {
  var ret=computeAmort(simu.value.credit.y,simu.value.credit.m,simu.value.credit.amount,simu.value.credit.duration_y*12,simu.value.credit.mensuality);
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

const hasBeenRebougthSavings=function(){
  if(simu.value.credit.has_been_rebougth)
  {
    return true;
  }
  return false;
}

const apply_events_chain=()=>{
  if(simu.value.events.length!=0)
  {
    var nb_mens_spent=0;
    var nb_mens_to_pay=0;
    simu.value.events=sortEvents(simu.value.events);
    for(var i = 0; i< simu.value.events.length;i++)
    {
      simu.value.events[i].amortEvt=[];
      if(simu.value.events[i].metaType==EVT_META_TYPE_MOD)
      {
        if(i==0)//first event : capital left to pay based on simu
        {
            nb_mens_spent=get_nb_mens_diff(simu.value.credit.y,simu.value.credit.m,simu.value.events[i].year,simu.value.events[i].month);
            nb_mens_to_pay=simu.value.credit.duration_y*12-nb_mens_spent+simu.value.events[i].mensDiff;
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
            nb_mens_spent=get_nb_mens_diff(simu.value.credit.y,simu.value.credit.m,simu.value.events[i].year,simu.value.events[i].month);
            nb_mens_to_pay=simu.value.events[i-1].amortEvt.length-nb_mens_spent +simu.value.events[i].mensDiff;
            var j=0;
            while(j<simu.value.events[i-1].amortEvt.length && simu.value.events[i-1].amortEvt[j][0]!=(simu.value.events[i].month_str+'-'+simu.value.events[i].year_str))
            {
              simu.value.events[i].amortEvt.push(simu.value.events[i-1].amortEvt[j]);
              j++;
            }
            //here we modulate after a potential rebuy at different rate : we must get the uptodate rate
            var up2date_rate=simu.value.credit.rate;
            for(var ind=i-1;ind>=0;ind--)
            {
              if(simu.value.events[ind].metaType==EVT_META_TYPE_REBUY && simu.value.events[ind].type==EVT_TYPE_REBUY_CREDIT)
              {
                up2date_rate=simu.value.events[ind].reloanRate;
                break;
              }
            }
            //extract total interests paid just before the modulation
            const interests_paid_before_mod=simu.value.events[i-1].amortEvt[j-1][2];
            var specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,simu.value.events[i-1].amortEvt[nb_mens_spent-1][1],nb_mens_to_pay,simu.value.events[i].new_mens,up2date_rate);
            var k=0;
            while(k<specific_amort[0].length)
            {
              simu.value.events[i].amortEvt.push(specific_amort[0][k]);
              simu.value.events[i].amortEvt[k+j][2]+=interests_paid_before_mod;
              k++;
            }
          }
      }
      //Rebuy with savings
      else if(simu.value.events[i].metaType==EVT_META_TYPE_REBUY  && simu.value.events[i].type==EVT_TYPE_REBUY_SAVINGS)
      {
        var toPay=0.0;
        //follow last event values until rebuy type
        var j=0;
        var interestsToLog=0.0;
        if(i==0)
        {
          while(j<simu.value.credit.amort.length && simu.value.credit.amort[j][0]!=(simu.value.events[i].month_str+'-'+simu.value.events[i].year_str))
          {
            simu.value.events[i].amortEvt.push(simu.value.credit.amort[j]);
            j++;
          }
          toPay=simu.value.credit.amort[j][1]*(1+simu.value.events[i].rebuyPenalties/100);
          interestsToLog=simu.value.credit.amort[j][2];
        }
        else
        {
          while(j<simu.value.events[i-1].amortEvt.length && simu.value.events[i-1].amortEvt[j][0]!=(simu.value.events[i].month_str+'-'+simu.value.events[i].year_str))
          {
            simu.value.events[i].amortEvt.push(simu.value.events[i-1].amortEvt[j]);
            j++;
          }
          toPay=simu.value.events[i-1].amortEvt[j][1]*(1+simu.value.events[i].rebuyPenalties/100);
          interestsToLog=simu.value.events[i-1].amortEvt[j][2];
        }
        //then update with zero to drop
        var monthToLog=transMonthName(getMonthNbr(simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][0].split('-')[0]));
        var yearToLog=simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][0].split('-')[1];
        simu.value.events[i].amortEvt.push([monthToLog+'-'+yearToLog,0.00,interestsToLog]);
        //substract amount to pay, on the less rentable account first
        //1 sort accounts
        var from_poor_to_high_rate=getSortedAccountsFromPoorToHighRate();
        //2 get the ammount of money on each account at event date
        var ret=getSavingsEarlier();
        var savErlyM=ret[0];
        var savErlyY=ret[1];
        compute_savings(savErlyY,savErlyM,get_nb_mens_diff(savErlyY,savErlyM,simu.value.events[i].year,simu.value.events[i].month),true);
        //3 substract desired amount on each account
        var indexAccount=0;
        while(toPay>0)
        {//if there is enough money on the account, the pick all on this acocunt
          var indexAtDate=bank.value.accounts[from_poor_to_high_rate[indexAccount]].computedOverTime.length-1;
          var amountOnaccountAtDate=bank.value.accounts[from_poor_to_high_rate[indexAccount]].computedOverTime[indexAtDate].amount;
          if(amountOnaccountAtDate>toPay)
          {
            bank.value.accounts[from_poor_to_high_rate[indexAccount]].single_in_out.push({account :from_poor_to_high_rate[indexAccount], title:transSIOspecial(),type:BANK_SIO_TYPE_OUT,amount:Math.round(100*toPay)/100,date:simu.value.events[i].year_str+'/'+simu.value.events[i].month_str,month:simu.value.events[i].month,year:simu.value.events[i].year,rate:0.0});
            toPay=0;
          }
          else
          {
            //else empty it
            bank.value.accounts[from_poor_to_high_rate[indexAccount]].single_in_out.push({account :from_poor_to_high_rate[indexAccount], title:transSIOspecial(),type:BANK_SIO_TYPE_OUT,amount:Math.round(100*amountOnaccountAtDate)/100,date:simu.value.events[i].year_str+'/'+simu.value.events[i].month_str,month:simu.value.events[i].month,year:simu.value.events[i].year,rate:0.0});
            toPay-=amountOnaccountAtDate;
          }
          indexAccount++;
        }
      }
      //Rebuy with credit
      else if(simu.value.events[i].metaType==EVT_META_TYPE_REBUY && simu.value.events[i].type==EVT_TYPE_REBUY_CREDIT)
      {
        var interests_paid_before_mod=0;
        var specific_amort=[];
        //follow last event values until rebuy type
        var j=0;
        if(i==0)
        {
          while(j<simu.value.credit.amort.length && simu.value.credit.amort[j][0]!=(simu.value.events[i].month_str+'-'+simu.value.events[i].year_str))
          {
            simu.value.events[i].amortEvt.push(simu.value.credit.amort[j]);
            j++;
          }
          interests_paid_before_mod=simu.value.credit.amort[j-1][2];
          toPay=simu.value.credit.amort[j-1][1]*(1+simu.value.events[i].rebuyPenalties/100);
          simu.value.events[i].new_mens=computeMensuality_noSave(simu.value.events[i].reloanDuration,simu.value.events[i].reloanRate,toPay);
          specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,toPay,simu.value.events[i].reloanDuration*12,simu.value.events[i].new_mens,simu.value.events[i].reloanRate);
        }
        else
        {
          while(j<simu.value.events[i-1].amortEvt.length && simu.value.events[i-1].amortEvt[j][0]!=(simu.value.events[i].month_str+'-'+simu.value.events[i].year_str))
          {
            simu.value.events[i].amortEvt.push(simu.value.events[i-1].amortEvt[j]);
            j++;
          }
          interests_paid_before_mod=simu.value.events[i-1].amortEvt[j-1][2];
          toPay=simu.value.events[i-1].amortEvt[j-1][1]*(1+simu.value.events[i].rebuyPenalties/100);
          simu.value.events[i].new_mens=computeMensuality_noSave(simu.value.events[i].reloanDuration,simu.value.events[i].reloanRate,toPay);
          specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,toPay,simu.value.events[i].reloanDuration*12,simu.value.events[i].new_mens,simu.value.events[i].reloanRate);
        }
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
  if(simu.value.events.length!=0)
  {
    //retreive and sort events
    simu.value.events=sortEvents(simu.value.events);
    var event_=simu.value.events[simu.value.events.length-1];
    //get the capital left to pay at date
    var index=get_nb_mens_diff(simu.value.credit.y,simu.value.credit.m,evt_year_in_fmt,evt_month_in_fmt);
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
    var origin_end_year=simu.value.credit.y+Number(simu.value.credit.duration_y);
    var index=get_nb_mens_diff(simu.value.credit.y,simu.value.credit.m,evt_year_in_fmt,evt_month_in_fmt);
    if(index<=simu.value.credit.amort.length)
    {
      return {end_year:origin_end_year,end_month:simu.value.credit.m,capital_left:simu.value.credit.amort[index-1][1]};
    }
    else
    {
      return {end_year:origin_end_year,end_month:simu.value.credit.m,capital_left:0};
    }
  }
}
const provideModOptions=(evt_type_in,evt_year_in,evt_month_in)=>{
  var toreturn =[];
  var ret=returnBaseData(evt_year_in,evt_month_in);
  var up2date_rate=simu.value.credit.rate;
  var mensualities_to_end=0;
  mensualities_to_end=get_nb_mens_diff(evt_year_in,evt_month_in,ret.end_year,ret.end_month);
  //get the up to date rate
  if(simu.value.events.length!=0)
  {
    for(var j=simu.value.events.length-1;j>=0;j--)
    {
      if(simu.value.events[j].metaType==EVT_META_TYPE_REBUY && simu.value.events[j].type==EVT_TYPE_REBUY_CREDIT)
      {
        up2date_rate=simu.value.events[j].reloanRate;
        break;
      }
    }
  }
  if(mensualities_to_end>=0)
  {
    if(evt_type_in==EVT_TYPE_MOD_MENS_UP)//duree - mens +
    {
      for(let i=1;i<mensualities_to_end;i++)
      {
        toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end-i,up2date_rate,ret.capital_left)*100)/100).toString() +'€ (-'+i.toString()+' mois)');
      }
      if(mensualities_to_end==1)
      {
        toreturn.push(transStr(stringsIDs.str_mod_impossible));
      }
    }
    else if(evt_type_in==EVT_TYPE_MOD_MENS_DOWN)//duree+ mens -
    {
      for(let i=1;i<simu.value.credit.duration_y*12;i++)//max twince the duration
      {
        toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end+i,up2date_rate,ret.capital_left)*100)/100).toString() +'€ (+'+i.toString()+' mois)');
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



const getLatestMensuality=function(){
  var latest_year=simu.value.credit.y+simu.value.credit.duration_y;
  var latest_month=simu.value.credit.m;
  if(simu.value.events.length!=0)
  {
    for(var i=simu.value.events.length-1;i>=0;i--)
    {
      if(!(simu.value.events[i].metaType==EVT_META_TYPE_REBUY && simu.value.events[i].type==EVT_TYPE_REBUY_SAVINGS))//not a rebuy with savings
      {
        var index =simu.value.events[i].amortEvt.length-1;
        if(compareDates(Number(simu.value.events[i].amortEvt[index][0].split('-')[1]),(simu.value.events[i].amortEvt[index][0].split('-')[0]),latest_year,latest_month)>0)
        {
          latest_year=Number(simu.value.events[i].amortEvt[index][0].split('-')[1]);
          latest_month=getMonthNbr(simu.value.events[i].amortEvt[index][0].split('-')[0]);
        }
      }

    }
  }
  return {l_y:latest_year,l_m:latest_month};
}

const getEarliestNewEventDate=function(){
  if(simu.value.events.length==0)
  {
    return {l_y:simu.value.credit.y,l_m:simu.value.credit.m};
  }
  else
  {
    return {l_y:simu.value.events[simu.value.events.length-1].year,l_m:simu.value.events[simu.value.events.length-1].month};
  }
}
const getModulationNbr=function()
{
  var count=0;
  if(simu.value.events.length!=0)
  {
    for(var i =0;i<simu.value.events.length;i++)
    {
      if(simu.value.events[i].metaType==EVT_META_TYPE_MOD)
      {
        count++;
      }
    }
  }
  return count;
}
  const getRebuyNbr=function()
{
  var count=0;
  if(simu.value.events.length!=0)
  {
    for(var i =0;i<simu.value.events.length;i++)
    {
      if(simu.value.events[i].metaType==EVT_META_TYPE_REBUY)
      {
        count++;
      }
    }
  }
  return count;
}
const build_event_name=function(metaType)
{
  if(metaType==EVT_META_TYPE_MOD)
  {
    return transevtmetaType(EVT_META_TYPE_MOD)+' '+String(getModulationNbr()+1);
  }
  else
  {
    return transevtmetaType(EVT_META_TYPE_REBUY)+' '+String(getRebuyNbr()+1);
  }
}
export { computeMensuality, computeCredit_init, getEarliestNewEventDate, sortEvents,provideModOptions,apply_events_chain,getChartXAxis,
  returnBaseData,getLatestMensuality,hasBeenRebougthSavings,build_event_name,
  EVT_META_TYPE_MOD, EVT_META_TYPE_REBUY, EVT_TYPE_MOD_MENS_UP, EVT_TYPE_MOD_MENS_DOWN, EVT_TYPE_REBUY_CREDIT, EVT_TYPE_REBUY_SAVINGS};
