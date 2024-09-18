

import { LocalStorage } from 'quasar';

export const supportedCurrencies=
[
  '$','€','£','¥','؋','₿', 'Bs','₵', 'Ch','₡','C$','D',
  'ден','дин','.د.ج','.د.ب','.د.ع','.د.أ','.د.ك','.د.ل',
  '.د.ت','.د.م','đ','Ξ','֏','G','₲','h','₴','₭','Kč',
  'kr','Kz',  '₾','Lek','leu','лев','₺','₼','Nfk',
  '₦','T$','.ج.م','.ل.ل','R$','﷼','.ر.ي','.ر.ع','.ر.ق','៛','₪',
]

export const currencyNames=
[
  'Dollar', 'Euro', 'Sterling','Yen','Afghani','Bitcoin','Venez. Bolivar','Cedi','Bhutanese chhertum', 'Costa Rican colón','Nicaraguan córdoba','Gambian dalasi',
  'Macedonian denar', 'Serbian dinar', 'Dinal algérien', 'Bahrein dinar', 'Iraqi dinar', 'United Arab Emirates Dirham', 'Kuwaiti dinar', 'Libyan Dinar',
  'Dinar tunisien', 'Dirham marocain', 'Dong', 'Ether', 'Armenian Dram', 'Guyanian dollar','Paraguayan guaraní', 'Czech heller','Hryvnia','Lao Kip', 'Czech Koruny',
  'Swedish krona', 'Tenge kazakh', 'Georgian Lari', 'Albanian Leke', 'Romanian leu', 'Lev bulgare', 'Turkish Lire', 'Azerbaijan Manats', 'Eritrean Nakfas',
  'Naira', 'Pa’anga', 'Egyptian pound', 'Lebanese pound', 'Brazilian real', 'Saudi Arabian Riyals', 'Yemeni rial', 'Omani Rial', 'Qatari riyal', 'Cambodian Riels',
  'Israeli New Shekels'

]

export const getCurrencySymbol=function()
{
  return (LocalStorage.has('currentCurrency') ? LocalStorage.getItem('currentCurrency') : '€');//€ as default
}
