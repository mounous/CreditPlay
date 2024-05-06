
import {startFormFilled} from '../stores/store'
import { hasSavings } from './bank_utility';
const targetPage=function(direction,currentRoute)
{
  if(direction=='left')
  {
    if(currentRoute=='/')
    {
      return'/events';
    }
    else if(currentRoute=='/events')
    {
      if(startFormFilled.value)
      {
        return '/summary';
      }
      else if(hasSavings())
      {
        return '/lineChart';
      }
      else
      {
        return '/bank';
      }
    }
    else if(currentRoute=='/summary')
    {
     return '/lineChart';
    }
    else if(currentRoute=='/lineChart')
    {
     return '/bank';
    }
    else if(currentRoute=='/bank')
    {
     return '/memory';
    }
    else if(currentRoute=='/memory')
    {
     return '/help';
    }
    else if(currentRoute=='/help')
    {
     return '/';
    }
  }
  else if(direction=='right')
  {
    if(currentRoute=='/')
    {
     return '/help';
    }
    else if(currentRoute=='/events')
    {
     return '/';
    }
    else if(currentRoute=='/summary')
    {
     return '/events';
    }
    else if(currentRoute=='/lineChart')
    {
      if(startFormFilled.value)
      {
        return '/summary';
      }
      else
      {
        return '/events';
      }

    }
    else if(currentRoute=='/bank')
    {
      if (hasSavings()||startFormFilled.value)
      {
        return '/lineChart';
      }
      else
      {
        return '/events';
      }
    }
    else if(currentRoute=='/memory')
    {
     return '/bank';
    }
    else if(currentRoute=='/help')
    {
     return '/memory';
    }
  }
}

export { targetPage};
