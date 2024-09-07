

import { LocalStorage } from 'quasar';
import {ref} from 'vue'
import {BANK_SAVE_TYPE_MONTHLY,BANK_SAVE_TYPE_YEARLY,BANK_SIO_TYPE_IN,BANK_SIO_TYPE_OUT } from 'src/utils/bank_utility';
import {  EVT_TYPE_MOD_MENS_UP, EVT_TYPE_MOD_MENS_DOWN, EVT_TYPE_REBUY_CREDIT, EVT_TYPE_REBUY_SAVINGS} from '../utils/credit_utility'
export const supportedLanguages=ref(['Français','English']);
export const rerenderMainlayout=ref(0);
export const FRENCH_ID =0;
export const ENGLISH_ID =1;
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
  str_choose_mod=36,
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
  //notify utils
  str_not_show_again=128,
  //help page notifs
  str_display_help=129,
  //picker
  str_choose_evt_type=130,
  str_indic_penalties=131,
  str_indic_rebuy_type=132,
  //creditstratform
  str_unit_y=133,
  str_unit_m=134,
  str_credit_fill=135,
  //bank again
  str_ps_period=136,
  //credit start form again
  str_credit_fill_again=137,
  str_mens_only=138,
  //help again !!
  str_settings=139,
  str_simulate_credit=140,
  str_modulate_credit=141,
  str_reloan_credit=142,
  str_savings_help=143,
  str_rebuy_savings_help=144,
  //TUTORIAL
  str_tuto_welcome=145,
  str_tuto_play=146,
  str_tuto_giveUp=147,
  str_tuto_credit=148,
  str_tuto_events_1=149,
  str_tuto_events_2=150,
  str_tuto_events_3=151,
  str_tuto_events_4=152,
  str_tuto_events_5=153,
  str_tuto_Sum = 154,
  str_tuto_sum_1=155,
  str_tuto_sum_2=156,
  str_tuto_sum_3=157,
  str_tuto_sum_4=158,
  str_tuto_chart_1=159,
  str_tuto_chart_2=160,
  str_graph_indication_2=161,
  str_tuto_chart_3=162,
  str_tuto_chart_4=163,
  str_tuto_chart_5=164,
  str_tuto_bank_1=165,
  str_tuto_bank_2=166,
  str_tuto_bank_3=167,
  str_tuto_bank_4=168,
  str_tuto_bank_5=169,
  str_tuto_bank_6=170,
  str_tuto_mem_1=171,
  str_tuto_mem_2=172,
  str_tuto_mem_3=173,
  str_tuto_mem_4=174,
  str_tuto_mem_5=175,
  str_tuto_mem_6=176,
  str_tuto_mem_7=177,
  str_tuto_tuto  =178,
  str_tuto_helpP_1=179,
  str_tuto_helpP_2=180,
  str_tuto_helpP_3=181,
  str_tuto=182,
  str_tuto_process_1=183,
  str_tuto_process_2=184,
  str_tuto_process_3=185,
  str_tuto_process_4=186,
  str_tuto_process_5=187,
  str_tuto_process_6=188,
  str_tuto_process_7=189,
  str_tuto_process_8=190,
  str_tuto_process_9=191,
  str_tuto_process_10=192,
  str_tuto_process_11=193,
  str_tuto_process_12=194,
  str_tuto_process_13=195,
  str_tuto_process_14=196,
  str_tuto_process_15=197,
  str_tuto_process_16=198,
  str_tuto_process_17=199,
  str_tuto_process_18=200,
  str_tuto_process_19=201,
  str_cap_simulate_credit=202,
  str_cap_modulate_credit=203,
  str_cap_rebuy=204,
  str_cap_savings_simu=205,
  str_cap_coffee=206,
  str_tuto_icon=207,
  str_tuto_video=208,
  str_ops_cap_reloan=209,
  str_ops_cap_rebuy=210,
  str_tuto_chart_cpmlnt_1=211,
  str_tuto_chart_cpmlnt_2=212,
  str_tuto_chart_cpmlnt_3=213,
  str_tuto_chart_cpmlnt_4=214,
  str_tuto_chart_cpmlnt_5=215,
  str_tuto_chart_cpmlnt_6=216,
  str_tuto_chart_cpmlnt_7=217,
  str_tuto_save_cap_1=218,
  str_tuto_save_cap_2=219,
  str_tuto_save_cap_3=220,
  str_tuto_save_en_intro=221,
  str_tuto_save_en_1=222,
  str_tuto_save_en_2=223,
  str_tuto_save_proc_intro=224,
  str_tuto_save_proc_1=225,
  str_tuto_save_proc_2=226,
  str_tuto_save_proc_3=227,
  str_tuto_save_proc_4=228,
  str_tuto_save_proc_5=229,
  str_tuto_save_proc_6=230,
  str_tuto_mem_content_1=231,
  str_tuto_mem_content_2=232,
  str_tuto_mem_content_3=233,
  str_tuto_mem_content_4=234,
  str_mod_down_consequence=235,
  str_mod_up_consequence=236,
};

