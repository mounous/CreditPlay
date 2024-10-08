
import { bank, simu, startFormFilled } from 'src/stores/store';
import { get_nb_mens_diff, compareDates } from './date_utility';
import {getSortedAccountsFromPoorToHighRate,getSavingsEarlier,compute_savings, BANK_SIO_TYPE_OUT} from './bank_utility'
import {transStr,stringsIDs,transevtmetaType,transSIOspecial ,transMonthName,getMonthNbr,is_sio_special_name} from '../stores/languages'
import {getCurrencySymbol} from '../stores/currencies'
import { ref } from 'vue';
const EVT_META_TYPE_MOD =0;
const EVT_META_TYPE_REBUY=1;
const EVT_TYPE_MOD_MENS_UP=1;
const EVT_TYPE_MOD_MENS_DOWN=0;
const EVT_TYPE_REBUY_SAVINGS=0;
const EVT_TYPE_REBUY_CREDIT=1;
const TIME =0;
const CAPITAL =1;
const INTERESTS = 2;
const CAPITAL_ROUNDED = 3;
const INTERESTS_ROUNDED = 4;
const computeMensuality = () => {
  simu.value.credit.mensuality=computeMensuality_noSave_Months(simu.value.credit.duration_m,simu.value.credit.rate,simu.value.credit.amount);
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

const computeAmort=(starting_year,starting_month,amount,nb_mens,mens,rate_rebuy=0.0)=>{
  var currentYear = starting_year;
  var curentMonth = starting_month;
  var capital_to_pay = amount;
  var capital_paid = 0;
  var interests_to_pay = 0;
  var interests_paid = 0;
  var amort_monthly_dates = [];
  var amort_monthly_cap=[];
  var amort_monthly_interests=[];
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

    amort_monthly_dates.push( {m :curentMonth,y: currentYear});
    amort_monthly_cap.push( Math.round(capital_to_pay * 100) / 100);
    amort_monthly_interests.push(Math.round(interests_paid * 100) / 100);

    mensuality_count++;
    curentMonth++;
    if (curentMonth % 13 == 0) {
      currentYear++; //next year
      curentMonth = 1; //return to january next year
    }
  }
  interests_to_pay = mens - capital_to_pay;
  interests_paid += interests_to_pay;
  amort_monthly_dates.push( {m :curentMonth,y: currentYear});
  amort_monthly_cap.push(0);
  amort_monthly_interests.push(Math.round(interests_paid * 100) / 100);
  return [amort_monthly_dates,amort_monthly_cap,amort_monthly_interests];
}

