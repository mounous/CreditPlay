

import { LocalStorage } from 'quasar';
import {ref} from 'vue'
import {BANK_SAVE_TYPE_MONTHLY,BANK_SAVE_TYPE_YEARLY,BANK_SIO_TYPE_IN,BANK_SIO_TYPE_OUT } from 'src/utils/bank_utility';
import {  EVT_TYPE_MOD_MENS_UP, EVT_TYPE_MOD_MENS_DOWN, EVT_TYPE_REBUY_CREDIT, EVT_TYPE_REBUY_SAVINGS} from '../utils/credit_utility'
export const supportedLanguages=ref(['Français','English']);
export const rerenderMainlayout=ref(0);
//------------------------------------------------------------------------//
//                      labels                                            //
//------------------------------------------------------------------------//
export enum stringsIDs {
  //creditStartForm
  str_alreadySigned=0,
  str_simulation=1,
  str_signature_date=2,
  str_close=3,
  str_cancel=4,
  str_simu=5,
  str_amount_borrowed=6,
  str_neg_amount=7,
  str_rate=8,
  str_duration=9,
  str_rate_impossible=10,
  str_durationPos=11,
  str_valid=12,
  str_notif_warn_credit_type=13,
  str_notif_warn_date=14,
  str_notif_warn_amount=15,
  str_notif_warn_rate=16,
  str_notif_warn_duration=17,
  //bank Page
  str_title_accounts=18,
  str_btn_add=19,
  str_head_name=20,
  str_head_amount=21,
  str_head_profit=22,
  str_save_capability=23,
  str_account=24,
  str_save_type=25,
  str_save_from=26,
  str_save_untill=27,
  str_title_sio=28,
  str_head_date=29,
  str_btn_valid=30,
  str_acc_not_found=31,
  str_saving_p_not_found=32,
  str_sio_not_found=33,
  //crediteventsHandler
  str_mod_date=34,
  str_capital_left=35,
  str_choose_act=36,
  str_choose_mensuality=37,
  str_select_action=38,
  str_choose_opt=39,
  str_mod_impossible=40,
  str_mens_increase=41,
  str_mens_decrease=42,
  str_rebuy_savings=43,
  str_rebuy_loan=44,
  str_btn_del=45,
  str_warn_unselect=46,
  str_info_select_too=47,
  str_info_unselect_too=48,
  //memory page
  str_btn_delete_all=49,
  str_btn_save_current =50,
  str_btn_delete =51,
  str_btn_restore =52,
  str_pop_simu_save_name=53,
  str_pop_simu_default_name=54,
  str_pop_simu_custom_name=55,
  //summary
  str_simu_summary=56,
  str_mens=57,
  str_loan_end=58,
  str_total_cost=59,
  str_init_loan=60,
  str_cost_diff_rel=61,
  str_cost_diff_abs=62,
  str_capital_rebought=63,
  str_savings_left=64,
  str_new_rate=65,
  //accountsForm
  str_acc_name_opt=66,
  str_acc_name_hint=67,
  str_shorter_acc_name=68,
  str_next=69,
  str_prev=70,
  str_validate=71,
  str_current_amount_acc=72,
  str_current_amount=73,
  str_debts_not_handled=74,
  str_profitability_st=75,
  str_profitability_label=76,
  str_null_save=77,
  str_neg_save=78,
  //buypicker
  str_penalties=79,
  str_penalties_hint=80,
  str_penalties_rule=81,
  str_choose_rebuy_type=82,
  str_choose_option=83,
  str_rebuy_date=84,
  //linechart
  str_cap_left=85,
  str_interests_paid=86,
  str_interests_parenth=87,
  str_savings=88,
  str_graph_title=89,
  str_graph_indication=90,
  //periodic savings form
  str_choose_op_type=91,
  str_choose_op_amount=92,
  str_choose_op_account=93,
  str_choose_op_strat_date=94,
  str_choose_op_end_date=95,
  str_warn_start_date=96,
  str_warn_null_save=97,
  str_warn_neg_save=98,
  str_sel_month=99,
  str_sel_year=100,
  //sio form
  str_sio_type=101,
  str_sio_name=102,
  str_sio_amount=103,
  str_sio_account=104,
  str_sio_date=105,
  str_sio_hint_name=106,
  str_sio_hint_amount=107,
  str_sio_hint_account=108,
  str_sio_hint_date=109,
  str_confirm=110,
  str_sio_warn_date=111,
  str_sio_warn_null_op=112,
  str_sio_warn_reserved=113,
  //bank_utils
  str_savings_empty=114,
  str_unsufficient_savings=115,
  //main layout
  str_restore_last=116,
  str_yes=117,
  str_no=118,
  str_tab_credit=119,
  str_tab_ops=120,
  str_tab_sum=121,
  str_tab_chart=122,
  str_tab_savings=123,
  str_tab_mem=124,
  str_tab_help=125,
  //help page
  str_choose_lang=126,
  str_choose_currency=127,
};

