

import { LocalStorage } from 'quasar';
import {ref} from 'vue'
import {BANK_SAVE_TYPE_MONTHLY,BANK_SAVE_TYPE_YEARLY } from 'src/utils/bank_utility';
export const supportedLanguages=ref(['Français','English']);

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
  ['entre ne durée positive','Enter a positive duration'],
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

]);

const getLangId=function()
{
  return (LocalStorage.has('currentLanguage') ? (LocalStorage.getItem('currentLanguage')=='Français' ? 0 : 1) : 0);//french as default
}
export const transStr=function(index:number)
{
  return translatedStrs.value[index][getLangId()];
}
export enum sentancesIDs {
  s_warning_overwriteSimu=0,
};
const translatedSentances=ref(
  [
  ['Vous êtes sur le point de simuler un nouveau crédit, cela supprimera la simulation en cours si vous ne l\'avez pas sauvegardée. Vous pouvez sauvegarder la simulation dans l\'onglet "mémoire". Pour écraser la simulation en cours, choisir "Simuler". Sinon, choisir "Annuler".',
   'You are about to start a new simulation, this will erase the current simulation, if not saved. You can save the current simulation in "memory" tab. To start a new simulation and overwrite current simulation, choose "simulate". Otherwise, choose "cancel'],
  ]
);
export const transSt=function(index:number)
{
  return translatedSentances.value[index][getLangId()];
}


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
