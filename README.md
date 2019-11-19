# GOAlpha--Cloud-function


Ky funksion merr si parameter id e fushates se hapur. Ai trigerohet me nje http Call te tipit : https://host.com/campaignId={id}.

Funksionaliteti i funksionit shprehet me hapat me poshte :

1. Hap connection me db  dhe query te gjithe connection te lidhur me projektin te cilit i perket fushata.
2. Loop te te gjithe rezultatet e queryt, Merr subscription String dhe parse si Object.
3. Me pas duke perdorur librarine web push dergon te ky subscription te gjitha te dhenat qe lidhen me fushaten.
4. Ne rast se subscription nuk eshte valid kapet error (401) dhe behet kujdes qe te mos numerohet tek numberSent. (Ne kete pike mund edhe te updatetohen
subscriptionat qe nuk jane valide ne isActive , por nuk u be per arsye kohe.)
5.Ne rast se subscriptioni eshte valid dhe arrihet te cohet njoftimi numerohet tek number send.
6.Updatohet fushata me number sent.