const translatedStrs=ref(
[
  //creditStartForm
  ['Crédit en cours','already signed'],
  ['Simulation','Simulation'],
  ['Date de signature','Signature Date'],
  ['fermer','close'],
  ['Annuler','Cancel'],
  ['Simuler','Simulate'],
  ['Somme empruntée','amount borrowed'],
  ['Vous empruntez, vous ne prêtez pas','You borrow, you don\'t lend'],
  ['Taux','rate'],
  ['Durée d\'meprunt (années)','Loan duration (years)'],
  ['Ce taux semble irréel','this rate seems unreal'],
  ['Entrer une durée positive','Enter a positive duration'],
  ['Valider','Launch simulation'],
  ['Choisir un type de crédit (en cours/simulation)','Choose a credit type (already started/Simulation'],
  ['Renseigner une date de départ','Enter a starting date'],
  ['Renseigner une somme empruntée','Enter a borrowed amount'],
  ['Renseigner un taux','Enter a rate'],
  ['Renseigner une durée','enter a duration'],
  //bank page
  ['Comptes banquaires','Bank accounts'],
  ['Ajouter','Add'],
  ['Nom','Name'],
  ['Montant','Amount'],
  ['Rentabilité','Profitability'],
  ['Capacité d\'épargne','Savings capacity'],
  ['Compte','Account'],
  ['Type','Type'],
  ['à partir de','from'],
  ['jusqu\'à','untill'],
  ['Entrées/Sorties exceptionnelles','Exceptional Incomes/Outcomes'],
  ['Date','Date'],
  ['confirmer','Confirm'],
  ['compte de rattachement non trouvé','Account not found'],
  ['Epargne periodique non trouvé','Periodic saving not found'],
  ['Epargne exceptionnelle non trouvé','Exceptional income/outcome not found'],
  //crediteventsHandler
  ['Date de modulation','modulation date'],
  ['Capital restant du à la date de l\'évènement : ','Capital left to pay at event date :'],
  ['choisir une action','choose an action'],
  ['choisir une mensualité','choose mensuality'],
  ['Sélectionnez une action','Select an action'],
  ['choisir une option','choose an option'],
  ['1 mensualité restante, modulation impossible','1 mensuality left, impossible to modulate'],
  [' (Augmentation de la mensualité : ',' (Mensuality increase : '],
  [' (Réduction de la mensualité : ',' (Mensuality decrease : '],
  [' - Rachat du capital restant dû avec épargne',' - Rebuy of capital with savings'],
  [' - Rachat du capital restant dû à crédit (taux : ',' - reloan (rate : '],
  ['supprimer','delete'],
  ['impossible de déselectionner des évènements dépendant d\'évènements sélectionés','Impossible to unselect events depending on selected events'],
  ['évènements dépendants aussi sélectionnés','depending events selected too'],
  ['évènements dépendants aussi désélectionnés','depending event unselected too'],
  //memory page
  ['Tout supprimer','Delete all'],
  ['Sauvegarder la simulation en cours','Save current simulation'],
  ['Supprimer la simulation','Delete simulation'],
  ['Restaurer la simulation','restore simulation'],
  ['Donner un nom à la sauvegarde ?','Name of current save ?'],
  ['Nom par Défaut','Default name'],
  ['Ajouter un nom ','Custom name'],
  //summary
  ['Résumé de la simulation','Simulation summary'],
  [' Mensualité : ',' Mensuality : '],
  [' fin de l\'emprunt : ',' end of loan : '],
  [' coût total : ',' total cost : '],
  ['Crédit initial','initial loan'],
  ['différence en interêts : (/','total cost difference : (/'],
  ['différence en interêts : (/Crédit initial) : ','total cost difference : (/initial loan) : '],
  ['capital racheté : ','capital rebought : '],
  ['Economies restantes après rachat : ','Savings left after rebuy : '],
  ['Nouveau taux : ','new rate : '],
  //account form
  ['Saisir un nom (facultatif, \'suivant\' pour utiliser le nom par défaut)','Enter a name (optional, press \'next\' to use default name'],
  ['nom du compte','account name'],
  ['choisir un nom plus court','Choose shorter name'],
  ['suivant','next'],
  ['précédent','previous'],
  ['valider','validate'],
  ['Saisir le montant actuel sur le compte','enter current amount on account'],
  ['Montant','Amount'],
  ['Les dettes ne sont pas gérées','debts are not handled'],
  ['Renseignez la rentabilité annuelle du compte','Enter account profitability'],
  ['rentabilité','profitability'],
  ['Une épargne de 0 n\'est pas une épargne','Saving 0 is not saving'],
  ['Une dette n\'est pas une épargne','A debt is not a saving'],
  //buypicker
  ['Pénalités','Penalties'],
  ['% du capital restant dû','% of capital left to pay'],
  ['Les pénalités ne sont pas payées par la banque','Penalties are not paid by the bank'],
  ['choisir un type de rachat','choose a rebuy type'],
  ['choisir une option','choose an option'],
  ['Date de rachat','Rebuy date'],
  //linechart
  ['Capital restant','Capital left'],
  ['interets payés','Interests paid'],
  ['interets (','interests ('],
  ['économies','savings'],
  ['Capital, interêts et économies','Capital, interests, and savings'],
  ['Pour changer l\'affichage, pressez longtemps sur le graphe','To change display, hold a long touch on graph'],
  //periodic savings form
  ['Choisir le type d\'opération','select saving periodicity'],
  ['Saisir le montant de l\'opération','Choose periodic saving amount'],
  ['Saisir le compte impacté par l`\'opération','select account to proceed periodic saving'],
  ['Saisir la date de la première opération periodique','Select a starting date for periodic saving'],
  ['(Facultatif) Saisir la date de la dernière opération periodique. L\'opération sera considérée infinite si non saisie.','(Optional) Select periodic saving end date. Operation considered infinite if not set'],
  ['Il faut renseigner une date de départ','Setting a starting date is mandatory'],
  ['Une épargne de 0, même périodique, ne va rien rapporter','Saving 0 periodically will not make you rich'],
  ['Une épargne négative n\'est pas un épargne','A negative saving is a spending'],
  ['choisir un mois ','Choose a month'],
  ['choisir une année ','Choose a year'],
  //sio form
  ['Renseignez le type d\'opération expectionelle','Select exceptional operation type'],
  ['Renseignez le nom d\'opération expectionelle (facultatif)','enter the exceptional operation name (optional)'],
  ['Renseignez le montant de l\'opération','Enter the operation amount'],
  ['Choisissez le compte impacté par l\'opération','Select account to proceed operation'],
  ['Choisissez la date de l\'opération','Select operation date'],
  ['Nom de l\'opération','Operation name'],
  ['Montant de l\'opération','Operation amount'],
  ['Compte concerné','Account'],
  ['Date de l\'opération','Operation date'],
  ['Confirmer','Confirm'],
  ['Il faut renseigner une date ! Sinon remplir les comptes bancaires !','Date selection is mandatory. Fill "Bank account" otherwise'],
  ['Une entrée ou sortie d\'argent nulle n\'a pas d\'effet','A zero income or outcome has no effect'],
  ['Ce nom est réservé. Choisir un autre nom','Name reserved, choose another name'],
  //bank_utils
  ['onglet épargne non renseigné','Savings not filled'],
  ['economies insuffisantes','unsufficient savings'],
  //main layout
  ['Reprendre la dernière simulation sauvegardée ?','Resume last saved simulation ?'],
  ['oui','yes'],
  ['non','no'],
  ['Crédit','Loan'],
  ['Opérations','Operations'],
  ['Résumé','Summary'],
  ['Graphique','Chart'],
  ['épargne','Savings'],
  ['Mémoire','Memory'],
  ['aide','help'],
  //help page
  ['changer la langue','change language'],
  ['Changer de monnaie','Change currency'],
]);

