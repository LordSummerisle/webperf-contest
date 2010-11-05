<!doctype html>
<html lang="en">
	<head>
		<title>Webperf contest - Admin dashboard</title>

		<meta http-equiv="Content-Type" content="text/html;charset=utf-8">

		<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/combo?3.2.0/build/cssreset/reset-min.css&3.2.0/build/cssbase/base-min.css&3.2.0/build/cssfonts/fonts-min.css&3.2.0/build/cssgrids/grids-min.css">
		<!-- yui resets/styles must be on top, then ours -->
		<link rel="stylesheet" type="text/css" href="http://cdn.webperf-contest.com/library.css?v6">
		<link rel="stylesheet" type="text/css" href="http://cdn.webperf-contest.com/screen.css?v6">

		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-12667483-3']);
			_gaq.push(['_trackPageview']);_gaq.push(['_setDomainName', 'webperf-contest.com']);
			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
		<!--[if lt IE 9]>
		<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
	</head>
	<body id="top" class="font11">
		<div id="content-container">

			<header class="block" id="header">
				<div class="floatRight sponsors">
					<div class="floatLeft marg1emr">
						<strong>Gold sponsors</strong>
						<a href="http://zeroload.net/blog/" title="Web Performance consultant"><img src="http://cdn.webperf-contest.com/logos/zeroload.png" alt="Zeroload" /></a>
						<a href="http://www.yottaa.com" title="Web Performance Analytics"><img src="http://cdn.webperf-contest.com/logos/yottaa.png" alt="with Yottaa" /></a>
						<a href="http://www.alwaysdata.com/" title="Dedicated and shared web hosting"><img src="http://cdn.webperf-contest.com/logos/alwaysdata.png" alt="and AlwaysData" /></a>
					</div>
					<div class="floatLeft">
						<span>Silver sponsor</span>
						<a href="http://www.catchpoint.com/" title="Web performance monitoring"><img src="http://cdn.webperf-contest.com/logos/catchpoint2.png" alt="Catchpoint Systems" /></a>
						<a href="http://www.clever-age.com/" title="Digital architecture"><img src="http://cdn.webperf-contest.com/logos/clever-age.png" alt="Clever Age" /></a>
					</div>
				</div>

				<h1 class="caps center classicTextShadow">
					Webperf <span class="white">Contest</span> 2010
				</h1>
				<h2 class="center">Optimize a website's homepage and win some prizes</h2>

				<nav id="menu" class="block clearfix bold caps">
					<a href="/" title="Prizes, Sponsors, Rules">home</a>
					<a href="/news.html" title="Contest news">news</a>
					<a href="/rules.html" title="Contest rules">rules</a>
					<a href="/register.html" title="Register for the contest">register</a>
					<a href="/leaderboard.html" class="hide deactivate" title="Who's leading the contest?">leaderboard</a>
					<a href="http://twitter.com/webperf_contest" title="Follow us on twitter">twitter</a>
					<a href="/about.html" title="Organizers and Sponsors">about</a>
					<a href="./" class="current" title="admin">admin</a>
				</nav>
			</header>

			<div id="text-container">

				<h1>Admin</h1>

				<?php include 'dashboard.php'; ?>

				
			</div>
		</div>
		<script type="text/javascript">
			var $soon = document && document.getElementsByClassName('deactivate');
			if ($soon) {
				for(var i = 0, limit = $soon.length; i < limit; i+=1) {
					if($soon[i].tagName === 'A') {
						$soon[i].href = '/soon.html';
						$soon[i].onclick = function() {
							return false;
						}
					} else {

					}
				}
			}
		</script>
	</body>
</html>