const computeCredit_init = () => {
  simu.value.credit.amort=computeAmort(simu.value.credit.y,simu.value.credit.m,simu.value.credit.amount,simu.value.credit.duration_m,simu.value.credit.mensuality);
  simu.value.credit.total_cost=Math.round(simu.value.credit.amort[INTERESTS].at(-1)*100)/100;
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
      simu.value.events[i].amortEvt=[[],[],[],[],[]];
      if(simu.value.events[i].metaType==EVT_META_TYPE_MOD)
      {
        if(i==0)//first event : capital left to pay based on simu
        {
          nb_mens_spent=get_nb_mens_diff(simu.value.credit.y,simu.value.credit.m,simu.value.events[i].year,simu.value.events[i].month);
          nb_mens_to_pay=simu.value.credit.duration_m-nb_mens_spent+simu.value.events[i].mensDiff;
          var j=0;
          while(j<simu.value.credit.amort[TIME].length && compareDates(simu.value.credit.amort[TIME][j].y,simu.value.credit.amort[TIME][j].m,simu.value.events[i].year, simu.value.events[i].month)!=0)
          {
            simu.value.events[i].amortEvt[TIME].push(simu.value.credit.amort[TIME][j]);
            simu.value.events[i].amortEvt[CAPITAL].push(simu.value.credit.amort[CAPITAL][j]);
            simu.value.events[i].amortEvt[INTERESTS].push(simu.value.credit.amort[INTERESTS][j]);
            j++;
          }
          simu.value.events[i].indexItself=j;
          //extract total interests paid just before the modulation
          const interests_paid_before_mod=simu.value.credit.amort[INTERESTS][j-1];
          var specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,simu.value.credit.amort[CAPITAL][nb_mens_spent-1],nb_mens_to_pay,simu.value.events[i].new_mens);
          var k=0;
          while(k<specific_amort[TIME].length)
          {
            simu.value.events[i].amortEvt[TIME].push(specific_amort[TIME][k]);
            simu.value.events[i].amortEvt[CAPITAL].push(specific_amort[CAPITAL][k]);
            simu.value.events[i].amortEvt[INTERESTS].push(specific_amort[INTERESTS][k]+interests_paid_before_mod);
            k++;
          }
        }
        else//capital left to pay based on previous event
        {
          nb_mens_spent=get_nb_mens_diff(simu.value.credit.y,simu.value.credit.m,simu.value.events[i].year,simu.value.events[i].month);
          nb_mens_to_pay=simu.value.events[i-1].amortEvt[TIME].length-nb_mens_spent +simu.value.events[i].mensDiff;
          var j=0;
          while(j<simu.value.events[i-1].amortEvt[TIME].length && compareDates(simu.value.events[i-1].amortEvt[TIME][j].y,simu.value.events[i-1].amortEvt[TIME][j].m,simu.value.events[i].year, simu.value.events[i].month)!=0)
          {
            simu.value.events[i].amortEvt[TIME].push(simu.value.events[i-1].amortEvt[TIME][j]);
            simu.value.events[i].amortEvt[CAPITAL].push(simu.value.events[i-1].amortEvt[CAPITAL][j]);
            simu.value.events[i].amortEvt[INTERESTS].push(simu.value.events[i-1].amortEvt[INTERESTS][j]);
            j++;
          }
          simu.value.events[i].indexItself=j;
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
          const interests_paid_before_mod=simu.value.events[i-1].amortEvt[INTERESTS][j-1];
          var specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,simu.value.events[i-1].amortEvt[CAPITAL][nb_mens_spent-1],nb_mens_to_pay,simu.value.events[i].new_mens,up2date_rate);
          var k=0;
          while(k<specific_amort[TIME].length)
          {
            simu.value.events[i].amortEvt[TIME].push(specific_amort[TIME][k]);
            simu.value.events[i].amortEvt[CAPITAL].push(specific_amort[CAPITAL][k]);
            simu.value.events[i].amortEvt[INTERESTS].push(specific_amort[INTERESTS][k]+interests_paid_before_mod);
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
          while(j<simu.value.credit.amort[TIME].length && compareDates(simu.value.credit.amort[TIME][j].y,simu.value.credit.amort[TIME][j].m,simu.value.events[i].year, simu.value.events[i].month)!=0)
          {
            simu.value.events[i].amortEvt[TIME].push(simu.value.credit.amort[TIME][j]);
            simu.value.events[i].amortEvt[CAPITAL].push(simu.value.credit.amort[CAPITAL][j]);
            simu.value.events[i].amortEvt[INTERESTS].push(simu.value.credit.amort[INTERESTS][j]);
            j++;
          }
          simu.value.events[i].indexItself=j;
          if(simu.value.events[i].rebuyPenaltiesType=='%')
          {
            toPay=simu.value.credit.amort[CAPITAL][j]*(1+simu.value.events[i].rebuyPenalties/100);
          }
          else
          {
            toPay=simu.value.credit.amort[CAPITAL][j]+simu.value.events[i].rebuyPenalties_abs;
          }
          interestsToLog=simu.value.credit.amort[INTERESTS][j];
        }
        else
        {
          while(j<simu.value.events[i-1].amortEvt[TIME].length && compareDates(simu.value.events[i-1].amortEvt[TIME][j].y,simu.value.events[i-1].amortEvt[TIME][j].m,simu.value.events[i].year, simu.value.events[i].month)!=0)
          {
            simu.value.events[i].amortEvt[TIME].push(simu.value.events[i-1].amortEvt[TIME][j]);
            simu.value.events[i].amortEvt[CAPITAL].push(simu.value.events[i-1].amortEvt[CAPITAL][j]);
            simu.value.events[i].amortEvt[INTERESTS].push(simu.value.events[i-1].amortEvt[INTERESTS][j]);
            j++;
          }
          simu.value.events[i].indexItself=j;
          if(simu.value.events[i].rebuyPenaltiesType=='%')
          {
            toPay=simu.value.events[i-1].amortEvt[CAPITAL][j]*(1+simu.value.events[i].rebuyPenalties/100);
          }
          else
          {
            toPay=simu.value.events[i-1].amortEvt[CAPITAL][j]+simu.value.events[i].rebuyPenalties_abs;
          }
          interestsToLog=simu.value.events[i-1].amortEvt[INTERESTS][j];
        }
        //then update with zero to drop
        simu.value.events[i].amortEvt[TIME].push({m:simu.value.events[i].month,y:simu.value.events[i].year});
        simu.value.events[i].amortEvt[CAPITAL].push(0);
        simu.value.events[i].amortEvt[INTERESTS].push(interestsToLog);
        //substract amount to pay, on the less rentable account first
        //1 sort accounts
        var from_poor_to_high_rate=getSortedAccountsFromPoorToHighRate();
        //2 get the ammount of money on each account at event date
        var ret=getSavingsEarlier();
        var savErlyM=ret[0];
        var savErlyY=ret[1];
        compute_savings(savErlyY,savErlyM,1+get_nb_mens_diff(savErlyY,savErlyM,simu.value.events[i].year,simu.value.events[i].month),true);
        //3 substract desired amount on each account
        var indexAccount=0;
        while(toPay>0)
        {//if there is enough money on the account, the pick all on this acocunt
          var indexAtDate=bank.value.accounts[from_poor_to_high_rate[indexAccount]].computedOverTime[TIME].length-1;
          var amountOnaccountAtDate=bank.value.accounts[from_poor_to_high_rate[indexAccount]].computedOverTime[CAPITAL][indexAtDate];
          if(amountOnaccountAtDate>toPay)
          {
            bank.value.accounts[from_poor_to_high_rate[indexAccount]].single_in_out.push({account :from_poor_to_high_rate[indexAccount], title:transSIOspecial(),type:BANK_SIO_TYPE_OUT,amount:Math.round(100*toPay)/100,date:simu.value.events[i].year_str+'/'+transMonthName(simu.value.events[i].month),month:simu.value.events[i].month,year:simu.value.events[i].year,rate:0.0});
            toPay=0;
          }
          else
          {
            //else empty it
            bank.value.accounts[from_poor_to_high_rate[indexAccount]].single_in_out.push({account :from_poor_to_high_rate[indexAccount], title:transSIOspecial(),type:BANK_SIO_TYPE_OUT,amount:Math.round(100*amountOnaccountAtDate)/100,date:simu.value.events[i].year_str+'/'+transMonthName(simu.value.events[i].month),month:simu.value.events[i].month,year:simu.value.events[i].year,rate:0.0});
            toPay-=amountOnaccountAtDate;
          }
          indexAccount++;
        }
      }
      //Rebuy with credit
      else if(simu.value.events[i].metaType==EVT_META_TYPE_REBUY && simu.value.events[i].type==EVT_TYPE_REBUY_CREDIT)
      {
        var interests_paid_before_mod=0;
        var specific_amort=[[],[],[]];
        //follow last event values until rebuy type
        var j=0;
        if(i==0)
        {
          while(j<simu.value.credit.amort[TIME].length && compareDates(simu.value.credit.amort[TIME][j].y,simu.value.credit.amort[TIME][j].m,simu.value.events[i].year, simu.value.events[i].month)!=0)
          {
            simu.value.events[i].amortEvt[TIME].push(simu.value.credit.amort[TIME][j]);
            simu.value.events[i].amortEvt[CAPITAL].push(simu.value.credit.amort[CAPITAL][j]);
            simu.value.events[i].amortEvt[INTERESTS].push(simu.value.credit.amort[INTERESTS][j]);
            j++;
          }
          simu.value.events[i].indexItself=j;
          interests_paid_before_mod=simu.value.credit.amort[INTERESTS][j-1];
          if(simu.value.events[i].rebuyPenaltiesType=='%')
          {
            toPay=simu.value.credit.amort[CAPITAL][j-1]*(1+simu.value.events[i].rebuyPenalties/100);
          }
          else
          {
            toPay=simu.value.credit.amort[CAPITAL][j-1]+simu.value.events[i].rebuyPenalties_abs;
          }

          simu.value.events[i].new_mens=computeMensuality_noSave_Months(simu.value.events[i].reloanDuration_m,simu.value.events[i].reloanRate,toPay);
          specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,toPay,simu.value.events[i].reloanDuration_m,simu.value.events[i].new_mens,simu.value.events[i].reloanRate);
        }
        else
        {
          while(j<simu.value.events[i-1].amortEvt[TIME].length && compareDates(simu.value.events[i-1].amortEvt[TIME][j].y,simu.value.events[i-1].amortEvt[TIME][j].m,simu.value.events[i].year, simu.value.events[i].month)!=0)
          {
            simu.value.events[i].amortEvt[TIME].push(simu.value.events[i-1].amortEvt[TIME][j]);
            simu.value.events[i].amortEvt[CAPITAL].push(simu.value.events[i-1].amortEvt[CAPITAL][j]);
            simu.value.events[i].amortEvt[INTERESTS].push(simu.value.events[i-1].amortEvt[INTERESTS][j]);
            j++;
          }
          simu.value.events[i].indexItself=j;
          interests_paid_before_mod=simu.value.events[i-1].amortEvt[INTERESTS][j-1];
          if(simu.value.events[i].rebuyPenaltiesType=='%')
          {
            toPay=simu.value.events[i-1].amortEvt[CAPITAL][j-1]*(1+simu.value.events[i].rebuyPenalties/100);
          }
          else
          {
            toPay=simu.value.events[i-1].amortEvt[CAPITAL][j-1]+simu.value.events[i].rebuyPenalties_abs;
          }
          simu.value.events[i].new_mens=computeMensuality_noSave_Months(simu.value.events[i].reloanDuration_m,simu.value.events[i].reloanRate,toPay);
          specific_amort=computeAmort(simu.value.events[i].year,simu.value.events[i].month,toPay,simu.value.events[i].reloanDuration_m,simu.value.events[i].new_mens,simu.value.events[i].reloanRate);
        }
        var k=0;
        while(k<specific_amort[TIME].length)
        {
          simu.value.events[i].amortEvt[TIME].push(specific_amort[TIME][k]);
          simu.value.events[i].amortEvt[CAPITAL].push(specific_amort[CAPITAL][k]);
          simu.value.events[i].amortEvt[INTERESTS].push(specific_amort[INTERESTS][k]+interests_paid_before_mod);
          k++;
        }
      }
      //for display purpose (faster chart if computed here)
      for(var index=0;index<simu.value.events[i].amortEvt[TIME].length;index++)
      {
        simu.value.events[i].amortEvt[CAPITAL_ROUNDED].push(Math.round(simu.value.events[i].amortEvt[CAPITAL][index]*100)/100);
        simu.value.events[i].amortEvt[INTERESTS_ROUNDED].push(Math.round(simu.value.events[i].amortEvt[INTERESTS][index]*100)/100);
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
    var e_m=event_.amortEvt[TIME][event_.amortEvt[TIME].length-1].m+1
    var e_y=event_.amortEvt[TIME][event_.amortEvt[TIME].length-1].y
    if(e_m==13)
    {
      e_y++;
      e_m=1;
    }
    return {end_year:e_y,end_month:e_m,capital_left:event_.amortEvt[CAPITAL][index-1]};
  }
  else
  {
    var origin_end_year=simu.value.credit.y;
    var origin_end_month=simu.value.credit.m;
    var nb_mens_to_pay=Number(simu.value.credit.duration_m);
    while(nb_mens_to_pay!=0)
    {
      origin_end_month++;
      if(origin_end_month==13)
      {
        origin_end_year++;
        origin_end_month=1;
      }
      nb_mens_to_pay--;
    }
    var index=get_nb_mens_diff(simu.value.credit.y,simu.value.credit.m,evt_year_in_fmt,evt_month_in_fmt);
    if(index>0 && index<=simu.value.credit.amort[TIME].length)
    {
      return {end_year:origin_end_year,end_month:origin_end_month,capital_left:simu.value.credit.amort[CAPITAL][index-1]};
    }
    else
    {
      return {end_year:origin_end_year,end_month:origin_end_month,capital_left:0};
    }
  }
}
const provideModOptions=(evt_type_in,evt_year_in,evt_month_in)=>{
  var toreturn =[];
  var finalMonth=ref(evt_month_in);
  var finalYear=ref(evt_year_in);
  var ret=returnBaseData(finalYear.value,finalMonth.value);
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
      for(let i=1;i<=mensualities_to_end-2;i++)//minimum authorized : turn 3 mensualities in 2 with mod
      {
        toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end-i,up2date_rate,ret.capital_left)*100)/100).toString() +getCurrencySymbol()+' (-'+i.toString()+' '+transStr(stringsIDs.str_unit_m)+')');
      }
      if(mensualities_to_end<=2)
      {
        toreturn.push(transStr(stringsIDs.str_mod_impossible));
      }
    }
    else if(evt_type_in==EVT_TYPE_MOD_MENS_DOWN)//duree+ mens -
    {
      for(let i=1;i<simu.value.credit.duration_m;i++)//max twince the duration
      {
        toreturn.push((Math.round(computeMensuality_noSave_Months(mensualities_to_end+i,up2date_rate,ret.capital_left)*100)/100).toString() +getCurrencySymbol()+' (+'+i.toString()+' '+transStr(stringsIDs.str_unit_m)+')');
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
      current=simu.value.events[i].amortEvt[TIME].length;
      if(current>latest)
      {
        latest=current;
        max=i;
      }
    }
    if(latest<simu.value.credit.amort[TIME].length)
    {
      return simu.value.credit.amort[TIME];
    }
    else
    {
      return simu.value.events[max].amortEvt[TIME];
    }
  }
  else
  {
    return simu.value.credit.amort[TIME];
  }
}