const getLangId=function()
{
  return (LocalStorage.has('currentLanguage') ? (LocalStorage.getItem('currentLanguage')=='Français' ? 0 : 1) : 0);//french as default
}
export const transStr=function(index:number)
{
  return translatedStrs.value[index][getLangId()];
}
//------------------------------------------------------------------------//
//                      Sentences                                         //
//------------------------------------------------------------------------//
export enum sentancesIDs {
  s_warning_overwriteSimu=0,
  s_warning_acc_delete_rebuy_op=1,
  s_warning_acc_rebuy_op=2,
  s_warning_op_rebuy_delete=3,
  s_warning_post_rebuy_ops=4,
  s_info_savings_only_p1=5,
  s_info_savings_only_p2=6,
  s_warning_out_sio_rebuy_del=7,
};
const translatedSentances=ref(
  [
  ['Vous êtes sur le point de simuler un nouveau crédit, cela supprimera la simulation en cours si vous ne l\'avez pas sauvegardée. Vous pouvez sauvegarder la simulation dans l\'onglet "mémoire". Pour écraser la simulation en cours, choisir "Simuler". Sinon, choisir "Annuler".',
   'You are about to start a new simulation, this will erase the current simulation, if not saved. You can save the current simulation in "memory" tab. To start a new simulation and overwrite current simulation, choose "simulate". Otherwise, choose "cancel'],

  ['Vous êtes sur le point de supprimer un compte utilisé pour racheter votre crédit. Cela supprimera également le rachat du crédit si vous confirmez.',
    'You are about to delete an account involved in the rebuy of you credit with savings. This will also delete the credit rebuy operation if you confirm.'],

  ['Vous êtes sur le point de supprimer une opération sur un compte contribuant au rachat votre crédit. Cela supprimera également le rachat du crédit si vous confirmez.',
    'You are about to delete an operation on an account involved in the rebuy with savings of your credit. This will also delete the rebuy operation if you confirm' ],

  ['Vous êtes sur le point de supprimer une opération contribuant au rachat votre crédit. Cela supprimera également le rachat du crédit si vous confirmez.',
    'You are about to delete an operation involved in the rebuy of you credit with savings. This will also delete the rebuy of your credit operation if you confirm'],

  ['Des opérations postérieures au rachat de crédit ont été renseignées. Ces opérations ne font plus sens après un rachat. Ces opérations seront supprimées si vous validez :',
   'Some operation occure after the credit rebuy. These operations make no sense after a rebuy. These operation will be deleted if you validate :'],

  ['Aucun crédit n\'a été renseigné, mais certaines économies oui. Les premières économies ont été renseignées pour le ',
   'No credit is being simulated, but you set up your savings. The first savings have been set up from '],

  ['. Sur combien d\'anées afficher les économies ?',
   '. How many years of savings evolution do you want to display ?' ],
  ['Vous êtes sur le point de retirer de l\'argent d\'un compte impliqué dans le rachart de votre crédit à une date antérieure au Rachat. Cela supprimera le rachat du crédit si vous confirmez.',
   'you are about to remove money from an account involved in the rebuy of the loan with savings at a date anterior to the rebuy date. This will delete the rebuy with saving operation if you confirm'],


]
);
export const transSt=function(index:number)
{
  return translatedSentances.value[index][getLangId()];
}


