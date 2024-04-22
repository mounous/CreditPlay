

const formatnumber=function(number_in_str)
{
  var parts = number_in_str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
}

export { formatnumber};
