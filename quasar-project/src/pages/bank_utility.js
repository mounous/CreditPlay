
import { bank, simu } from 'src/stores/store';
import {month_names} from 'src/pages/date_utility'
const isPeriodicConcerned=function(currentY,currentM,periodic_saving_index)
{
  if(bank.value.periodic_savings.length<periodic_saving_index)
  {
    return false;
  }
  //1 has the periodic saving started ?
  if(bank.value.periodic_savings[periodic_saving_index].startYear*12+bank.value.periodic_savings[periodic_saving_index].startMonth>currentY*12+currentM)
  {
    return false;
  }
  //2 if so, hasn't it ended is a stop date is defined
  var ps_endY=bank.value.periodic_savings[periodic_saving_index].endYear;
  var ps_endM=bank.value.periodic_savings[periodic_saving_index].endMonth;
  if(ps_endM !=0 && ps_endY!=0 && ps_endM+ps_endY*12<currentY*12+currentM)
  {
    return false;
  }
  return true;
}
const hasPeriodicEnded=function(currentY,currentM,periodic_saving_index)
{
  if(bank.value.periodic_savings.length<periodic_saving_index)
  {
    return false;
  }
  //1 has the periodic saving ended ?
  if(bank.value.periodic_savings[periodic_saving_index].endYear*12+bank.value.periodic_savings[periodic_saving_index].endMonth>currentY*12+currentM)
  {
    return true;
  }
  return false;
}
const isSingleIOConcerned=function(currentY,currentM,singleIO_index)
{
  //undefined single io not treated
  if(bank.value.single_in_out.length<singleIO_index)
  {
    return false;
  }
  //does single io belong to the future ?
  if(bank.value.single_in_out[singleIO_index].year*12+bank.value.single_in_out[singleIO_index].month>currentY*12+currentM)
  {
    return false;
  }
  return true;

}
const DEFAULT_SAVINGS_EARLIER_MONTH=12;
const DEFAULT_SAVINGS_EARLIER_YEAR=1290;
const getSavingsEarlier=function()
{
  var savingsEarlierY=DEFAULT_SAVINGS_EARLIER_YEAR;
  var savingsEarlierM=DEFAULT_SAVINGS_EARLIER_MONTH;
  for(var i=0;i<bank.value.periodic_savings.length;i++)
  {
    if(bank.value.periodic_savings[i].startYear<=savingsEarlierY)
    {
      savingsEarlierY=bank.value.periodic_savings[i].startYear;
      if(bank.value.periodic_savings[i].startMonth<=savingsEarlierM)
      {
        savingsEarlierM=bank.value.periodic_savings[i].startMonth;
      }
    }
  }
  for(var i=0;i<bank.value.single_in_out.length;i++)
  {
    if(bank.value.single_in_out[i].year<=savingsEarlierY)
    {
      savingsEarlierY=bank.value.single_in_out[i].year;
      if(bank.value.single_in_out[i].month<=savingsEarlierM)
      {
        savingsEarlierM=bank.value.single_in_out[i].month;
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
  return (bank.value.periodic_savings.length!=0 || bank.value.savings.length!=0 || bank.value.single_in_out.length!=0);
}
const computeDisplaySavings=function(startY,startM,durationY)
{
  bank.value.monthly_sum=[];
  var currentM=Number(startM);
  var currentY=Number(startY);
  var computed_savings=[];
  var total_savings=0.0;
  var fictive_p_accounts=[];
  var fictive_p_average=[];
  var fictive_p_avg_month_spent=[];
  var fictive_sio_accounts=[];
  var fictive_sio_average=[];
  var fictive_sio_avg_month_spent=[];
  //--------------------------------------------------//
  // prepare for fictive accounts for periodic savings//
  //--------------------------------------------------//
  for(var ps=0;ps<bank.value.periodic_savings.length;ps++)
  {
    fictive_p_accounts[ps]=0;
    fictive_p_average[ps]=0;
    fictive_p_avg_month_spent[ps]=0;
  }
  //--------------------------------------------------//
  // prepare for fictive accounts for single IO       //
  //--------------------------------------------------//
  for(var io=0;io<bank.value.single_in_out.length;io++)
  {
    fictive_sio_accounts[io]=0;
    fictive_sio_average[io]=0;
    fictive_sio_avg_month_spent[io]=0;
  }
  //----------------------//
  //    origin savings    //
  //----------------------//
  //at start date summ all savings already done
  for(var x=0;x<bank.value.savings.length;x++)
  {
    computed_savings[x]=Number(bank.value.savings[x].amount);
  }
  for(var i=0;i<durationY*12;i++)
  {
    //------------------------//
    //get interests in january//
    //------------------------//
    if(currentM==1)
    {
      //initial savings
      for(var k=0;k<bank.value.savings.length;k++)
      {
        if(Number(bank.value.savings[k].rate/100)!=0)
        {
          computed_savings[k]+=computed_savings[k]*Number(bank.value.savings[k].rate/100);
        }
      }
      //periodic savings
      for(var ps=0;ps<bank.value.periodic_savings.length;ps++)
      {
        if( isPeriodicConcerned(currentY,currentM,ps)||hasPeriodicEnded(currentY,currentM,ps))
        {
          if(Number(bank.value.periodic_savings[ps].rate)!=0)
          {
            fictive_p_accounts[ps]+=fictive_p_average[ps]/fictive_p_avg_month_spent[ps]*Number(bank.value.periodic_savings[ps].rate/100);
          }
          fictive_p_avg_month_spent[ps]=0;
          fictive_p_average[ps]=0;
        }
      }
      //single IO
      for(var io=0;io<bank.value.single_in_out.length;io++)
      {
        if( isSingleIOConcerned(currentY,currentM,io))
        {
          if(Number(bank.value.single_in_out[io].rate)!=0 && bank.value.single_in_out[io].type=='entrée')
          {
            fictive_sio_accounts[io]+=fictive_sio_average[io]/fictive_sio_avg_month_spent[io]*Number(bank.value.single_in_out[io].rate/100);
          }
          fictive_sio_avg_month_spent[io]=0;
          fictive_sio_average[io]=0;
        }
      }
    }
    //---------------//
    //Sum all savings//
    //---------------//
    //initial savings
    for(var j=0;j<bank.value.savings.length;j++)
    {
      total_savings+=computed_savings[j];
    }
    //periodic savings
    for(var k=0;k<bank.value.periodic_savings.length;k++)
    {
      if( isPeriodicConcerned(currentY,currentM,k))
      {
        if(bank.value.periodic_savings[k].type=='mensuelle')
        {
          fictive_p_accounts[k]+=Number(bank.value.periodic_savings[k].amount);
          fictive_p_average[k]+=fictive_p_accounts[k];
          fictive_p_avg_month_spent[k]++;

        }
      }

      total_savings+=fictive_p_accounts[k];
    }
    //single IOs
    for(var l=0;l<bank.value.single_in_out.length;l++)
    {
      if(isSingleIOConcerned(currentY,currentM,l))
      {
        if(bank.value.single_in_out[l].type=='sortie')
        {
          total_savings-=Number(bank.value.single_in_out[l].amount);
        }
        else
        {
          total_savings+=Number(bank.value.single_in_out[l].amount);
        }
      }
    }
    bank.value.monthly_sum.push([(month_names[currentM-1]+'-'+currentY.toString()),total_savings]);
    total_savings=0;
    currentM++;
    if(currentM%12==1)
    {
      currentM=1;
      currentY++;
    }
  }
}

export { getSavingsEarlier,computeDisplaySavings,hasSavings,hasPeriodicEnded};