//------------------------------------------------------------------------//
//                      SavingsP type                                     //
//------------------------------------------------------------------------//
export const savings_p_opt=ref(
  [
['mensuelle','montly'],
['anuelle','yearly']
  ]
);
export const transoptSaveP=function(index:number)
{
  return savings_p_opt.value[index][getLangId()];
}
export const getOptSavePFromStr=function(input:string)
{
  for(let i=0;i<supportedLanguages.value.length;i++)
  {
    if(input==savings_p_opt.value[BANK_SAVE_TYPE_MONTHLY][i])
    {
      return BANK_SAVE_TYPE_MONTHLY;
    }
    else if(input==savings_p_opt.value[BANK_SAVE_TYPE_YEARLY][i])
    {
      return BANK_SAVE_TYPE_YEARLY;
    }
  }
}
//------------------------------------------------------------------------//
//                      single IO type and title                          //
//------------------------------------------------------------------------//
export const sio_opt=ref(
  [
['Entrée','Income'],
['Sortie','Outcome']
  ]
);
export const transoptSIO=function(index:number)
{
  return sio_opt.value[index][getLangId()];
}
export const getOptSIOFromStr=function(input:string)
{
  for(let i=0;i<supportedLanguages.value.length;i++)
  {
    if(input==sio_opt.value[BANK_SIO_TYPE_IN][i])
    {
      return BANK_SIO_TYPE_IN;
    }
    else if(input==sio_opt.value[BANK_SIO_TYPE_OUT][i])
    {
      return BANK_SIO_TYPE_OUT;
    }
  }
}
export const sio_special_name=ref(

['rachat avec économies','rebuy with savings'],

);
export const is_sio_special_name=function(name:string)
{
  for(let i=0;i<supportedLanguages.value.length;i++)
  {
    if(name==sio_special_name.value[i])
    {
      return true;
    }
  }
  return false;
}
export const transSIOspecial=function()
{
  return sio_special_name.value[getLangId()];
}
//------------------------------------------------------------------------//
//                     Event type and metatype                            //
//------------------------------------------------------------------------//
export const evt_meta_type=ref(
  [
['modulation','Modulation'],
['Rachat','Rebuy']
  ]
);
export const transevtmetaType=function(type:number)
{
  return evt_meta_type.value[type][getLangId()];
}
export const optionsEvtType = ref([
  ['Augmenter la durée - réduire la mensualité', 'Réduire la durée - augmenter la mensualité'],
  ['Increase duration - decrease mensuality','Decrease duration - increase mensuality']
]);
export const transevtmodType=function()
{
  return optionsEvtType.value[getLangId()];
}
export const getModTypeFromStr=function(input:string)
{
  for(let i=0;i<supportedLanguages.value.length;i++)
    {
      if(input==optionsEvtType.value[i][EVT_TYPE_MOD_MENS_DOWN])
      {
        return EVT_TYPE_MOD_MENS_DOWN;
      }
      else if(input==optionsEvtType.value[i][EVT_TYPE_MOD_MENS_UP])
      {
        return EVT_TYPE_MOD_MENS_UP;
      }
    }
}
//------------------------------------------------------------------------//
//                     Rebuy type and metatype                            //
//------------------------------------------------------------------------//

