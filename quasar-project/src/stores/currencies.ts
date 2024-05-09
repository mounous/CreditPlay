

import { LocalStorage } from 'quasar';

export const supportedCurrencies=
[
  '$','€','£','¥','؋','₿','Bs','₵','¢','Ch','₡','C$','D','ден','дин','.د.ج','.د.ب','.د.ع','.د.أ','.د.ك','.د.ل','.د.ت','.د.م','.د.إ','đ','Ξ','֏','G','₲','h','₴','₭','Kč','kr','Kz',
  '₾','Lek','leu','лев','₺','₼','Nfk','₦','T$','.ج.م','.ل.ل','R$','﷼','.ر.ي','.ر.س','.ر.ع','.ر.ق','៛','₪',
]

export const getCurrencySymbol=function()
{
  return (LocalStorage.has('currentCurrency') ? LocalStorage.getItem('currentCurrency') : '€');//€ as default
}
