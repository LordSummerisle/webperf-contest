<?php

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

if (isset($_GET) && !empty($_GET['action']) && !empty($_GET['participant_id']) && in_array($_GET['action'], array('show', 'hide'))) {
	if($_GET['action'] == 'show') {
		mysql_query("update participant set show_in_leaderboard = 1 where participant_id = " .  mysql_real_escape_string(strip_tags(trim($_GET['participant_id']))));
		echo 1;
	} else {
		mysql_query("update participant set show_in_leaderboard = 0 where participant_id = " .  mysql_real_escape_string(strip_tags(trim($_GET['participant_id']))));
		echo 0;
	}
}