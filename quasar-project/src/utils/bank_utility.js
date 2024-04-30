
import { bank, simu } from 'src/stores/store';
import {month_names,getMonthNbr } from 'src/utils/date_utility'
import { returnBaseData } from './credit_utility';
import { formatnumber } from './string_utils';
import { compareDates } from 'src/utils/date_utility';
const BANK_SEARCH_ERROR=-1;

const deleteRebuySavingsEventAndAssociatedInOut=function()
{
  simu.value.events.pop();//always the last event
  simu.value.credit.has_been_rebougth=false;
  for(var accId=0;accId<bank.value.accounts.length;accId++)
  {
    for(var io=0;io<bank.value.accounts[accId].single_in_out.length;io++)
    {
      if(bank.value.accounts[accId].single_in_out[io].title=='rachat avec économies')
      {
        bank.value.accounts[accId].single_in_out.splice(io,1);
      }
    }
  }
}
const isAccountInvolvedInRebuyWithSavings=function(accId)
{
  for(var i=0;i<bank.value.accounts[accId].single_in_out.length;i++)
  {
    if(bank.value.accounts[accId].single_in_out[i].title=='rachat avec économies')
    {
      return true;
    }
  }
  return false;
}
const makeAccountNameUnique=function(name,suffix=1)
{
  var is_duplicate=false;
  //check that the name is not null
  if(name=='')
  {
    name='compte'
  }
  name=name.trim();//remove padding spaces from beginning and end
  //ensure the name is not already used
  for(var i=0;i<bank.value.accounts.length;i++)
  {
    if(suffix==1)
    {
      if(bank.value.accounts[i].title.trim()==name)
      {
        is_duplicate=true;
        break;
      }
    }
    else
    {
      if(bank.value.accounts[i].title.trim()==name+' '+String(suffix))
      {
        is_duplicate=true;
        break;
      }
    }
  }
  if(is_duplicate)
  {
    return makeAccountNameUnique(name,suffix+1);
  }
  else
  {
    if(suffix==1)
    {
      return name;
    }
    else
    {
      return name+' '+String(suffix);
    }
  }
}
const isPeriodicConcerned=function(currentY,currentM,accID,psID)
{
  var ps_startY=  bank.value.accounts[accID].periodic_savings[psID].startYear;
  var ps_startM=  bank.value.accounts[accID].periodic_savings[psID].startMonth;
  var ps_endY=    bank.value.accounts[accID].periodic_savings[psID].endYear;
  var ps_endM=    bank.value.accounts[accID].periodic_savings[psID].endMonth;
  if(bank.value.accounts[accID].periodic_savings.length<psID)
  {
    return false;
  }
  //1 has the periodic saving started ?
  if(ps_startY!=0 && ps_startM!=0)
  {
    if(compareDates(ps_startY,ps_startM,currentY,currentM)>0)
    {
      return false;
    }
  }
  //2 if so, hasn't it ended is a stop date is defined
  if(ps_endY!=0 && ps_endM!=0)
  {
    if(compareDates(ps_endY,ps_endM,currentY,currentM)<=0)
    {
      return false;
    }
  }
  if(bank.value.accounts[accID].periodic_savings[psID].type!='mensuelle')
  {
    if(ps_startM!=currentM)
    {
      return false;
    }
  }
  return true;
}
const isSingleIOConcerned=function(currentY,currentM,accID,sioID)
{
  //undefined single io not treated
  if(bank.value.accounts[accID].single_in_out.length<sioID)
  {
    return false;
  }
  if(bank.value.accounts[accID].single_in_out[sioID].year*12+bank.value.accounts[accID].single_in_out[sioID].month==currentY*12+currentM)
  {
    return true;
  }
  return false;

}
const DEFAULT_SAVINGS_EARLIER_MONTH=12;
const DEFAULT_SAVINGS_EARLIER_YEAR=1290;
const getSavingsEarlier=function()
{
  var savingsEarlierY=DEFAULT_SAVINGS_EARLIER_YEAR;
  var savingsEarlierM=DEFAULT_SAVINGS_EARLIER_MONTH;
  for(var i=0;i<bank.value.accounts.length;i++)
  {
    for(var ps=0;ps<bank.value.accounts[i].periodic_savings.length;ps++)
    {
      if(bank.value.accounts[i].periodic_savings[ps].startYear<=savingsEarlierY)
      {
        savingsEarlierY=bank.value.accounts[i].periodic_savings[ps].startYear;
        if(bank.value.accounts[i].periodic_savings[ps].startMonth<=savingsEarlierM)
        {
          savingsEarlierM=bank.value.accounts[i].periodic_savings[ps].startMonth;
        }
      }
    }
    for(var io=0;io<bank.value.accounts[i].single_in_out.length;io++)
    {
      if(bank.value.accounts[i].single_in_out[io].startYear<=savingsEarlierY)
      {
        savingsEarlierY=bank.value.accounts[i].single_in_out[io].startYear;
        if(bank.value.accounts[i].single_in_out[io].startMonth<=savingsEarlierM)
        {
          savingsEarlierM=bank.value.accounts[i].single_in_out[io].startMonth;
        }
      }
    }
  }
  if(savingsEarlierY==DEFAULT_SAVINGS_EARLIER_YEAR && savingsEarlierM==DEFAULT_SAVINGS_EARLIER_MONTH)
  {
    return[new Date().getMonth()+1,new Date().getFullYear()];
  }
  return [savingsEarlierM,savingsEarlierY];
}
const hasSavings=function(){
  for(var i=0;i<bank.value.accounts.length;i++)
  {
    if(bank.value.accounts[i].amount!=0)
    {
      return true;
    }
    else
    {
      for(var ps=0;ps<bank.value.accounts[i].periodic_savings.length;ps++)
      {
        if(bank.value.accounts[i].periodic_savings[ps].amount!=0)
        {
          return true;
        }
      }
      for(var io =0;io<bank.value.accounts[i].single_in_out.length;io++)
      {
        if(bank.value.accounts[i].single_in_out[io].amount!=0)
        {
          return true;
        }
      }
    }
  }
  return false;
}
const computeDisplaySavings=function(startY,startM,durationY)
{
  bank.value.monthly_sum=[];
  var computed=compute_savings(startY,startM,durationY*12);
  for(var i=0;i<computed.length;i++)
  {
    bank.value.monthly_sum.push(computed[i]);
  }
}
const compute_savings=function(startY,startM,durationM,save=false)
{
  var result=[];
  var currentM=Number(startM);
  var currentY=Number(startY);
  var total_savings=0.0;
  var fictive_accounts=[];
  var fictive_average=[];//sum acount value each mont
  var fictive_avg_month_spent=[];//divide fictive_average by fictive_avg_month_spent in january to get ammount of interests
  //------------------------------//
  // prepare for fictive accounts //
  //----------------------------- //
  for(var acc=0;acc<bank.value.accounts.length;acc++)
  {
    fictive_accounts.push(bank.value.accounts[acc].amount);
    //supposed constant before current month
    fictive_average.push(fictive_accounts[acc]*(startM));
    fictive_avg_month_spent.push(startM);
  }
  for(var i=0;i<durationM;i++)
  {
    //------------------------//
    //get interests in january//
    //------------------------//
    if(currentM==1)
    {
      for(var k=0;k<bank.value.accounts.length;k++)
      {//if the rate is not null for a given account, compute interests
        if(Number(bank.value.accounts[k].rate/100)!=0)
        {
          //if there have been some money on the account, mean it
          if(fictive_avg_month_spent[k]!=0)
          {
            fictive_average[k]/=fictive_avg_month_spent[k];
          }
          fictive_accounts[k]+=fictive_average[k]*Number(bank.value.accounts[k].rate/100);
          fictive_average[k]=0;
          fictive_avg_month_spent[k]=0;
        }
      }
    }
    //---------------------------------------//
    // then, whatever the month, sum savings //
    //---------------------------------------//
    for(var acc=0;acc<bank.value.accounts.length;acc++)
    {
      //add periodic savings to the account
      for(var ps=0;ps<bank.value.accounts[acc].periodic_savings.length;ps++)
      {
        if(isPeriodicConcerned(currentY,currentM,acc,ps))
        {
          fictive_accounts[acc]+=bank.value.accounts[acc].periodic_savings[ps].amount;
        }
      }
      //add single io if it is time to
      for(var io=0;io<bank.value.accounts[acc].single_in_out.length;io++)
      {
        if(isSingleIOConcerned(currentY,currentM,acc,io))
        {
          if(bank.value.accounts[acc].single_in_out[io].type=='entrée')
          {
            fictive_accounts[acc]+=bank.value.accounts[acc].single_in_out[io].amount;
          }
          else
          {
            fictive_accounts[acc]-=bank.value.accounts[acc].single_in_out[io].amount;
          }
        }
      }
      fictive_average[acc]+=fictive_accounts[acc];
      fictive_avg_month_spent[acc]++;
      total_savings+=fictive_accounts[acc];
    }
    result.push([(month_names[currentM-1]+'-'+currentY.toString()),total_savings]);
    if(save)
    {
      for(var accID=0;accID<bank.value.accounts.length;accID++)
      {
        bank.value.accounts[accID].computedOverTime.push({date:month_names[currentM-1]+'-'+currentY.toString(),amount:fictive_accounts[accID]})
      }
    }
    total_savings=0;
    currentM++;
    if(currentM%12==1)
    {
      currentM=1;
      currentY++;
    }
  }
  return result;
}
var optionsReBuyType=[
  'Rachat avec épargne',
  'Rachat à crédit - meilleur taux'
]
const provideRebuyOptions=function(evt_type,penalties){
  var options_rebuy_savings=[];
  var forDisplay_post_select_opt=[];
  var i=0;
  if(evt_type==optionsReBuyType[0])//Rachat avec épargne
  {
    if(!hasSavings())
    {
      return ['onglet épargne non renseigné'];
    }
    //dernier paramètre à changer : il faut prendre en compte des modulations qui ralongent
    var computed=compute_savings(getSavingsEarlier()[1],getSavingsEarlier()[0],simu.value.credit.year*12);
    while(computed[i][1]<returnBaseData(Number(computed[i][0].split('-')[1]),getMonthNbr(computed[i][0].split('-')[0])).capital_left*(1+penalties/100) && i!=computed.length)
    {
      i++;
    }
    if(i==computed.length)
    {
      return ['economies insuffisantes'];
    }
    while(i<computed.length &&
      returnBaseData(Number(computed[i][0].split('-')[1]),getMonthNbr(computed[i][0].split('-')[0])).capital_left!=0)
    {
      var to_pay=returnBaseData(Number(computed[i][0].split('-')[1]),getMonthNbr(computed[i][0].split('-')[0])).capital_left*(1+penalties/100);
      options_rebuy_savings.push(computed[i][0].split('-').join(' '));
      forDisplay_post_select_opt.push({eco_left:formatnumber(String(Math.round(100*(computed[i][1]-to_pay))/100))+' €',value_paid:formatnumber(String(Math.round(100*to_pay)/100)+' €')});
      i++;
    }
    return [options_rebuy_savings,forDisplay_post_select_opt];
  }
}
const getAccId=function(name){
  //get the account id
  for(var acc=0;acc<bank.value.accounts.length;acc++)
  {
    if(bank.value.accounts[acc].title==name)
    {
      return acc;
    }
  }
  return BANK_SEARCH_ERROR;
}

