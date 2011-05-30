(function(w) {

	var timer1, timer2, formatTimeObj;

	function secondsToTime(secs) {
		var hours = Math.floor(secs / (60 * 60)),
		divisor_for_minutes = secs % (60 * 60),
		minutes = Math.floor(divisor_for_minutes / 60),
		divisor_for_seconds = divisor_for_minutes % 60,
		seconds = Math.ceil(divisor_for_seconds),
		obj = {
			"h": hours,
			"m": minutes,
			"s": seconds
		};

		return obj;
	}

	function stopAllTimers() {
		clearInterval(timer1);
		clearInterval(timer2);
	}

	formatTimeObj = {
		eng: function(time) {
			return ( (time.h > 0 ? time.h + " hours, " : "") + (time.m > 0 ? time.m + " minutes and " : "") + time.s + " seconds" )
		},
		fra : function(time) {
			return ( (time.h > 0 ? time.h + " heures, " : "") + (time.m > 0 ? time.m + " minutes et " : "") + time.s + " secondes" )
		}
	};


	function incrementTime(initialTime, $container, lang) {
		lang = lang || 'eng';
		setInterval(function(){
			initialTime += 1;
			$container.text(formatTimeObj[lang](secondsToTime(initialTime)));
		}, 1000);
	}

	function decrementTime(initialTime, $container, lang, callback, thisObjCallback) {
		thisObjCallback = thisObjCallback || this;
		lang = lang || 'eng';
		setInterval(function(){
			if (initialTime > 0) {
				initialTime -= 1;
				$container.text(formatTimeObj[lang](secondsToTime(initialTime)));
			} else {
				callback && callback.call(thisObjCallback);
			}
		}, 1000);
	}

	// templating ENGINE!
	function tmpl(obj, tpl) {
		var key;
		for (key in obj) {
			tpl = tpl.replace("{"+key+"}", obj[key]);
		}
		return tpl;
	}

	function buildLink(url, text, title, nofollow) {
		return '<a href="'+url+'"'+ (title ? ' title="'+title+'"' : '')+(nofollow ? 'rel="nofollow"' : '')+'>'+text+'</a>'
	}

	w.LB = {
		lang : "eng",
		templates : {
			table_header : {
				fra : "<thead><tr><th>Participant</th><th>Onload <sup>(s)</sup></th><th>Start Render <sup>(s)</sup></th><th>Requêtes <sup>(n)</sup></th><th>Poids <sup>(Ko)</sup></th><th><img src=http://webperf-contest.com/logos/yottaa.png width=70 height=19 class=yottaa_header /></th></tr></thead>",
				eng : "<thead><tr><th colspan=\"5\" rowspan=\"2\">info</th><th colspan=\"5\">WPT links</th>"
					  +"<th colspan=\"9\">WPT results (always average)</th>"
					  +"<th colspan=\"2\" rowspan=\"2\"><img src=http://webperf-contest.com/logos/yottaa.png width=70 height=19 class=yottaa_header /></th></tr>"
					  +"<tr>"
					  +"<th rowspan=\"2\">wpt</th><th colspan=\"2\">progressive rendering</th><th colspan=\"2\">network waterfalls</th>"
					  +"<th rowspan=\"2\">ol+sr</th><th colspan=\"2\">onload</th><th colspan=\"2\">start render</th><th colspan=\"2\">requests</th><th colspan=\"2\">kilobytes</th>"
					  +"</tr>"
					  +"<tr><th>id</th><th>name</th><th>url</th><th>gist</th><th>sources</th>"
					  +"<th>FV</th><th>RV</th><th>FV</th><th>RV</th>"
					  +"<th>FV</th><th>RV</th><th>FV</th><th>RV</th><th>FV</th><th>RV</th><th>FV</th><th>RV</th>"
					  +"<th>score</th><th>link</th>"
					  +"</tr>"
					  +"</thead>"
			},
			inthefuture : {
				fra : "Dans le futur",
				eng : "In the future"
			},
			line : '<tr><td title="id of the participant">{id}</td><td>{name}</td><td>{url}</td><td>{gist}</td><td>{sources}</td>'
					  +'<td>{wpt}</td><td>{PRFV}</td><td>{PRRV}</td><td>{WFFV}</td><td>{WFRV}</td>'
					  +'<td>{ol+sr}</td><td title="onload, first view">{OLFV}</td><td title="onload, repeat view">{OLRV}</td><td title="start render, first view">{SRFV}</td><td title="start render, repeat view">{SRRV}</td><td title="number of requests, first view">{RQFV}</td><td title="number of requests, repeat view">{RQRV}</td><td title="kilobytes downloaded, first view">{KBFV}</td><td title="kilobytes downloaded, repeat view">{KBRV}</td>'
					  +'<td title="yottaa score">{yottaa_score}</td><td>{yottaa_link}</td>'
		},
		containers : {
			$nbranked : $('#nbRanked'),
			$table : $('<table class="tablesorter">'),
			$lastUpdate : $('#lastUpdate'),
			$leaderboard : $('#leaderboard'),
			$nextUpdate : $('#nextUpdate'),
			$updateRunning : $('#updateRunning'),
			$nextUpdateTime : $('#nextUpdateTime')
		},
		dates : {
			latestTest : new Date
		},
		lastUpdate : 0,
		switchToRunningUpdate : function() {
			this.containers.$nextUpdate.hide();
			this.containers.$updateRunning.show();
		},
		findLastUpdate : function(ms_timestamp) {
			var time = new Date;
			this.dates.latestTest.setTime(ms_timestamp);
			this.lastUpdate = time.getTime() - this.dates.latestTest.getTime();
			if(this.lastUpdate > 0) {
				this.lastUpdate = parseInt(this.lastUpdate / 1000);
				incrementTime(this.lastUpdate, this.containers.$lastUpdate, this.lang);
			} else {
				this.lastUpdate = "In the future !";
			}
		},
		init : function(data, lang) {
			stopAllTimers();

			var wpt_data = data.wpt_data, yottaa_data = data.yottaa_data, i = 0, limit = wpt_data.length, dateTmp = new Date, htmlLine, d,
				fv, rv, arfv, arrv,
				entry_url = "http://entries.webperf-contest.com/{id}/index.html",
				wpt_results = "http://www.webpagetest.org/result/{id}/",
				wpt_pr = "http://www.webpagetest.org/video/compare.php?tests={id}-r:{run}-c:{view}&ival=100",
				wpt_wf = "http://www.webpagetest.org/result/{id}/{run}/details/",
				yottaa_link = "http://www.yottaa.com/url/search?u=" + entry_url,
				sources_url = "http://dl.zeroload.net/webperf_contest/2010/{id}.7z",
				deactivateHeaders;

			this.lang = lang;

			this.containers.$table.empty().append(this.templates.table_header[lang]);

			for(; i < limit; i+=1) {
				if (wpt_data[i].data && wpt_data[i].data.firstView && wpt_data[i].data.firstView.loadTime && parseInt(wpt_data[i].data.firstView.loadTime) > 1) {

					d = wpt_data[i];
					fv = d.data.firstView,
					rv = d.data.repeatView,
					arfv = fv.avgRun;
					arrv = rv.avgRun;

					dateTmp.setTime(d.date*1000);

					htmlLine = tmpl({
						"ol+sr": ((parseFloat(fv.render)+parseFloat(fv.loadTime))/1000).toFixed(3),
						id: '#'+d.id,
						sources: buildLink(tmpl({id:d.uniqid}, sources_url), '7z archive', '7z archive of participant\'s work, you\'ll find unminified sources and log sometimes'),
						name: (d.twitter ? '<a href="http://twitter.com/'+d.twitter+'">' : '')+d.name+(d.twitter ? '</a>' : ''),
						url: buildLink(tmpl({id:d.uniqid}, entry_url, true), 'url', 'direct url to participant\'s entry'),
						wpt : buildLink(tmpl({id:d.wpt_id}, wpt_results), 'wpt', 'webpagetest summary'),
						PRFV : buildLink(tmpl({id:d.wpt_id, run : arfv, view : 0}, wpt_pr), 'link', 'progressive rendering FIRST view'),
						PRRV : buildLink(tmpl({id:d.wpt_id, run : arrv, view : 1}, wpt_pr), 'link', 'progressive rendering REPEAT view'),
						WFFV : buildLink(tmpl({id:d.wpt_id, run : arfv}, wpt_wf), 'link', 'network waterfall FIRST view'),
						WFRV : buildLink(tmpl({id:d.wpt_id, run : arrv}, wpt_wf)+'cached/', 'link', 'network waterfall REPEAT view'),
						OLFV : (fv.loadTime/1000).toFixed(3),
						OLRV : (rv.loadTime/1000).toFixed(3),
						SRFV : (fv.render/1000).toFixed(3),
						SRRV : (rv.render/1000).toFixed(3),
						RQFV : fv.requests,
						RQRV : rv.requests,
						KBFV : (fv.bytesIn/1024).toFixed(2),
						KBRV : (rv.bytesIn/1024).toFixed(2),
						yottaa_score : yottaa_data[d.id] || 0,
						gist : buildLink(d.gist.replace('github.com/', 'github.com/raw/')+"/:filename", 'gist', 'raw gist, can be broken', true),
						yottaa_link : buildLink(tmpl({id:d.uniqid}, yottaa_link), 'url', 'Yottaa details')
					}, this.templates.line);
					this.containers.$table.append(htmlLine);
				}
			}

			this.containers.$leaderboard.empty().append(this.containers.$table);

			deactivateHeaders = {
				0:{
					sorter:false
				},
				1:{
					sorter:false
				},
				2:{
					sorter:false
				},
				3:{
					sorter:false
				},
				4:{
					sorter:false
				},
				5:{
					sorter:false
				},
				6:{
					sorter:false
				},
				8:{
					sorter:false
				},
				9:{
					sorter:false
				},
				10:{
					sorter:false
				},
				11:{
					sorter:false
				},
				12:{
					sorter:false
				},
				14:{
					sorter:false
				},
				15:{
					sorter:false
				},
				16:{
					sorter:false
				},
				17:{
					sorter:false
				},
				18:{
					sorter:false
				},
				19:{
					sorter:false
				},
				20:{
					sorter:false
				},
				30:{
					sorter:false
				}
			};

			// sort "onload" first
			this.containers.$table.tablesorter({sortList: [[10,0]], headers : deactivateHeaders});
		}
	};

})(this);