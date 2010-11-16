(function(w) {

	var timer1, timer2;

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

	w.LB = {
		lang : "eng",
		templates : {
			table_header : {
				fra : "<thead><tr><th>Participant</th><th>Onload (s)</th><th>Start Render (s)</th><th>Requêtes (n)</th><th>Poids (Ko)</th></tr></thead>",
				eng : "<thead><tr><th>Participant</th><th>Onload (s)</th><th>Start Render (s)</th><th>Requests (n)</th><th>Size (kB)</th></tr></thead>"
			},
			inthefuture : {
				fra : "Dans le futur",
				eng : "In the future"
			},
			line : "<tr><td>{name}</td><td class=right>{onload}</td><td class=right>{start_render}</td><td class=right>{requests}</td><td class=right>{bytes}</td></tr>"
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

			var entries = data.entries, i = 0, limit = entries.length, dateTmp = new Date, htmlLine;

			this.lang = lang;

			this.containers.$nbranked.text(entries.length);

			this.findLastUpdate(entries[0].date*1000);

			this.containers.$table.empty().append(this.templates.table_header[lang]);

			for(; i < limit; i+=1) {
				if (entries[i].data && entries[i].data.firstView && entries[i].data.firstView.loadTime && parseInt(entries[i].data.firstView.loadTime) > 1) {
					dateTmp.setTime(entries[i].date*1000);
					htmlLine = tmpl({
						name: (entries[i].twitter ? '<a href="http://twitter.com/'+entries[i].twitter+'">' : '')+entries[i].name+(entries[i].twitter ? '</a>' : ''),
						onload: (entries[i].data.firstView.loadTime/1000).toFixed(3),
						start_render: (entries[i].data.firstView.render/1000).toFixed(3),
						requests: entries[i].data.firstView.requests,
						bytes: (entries[i].data.firstView.bytesIn/1024).toFixed(2)
					}, this.templates.line);
					this.containers.$table.append(htmlLine);
				}
			}

			this.containers.$leaderboard.empty().append(this.containers.$table);
			this.containers.$table.tablesorter({sortList: [[1,0]]}); // sort "onload" first

			if (typeof data.nextUpdate !== 'undefined') {
				if (data.nextUpdate === 0) {
					this.switchToRunningUpdate();
				} else {
					decrementTime(data.nextUpdate, this.containers.$nextUpdateTime, lang, this.switchToRunningUpdate, this);
				}
			}

		}
	};

})(this);