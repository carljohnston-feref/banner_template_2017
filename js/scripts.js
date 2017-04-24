
(function() {

	// Strict mode
	"use strict";

	// Selector helper
	function $(el) {
		return document.querySelector(el);
	}

	// Greensock timelines
	var _tl = new TimelineLite();
	var tl1 = new TimelineMax({ease:Power2.easeOut});

	// DoubleClick Enabler
	window.onload = function() {

		// Initialise Enabler
		if (Enabler.isInitialized()) {
			doubleclickInit();
		} else {
			Enabler.addEventListener(studio.events.StudioEvent.INIT, doubleclickInit);
		}

		// When Enabler is ready
		function doubleclickInit() {
			if (Enabler.isPageLoaded()) {
				polite();
			} else {
				Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, polite);
			}
		};

		// Polite load
		function polite() {
			tl1.to(['#load'], 0.25, {autoAlpha:0});
			banner();
		}
	};

	// Date Switch
	var DateChecker = function(releaseDate, preReleasePeriod, dbug) {
		var today = new Date();
		var releaseDate = new Date(releaseDate);

		if(preReleasePeriod) var preReleasePeriod = new Date(preReleasePeriod);

		if(dbug){
			console.log("Today: ", today, "\n", "Release date: ", releaseDate, "\n", "Release period ", preReleasePeriod || "Not set");
		}

		if(preReleasePeriod) {
			if(releaseDate < preReleasePeriod) {
				throw new Error("releaseDate is before preReleasePeriod. Reverse their order");
			}
			if(today < preReleasePeriod) {
				return "Release 1";
			}
			if(today < releaseDate) {
				return "Release 2";
			}
		}
		if( today < releaseDate ) {
			return "Release 3";
		}
		else {
			return "Release 4";
		}
	}

	// Release Line Switch
	var ctaSwitch = DateChecker("2017-04-26", "2017-04-25");
	switch (ctaSwitch) {
		case "Release 1":
			$('#ctaExit').innerHTML = "Release 1";
			break;

		case "Release 2":
			$('#ctaExit').innerHTML = "Release 2";
			break;

		case "Release 3":
			$('#ctaExit').innerHTML = "Release 3";
			break;

		case "Release 4":
			$('#ctaExit').innerHTML = "Release 4";
			break;

		default:
			break;
	}

	// Banner animation
	function banner() {

		// Set
		_tl.set('#frame1Copy1', {x:970, autoAlpha:1});
		_tl.set('#frame1Copy2', {x:-125, autoAlpha:1});

		// Animation
		tl1.to('#frame1', 0.25, {autoAlpha:1})
		   .to('#frame1Copy1', 1.5, {x:-81, ease: SlowMo.ease.config(0.25, 0.98, false)})
		   .to('#frame1Copy2', 1.5, {x:970, ease: SlowMo.ease.config(0.25, 0.98, false)}, '-=1.5')
		   .to('#frame1Copy1', 0, {autoAlpha:0})
		   .to('#frame1Copy3', 2, {delay:1, autoAlpha:1, scale:1.5, ease:Power4.easeOut})
		   .to('#frame1Copy3', 0.5, {autoAlpha:0, scale:10, letterSpacing:"100px", ease:Power4.easeIn})
		   .to('#frame1', 0, {autoAlpha:0})
		   .to(['#frame2', '#frame2Trailer'], 0, {autoAlpha:1})
		   .call(showreel)
		   .to('#frame2Tt', 0.5, {delay:1, autoAlpha:1})
		   .to('#frame2Tagline', 0.5, {autoAlpha:1})
		   .to('#ctaExit', 0.5, {autoAlpha:1})
		;

		function showreel() {
			Enabler.loadModule(studio.module.ModuleId.VIDEO, function() {
				studio.video.Reporter.attach('video_1', video1);
				video1.play();
				video1.muted = true;
			});

			$('#video1').addEventListener('ended', function() {
				studio.video.Reporter.detach('video_1');
			});
		}
	};

	// Exits
	function exit() {
		tl1.progress(1);
		setTimeout(function() {
			video1.pause();
			video1.muted = false;
			video1.currentTime = 0;
			document.querySelectorAll('.progress')[0].style.width = 100+'%';
		}, 30)
	}

	$('#mainExit').addEventListener('click', function() {
		Enabler.exit('Main Exit');
		exit();
	});

	$('#ctaExit').addEventListener('click', function() {
		Enabler.exit('CTA Exit');
		exit();
	});

})();