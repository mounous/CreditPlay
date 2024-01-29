const getFormatedCategories=function(categories,numberofPointsTodisplay){
  var categoriesFmt= categories;
  //display 10 points : compute step
  const step=categoriesFmt.length/numberofPointsTodisplay;
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