const getSavinPID=function(accId,Saving_name){
  //get the account id
  if (accId<bank.value.accounts.length)
  {
    for(var sp=0;sp<bank.value.accounts[accId].periodic_savings.length;sp++)
    {
      if(bank.value.accounts[accId].periodic_savings[sp].title==Saving_name)
      {
        return sp;
      }
    }
  }
  return BANK_SEARCH_ERROR;
}

const getSIOID=function(accId,Saving_name){
  //get the account id
  if (accId<bank.value.accounts.length)
  {
    for(var sio=0;sio<bank.value.accounts[accId].single_in_out.length;sio++)
    {
      if(bank.value.accounts[accId].single_in_out[sio].title==Saving_name)
      {
        return sio;
      }
    }
  }
  return BANK_SEARCH_ERROR;
}

const getSortedAccountsFromPoorToHighRate=function()
{
  var from_poor_to_high_rate=[];
  if(bank.value.accounts.length==0)
  {
    return
  }
  if(bank.value.accounts.length==1)
  {
    return [0]
  }
  else
  {
    var Tmpaccounts=bank.value.accounts;
    var fullysorted=false
    while(fullysorted==false)
    {
      var fullysorted=true;
      var currentIndex=0;
      var Tmpaccount;
      while(currentIndex<Tmpaccounts.length-1)
      {
        if(Tmpaccounts[currentIndex].rate>Tmpaccounts[currentIndex+1].rate)
        {
          //swap
          Tmpaccount=Tmpaccounts[currentIndex];
          Tmpaccounts[currentIndex]=Tmpaccounts[currentIndex+1];
          Tmpaccounts[currentIndex+1]=Tmpaccount;
          fullysorted=false;
        }
        currentIndex++;
      }
    }
    for(var index=0;index<Tmpaccounts.length;index++)
    {
      from_poor_to_high_rate.push(getAccId(Tmpaccounts[index].title))
    }
    return from_poor_to_high_rate;
  }
}
export { getSavingsEarlier,computeDisplaySavings,hasSavings, provideRebuyOptions,optionsReBuyType
  ,BANK_SEARCH_ERROR,getAccId,getSavinPID,getSIOID,getSortedAccountsFromPoorToHighRate,compute_savings,makeAccountNameUnique,
  isAccountInvolvedInRebuyWithSavings, deleteRebuySavingsEventAndAssociatedInOut};