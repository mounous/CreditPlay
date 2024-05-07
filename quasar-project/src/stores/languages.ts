

import { LocalStorage } from 'quasar';
import {ref} from 'vue'

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
