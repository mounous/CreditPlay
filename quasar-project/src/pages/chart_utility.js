const getFormatedCategories=function(categories,numberofPointsTodisplay){
  var categoriesFmt= categories;
  var step=0;
  //display 10 points : compute step
  if(categoriesFmt.length>numberofPointsTodisplay)
  {
    step=Number(categoriesFmt.length/numberofPointsTodisplay);
  }
  else
  {
    step=1;
  }

  for(var i=0;i<categoriesFmt.length;i++)
  {
    if(i%step!=0 && i!=(categoriesFmt.length-1))
    {
      categoriesFmt[i]='';
    }
    else
    {
      categoriesFmt[i]=categories[i].split('-')[0].slice(0,3)+'-'+categories[i].split('-')[1];
    }
  }
  return categoriesFmt;
}
export {  getFormatedCategories};