export const optionsRebuyType = ref([
  ['Rachat avec épargne', 'Rachat à crédit - meilleur taux'],
  ['Rebuy with savings','Rebuy with loan']
]);
export const transRebuymodType=function()
{
  return optionsRebuyType.value[getLangId()];
}
export const getrebuyTypeFromStr=function(input:string)
{
  for(let i=0;i<supportedLanguages.value.length;i++)
    {
      if(input==optionsRebuyType.value[i][EVT_TYPE_REBUY_SAVINGS])
      {
        return EVT_TYPE_REBUY_SAVINGS;
      }
      else if(input==optionsRebuyType.value[i][EVT_TYPE_REBUY_CREDIT])
      {
        return EVT_TYPE_REBUY_CREDIT;
      }
    }
}
//------------------------------------------------------------------------//
//                        DATES HANDLING                                  //
//------------------------------------------------------------------------//

 const formatCalendar_fr = {
  /* starting with Sunday */
  days: 'Dimanche_lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
  daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
  months: 'Janvier_Fevrier_Mars_Avril_mai_Juin_Juillet_Aout_Septembre_Octobre_Novembre_Decembre'.split('_'),
  monthsShort: 'jan_Fev_Mar_Avr_Mai_Jui_Jui_Aou_Sep_Oct_Nov_Dec'.split('_'),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'jours'
};
 const formatCalendar_en = {
  /* starting with Sunday */
  days: 'sunday_Monday_Tuesday_wednesday_Thursday_Friday_Saterday'.split('_'),
  daysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  months: 'January_February_March_April_may_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'days'
};

const formatcalendars =
[
  formatCalendar_fr,formatCalendar_en
];

export const getTranslatedFormatedCalendar=function()
{
  return formatcalendars[getLangId()];
}





const month_names = [[
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
  'Decembre'],
  [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
  ]
];
export const transMonthName=function(month:number)
{
  return month_names[getLangId()][month];
}
export const getMonthNbr=function(month_in:string)
{
  //walk over all languages to prevent bugs if user switched
  for(let i=0;i<supportedLanguages.value.length;i++)
  {
    let count=1;
    while(count<=month_names[i].length)
    {
      if(month_in==month_names[i][count-1])
      {
        return count;
      }
      count++;
    }
  }
}
