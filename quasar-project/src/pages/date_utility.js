

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
export { month_names,get_nb_mens_diff,getMonthNbr};
