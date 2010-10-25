<?php
// @vvo : why am I the only one to see ? because I do create FTP accounts...
if ($_SERVER['PHP_AUTH_USER'] == 'vvo') {
	/*
	 * To change this template, choose Tools | Templates
	 * and open the template in the editor.
	 */

	date_default_timezone_set('Europe/Paris');

	include('Mail.php');

	include('../config.php');

	$link = mysql_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PW);

	if (!$link) {
		die('DATABASE error 1, please contact us on <a href="http://twitter.com/webperf_contest">@webperf_contest</a>');
	}

	$db_selected = mysql_select_db(MYSQL_DB, $link);
	if (!$db_selected) {
		die('DATABASE error 2, please contact us on <a href="http://twitter.com/webperf_contest">@webperf_contest</a>');
	}

	mysql_set_charset("utf8");

	$result = mysql_query("select participant_id, email, name, language, uniqid from participant where login_sent is false");

// this is crado yes, next contest : use a framework :'(
	while ($row = mysql_fetch_assoc($result)) {
		$id = $row['participant_id'];
		$lang = $row['language'];
		$name = $row['name'];
		$email = $row['email'];
		$uniqid = $row['uniqid'];
		$login = 'webperf-contest_' . $uniqid;
		$password = $uniqid;
		$server = 'ftp://ftp.alwaysdata.com:21';

//$mail = Mail::factory("smtp", array ('host' => 'smtp.free.fr'));
		$mail = Mail::factory("sendmail");

		$headers['eng'] = array(
			"From" => "Webperf contest <support@webperf-contest.com>",
			"To" => $email,
			"Subject" => "Your FTP credentials"
		);
		$headers['fra'] = array(
			"From" => "Concours webperf <support@webperf-contest.com>",
			"To" => $email,
			"Subject" => "Vos logins FTP"
		);
		$body['eng'] =
				<<<EOT
Hello $name,

	we have activated your FTP credentials. Here's the info you need to send your optimized version of the packaged webpage on our servers:

	------------------------------FTP--------------------------------------
	host : $server
	login : $login
	password : $password
	------------------------------/FTP-------------------------------------

	You must upload index.html at the root directory. For all other files you can do what you want.

	All the files uploaded to your FTP account will be available at these urls :
	- entries.webperf-contest.com/$uniqid/
	- s1.webperf-contest.com/$uniqid/
	- s2.webperf-contest.com/$uniqid/
	- s3.webperf-contest.com/$uniqid/

	You can use .htaccess on our servers.

	The list of installed apache modules is here : http://gist.github.com/644842

	You should not share your uniqid, otherwise people could "steal" your ideas for the contest... We won't be responsible for that.

	Our sponsor for the servers : http://www.alwaysdata.com.

	Thank you and good luck!

	http://webperf-contest.com
	http://twitter.com/webperf_contest
EOT;
		$body['fra'] =
				<<<EOT
Bonjour $name,

	nous venons d'activer vos logins FTP, voilà les infos pour vous connecter et envoyer vos fichiers sur nos serveurs :

	------------------------------FTP--------------------------------------
	serveur : $server
	identifiant : $login
	mot de passe : $password
	------------------------------/FTP-------------------------------------

	Vous devez envoyer votre fichier index.html à la racine. Vous êtes ensuite libre d'organiser vos fichiers et dossiers.

	Tous les fichiers envoyés dans votre compte FTP seront accessibles à ces adresses :
	- entries.webperf-contest.com/$uniqid/
	- s1.webperf-contest.com/$uniqid/
	- s2.webperf-contest.com/$uniqid/
	- s3.webperf-contest.com/$uniqid/

	Vous pouvez utiliser les fichiers .htaccess sur nos serveurs.

	La liste des modules apaches installés est ici : http://gist.github.com/644842

	Vous ne devriez pas partager votre uniqid, d'autres personnes pourraient ensuite "voler" vos idées... Nous ne pourrions êtres tenus responsables.

	Les serveurs du concours sont fournis par http://www.alwaysdata.com.

	Merci et bonne chance !

	http://webperf-contest.com/index-fr.html
	http://twitter.com/webperf_contest
EOT;

		$mail->send($email, $headers[$lang], $body[$lang]);

		mysql_query("update participant set login_sent=1 where participant_id=" . $id);
	}
}
header('Location: index.php');