<?php
include('config.php');


/**
 * SVP cela fait un bail que je n'ai pas fait de PHP, alors on ne rigole pas !
 */

if(!isset($_POST)) die('HO HAI!');

// OH HAI BOTS!
if(isset($_POST['bar'])) die('HO HAI BOTS!');

// l'ordre est important, c'est celui de la requête ..
$required_fields = array("email", "name", "gist");
$optionnal_fields = array("website", "twitter");


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

// vérifions les donnéesj, je me rends compte que j'aurai pu faire ça dès le début, j'en sais rien, pourquoi y a 1 million de fonctions dans PHP
if(!filter_var($clean_fields['email'], FILTER_VALIDATE_EMAIL)) {
	die('Error, either you have not entered <strong>a valid email</strong>, either the php filter function is sh*t');
}
if(!filter_var($clean_fields['gist'], FILTER_VALIDATE_URL)) {
	die('Error, either you have not entered <strong>a valid gist url</strong>, either the php filter function is sh*t');
}

// on force des valeurs par défaut (vides ouais), ça évite de faire des tests lors de l'insertion dans la BDD, crado.com j'écoute ?
$clean_fields['website'] = '';
$clean_fields['twitter'] = '';

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

$link = mysql_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PW);

if (!$link) {
    die('DATABASE error, please contact us on <a href="http://twitter.com/webperf_contest">@webperf_contest</a>');
}

$insert = "insert into participant values (";

foreach($clean_fields as $value) {
	$insert .= "'".mysql_real_escape_string($value)."',";
}

// j'attaque la 74eme ligne pour faire une insertion dans une BDD, fantastique
$insert .= "'".uniqid()."');";

// insertion
$query = mysql_query($insert);

if(!$query) {
	die('Error, it seems this email address has already been registered, if you think this is an error please write a message from this particular address to support@webperf-contest.com');
}

mysql_close($link);

?>