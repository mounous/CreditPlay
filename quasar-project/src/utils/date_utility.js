import {ref} from 'vue'

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
  while(count<=month_names.length)
  {
    if(evt_month_in==month_names[count-1])
    {
      return count;
    }
    count++;
  }
}

const compareDates=function (y_1,m_1,y_2,m_2)
{
  if(y_1>y_2)
  {
    return 1;
  }
  else if(y_1==y_2)
  {
    if(m_1>m_2)
    {
      return 1;
    }
    else if (m_1==m_2)
    {
      return 0;
    }
    else
    {
      return -1
    }
  }
  else
  {
    return -1;
  }
}
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
const addOneMonth=function (month,Year)
{
  month.value++;
  if(month.value==13)
  {
    month.value=1
    Year.value++;
  }
}
const addOneMonthToStringDate=function(date)
{
  var year=ref(0);
  var month=ref(0);
  if(date.split('/')[0].length==4)//format YYYY/MM
  {
    year.value=date.split('/')[0];
    month.value=date.split('/')[1];
    addOneMonth(month,year);
    return (year.value.toString()+'/'+month.value.toString().padStart(2,'0'));
  }
  else if(date.split('/')[0].length==2)
  {
    year.value=date.split('/')[1];
    month.value=date.split('/')[0];
    return (month.value.toString()+'/'+year.value.toString().padStart(2,'0'));
  }
  else
  {
    console.log('------------------UNHANDLED DATE FORMAT ADD------------------');
  }
  addOneMonth(month,year);

}
const subOneMonth=function (month,Year)
{
  month.value--;
  if(month.value==0)
  {
    month.value=12
    Year.value--;
  }
}
const subOneMonthToStringDate=function(date)
{
  var year=ref(0);
  var month=ref(0);
  if(date.split('/')[0].length==4)//format YYYY/MM
  {
    year.value=date.split('/')[0];
    month.value=date.split('/')[1];
    subOneMonth(month,year);
    return (year.value.toString()+'/'+month.value.toString().padStart(2,'0'));
  }
  else if(date.split('/')[0].length==2)
  {
    year.value=date.split('/')[1];
    month.value=date.split('/')[0];
    subOneMonth(month,year);
    return (month.value.toString()+'/'+year.value.toString().padStart(2,'0'));
  }
  else
  {
    console.log('------------------UNHANDLED DATE FORMAT SUB------------------');
  }
}
export { month_names,get_nb_mens_diff,getMonthNbr,subOneMonthToStringDate,addOneMonthToStringDate,compareDates};
