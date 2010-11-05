<?php

date_default_timezone_set('Europe/Paris');

include('Mail.php');

include('config.php');

$link = mysql_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PW);

if (!$link) {
    die('DATABASE error 1, please contact us on <a href="http://twitter.com/webperf_contest">@webperf_contest</a>');
}

$db_selected = mysql_select_db(MYSQL_DB, $link);
if (!$db_selected) {
	die('DATABASE error 2, please contact us on <a href="http://twitter.com/webperf_contest">@webperf_contest</a>');
}

mysql_set_charset("utf8");

$languages = array('eng', 'fra');

/**
 * SVP cela fait un bail que je n'ai pas fait de PHP, alors on ne rigole pas !
 */

if(!isset($_POST)) die('HO HAI!');

// OH HAI BOTS!
if(isset($_POST['bar'])) die('HO HAI BOTS!');

// l'ordre est important, c'est celui de la requête sql ensuite ..
$required_fields = array("email", "name", "gist");
$optionnal_fields = array("website", "twitter", "language");


$clean_fields = array();

/**
 * Requis
 */
foreach($required_fields as $field) {
	if(!isset($_POST[$field])) {
		die('You missed one mandatory field, go back please');
	}

	$clean_fields[$field] = strip_tags(trim($_POST[$field]));

	if(empty($clean_fields[$field])) {
		die('You missed one mandatory field, go back please');
	}
}

// vérifions les données, je me rends compte que j'aurai pu faire ça dès le début, j'en sais rien, pourquoi y a 1 million de fonctions dans PHP
if(!filter_var($clean_fields['email'], FILTER_VALIDATE_EMAIL)) {
	die('Error, either you have not entered <strong>a valid email</strong>, either the php filter function is sh*t');
}
if(!filter_var($clean_fields['gist'], FILTER_VALIDATE_URL)) {
	die('Error, either you have not entered <strong>a valid gist url</strong>, either the php filter function is sh*t');
}

// on force des valeurs par défaut (vides ouais), ça évite de faire des tests lors de l'insertion dans la BDD, crado.com j'écoute ?
$clean_fields['website'] = '';
$clean_fields['twitter'] = '';
$clean_fields['language'] = 'eng';

/**
 * Optionnels
 */
foreach($optionnal_fields as $field) {
	if(isset($_POST[$field])) {
		$clean_fields[$field] = strip_tags(trim($_POST[$field]));
	}
}

// vérifions l'url donnée pour le website si il y en a
if(!empty($clean_fields['website']) && !filter_var($clean_fields['website'], FILTER_VALIDATE_URL)) {
	die('Error, either you have not entered a valid <strong>Website url</strong>, either the php filter function is sh*t');
}

// vérifions le language choisi
if(!in_array($clean_fields['language'], $languages)) {
	die("Error, either you are a cheater or I'm a bad programmer");
}

$insert = "insert into participant values (DEFAULT, ";

//utiliser gmdate() pour l'enregistrement de la date d'inscription

foreach($clean_fields as $value) {
	$insert .= "'".mysql_real_escape_string(stripslashes($value))."',";
}


// admin, date, login envoyés
$insert .= "DEFAULT, '".gmdate("Y-m-d H:i:s")."', DEFAULT, DEFAULT,";

// on sauvegarde l'uniqid pour envoit du mail
$uniqid = uniqid();
// uniqdid doit toujours être le dernier champs de la table, ouais c'est idiot et ?! :)
$insert .= "'".$uniqid."');";

// insertion
$query = mysql_query($insert);

var_dump(mysql_error());

if(!$query) {
	die('Error, it seems this email address has already been registered, if you think this is an error please write a message from this particular address to support@webperf-contest.com');
}

mysql_close($link);

$lang = $clean_fields['language'];
// pour l'envoit par mail on a pas besoin des \' \"
// on enlève aussi les noms trop longs, histoire de pas servir de serveur à spam ..
// Là y aura aucun avantage à utiliser le script pour faire du SPAM, certes on peut envoyer des emails à n'importe qui mais par contre on peut pas envoyer grand chose...
$name = stripslashes(substr($clean_fields['name'], 0, 100));
$email = $clean_fields['email'];
// pour tests :
//$email = "wouaren@gmail.com";

// envoi du mail d'inscription
// pour tests :
//$mail = Mail::factory("smtp", array ('host' => 'smtp.free.fr'));
$mail = Mail::factory("sendmail");
$headers['eng'] = array(
	"From"=>"Webperf contest <support@webperf-contest.com>",
	"To"=> $email,
	"Subject"=>"Registration to the webperf contest"
);
$headers['fra'] = array(
	"From"=>"Concours webperf <support@webperf-contest.com>",
	"To"=> $email,
	"Subject"=>"Inscription au concours webperf"
);
$body['eng'] =
<<<EOT
Hello $name,

	your registration to the webperf contest is complete, here's your uniqid :

	------------------------------UNIQID--------------------------------------
                                  $uniqid
	------------------------------/UNIQID-------------------------------------

	Please keep this uniqid secret as it will also be the name of the directory where to put your files on our servers.

	You'll receive your FTP credentials within 24 hours.

	You can download the webpage package and start optimizing it : /webpage.zip

	You'll find a copy of the rules in the file named RULES-EN.html.

	Warning:
	As it was hard to find a good example webpage for the contest. Please do not make bad comments on the code quality or on the webpage architecture.

	It is possible to find dead or strange code, do not argue on this as this is not the purpose of the contest. You can still get rid of it of course (if it is safe).

	Thank you and good luck!

	http://webperf-contest.com
	http://twitter.com/webperf_contest
EOT;
$body['fra'] =
<<<EOT
Bonjour $name,

	votre inscription au concours performance web est complète, voici votre uniqid :

	------------------------------UNIQID----------------------------------------
                                  $uniqid
	------------------------------/UNIQID---------------------------------------

	Merci de garder cet identifiant secret car c'est aussi le nom du dossier dans lequel envoyer vos fichiers sur nos serveurs.

	Vous recevrez vos logins FTP d'ici à 24 heures.

	Vous pouvez d'ores et déjà commencer à optimiser la page web du concours en téléchargeant le package ici : /webpage.zip

	Vous trouverez une copie des règles dans le fichier RULES-FR.html.

	Important :
	Il a été assez difficile d'obtenir l'autorisation d'un gros site web pour utiliser une de ses pages.
	C'est pourquoi nous vous demandons de rester constructifs dans vos éventuelles remarques sur la qualité du code ou sur l'architecture.

	Il est possible que vous trouviez du code inutilisé ou "bizarre", c'est le lot de tous les gros sites web. Vous veillerez à ne pas argumenter sur ce point.

	Merci et bonne chance !

	http://webperf-contest.com/index-fr.html
	http://twitter.com/webperf_contest
EOT;

$mail->send($email, $headers[$lang], $body[$lang]);

if($lang === 'fra') {
	header('Location: confirm-fr.html');
} else {
	header('Location: confirm.html');
}

?>
