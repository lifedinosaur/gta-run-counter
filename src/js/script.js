/*
		GTA IV Run Stats Counter
        by Jake and Sean
		
		© 2012 Sean Brutscher  
*/



///////
//  GLOBAL VARS:

//  running time constants:
var gameMinutes = 7;
var gameSeconds = 0;

//  2-minute warning constant:
var gameWarning = 2;

//  streak length constant:
var streakSeconds = 30;

//  streak in-game vars (in milliseconds):
var streakTimeout = streakSeconds * 1000;
var streakWarning = 5000;

//
var streakStartTime = 7;
var streakStartKills = 3;

//  folder animation speed:
var folderSpeed = 0;

//  folder animation in/out easing functions:
var easeOutFunction = 'linear';
var easeInFunction = "linear";




///////
//  READY:


//  DOCUMENT - READY:

//  the browser is up and ready for some JS:
$(document).ready(function()
{
	
	///////
	//  BUILT-IN:
	
	// Run Matt Kersley's jQuery Responsive menu plugin (see plugins.js):
	if ($.fn.mobileMenu) {
		$('ol#id').mobileMenu({
			switchWidth: 768,                   // width (in px to switch at)
			topOptionText: 'Choose a page',     // first option text
			indentString: '&nbsp;&nbsp;&nbsp;'  // string for indenting nested items
		});
	}

	// Run Mathias Bynens jQuery placeholder plugin (see plugins.js):
	if ($.fn.placeholder) {
		$('input, textarea').placeholder();		
	}
	
	
	
	///////
	//  GAME:
	
	var gameStarted = false;
	
	
	///////
	//  TIMER:
	
	//  timer states:
	var running = false;
	var warning = false;
	
	//  calc time elements:
	var minutes = gameMinutes;
	var seconds = gameSeconds;
	
	//  screen-rendered time:
	var scrSeconds, scrMinutes;
	
	//  "out" check flags - as in does not have anymore:
	var minutesOut = false;
	var secondsOut = false;
	
	//  interval instance:
	var timer;
	
	
	///////
	//  STATS:
	
	//  game stat counters:
	var civs = 0;
	var cops = 0;
	var stars = 0;
	var cleared = 0;
	
	
	///////
	//  STREAKS:
	
	//  streak counters:
	var kill = 0;
	var rampage = 0;
	var serial = 0;
	var longStreak = 0;
	//
	var sStrTime = 0;
	var sStrKills = 0;
	//
	var sStrOn = false;
	
	//  streaking flag:
	var streak = false;
	
	//  count for current streak:
	var curStreak = 0;
	
	//  screen-rendered streak:
	var scrCurStreak;
	
	//  countdown for current streak:
	var streakCountdown = streakSeconds;
	
	//  marker for streak pause:
	var streakPauseTime = 30;
	
	//  which row to write the score to:
	var writeRun = 1;
	
	//  number of runs that have been written:
	var writeTotal = 1;
	
	//  add expand listeners:
	enableExpands(true);
	
	
	
	
	///////
	//  INIT:
	
	
	//  CONTROLLER:
	
	//  start button listener/handler:
	$('input:button[name$="start"]').bind('click', function(){
		toggleClock();
	});
	
	//  reset button listener/handler:
	$('input:button[name$="reset"]').bind('click', function(){
		resetGame();
	});
	
	
	//  RESET:
	
	//  reset the game to start:
	resetGame();
	
	
	//  FOLDERS:
	
	//  !
	//  important note about folder collapse:
	//
	//  all folders that are enclosed must be folded BEFORE their parent. 
	//  it is most likely a jquery "animate" conflict and parent winning. :)
	//  either way... close the kids first.
	
	//  close streaks:
	collapseFolder(".streaks", ".streaks-folder", true, 0);
	
	//  close game controller:
	collapseFolder(".controller", ".controller-folder", true, 0);
	
	//  close current run folder:
	collapseFolder(".current-run", ".folder", true, 0);
	
	//  close run folders with no exception:
	closeHighRuns(0);
	
	//  close high runs folder:
	collapseFolder(".high-runs", ".folder", true, 0);
	
	
	
	
	///////
	//  RESET:
	
	
	//  RESET GAME:
	
	//  set all the game variables to default:
	function resetGame()
	{
		//  end streak:
		endStreak();
		
		//  stop an already running game:
		setGame(false);
		
		//  game started flag:
		gameStarted = false;
		
		//  total game time:
		minutes = gameMinutes;
		seconds = gameSeconds;
		
		//  time flags:
		minutesOut = false;
		secondsOut = false;
		
		warning = false;
		
		//  stats:
		civs = 0;
		cops = 0;
		stars = 0;
		cleared = 0;
		
		//  streaks:
		kill = 0;
		rampage = 0;
		serial = 0;
		longStreak = 0;
		streak = false;
		curStreak = 0;
		
		//  render ALL the UI to reflect newness:
		renderStreak();
		renderStreakCountdown();
		renderTime();
		checkWarning();
		renderScore();
		
		//  reset the 'start' button:
		$('input:button[name$="start"]').val("start");
	}
	
	
	
	
	///////
	//  CLOCK:
	
	
	//  TOGGLE CLOCK:
	
	//  toggles the game clock to its opposite state:
	function toggleClock()
	{
		//  if not running:
		if(!running)
		{
			//  set the game running:
			setGame(true);
			
			//  close the game controller:
			collapseFolder(".controller", ".controller-folder", true, folderSpeed);
			
			//  jump to the gameview location:
			window.location = '#gameview';
		}
		else
			//  set the game off:
			setGame(false);
	}
	
	
	//  SET GAME:
	
	//  set game 'on' or 'off':
	function setGame(gameOn)
	{
		//  set 'on':
		if(gameOn)
		{
			//  disable submit when game is on:
			$('input:button[name$="submit"]').unbind('click');
			
			//  enable controlls for game:
			enableControls(true);
			
			//  set running:
			running = true;
			
			//  change 'start' value to 'pause':
			$('input:button[name$="start"]').val("pause");
			
			//  set game control to include the "Pause" function:
			$("a.controller span.title").html("Game Control / Pause");
			
			//  set the game clock interval of 1 tick per second:
			timer = setInterval(runClock, 1000);
			
			
			//  close 'high runs' folder:
			/*closeHighRuns(folderSpeed);
			collapseFolder(".high-runs", ".folder", true, folderSpeed);*/
		}
		//  game 'off':
		else
		{
			//  disable controls:
			enableControls(false);
			
			//  if the game time is greater than zero, the game has started:	
			if(calculatePlayedSeconds() > 0)
				gameStarted = true;
			
			//  enable submit when game is off:
			$('input:button[name$="submit"]').bind('click', function(){
				//  check for zero second, erroneous games
				if(gameStarted)
					//  and submit the run to the board:
					submitRun();
			});
			
			//  set running:
			running = false;
			
			//  change 'pause' to 'continue':
			$('input:button[name$="start"]').val("continue");
			
			//  set game control to remove the "Pause":
			$("a.controller span.title").html("Game Control");
			
			//  clear the interval:
			clearInterval(timer);
		}
	}
	
	
	//  RUN CLOCK:
	
	//  function gets called on the game clock's second interval:
	function runClock()
	{	
		//  check zero minutes:
		if(minutes == 0)
		{
			//  set minutes "out" flag:
			if(!minutesOut) 
				minutesOut = true;	
		}
		
		//  check zero seconds:
		if(seconds == 0)
		{
			//  if seconds are left:
			if(!secondsOut) 
			{	
				//  check for minutes to take seconds from:
				if(!minutesOut)
				{
					//  take 'em!!:
					seconds = 59;
					
					//  but pay for 'em:
					minutes--;
				}
				else
					//  set seconds "out":
					secondsOut = true;	
			}
		}	
		else	
		{
			//  if we have seconds, take one away for this interval:
			seconds--;
		}
		
		//  if start-streak test is 'on':
		if(sStrOn)
		{
			//  if the start-streak has reached the time limit:
			if(sStrTime == streakStartTime)
			{
				//  reset:
				sStrOn = false;
				sStrTime = 0;
				sStrKills = 0;
			}
			else
				//  increment:
				sStrTime++;
		}
		else
			//  clear start-streak time:
			sStrTime = 0;
		
		//  check start-streak time against limits:
		checkStreakStart();
		
		//  if player is streaking:
		if(streak)
		{
			//  !
			//  this science is imperfect: basically, the user could have "JUST" entered the kill, or 
			//  entered it at the moment after the start of the last second. we just assume the worst here 
			//  and take a "streak second" debt on every interval... change it if you don't like it... dick.
			
			//  remove a second from the streak countdown for this interval:
			streakCountdown--;
		}
		else
		{	
			//  set the countdown to the default:
			streakCountdown = streakSeconds;
		}
		
		//  check streak warning:
		checkStreakWarning();
		
		//  render streak countdown:
		renderStreakCountdown();
		
		//  check end of game conditions and handle that:
		checkGameEnd();
		
		//  render clock:
		renderTime();
		
		//  check for game clock in warning:
		checkWarning();
	}
	
	
	
	
	///////
	//  GAME END:
	
	
	//  CHECK GAME END:
	
	//  check end of game condition:
	function checkGameEnd()
	{
		//  minutes and seconds zero:
		if(minutes <= 0 && seconds <= 0)
			//  end game:
			setGame(false);
	}
	
	
	
	
	///////
	//  WARNING:
	
	
	//  CHECK WARNING:
	
	//  check and handle the game going into the '2-minute warning':
	function checkWarning()
	{
		//  if right on, or less than the set warning time:
		if((minutes == gameWarning && seconds == 0) || minutes < gameWarning)
			//  add warning to logic and front-end:
			addWarning(true);
		else
			//  remove warning;
			addWarning(false);
	}
	
		
	//  ADD WARNING:
	
	//  adds warning to logic and UI:
	function addWarning(add)
	{
		//  add:
		if(add)
			//  add class and set only if not already set this way:
			if(!warning)
			{
				//  class styles to clock:
				$('input#game-clock').addClass('warning');
				
				//  logical flag:
				warning = true;
			}
		//  remove:
		else
			//  check 'warning' is already present:
			if($('input#game-clock').hasClass('warning'))
			{
				//  remove class:
				$('input#game-clock').removeClass('warning');
				
				//  flag:
				warning = false;
			}
	}
	
	
	
	
	///////
	//  STREAKING:
	
	//  check the streak has started:
	function checkStreakStart()
	{	
		if(!streak)
			if(sStrKills == streakStartKills && sStrTime == streakStartTime)
				startStreak();
	}
	
	
	
	//  CHECK STREAK:
	
	//  adds a kill to the streak, handles scoring, and updates UI:
	function checkStreak()
	{	
		if(streak)
		{
			curStreak++;
			
			//  increment streak types based on the current streak:
			if(curStreak == 5)
				kill++;
			if(curStreak == 10)
				rampage++;
			if(curStreak == 20)
				serial++;
		}
		else
		{
			//  if the start-streak test has not started:
			if(!sStrOn)
			{
				//  set 'on' and reset:
				sStrOn = true;
				sStrKills = 0;
			}
			
			//  increment start streak kills:
			sStrKills++;
			
			//  check start streak kills for the goal:
			if(sStrKills == streakStartKills)
			{
				//  start the streak:
				startStreak();
				
				//  update the current streak with start kills added:
				curStreak += streakStartKills;
				
				//  update the streak countdown with the seconds used so far:
				streakCountdown = streakSeconds - sStrTime;
				
				sStrOn = false;
				sStrTime = 0;
				sStrKills = 0;
			}
		}
		
		//  update UI:
		renderStreak();
		
		//  render streak countdown:
		renderStreakCountdown();
	}
	
	
	function removeFromStreak()
	{
		//  check current streak level:
		if(curStreak == 5)
			kill--;
		else if(curStreak == 10)
			rampage--;
		else if(curStreak == 20)
			serial--;
		
		//  remove one from current streak:
		curStreak--;
		
		//  update the streak UI:
		if(curStreak > 0)
			renderStreak();	
		//  or end:
		else
			endStreak();
	}
	
	
	//  START STREAK:
	
	//  starts the user's kill-streak:
	function startStreak()
	{
		//  set the start-streak off:
		sStrOn = false;
		
		//  set the streak to true (will be picked up on the next game clock tick):
		streak = true;
		
		//  reset current:
		curStreak = 0;
		
		//  remove 'warning' and add 'streak' class:
		safeClass(false, $('table.streaks'), 'streak-warning');
		safeClass(true, $('table.streaks'), 'streak');
	}
	
	//  CHECK STREAK WARNING:
	
	//  check if the streak has reached the warning time:
	function checkStreakWarning()
	{
		//  warning:
		if((streakCountdown*1000) == streakWarning)
			warnStreak();
			
		//  end:
		if(streakCountdown == 0)
			endStreak();
	}
	
	
	//  WARN STREAK:
	
	//  alerts the user their kill streak is almost over:
	function warnStreak()
	{
		//  add 'warning' and remove 'streak':
		safeClass(true, $('table.streaks'), 'streak-warning');
		safeClass(false, $('table.streaks'), 'streak');
	}
	
	
	//  END STREAK:
	
	//  ends the user streak, handles logic and updates UI:
	function endStreak()
	{
		//  if this is more than the long, it IS the long:
		if(curStreak > longStreak)
			longStreak = curStreak;
		
		//  reset variables for next streak:
		streak = false;
		curStreak = 0;
		streakCountdown = streakSeconds;
		
		//  update UI:
		renderStreak();
		renderStreakCountdown();
		
		//  remove 'warning' and/or 'streak' classes:
		safeClass(false, $('table.streaks'), 'streak-warning');
		safeClass(false, $('table.streaks'), 'streak');
	}
	
	
	
	
	///////
	//  SCORING:
	
	
	//  ADD CIV:
	
	//  adds/subtracts a civilian kill to the game:
	function addCiv(addTo) 
	{
		civs += addTo;
		civs = zeroCheck(civs);
		
		if(addTo >= 0)
			processScore(true);
		else
		{
			removeFromStreak();
			processScore(false);
		}
	}
	
	
	//  ADD COP:
	
	//  adds/subtracts a cop kill to the game:
	function addCop(addTo) 
	{
		cops += addTo;
		cops = zeroCheck(cops);
		
		if(addTo >= 0)
			processScore(true);
		else
		{
			removeFromStreak();
			processScore(false);
		}
	}
	
	
	//  ADD STAR:
	
	//  adds/subtracts a wanted-level "star" to the game:
	function addStar(addTo) 
	{
		stars += addTo;
		stars = zeroCheck(stars);
		stars = zeroCheck(stars, 6, 1);
		processScore(false);
	}
	
	
	//  ADD CLEARED:
	
	//  adds/subtracts "wanted" stars to the cleared stat:
	function addCleared(addTo) 
	{
		cleared += addTo;
		cleared = zeroCheck(cleared);
		stars = 0;
		processScore(false);
	}
	
	
	//  PROCESS SCORE:
	
	//  processes the new score logically and updates the UI:
	function processScore(addToStreak)
	{
		//  add this score update to the streak:
		if(addToStreak)
			checkStreak();
		
		//  call to update UI:
		renderScore();	
	}
	
	
	
	
	///////
	//  SUBMIT:
	
	
	//  SUBMIT RUN:
	
	//  adds the current run to the 'high runs' board.
	//  handles all writing and logic for non-persistant stat keeping:
	function submitRun()
	{
		var deltaSecs = calculatePlayedSeconds();
		
		//  get it figured with division maths:
		var playedMins = Math.floor(deltaSecs/60);
		var playedSecs = deltaSecs % 60;
		
		
		//  set the run row to write this score to.
		//  if 3 or larger, will always write to 3rd row:
		if(writeTotal >= 3)
		{
			//  reset the run row to 3:
			writeRun = 3;
			
			//  and shift the other rows up:
			if(writeTotal > 3)
				shiftHighRuns();
		}
		
		//  close all other runs:
		closeHighRuns(folderSpeed, writeRun);		
		
		//  write to title:
		$('.run'+writeRun+' span.run'+writeRun).html("Run " + writeTotal);
		
		//  write to time:
		$('.run'+writeRun+' span.count').html(playedMins + " : " + formatNumber(playedSecs));
		
		//  write to score:
		$('td#run'+writeRun+'-civs').html(civs);
		$('td#run'+writeRun+'-cops').html(cops);
		$('td#run'+writeRun+'-stars').html(stars);
		$('td#run'+writeRun+'-cleared').html(cleared);
		
		//  write to streaks:
		$('td#run'+writeRun+'-kill').html(kill);
		$('td#run'+writeRun+'-rampage').html(rampage);
		$('td#run'+writeRun+'-serial').html(serial);
		$('td#run'+writeRun+'-long').html(longStreak);
				
		//  open high runs and the current run:
		collapseFolder(".high-runs", ".folder", false, folderSpeed);
		collapseFolder(".run"+writeRun, ".run"+writeRun+"-folder", false, folderSpeed);
		
		//  close controller:
		collapseFolder(".controller", ".controller-folder", true, folderSpeed);
		
		//  jump to run:
		window.location = '#highsview-r'+writeRun;
		
		//  increment for next:
		writeRun += 1;
		writeTotal += 1;
		
		//  and the reset:
		resetGame();
	}
	
	
	//  SHIFT HIGH RUNS:
	
	//  takes information from row 2 and places it into row 1,
	//  and information from row 3 and places it into row 2 :)
	//  simple:
	function shiftHighRuns()
	{
		for(var i = 1; i<=2; i++)
		{			
			$('.run'+i+' span.count').html($('.run'+(i+1)+' span.count').html());
			
			$('td#run'+i+'-civs').html($('td#run'+(i+1)+'-civs').html());
			$('td#run'+i+'-cops').html($('td#run'+(i+1)+'-cops').html());
			$('td#run'+i+'-stars').html($('td#run'+(i+1)+'-stars').html());
			$('td#run'+i+'-cleared').html($('td#run'+(i+1)+'-cleared').html());
			
			$('td#run'+i+'-kill').html($('td#run'+(i+1)+'-kill').html());
			$('td#run'+i+'-rampage').html($('td#run'+(i+1)+'-rampage').html());
			$('td#run'+i+'-serial').html($('td#run'+(i+1)+'-serial').html());
			
			$('.run'+i+' span.run'+i).html($('.run'+(i+1)+' span.run'+(i+1)).html());
		}
	}
	
	
	
	
	///////
	//  FOLDERS:
	
	
	//  ENABLE EXPANDS:
	
	//  binds event listeners and defines callbacks
	//  for 'click' on each expandable folder: 
	function enableExpands(enable)
	{
		
		//  ENABLE FOLDERS:
		
		if(enable)
		{
			
			//  CURRENT RUN:
			
			//  current run folder:
			$("a.current-run").bind('click', function()
			{
				//  will only work when the game clock is not running:
				if(!running) 
				{
					//  check that the folder is not already closed:
					if(!$(".current-run .folder").hasClass('closed'))
					{
						//  first, close streaks:
						collapseFolder(".streaks", ".streaks-folder", true, 0);
						//  and close controller:
						collapseFolder(".controller", ".controller-folder", true, 0);
						
						//  and close current run:
						collapseFolder(".current-run", ".folder", true, folderSpeed);
					}
					else
					{
						//  well then 'open it', is probably the right one:
						
						//  !
						//  (i know it sounds wierd, requesting in the negative for the obviously 'positive' feeling 
						//  of 'opening', but if you think about it, it is actually a double-negative)
						
						//  no i don't want to collapse this folder (open it, please):
						collapseFolder(".current-run", ".folder", false, folderSpeed);
						
						//  and jump to the location on the page:
						window.location = '#currentview';
					}
				}
				
				//  and stop it, with all the "i'm a button" shit:
				return false;
			});
			
			//  streaks sub-folder:
			$("a.streaks").bind('click', function()
			{
				//  check if the folder is not already closed:
				if(!$(".current-run .streaks-folder").hasClass('closed'))
					//  close it:
					collapseFolder(".streaks", ".streaks-folder", true, folderSpeed);
				else
				{
					//  open it:
					collapseFolder(".streaks", ".streaks-folder", false, folderSpeed);
					
					//  jump it:
					window.location = '#currentview';
				}
					
				//  false it:
				return false;
			});
			
			//  game controller sub-folder:
			$("a.controller").bind('click', function()
			{
				//  stop clock:
				if(running)
				{
					toggleClock();
				}
				
				//  is not closed?
				if(!$(".current-run .controller-folder").hasClass('closed'))
					//  please close it:
					collapseFolder(".controller", ".controller-folder", true, folderSpeed);
				else
				{
					//  open and jump:
					collapseFolder(".controller", ".controller-folder", false, folderSpeed);
					window.location = '#controlview';
				}
				
				//  no:	
				return false;
			});
			
			
			//  HIGH RUNS:
			
			//  high runs folder:
			$("a.high-runs").bind('click', function()
			{
				//  will not work when game clock is running:
				if(!running) 
				{
					//  check not closed:
					if(!$(".high-runs .folder").hasClass('closed'))
					{
						//  close all runs inside:
						closeHighRuns(0);
						
						//  and close high runs:
						collapseFolder(".high-runs", ".folder", true, folderSpeed);
					}
					else
					{
						//  open it:
						collapseFolder(".high-runs", ".folder", false, folderSpeed);
						
						//  jump:
						window.location = '#highsview';
					}
				}
				
				//  no html -- this is actually pretty funny considering the 'window.location =' bit i just did :o -( shhhhh! )
				return false;
			});
			
			
			//  !
			//  note about: look at how similar these look.. write a loop!!
			//  maybe specify, i dunno, a length and make it variable??
			//  :o  maybe even settable?? (idiot)
			
			//  run 1:
			$("a.run1").bind('click', function()
			{
				//  only work when game clock is not running:
				if(!running)
				{
					//  check closed... you've seen this all before:
					if(!$(".high-runs .run1-folder").hasClass('closed'))
						collapseFolder(".run1", ".run1-folder", true, folderSpeed);
					else
					{
						collapseFolder(".run1", ".run1-folder", false, folderSpeed);
						window.location = '#highsview-r1';
					}
				}
				return false;
			});
			
			//  run 2:
			$("a.run2").bind('click', function()
			{
				if(!running)
				{
					if(!$(".high-runs .run2-folder").hasClass('closed'))
						collapseFolder(".run2", ".run2-folder", true, folderSpeed);
					else
					{
						collapseFolder(".run2", ".run2-folder", false, folderSpeed);
						window.location = '#highsview-r2';
					}
				}
				
				return false;
			});
			
			//  run 3:
			$("a.run3").bind('click', function()
			{
				if(!running)
				{
					if(!$(".high-runs .run3-folder").hasClass('closed'))
						collapseFolder(".run3", ".run3-folder", true, folderSpeed);
					else
					{
						collapseFolder(".run3", ".run3-folder", false, folderSpeed);
						window.location = '#highsview-r3';
					}
				}
				
				return false;
			});
		}
	}
	
	
	//  CLOSE HIGH RUNS:
	
	//  close each high run folder and allow an exception:
	function closeHighRuns(time, exceptID)
	{
		//  close run folders with exceptions:
		
		if(exceptID != 1)
			collapseFolder(".run1", ".run1-folder", true, time);
		
		if(exceptID != 2)
			collapseFolder(".run2", ".run2-folder", true, time);
		
		if(exceptID != 3)
			collapseFolder(".run3", ".run3-folder", true, time);
	}
	
	
	//  COLLAPSE FOLDER:
	
	//  close a particular folder and set class 'closed' flag
	//  also adds an open/close image to any folder with a <span class="image">
	
	function collapseFolder(name, folder, collapse, time)
	{
		//  for a collapsing folder:
		if(collapse)
		{
			//  add 'closed' flag class to folder:
			$(name + " " + folder).addClass('closed');
			
			//  stop all animations and slideUp to close the folder:
			$(name + " " + folder).stop(true, true).slideUp(time, easeOutFunction);
			
			//  could be a switch if it gets more complicated:
			
			//  add the star image for 'current run' and 'high runs' main folders:
			if(name == ".current-run" || name == ".high-runs")
				$("a" + name + " span.image").html('<img src="images/star-empty.png">');
			
			//  default add the arrow to the <span>:
			else
				$("a" + name + " span.image").html('<img src="images/arrow-down.png">');
		}
		else
		{
			$(name + " " + folder).removeClass('closed');
			$(name + " " + folder).stop(true, true).slideDown(time, easeInFunction);
			
			if(name == ".current-run" || name == ".high-runs")
				$("a" + name + " span.image").html('<img src="images/star-filled.png">');
			else
				$("a" + name + " span.image").html('<img src="images/arrow-up.png">');
		}
	}
	
	
	
	
	///////
	//  GAME CONTROLS:
	
	
	//  ENABLE CONTROLS:
	
	//  enable/disable game-related controls and add event handlers:
	function enableControls(enable)
	{
		if(enable)
		{
			$('input:button[name$="add-civ"]').bind('click', function(){
				addCiv(1);
			});
			
			$('input:button[name$="add-cop"]').bind('click', function(){
				addCop(1);
			});
			
			$('input:button[name$="add-star"]').bind('click', function(){
				addStar(1);
			});
			
			$('input:button[name$="clear-stars"]').bind('click', function(){
				addCleared(stars);
			});
			
			$('input:button[name$="sub-civ"]').bind('click', function(){
				addCiv(-1);
			});
			
			$('input:button[name$="sub-cop"]').bind('click', function(){
				addCop(-1);
			});
			
			$('input:button[name$="sub-star"]').bind('click', function(){
				addStar(-1);
			});
			
			$('input:button[name$="sub-cleared"]').bind('click', function(){
				addCleared(-1);
			});
		}
		else
		{
			$('input:button[name$="add-civ"]').unbind('click');
			$('input:button[name$="add-cop"]').unbind('click');
			$('input:button[name$="add-star"]').unbind('click');
			$('input:button[name$="clear-stars"]').unbind('click');
			$('input:button[name$="sub-civ"]').unbind('click');
			$('input:button[name$="sub-cop"]').unbind('click');
			$('input:button[name$="sub-star"]').unbind('click');
			$('input:button[name$="sub-cleared"]').unbind('click');
		}
	}
	
	
	
	
	///////
	//  RENDER TO UI:
	
	
	//  RENDER TIME:
	
	//  render the game time to the UI clock:
	function renderTime()
	{
		//  zero check the minutes:
		scrMinutes = zeroCheck(minutes);
		
		//  zero check, and format the seconds:
		scrSeconds = formatNumber(zeroCheck(seconds));
		
		//  set the game clock's value:
		$('input#game-clock').val(scrMinutes + " : " + scrSeconds);
	}
	
	
	//  RENDER STREAK:
	
	//  update streak UI:
	function renderStreak()
	{
		//  update streak table in 'current run':
		$('td#kill').html(kill);
		$('td#rampage').html(rampage);
		$('td#serial').html(serial);
		$('td#long').html(longStreak);
		
		//  update current streak display:
		scrCurStreak = "";
		if(curStreak > 0)
			scrCurStreak = curStreak;
			
		//  write current streak to UI:
		$('span.current-streak').html(scrCurStreak);
	}
	
	
	//  RENDER STREAK COUNTDOWN:
	
	//  render streak countdown to UI:
	function renderStreakCountdown()
	{
		if(!sStrOn)
			//  just nice:
			$('table.streaks th span.count').html(zeroCheck(streakCountdown));	
		else
			//  render as the start streak value:
			$('table.streaks th span.count').html(zeroCheck(streakCountdown-sStrTime));
	}
	
	
	//  RENDER SCORE:
	
	//  renders the score/kill-stats to the UI:
	function renderScore()
	{
		//  score to stat table in 'current run':
		$('td#civs').html(civs);
		$('td#cops').html(cops);
		$('td#stars').html(stars);
		$('td#cleared').html(cleared);
	}
	
	
	
	
	///////
	//  UTILITIES:
	
	
	//  SAFE CLASS:
	
	//  intelligently adds or removes a class,
	//  only if it needs to:
	function safeClass(add, target, classname)
	{
		//  add:
		if(add)
		{
			//  check if already has:
			if(!target.hasClass(classname))
			{
				//  if not, add it:
				target.addClass(classname);
			}
		}
		//  remove:
		else
		{
			//  check it has the class:
			if(target.hasClass(classname))
			{
				//  if it does, remove it:
				$(target).removeClass(classname);
			}
		}
	}
	
	
	//  FORMAT NUMBER:
	
	//  adds a "0" to the front of any integer less than 10:
	function formatNumber(num)
	{
		if(num <= 9)
			return "0" + num;
		else
			return num;	
	}
	
	
	//  ZERO CHECK:
	
	//  will set a number to no-less than zero. an alternate
	//  floor or ceiling can be set with the direction +1/-1 
	//  used to determine "floor" or "ceiling" for the gate:
	function zeroCheck(num, altcheck, dir)
	{
		//  default altcheck to zero for classic 'zero check':
		if(altcheck == undefined)
			altcheck = 0;
		
		//  direction to zero - classic:
		if(dir == undefined)
			dir = 0;
		
		//  if direction is less than zero:
		if(dir <= 0)
		{
			//  check against the value as a "floor":
			if(num < altcheck)
				return altcheck;
			else
				return num;	
		}
		//  direction above zero:
		else
		{
			//  check against the value as a "ceiling":
			if(num > altcheck)
				return altcheck;
			else
				return num;
		}
	}
	
	
	//  CALCULATE PLAYED SECONDS:
	
	//  return the total game seconds played so far:
	function calculatePlayedSeconds()
	{
		//  figure out the delta seconds (i.e. - those played)
		return ((gameMinutes * 60) + gameSeconds) - ((minutes * 60) + seconds);
	}
	
});




///////
//  WINDOW - LOAD:

//  all the things to do AFTER each asset on the page has 
//  rendered and all (initial) assets have been loaded:
$(window).load(function(){
	
});