const getLastMensuality=function(){
  //by default, compute the 'no-event' end year
  var latest_year=simu.value.credit.y;
  var latest_month=simu.value.credit.m;
  var nb_mens_to_pay=Number(simu.value.credit.duration_m);
  while(nb_mens_to_pay!=0)
  {
    latest_month++;
    if(latest_month==13)
    {
      latest_year++;
      latest_month=1;
    }
    nb_mens_to_pay--;
  }
  //if some events exist, the latest mensuality is the latest mensuality of the last event
  if(simu.value.events.length!=0)
  {
    var i=simu.value.events.length-1;
    if(!(simu.value.events[i].metaType==EVT_META_TYPE_REBUY && simu.value.events[i].type==EVT_TYPE_REBUY_SAVINGS))//not a rebuy with savings
    {
      var index =simu.value.events[i].amortEvt[TIME].length-1;
      if(compareDates(simu.value.events[i].amortEvt[TIME][index].y,simu.value.events[i].amortEvt[TIME][index].m,latest_year,latest_month)<0)
      {
        latest_year=simu.value.events[i].amortEvt[TIME][index].y
        latest_month=simu.value.events[i].amortEvt[TIME][index].m
      }
    }
  }
  return {l_y:latest_year,l_m:latest_month};
}

const getLatestMensuality=function(specific_event=-1){
  //by default, compute the 'no-event' end year
  var latest_year=simu.value.credit.y;
  var latest_month=simu.value.credit.m;
  var nb_mens_to_pay=Number(simu.value.credit.duration_m);
  while(nb_mens_to_pay!=0)
  {
    latest_month++;
    if(latest_month==13)
    {
      latest_year++;
      latest_month=1;
    }
    nb_mens_to_pay--;
  }
  //if some events exist, the latest mensuality is the latest mensuality of all events
  if(simu.value.events.length!=0)
  {
    if(specific_event==-1)
    {
      for(var i=0;i< simu.value.events.length;i++)
        {
          if(!(simu.value.events[i].metaType==EVT_META_TYPE_REBUY && simu.value.events[i].type==EVT_TYPE_REBUY_SAVINGS))//not a rebuy with savings
          {
            var index =simu.value.events[i].amortEvt[TIME].length-1;
            if(compareDates(simu.value.events[i].amortEvt[TIME][index].y,simu.value.events[i].amortEvt[TIME][index].m,latest_year,latest_month)>0)
              {
                latest_year=simu.value.events[i].amortEvt[TIME][index].y;
                latest_month=simu.value.events[i].amortEvt[TIME][index].m;
              }
          }
        }
    }
    //if the comparaison with a specific event is required, just check this specific event
    else
    {
      if(!(simu.value.events[specific_event].metaType==EVT_META_TYPE_REBUY && simu.value.events[specific_event].type==EVT_TYPE_REBUY_SAVINGS))//not a rebuy with savings
       {
         var index =simu.value.events[specific_event].amortEvt[TIME].length-1;
         if(compareDates(simu.value.events[specific_event].amortEvt[TIME][index].y,simu.value.events[specific_event].amortEvt[TIME][index].m,latest_year,latest_month)>0)
           {
             latest_year=simu.value.events[specific_event].amortEvt[TIME][index].y;
             latest_month=simu.value.events[specific_event].amortEvt[TIME][index].m;
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


const reapplyLanguageToData=function()
{
    for(let i=0;i<simu.value.events.length;i++)
    {
      simu.value.events[i].month_str=transMonthName(getMonthNbr(simu.value.events[i].month_str));
    }
    if(startFormFilled.value==true)
    {
      //apply language switching to the special sio : remove
      for(let i=0;i<bank.value.accounts.length;i++)
      {
        for(let sio=0;sio<bank.value.accounts[i].single_in_out.length;sio++)
        {
          if(is_sio_special_name(bank.value.accounts[i].single_in_out[sio].title))
          {
            //remove "rebuy with savings sio" as it will be re-created by apply_events_chain
            bank.value.accounts[i].single_in_out.splice(sio,1);
          }
        }
      }
      //recompute to have everything switched to desired language
      computeCredit_init();
      apply_events_chain();
    }
}



export { computeMensuality, computeCredit_init, getEarliestNewEventDate, sortEvents,provideModOptions,apply_events_chain,getChartXAxis,
  returnBaseData,getLastMensuality,hasBeenRebougthSavings,build_event_name,reapplyLanguageToData,getLatestMensuality,
  EVT_META_TYPE_MOD, EVT_META_TYPE_REBUY, EVT_TYPE_MOD_MENS_UP, EVT_TYPE_MOD_MENS_DOWN, EVT_TYPE_REBUY_CREDIT, EVT_TYPE_REBUY_SAVINGS,
  TIME,CAPITAL,INTERESTS,CAPITAL_ROUNDED,INTERESTS_ROUNDED};
