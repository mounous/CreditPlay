
import { bank, simu, startFormFilled } from 'src/stores/store';
import { returnBaseData,EVT_TYPE_REBUY_SAVINGS, getLatestMensuality  } from './credit_utility';
import { formatnumber } from './string_utils';
import { compareDates, get_nb_mens_diff } from 'src/utils/date_utility';
import{transSIOspecial,stringsIDs,transStr,transMonthName,getMonthNbr} from '../stores/languages'
import {getCurrencySymbol} from '../stores/currencies'

const BANK_SEARCH_ERROR=-1;
const BANK_SAVE_TYPE_MONTHLY=0;
const BANK_SAVE_TYPE_YEARLY=1;
const BANK_SIO_TYPE_IN=0;
const BANK_SIO_TYPE_OUT=1;
const deleteRebuySavingsEventAndAssociatedInOut=function()
{
  simu.value.events.pop();//always the last event
  simu.value.credit.has_been_rebougth=false;
  for(var accId=0;accId<bank.value.accounts.length;accId++)
  {
    for(var io=0;io<bank.value.accounts[accId].single_in_out.length;io++)
    {
      if(bank.value.accounts[accId].single_in_out[io].title==transSIOspecial())
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
    if(bank.value.accounts[accId].single_in_out[i].title==transSIOspecial())
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
  if(name==''|| name==null)
  {
    name=transStr(stringsIDs.str_account);
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
    if(compareDates(ps_endY,ps_endM,currentY,currentM)<0)
    {
      return false;
    }
  }
  if(bank.value.accounts[accID].periodic_savings[psID].type!=BANK_SAVE_TYPE_MONTHLY)
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
const DEFAULT_SAVINGS_EARLIER_YEAR=3000;
const getSavingsEarlier=function()
{
  var savingsEarlierY=DEFAULT_SAVINGS_EARLIER_YEAR;
  var savingsEarlierM=DEFAULT_SAVINGS_EARLIER_MONTH;
  //search for earlier account creation
  for(var i=0;i<bank.value.accounts.length;i++)
  {
    if(bank.value.accounts[i].open_y<=savingsEarlierY)
    {
      savingsEarlierY=bank.value.accounts[i].open_y;
      if(bank.value.accounts[i].open_m<=savingsEarlierM)
      {
        savingsEarlierM=bank.value.accounts[i].open_m;
      }
    }
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
      {
        //do not consider accounts not created at current date
        if(compareDates(bank.value.accounts[k].open_y,bank.value.accounts[k].open_m,currentY,currentM)<=0)
        {
          //if the rate is not null for a given account, compute interests
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
          if(bank.value.accounts[acc].single_in_out[io].type==BANK_SIO_TYPE_IN)
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
    result.push([(transMonthName(currentM)+'-'+currentY.toString()),total_savings]);
    if(save)
    {
      for(var accID=0;accID<bank.value.accounts.length;accID++)
      {
        bank.value.accounts[accID].computedOverTime.push({date:transMonthName(currentM)+'-'+currentY.toString(),amount:fictive_accounts[accID]})
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
const provideRebuyOptions=function(evt_type,penalties,penalties_abs,penalties_type){
  var options_rebuy_savings=[];
  var forDisplay_post_select_opt=[];
  var i=0;//initialize the var to 1 in order to avoid simulating the rebuy before first mensuality paid
  var j=0;//to align savings on first credit mensuality if necessary
  if(evt_type==EVT_TYPE_REBUY_SAVINGS)//Rachat avec épargne
  {
    if(!hasSavings())
    {
      return [transStr(stringsIDs.str_savings_empty)];
    }
    var nb_mens_compute=get_nb_mens_diff(Number(simu.value.credit.startingDate.split('/')[2]),Number(simu.value.credit.startingDate.split('/')[1]),getLatestMensuality().l_y,getLatestMensuality().l_m);
    //var computed=compute_savings(getSavingsEarlier()[1],getSavingsEarlier()[0],nb_mens_compute);
    var computed=compute_savings(Number(simu.value.credit.startingDate.split('/')[2]),Number(simu.value.credit.startingDate.split('/')[1]),nb_mens_compute);
    //in case a periodic saving or single io was set before credit start, we have to start comparing savings and credit when dates match
    // to do so, we have to scroll to an offset in computed that is aligned on first credit mensuality date
    while(j<computed.length &&  computed[j][0]!=simu.value.credit.amort[0][0] )
    {
      j++;
    }
    if(j==computed.length)
    {
      options_rebuy_savings.push('impossible');
      forDisplay_post_select_opt.push({eco_left:'0 ',value_paid:'0'});
      return [options_rebuy_savings,forDisplay_post_select_opt];
    }
    i++;//initialize the var to 1 in order to avoid simulating the rebuy before first mensuality paid
    if(penalties_type=='%')
    {
      while(computed[j+i-1][1]<returnBaseData(Number(computed[j+i][0].split('-')[1]),getMonthNbr(computed[j+i][0].split('-')[0])).capital_left*(1+penalties/100) && i+j-1!=computed.length)
      {
        i++;
      }
    }
    else
    {
      while(computed[j+i-1][1]<returnBaseData(Number(computed[j+i][0].split('-')[1]),getMonthNbr(computed[j+i][0].split('-')[0])).capital_left+penalties_abs && i+j-1!=computed.length)
      {
        i++;
      }
    }
    //handle error
    if(i+j-1==computed.length)
    {
      options_rebuy_savings.push('impossible');
      forDisplay_post_select_opt.push({eco_left:'0 ',value_paid:'0'});
      return [options_rebuy_savings,forDisplay_post_select_opt];
    }
    //at this point, credit[i+j] and savings[i] are aligned
    i++;//ad one year to have a margin
    if(i+j-1>=computed.length)
    {
      return [transStr(stringsIDs.str_unsufficient_savings)];
    }
    while(i+j<computed.length &&
      returnBaseData(Number(computed[i+j][0].split('-')[1]),getMonthNbr(computed[i+j][0].split('-')[0])).capital_left!=0)
    {
      var to_pay=0;
      if(penalties_type=='%')
      {
        to_pay=returnBaseData(Number(computed[i+j][0].split('-')[1]),getMonthNbr(computed[i+j][0].split('-')[0])).capital_left*(1+penalties/100);
      }
      else
      {
        to_pay=returnBaseData(Number(computed[i+j][0].split('-')[1]),getMonthNbr(computed[i+j][0].split('-')[0])).capital_left+penalties_abs;
      }
      options_rebuy_savings.push(computed[i+j-1][0].split('-').join(' '));
      forDisplay_post_select_opt.push({eco_left:formatnumber(String(Math.round(100*(computed[i+j-1][1]-to_pay))/100))+' ',value_paid:formatnumber(String(Math.round(100*to_pay)/100)+' '+getCurrencySymbol())});
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

const getSavinPID=function(accId,savingP){
  //get the account id
  if (accId<bank.value.accounts.length)
  {
    for(var sp=0;sp<bank.value.accounts[accId].periodic_savings.length;sp++)
    {
      if(bank.value.accounts[accId].periodic_savings[sp].amount==savingP.amount
        && bank.value.accounts[accId].periodic_savings[sp].startMonth ==savingP.startMonth
        && bank.value.accounts[accId].periodic_savings[sp].startYear ==savingP.startYear
        && bank.value.accounts[accId].periodic_savings[sp].type ==savingP.type
      )
      {
        if(savingP.endMonth!=0 && savingP.endYear!=0)
        {
          if(   savingP.endMonth==bank.value.accounts[accId].periodic_savings[sp].endMonth
            &&  savingP.endYear==bank.value.accounts[accId].periodic_savings[sp].endYear)
            {
              return sp;
            }
        }
        else
        {
          return sp;
        }
      }
    }
  }
  return BANK_SEARCH_ERROR;
}

const getSIOID=function(accId,single_io){
  //get the account id
  if (accId<bank.value.accounts.length)
  {
    for(var sio=0;sio<bank.value.accounts[accId].single_in_out.length;sio++)
    {
      if(   bank.value.accounts[accId].single_in_out[sio].amount==single_io.amount
        &&  bank.value.accounts[accId].single_in_out[sio].year==single_io.year
        &&  bank.value.accounts[accId].single_in_out[sio].month==single_io.month
      )
      {
        if(single_io.title!='')
          {
            if(bank.value.accounts[accId].single_in_out[sio].title==single_io.title)
            {
                return sio;
            }
          }
          else
          {
            return sio;
          }
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

const getAccOpt=function()
{
  var toreturn=[]
  for (var acc =0;acc< bank.value.accounts.length;acc++)
  {
    toreturn.push( bank.value.accounts[acc].title);
  }
  return toreturn;
}
export { getSavingsEarlier,computeDisplaySavings,hasSavings, provideRebuyOptions,
  BANK_SEARCH_ERROR,getAccId,getSavinPID,getSIOID,getSortedAccountsFromPoorToHighRate,compute_savings,makeAccountNameUnique,
  isAccountInvolvedInRebuyWithSavings, deleteRebuySavingsEventAndAssociatedInOut,getAccOpt,
  BANK_SAVE_TYPE_MONTHLY,BANK_SAVE_TYPE_YEARLY,BANK_SIO_TYPE_IN,BANK_SIO_TYPE_OUT};
