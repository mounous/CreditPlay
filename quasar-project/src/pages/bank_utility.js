
import { bank } from 'src/stores/store';
import {month_names} from 'src/pages/date_utility'

const getSavingsEarlier=function()
{
  var savingsEarlierY=2100;
  var savingsEarlierM=12;
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
  return [savingsEarlierM,savingsEarlierY];
}
const computeDisplaySavings=function(startY,startM,durationY)
{
  var currentM=Number(startM);
  var currentY=Number(startY);
  var computed_savings=[];
  var total_savings=0.0;
  for(var x=0;x<bank.value.savings.length;x++)
  {
    computed_savings[x]=Number(bank.value.savings[x].amount);
  }
  for(var i=0;i<durationY*12;i++)
  {
    if(currentM==1)
    {
      //get interests in january
      for(var k=0;k<bank.value.savings.length;k++)
      {
        if(Number(bank.value.savings[k].rate/100)!=0)
        {
          computed_savings[k]+=computed_savings[k]*Number(bank.value.savings[k].rate/100);
        }
      }
    }
    //Sum all savings
    for(var j=0;j<bank.value.savings.length;j++)
    {
      total_savings+=computed_savings[j];
    }
    bank.value.monthly_sum.push([(month_names[currentM-1]+'/'+currentY.toString()),total_savings]);
    currentM++;
    if(currentM%12==1)
    {
      currentM=1;
      currentY++;
    }
    total_savings=0;
  }
}
export { getSavingsEarlier,computeDisplaySavings};
