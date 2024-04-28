const interestsColorList=['#f9a068','#eb9058','#da7e44','#c26226','#b35418','#95420f','#79350b','#672e0b','#48220a','#301504'];
const capitalColorsList=['#5ec9d9','#51b9c9','#3ca1b0','#2a8f9f','#147280','#085a67','#0e4148','#082c06','#1f474d','#406469'];
const grennSave='#1ec95b';
const interestsInitColor='#e2001a';
const capitalInitColor='#0392ff';
const TYPE_CAPITAL=0;
const TYPE_INTERESTS=1;
const TYPE_SAVINGS=2;

const GetColor=function(type,rank=0,isInit=false)
{
  if(isInit)
  {
    //always colot init in grey and its interests in deep purple
    if(type==TYPE_INTERESTS)
    {
      return interestsInitColor;
    }
    else
    {
      return capitalInitColor;
    }
  }
  if(type==TYPE_SAVINGS)
  {
    return(grennSave);
  }
  else
  {
    if(type==TYPE_CAPITAL)
    {
      return capitalColorsList[rank%(capitalColorsList.length-1)];
    }
    else
    {
      return interestsColorList[rank%(capitalColorsList.length-1)];
    }
  }
}

export {   GetColor,TYPE_CAPITAL,TYPE_INTERESTS,TYPE_SAVINGS};