const translatedStrs=ref(
[
  //creditStartForm
  ['Crédit en cours','already signed'],
  ['Simulation','Simulation'],
  ['Entrez la date de signature','Set signature date'],
  ['fermer','close'],
  ['Annuler','Cancel'],
  ['Simuler','Simulate'],
  ['Renseignez la somme empruntée','Set the amount borrowed'],
  ['Vous empruntez, vous ne prêtez pas','You borrow, you don\'t lend'],
  ['Renseignez le taux d\'emprunt hors assurance','Set the loan rate, credit insurance excluded'],
  ['Renseignez la durée de l\'emprunt','Set the loan duration'],
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
  ['jusqu\'à','until'],
  ['Entrées/Sorties exceptionnelles','Exceptional Incomes/Outcomes'],
  ['Date','Date'],
  ['confirmer','Confirm'],
  ['compte de rattachement non trouvé','Account not found'],
  ['Epargne periodique non trouvé','Periodic saving not found'],
  ['Epargne exceptionnelle non trouvé','Exceptional income/outcome not found'],
  //crediteventsHandler
  ['Date de modulation (la modulation sera effective sur la mensualité du mois choisi) :','Modulation date (modulation effective on selected month) :'],
  ['Capital restant du à la date de l\'évènement : ','Capital left to pay at event date :'],
  ['Renseignez le type de modulation ainsi que la mensualité souhaitée','Select modulation type and desired mensuality'],
  ['choisir une mensualité','choose mensuality'],
  ['Sélectionnez une action','Select an action'],
  ['choisir une option','choose an option'],
  ['1 mensualité restante, modulation impossible','1 mensuality left, impossible to modulate'],
  ['Augmentation de la mensualité : ','Mensuality increase : '],
  ['Réduction de la mensualité : ','Mensuality decrease : '],
  ['Rachat du capital restant dû avec épargne',' - Rebuy of capital with savings'],
  ['Rachat du capital restant dû à crédit (taux : ',' - reloan (rate : '],
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
  ['Pour stopper l\'annimation, tapez sur le graphe','To stop animation, tap on graph'],
  //periodic savings form
  ['Choisir le type d\'opération','select saving periodicity'],
  ['Saisir le montant de l\'opération','Choose periodic saving amount'],
  ['Saisir le compte impacté par l`\'opération','select account to proceed periodic saving'],
  ['Saisir la date de la première opération periodique','Select a starting date for periodic saving'],
  ['(Facultatif) Saisir la date de la dernière opération periodique. L\'opération sera considérée infinite si non saisie. Dernier mois inclus.','(Optional) Select periodic saving end date. Operation considered infinite if not set. Last month is included.'],
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
  //notify utils
  ['ne plus voir','don\'t show again'],
  //help page notifs
  ['afficher l\'aide','Display tips'],
  ['choisir le type d\'évènement','Choose event type'],
  //Picker
  ['Renseignez les pénalités contractuelles de rachat','Enter contractual rebuy penalties'],
  ['Renseignez le type de rachat. Rachat avec épargne disponible seulement si l\'épargne a été renseignée','Select rebuy type. Rebuy with savings allowed only if savings are filled'],
  //creditstratform
  ['Années','Years'],
  ['Mois','Month'],
  ['Simuler','Simulate'],
  //bank again
  ['Période','from/to'],
  //credit start form again
  ['Nouvelle simulation','New Simulaiton'],
  ['mensualités','mensualities'],
  //help again !!
  ['Paramètres','Settings'],
  ['Comment simuler un crédit','How to simulate credit'],
  ['Comment moduler un crédit','How to modulate credit'],
  ['Comment racheter avec un crédit','How to reloan'],
  ['Comment renseigner l\'épargne','How to set your savings'],
  ['Comment racheter votre crédit avec votre éoargne','How to rebuy your credit with savings'],
  //TUTORIAL
  ['Bienvenue dans la supercalculette Credit Play !',
   'Welcome to the super finance calculator Credit Play !'],
   ['Lancer le tuto','Launch toturial'],
   ['Je suis déjà un expert','No need. I am an expert'],
   ['Vous pouvez à simuler votre crédit en cliquant sur ce bouton. Après avoir renseigné la somme empruntée, le  taux, et la durée, vous serez dirigé vers l\'onglet résumé où vous pourrez voir les données de votre crédit. Cela débloquera les onglets opérations et graphique.',
    'You can start simulating your credit by clicking this button. After having set your credit amount, duration, and rate, you will land on the summary tab, where your credit data will appear. This will also unlock the operation and chart tabs'
   ],
   ['L\'onglet operations est le coeur de l\'application ! Vous pouvez simuler successivement :',
    'Welcome to operations tab ! This is the core of the app ! You can simulate a sequence of: '
   ],
   ['Vous ne pourrez ajouter des évènements que si votre crédit a été renseigné (onglet précédent). Notez que le rachat de votre crédit avec de l\'épargne sera la dernière opération car vous aurez remboursé la totalité du crédit. Pour ajouter une opération cliquer sur \'AJOUTER\'.',
    'This tab will be available once you\'ll have simulated your credit (previous tab). Note that after having simulated a rebuy of your credit with savings, you are no longer allowed to add some operations on your credit because it will no longer exist. To add an operation, click \'ADD\'.'
   ],
   ['Les opérations seront appliquées successivement sur votre crédit. Si vous supprimez une opération, vous supprimerez également toutes les suivantes, car leur résultat dépend de l\'opération supprimée. Pour supprimer une opération, sélectionnez-la et cliquez sur \'SUPPRIMER\'.',
    'Operations are applyed one after the other on your credit. If you delete an operation, it will also delete all the following ones, which computation is based on the operation you deleted. To delete an operation, select it in the list and click \'DELETE\'.'
   ],
   ['Voici un faux jeu d\'opérations pour le tuto. Supprimez toutes les opérations.',
    'Here is a set of fake operations for the tuto. Delete all operations, '
   ],
   [' ', ''],//unused
   ['L\'onglet résumé synthétise le résultat de vos opérations de crédit. Vous pourrez voir ici combien d\'argent vous avez économisé ou perdu en modulant ou rachetant votre prêt. Le résultat de chaque opération sera comparé à votre crédit initial et à l\'opération précédente, si vous avez enchaîné les opérations (modulations, rachats...). Touchez l\'écran pour en savoir plus.',
    'In the summary tab, the results of all you operations are displayed as a timeline. You can see how much money you saved or lost at each credit operation (mensuality increase, decrease, or credit rebuy at different rate). Each operation result is compared to your initial loan and to the result of the previous operation. Tap screen to discover more.'],

   ['La modulation 1 vous a fait gagner 11 938,45 d\'intérêts par rapport au coût du crédit initial. Touchez l\'écran pour continuer',
    'First modulation made you save 11938.45 compared to the initial credit cost. Tap screen' ],

   ['La modulation 2 (combinée à la première) vous a fait gagner 8 504,89 d\'intérêts par rapport au coût du crédit initial mais perdre 3 433,56 par rapport au coût du crédit avec la modulation 1. Touchez l\'écran pour continuer',
    'Second modulation (combined to the first) made you save 8504.89 compared to the initial credit cost but lose 3433.56 compared to credit cost with only modulation 1. Tap screen' ],

   ['Le premier rachat (combiné aux deux modulations) vous a fait gagner 26 814,01 d\'intérêts par rapport au coût du crédit initial et 18 309,12 par rapport au coût du crédit avec les deux modulations combinées. Touchez l\'écran pour continuer',
    'First rebuy (combined to the two modulations) made you save 26814.01 compared to the initial credit cost and 18309 compared to credit cost with the combination of the two modulations. Tap screen' ],

   ['Le second rachat (combiné au premier ainsi qu\'au deux modulations) vous a fait gagner 30 631,83 d\'intérêts par rapport au coût du crédit initial et 3817,82 par rapport au coût du crédit avec les deux modulations et le premier rachat.',
    'Second rebuy (combined to the two modulations and the first rebuy) made you save 30 631.83 compared to the initial credit cost and 3817.82 compared to first rebuy combined with the two modulations.'],

   ['Vous trouverez ici :',
    'You will find here:'],

    ['Si vous avez des économies de renseignées dans l\'onglet dédié (nous le verrons plus tard), vous verrez leur évolution au cours du temps ici. Il apparaîtront à la fin de l\'annimation. Les économies sont toujours affichées en vert. Taper sur l\'écran pour en savoir plus.',
     'If you set up your savings in the dedicated tab (we\'ll discover it later), you can see the evolution of the amount here. It will be displayed at the end of the animation. Savings are always displayed in green color. Tap screen to discover more ! '],

    ['Touchez le graphe pour relancer l\'annimation',
      'Tap screen to relaunch animation'
    ],
    ['Attendez la fin de l\'animation.',
     'Wait until the end of animation.'],

    ['Relancez-l\'annimation si nécessaire',
     'Relaunch annimation if you need'],

    ['fermez le tuto',
     'close tutorial'],

    ['Vous pouvez ici renseigner : ',
     'This is were you can set up :'],

     ['Une fois que vous aurez créé un ou plusieurs comptes, vous pourrez ajouter des épargnes mensuelles ou annuelles vers ce compte. Vous pouvez mettre une date de fin à ces épargnes, par exemple pour en modifier le montant en en ajoutant une nouvelle qui commencera à la date de fin de la précédente, avec un nouveau montant. Si aucune date de fin n\'est renseignée, l\'épargne est considérée infinie à partir de la date de départ. Touchez l\'écran pour en savoir plus.',
      'Once you will have created one or more accounts, you will be able to add monthly or yearly savings capacities. You can set up an end date to these savings capacity, in order to, for instance, modify the amount save by creating a new saving capacity that starts when the previous one ends, with a different amount saved. If no end date is set up, the periodic saving is considered infinite from strating date. Tap screen to learn more !'],

    ['Vous pouvez aussi ajouter des entrées/sorties exceptionelles ici afin de prévoir des achats/ventes qui sortent de vos dépenses ordinaires (exemple : achat d\'une voiture). Vous noterez que si vous rachetez votre crédit avec votre épargne (onglet \'opérations\'), une dépense exceptionnelle sera automatiquement renseignée sur tous les comptes impactés par le rachat (les comptes à plus faible rentabilité sont utilisés en priorité). Touchez ce texte pour en décourvrir plus !',
     'You can also add some exceptional incomes/outcomes here in order to plan some unusual expenses or incomes, for instance, buy a car. Note that if you rebuy your credit with your savings, some exceptional outcomes will automatically be added here on all accounts impacted by the rebuy operation (the less profitable accounts are used first by default). Tap this text to discover more !'],

    ['Ajoutez les comptes ici. Vous pouvez voir leur montant à la création ainsi que leur rentabilité. Pour rappel, créer un compte est indispensable avant de passer aux étapes suivantes. Touchez l\'écran pour en savoir plus.','Add accounts here. Amount at creation and profitability are displayed. Reminder : create an account is mandatory for next steps. Tap screen to discover more.'],

    ['Ajoutez votre capacité d\'épargne ici. Sur un même compte, vous pouvez ajouter plusieurs lignes d\'épargne qui commencent et finissent à des dates différentes. Pour rappel : une épargne sans date de fin est considérée infinie à partir de la date de création. Touchez ici pour en découvrir plus.',
     'Add your savings capacity here. On a given account, several periodic savings (that start and finish -if they do- at different dates). Reminder : if you do not set up the end date for a periodic saving it is considered infinite from start date. Tap here to discover more.'],

    ['Ajoutez vos entrées/sorties exceptionelles ici. Si vous rachetez votre crédit avec vos économies, une dépense exceptionnelle est renseignée sur tous les comptes impactés (celui avec le taux le plus faible est vidé en priorité).',
     'Add here your exceptional incomes/outcomes. Reminder : if you rebuy your credit with your savings, an expetional outcome will automatically appear on every account impacted by the rebuy of your credit. (the less profitable account is emptyed first).'],

    ['Vous pouvez ici gérer vos simulations sauvegardées. Sauvegarder vos simulations vous permet de les restaurer et/ou de les modifier entre deux utilisations de l\'application.',
     'You can manage saved simulations here. Save your simulations allows you to restore and/or modify them between two application usage.' ],

    ['Votre sauvegarde de simulation contient :',
     'Your saved simulation contains :' ],

    ['Voici un ensemble de simulations sauvegardées. Sauvegardez notre exemple avec le nom de votre choix. Pour ce faire cliquez sur "Savergarder la simulation en cours" puis renseignez un nom, enfin, sélectionnez "Ajoutez un nom".',
     'Here is a set of saved simulations. Save the current simulation with a the name of your choice. To do so, click "Save current simulation", then set a name and click "Custom name".' ],

    ['Note : si vous aviez choisi "Nom par défaut" la simulation aurait été sauvegardée sous le nom "Simulation x", avec x un nombre.',
     'Note : if you had chosen "Default name", simulation would have been saved as "Simulation x", with x being a number.' ],

    ['Maintenant, supprimez la simulation que vous venez de sauvegarder. Pour ce faire, cliquez sur l\'icône corbeille de la simulation.',
     'Now, delete the simulation you just saved. To do so, click on trash icon of the simulation you just saved.'  ],

    ['Maintenant, supprimez toutes les sauvegardes de simulation . Pour ce faire, cliquez sur " Tout supprimer".',
     'Now, delete all saved simulations, to do so, press "Delete All".' ],

    ['Bravo ! Vous pouvez restaurer une simulation sauvegardée en la sélectionnant et en cliquant sur "restaurer", ce qui vous amènera automatiquement sur l\'onglet "résumé". Comme vous connaissez déjà cet onglet, cette fonctionnalité est désactivée pout le tuto.',
     'Well done ! You can restore a saved simulation by selecting it and clicking "restore". This will automatically move to the summary tab. As we already know it, this feature is disabled in tuto mode.'
    ],

    ['Lancer le tuto',
     'Launch tutorial' ],

    ['Bienvenue dans l\onglet aide ! Vous pouvez ici paramétrer la langue et la monnaie de votre choix, mais aussi relancer ce tuto si nécessaire, grâce aux trois boutons dédiés ci-dessus. Tapez ici pour en découvrir plus !',
     'Welcome to the help tab ! You can set the language and currency of the app here, and relaunch this tuto if necessary. Tap this text to learn more !'
    ],

    ['Toutes les fonctionnalités qui n\'ont pas été détaillées dans le tuto (comment simuler ou moduler un crédit, par exemple) sont présentées ci-dessous sous forme de vidéos. Prenez le temps de les regarder en cas de doute ! Tapez ici pour en découvrir plus',
     'All procedures that haven\'t been explained in this tutorial (how to simulate or modulate a credit, for instance) are detailed here in short videos. tap screen to discover more !' ],

    ['Il est temps pour moi de vous dire au revoir et pour vous de commencer votre enthousiasmante aventure d\'optimisation de vos finances. C\'est la fin de ce tutoriel, tapez ici pour sortir.',
     'It is time for me to say goodbye and for you to start your exciting journey to optimize your money ! This is the end of this tutorial, tap here to exit'],

    ['tutoriel', 'tutorial' ],

    //tuto process


    ['Bienvenue dans la supercalculette Credit Play !',
     'Welcome to the super finance calculator Credit Play !'],

    ['Encore un simulateur de crédit classique ?','Another loan simulator ?'],

    ['Pas exactement !','Not exactly !'],

    ['Voici tout ce que vous pouvez faire avec Credit Play :',
     'Credit Play provides :'],

    ['Saviez vous qu\'avec un taux élevé, augmenter vos mensualités peut vous faire gagner plusieurs dizaines de milliers d\'euros en intérêts ? Saviez-vous que les diminuer peut vous en faire perdre tout autant ?',
     'Did you know that with a high credit rate, increase your mensualities can make you save tens of thousands on your credit cost ? Did you know that you can loose the same amount when decreasing the mensuality amount ? '],

    ['Savez-vous qu\'avec des taux élevés, racheter votre crédit avec votre épargne peut également vous faire économiser des millers d\'euros en interêts, malgré les pénalités contractuelles ?',
     'did you know that with a high loan rate, rebuy your loan with your savings can make you save thousands, despite contractual penalties ?'
     ],

    ['Credit Play vous permetra de simuler l\'impact de toutes ces opérations ...','Credit Play provides the ability to simulate all these operations...'],

    ['Et plus encore ! Vous pourrez combiner un nombre illimité d\'opérations (modulations de mensualités, rachat à meilleur taux, rachat avec épargne) !',
     'And even better ! You\'ll be able to combine an unlimited number of operations (mensuality increase/decrease, rebuy at different rate, rebuy with savings) !'],

    ['Pour apprendre à utiliser Credit Play, lancer le tuto ! (Vous pourrez le lancer à volonté depuis le menu d\'aide).','To learn how to get profit from Credit PLay, launch tutorial ! (you can launch it at any time in the help tab).'],
      //10 v
    ['Pour une utilisation optimale de Credit Play, suivez ces étapes : ','For a better use of Credit Play, perform the following steps :'],

    ['Simulez votre crédit','Simulate your loan'],

    ['Taux, campital emprunté, durée'],

    ['Rensignez votre capacité d\'épargne [Facultatif]','Set up you saving capacity [Optionnal]'],

    ['Créez des comptes, ajoutez des épargnes, planifiez des entrées/sorties', 'Create accounts, add periodic savings, plan incomes/outcomes'],

    ['Simulez des opérations','Simulate operations'],

    ['Modulations, rachat à meilleur taux, rachat avec épargne', 'Modulations, rebuy with better rate, rebuy with savings'],

    ['Sauvegardez vos scénarios', 'Save your simulations'],

    ['Comparez les scénarios','Compare your simulations'],

    ['Trouvez le compromis mensualité/épargne qui vous correspond','Find out the mensuality/savings tradeoff that fits you best !'],

    ['Simuler votre credit','Loan simulation'],
    ['Moduler votre credit (augmentation ou diminution de mensualité)','Loan modulation (mensuality increase or decrease)'],
    ['Rachat de votre crédit (avec un taux différent ou votre épargne)','Loan rebuy (different rate or with savings)'],
    ['Simuler votre épargne','Savings simulation'],
    ['Faire le café','Make coffee'],

    ['Dans tous les onglets de l\'application, vous pourrez obtenir de l\'aide en cliquant sur cet icône :','In all app tabs, if you need help click this icon : '],

    ['Voir la vidéo','Watch video'],

    ['Rachat du crédit à un nouveau taux','Loan rebuy at better rate'],
    ['Rachat du crédit avec épargne','Loan rebuy with savings'],

    ['Le capital et les intêrets de votre crédit initial toujours affichés en rouge',
     'Capital and interests of your initial loan always displayed in red'],
    ['Le capital et les interêts du résultat des opérations toujours affiché en gris',
     'Capital and interests of the result of operations always displayed grey'],
    ['Vos économies toujours affiché en vert',
     'Your savings always displayed in green'],
    ['Des indicateurs visuels pour repérer vos opérations',
     'Visual indicators to spot your operations'],
     ['Touchez l\'écran pour voir la suite','Tap screen to learn more !'],

    ['Les opérations seront successivement affichées sous forme d\'annimation. Une fois l\'annimation terminée, vous pourrez la relancer en cliquant sur ce bouton, masqué pendant l\'annimation:',
     'Operations will be displayed as an animation. Once the annimation finished, you can replay it  by clicking this button, masked during animation:'],
    ['Essayons ensemble avec un jeu de données spécial tuto. Touchez l\'écran pour commencer','Let\'s try it together with a fake simulation. Tap screen to start'],

    ['Epargne actuelle',
     'Current banking accounts amounts'],

     ['Capacités d\'épargne mensuelle/annuelle',
      'Monthly/yearly savings capacity.'],

     ['Entrées/sorties d\'argent exceptionelles.',
      'Exceptional incomes/outcomes.'],

     ['Cela permet :',
      'It enables : '],

    ['Rachat de votre crédit avec épargne',
     'Loan rebuy with your savings'],

    ['Projection épargne dans le graphe',
     'Savings forecast in the chart tab'
    ],

    ['Voici comment procéder :',
     'Here is the process :'],

     ['Renseignez au moins un compte','Set up at least one account'],

     ['Il peut être vide et avoir une rentabilité nulle','It can be empty and have no profitability'],

     ['[Optionel] Saisissez vos capacités d\'épargne mensuelle et/ou annuelle',
      '[Optional] Set up your monthly and/or yearly saving capacity'],

     ['Il est possible d\'en ajouter plusieurs sur un même compte.',
      'Many entries are possible on a given account'],

     ['[Optionel] Renseignez vos entrées/sorties exceptionnelles','[Optional] Set up exceptional incomes/outcomes'],

     ['Exemple : planifiez l\'achat/vente de votre véhicule','Example : plan your next car purchase/sale'],

    ['Credit initial','Initial loan'],
    ['Opérations (modulations, rachats)','Operations (modulations, rebuys)'],
    ['Epargne','Savings'],
    ['Le nombre de sauvegardes est illimité.','You can save unlimited number of simulations'],

    ['Augmentation du coût total du crédit','Loan total cost will increase'],

    ['Diminution le coût total du crédit','Loan total cost will decrease'],
]);

export const getLangId=function()
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
  return month_names[getLangId()][month-1];
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
