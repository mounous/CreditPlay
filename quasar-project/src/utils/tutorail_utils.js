import { bank, simu } from 'src/stores/store';
import { transStr,stringsIDs, transevtmetaType,transMonthName } from 'src/stores/languages';
import { startFormFilled,tutoPhase,startformfilled_before_tuto,simu_before_tuto,bank_before_tuto } from 'src/stores/store';

import {computeMensuality, EVT_META_TYPE_REBUY,computeCredit_init} from '../utils/credit_utility'

import { getCurrencySymbol } from 'src/stores/currencies';

const saveTutoData=function()
{
  startformfilled_before_tuto.value=startFormFilled.value==true?true:false;
  startFormFilled.value=true;
  bank_before_tuto.value={ accounts:[], monthly_sum:[] };
  for(var i=0;i<bank.value.accounts.length;i++)
  {
    bank_before_tuto.value.accounts.push({title:bank.value.accounts[i].title,rate:bank.value.accounts[i].rate,amount:bank.value.accounts[i].amount,computedOverTime:bank.value.accounts[i].computedOverTime,single_in_out:[],periodic_savings:[]});
    for(var sio=0;sio<bank.value.accounts[i].single_in_out.length;sio++)
    {
      bank_before_tuto.value.accounts[i].single_in_out.push(bank.value.accounts[i].single_in_out[sio]);
    }
    for(var ps=0;ps<bank.value.accounts[i].periodic_savings.length;ps++)
    {
      bank_before_tuto.value.accounts[i].periodic_savings.push(bank.value.accounts[i].periodic_savings[ps]);
    }
  }
  bank_before_tuto.value.monthly_sum=bank.value.monthly_sum;
  simu_before_tuto.value.credit={...simu.value.credit};
  simu_before_tuto.value.events=simu.value.events;
}
const restoreTutoData=function()
{
  startFormFilled.value=startformfilled_before_tuto.value==true?true:false;
  bank.value={ accounts:[], monthly_sum:[] };
  for(var i=0;i<bank_before_tuto.value.accounts.length;i++)
  {
    bank.value.accounts.push({title:bank_before_tuto.value.accounts[i].title,rate:bank_before_tuto.value.accounts[i].rate,amount:bank_before_tuto.value.accounts[i].amount,computedOverTime:bank_before_tuto.value.accounts[i].computedOverTime,single_in_out:[],periodic_savings:[]});
    for(var sio=0;sio<bank_before_tuto.value.accounts[i].single_in_out.length;sio++)
    {
      bank.value.accounts[i].single_in_out.push(bank_before_tuto.value.accounts[i].single_in_out[sio]);
    }
    for(var ps=0;ps<bank_before_tuto.value.accounts[i].periodic_savings.length;ps++)
    {
      bank.value.accounts[i].periodic_savings.push(bank_before_tuto.value.accounts[i].periodic_savings[ps]);
    }
  }
  bank.value.monthly_sum=bank_before_tuto.value.monthly_sum;
  simu.value.credit={...simu_before_tuto.value.credit};
  simu.value.events=simu_before_tuto.value.events;
}
const injectCreditInTuto=function()
{
  simu.value.credit.amount=150000;
  simu.value.credit.duration_m=240;
  simu.value.credit.has_been_rebougth=false;
  simu.value.credit.rate=3.25;
  simu.value.credit.startingDate='11/08/2023';
  simu.value.credit.y=2023;
  simu.value.credit.m=8;
  computeMensuality();
  computeCredit_init();
}
const feedTextTutoOps=function()
{
  //do not display text that is not designed for tuto on this page
  if(tutoPhase.value<=stringsIDs.str_tuto_events_5-stringsIDs.str_tuto_events_1)
  {
    //add events to delete only when corresponding text is displayed
    if(tutoPhase.value==stringsIDs.str_tuto_events_3-stringsIDs.str_tuto_events_1+1)
    {
      //only add events if needed
      if(simu.value.events.length==0)
      {
        populateEventsTuto();
      }
    }
    //return text
    return transStr(stringsIDs.str_tuto_events_1+tutoPhase.value);
  }
  else
  {
    //return last if spammed
    return transStr(stringsIDs.str_tuto_events_5);
  }

}
const populateBankTuto=function(){
  bank.value={
    accounts: [
      {
        title: 'MostProfit',        amount: 50000,        rate: '3',        single_in_out: [],
        periodic_savings: [{amount: 320,account: 'MostProfit',type: 0, startMonth: 8,startYear: 2024,endMonth: 0,endYear: 0, },],
        computedOverTime: [],
      },
      {
        title: 'middleProfit',       amount: 14000,        rate: 1.6,
        single_in_out: [{account: 'middleProfit',title: 'Sell car', type: 0, amount: 9100,date: '24/08/2028', month: 8, year: 2028,},],
        periodic_savings: [{amount: 4500,account: 'middleProfit',type: 1,startMonth: 8,startYear: 2024, endMonth: 0,endYear: 0,}, ],
        computedOverTime: [ ],
      },
      {
        title: 'NoProfit',amount: 5000, rate: 0,single_in_out: [], periodic_savings: [ ],computedOverTime: [ ], }, ],  };
}
const populateEventsTuto=function()
{
  simu.value.events.push({    title: 'Modulation 1',    metaType: 0,    type: 1,    year_str: '2026',    month_str: transMonthName(11),    year: 2026,
  month: 11,    id: 1,    selected: false,    new_mens: 1112.38,    mensDiff: -58,    modVal: '',    amortEvt: [],    rebuyVal: '',    reLoanDate: '',
  reloanRate: 0,    rebuyPenaltiesType: '%',    rebuyPenalties: 0,    rebuyPenalties_abs: 0,    reloanDuration_m: 0,    savingsLeft: 0,    });

  simu.value.events.push({      title: 'Modulation 2',      metaType: 0,      type: 0,      year_str: '2027',      month_str: transMonthName(8),      year: 2027,
    month: 8,      id: 1,      selected: false,      new_mens: 1003.24,      mensDiff: 18,      modVal: '',      amortEvt: [],      rebuyVal: '',
    reLoanDate: '',      reloanRate: 0,      rebuyPenaltiesType: '%',      rebuyPenalties: 0,      rebuyPenalties_abs: 0,      reloanDuration_m: 0,      savingsLeft: 0,
  });


  simu.value.events.push({    title: transevtmetaType(EVT_META_TYPE_REBUY)+' 1',    metaType: 1,    type: 1,    year_str: '2028',    month_str: transMonthName(10),
    year: 2028,    month: 10,    id: 1,    selected: false,    new_mens: -1,    mensDiff: 0,    modVal: '',    amortEvt: [],    rebuyVal: '',    reLoanDate: '11/10/2028',
    reloanRate: 1.25,    rebuyPenaltiesType: getCurrencySymbol(),    rebuyPenalties: 0,    rebuyPenalties_abs: 1500,    reloanDuration_m: 76,    savingsLeft: 0,
  });
  simu.value.events.push({
    title: transevtmetaType(EVT_META_TYPE_REBUY)+' 2',    metaType: 1,    type: 0,    year_str: '2029',    month_str: transMonthName(5),    year: 2029,    month: 5,
    id: 1,    selected: false,    new_mens: -1,    mensDiff: 0,    modVal: '',    amortEvt: [],    rebuyVal: '',    reLoanDate: '',    reloanRate: 0,
    rebuyPenaltiesType: getCurrencySymbol(),    rebuyPenalties: 0,    rebuyPenalties_abs: 1500,    reloanDuration_m: 0,    savingsLeft: '25873.02',
  });
}

const feedSpanSummary=function(){
  switch(tutoPhase.value)
  {
    case 1:
      return transStr(stringsIDs.str_tuto_sum_1);
      break;
    case 2:
      return transStr(stringsIDs.str_tuto_sum_2);
      break;
    case 3:
      return transStr(stringsIDs.str_tuto_sum_3);
      break;
    case 4:
      return transStr(stringsIDs.str_tuto_sum_4);
      break;
    default:
      return '';
  }
}
export {saveTutoData,feedTextTutoOps,populateEventsTuto,injectCreditInTuto,populateBankTuto,feedSpanSummary,restoreTutoData};
