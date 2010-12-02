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

	function buildLink(url, text, title) {
		return '<a href="'+url+'"'+ (title ? ' title="'+title+'"' : '')+'>'+text+'</a>'
	}

	w.LB = {
		lang : "eng",
		templates : {
			table_header : {
				fra : "<thead><tr><th>Participant</th><th>Onload <sup>(s)</sup></th><th>Start Render <sup>(s)</sup></th><th>Requêtes <sup>(n)</sup></th><th>Poids <sup>(Ko)</sup></th><th><img src=http://cdn.webperf-contest.com/logos/yottaa.png width=70 height=19 class=yottaa_header /></th></tr></thead>",
				eng : "<thead><tr><th colspan=\"3\" rowspan=\"2\">info</th><th colspan=\"5\">WPT links</th>"
					  +"<th colspan=\"8\">WPT results (always average)</th>"
					  +"<th colspan=\"2\" rowspan=\"2\"><img src=http://cdn.webperf-contest.com/logos/yottaa.png width=70 height=19 class=yottaa_header /></th></tr>"
					  +"<tr>"
					  +"<th rowspan=\"2\">sum</th><th colspan=\"2\">progressive rendering</th><th colspan=\"2\">network waterfalls</th>"
					  +"<th colspan=\"2\">onload</th><th colspan=\"2\">start render</th><th colspan=\"2\">requests</th><th colspan=\"2\">kilobytes</th>"
					  +"</tr>"
					  +"<tr><th>name</th><th>url</th><th>gist</th>"
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
			line : "<tr><td>{name}</td><td>{url}</td><td>{gist}</td>"
					  +"<td>{sum}</td><td>{PRFV}</td><td>{PRRV}</td><td>{WFFV}</td><td>{WFRV}</td>"
					  +"<td>{OLFV}</td><td>{OLRV}</td><td>{SRFV}</td><td>{SRRV}</td><td>{RQFV}</td><td>{RQRV}</td><td>{KBFV}</td><td>{KBRV}</td>"
					  +"<td>{yottaa_score}</td><td>{yottaa_link}</td>"
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
				yottaa_link = "http://www.yottaa.com/url/search?u=" + entry_url;

			this.lang = lang;

//			this.containers.$nbranked.text(wpt_data.length);

			this.findLastUpdate(wpt_data[0].date*1000);

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
						name: (d.twitter ? '<a href="http://twitter.com/'+d.twitter+'">' : '')+d.name+(d.twitter ? '</a>' : ''),
						url: buildLink(tmpl({id:d.uniqid}, entry_url), 'url', 'direct url to participant\'s work'),
						sum : buildLink(tmpl({id:d.wpt_id}, wpt_results), 'sum', 'webpagetest summary'),
						PRFV : buildLink(tmpl({id:d.wpt_id, run : arfv, view : 0}, wpt_pr), 'link', 'progressive rendering FIRST view'),
						PRRV : buildLink(tmpl({id:d.wpt_id, run : arrv, view : 1}, wpt_pr), 'link', 'progressive rendering REPEAT view'),
						WFFV : buildLink(tmpl({id:d.wpt_id, run : arfv}, wpt_wf), 'link', 'network waterfall FIRST view'),
						WFRV : buildLink(tmpl({id:d.wpt_id, run : arrv}, wpt_wf), 'link', 'network waterfall REPEAT view'),
						OLFV : (fv.loadTime/1000).toFixed(3),
						OLRV : (rv.loadTime/1000).toFixed(3),
						SRFV : (fv.render/1000).toFixed(3),
						SRRV : (rv.render/1000).toFixed(3),
						RQFV : fv.requests,
						RQRV : rv.requests,
						KBFV : (fv.bytesIn/1024).toFixed(2),
						KBRV : (rv.bytesIn/1024).toFixed(2),
						yottaa_score : yottaa_data[d.id] || 0,
						gist : buildLink(d.gist.replace('github.com/', 'github.com/raw/')+"/:filename", 'gist', 'raw gist, can be broken'),
						yottaa_link : buildLink(tmpl({id:d.uniqid}, yottaa_link), 'url', 'Yottaa details')
					}, this.templates.line);
					this.containers.$table.append(htmlLine);
				}
			}

			this.containers.$leaderboard.empty().append(this.containers.$table);

			this.containers.$table.tablesorter({sortList: [[8,0]], headers : {0:{sorter:false}, 1:{sorter:false}, 2:{sorter:false}, 3:{sorter:false}, 4:{sorter:false}, 5:{sorter:false}, 6:{sorter:false}, 7:{sorter:false}, 8:{sorter:false}, 9:{sorter:false}, 10:{sorter:false}, 12:{sorter:false}, 13:{sorter:false}, 14:{sorter:false}, 15:{sorter:false}, 16:{sorter:false}, 17:{sorter:false}, 27:{sorter:false}}}); // sort "onload" first

//			if (typeof data.nextUpdate !== 'undefined') {
//				if (data.nextUpdate === 0) {
//					this.switchToRunningUpdate();
//				} else {
//					decrementTime(data.nextUpdate, this.containers.$nextUpdateTime, lang, this.switchToRunningUpdate, this);
//				}
//			}
		}
	};

})(this);