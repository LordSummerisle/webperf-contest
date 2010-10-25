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

$result = mysql_query("select * from participant");
?>
<p>
<?php
// @vvo : why am I the only one to see ? because I do create FTP accounts...
if($_SERVER['PHP_AUTH_USER'] == 'vvo') { ?>
	<a href="send-ftp-credentials.php">send FTP credentials</a>
<?php } ?>
</p>

<p>Do not take "admin" column into account atm.</p>

<table class="font11">
	<tr>
		<th>id</th>
		<th>email</th>
		<th>name</th>
		<th>gist</th>
		<th>website</th>
		<th>twitter</th>
		<th>language</th>
		<th>admin</th>
		<th>date (GMT)</th>
		<th>login sent</th>
		<th>uniqid</th>
	</tr>
<?php
$res = '';
while ($row = mysql_fetch_assoc($result)) {
	$res .= '<tr>';
	foreach($row as $field => $val) {

		$res .= '<td>';

		if(in_array($field, array('gist', 'website'))) {

			if ($val != '') {
				$res .= '<a href="'.$val.'">'.($field == 'gist' ? 'gist' : 'website').'</a>';
			} else {
				$res .= '-';
			}

			
		} else {

			if($field == 'twitter') {
				if($val != '') {
					$res .= '<a href="http://twitter.com/'.$val.'">@'.str_replace(array('http://', 'twitter.com', '/#!/'), '', $val).'</a>';
				} else {
					$res .= '-';
				}
			} else {
				$res .= $val;
			}

		}

		$res .= '</td>';

	}
	$res .= '</tr>';
}
echo $res;
?>
</table>
