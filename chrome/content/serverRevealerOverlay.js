var serverRevealerOverlay = (function() {


	var $ = function (id) {
		return document.getElementById(id)
	};

	return {

		initialise: function() {
			// Attach a onLoad eventlistener to the window, in order to do work only
			// after the window is loaded
			window.addEventListener("load", this.listeners.onLoad, false);
		},

		listeners : {
			/**
			 * When the window is loaded, setup other listeners.
			 */
			onLoad : function(e) {
				// Setup the listeners
				serverRevealerOverlay.listeners.setup();
			},

			/*
			 * Setup listeners
			 */
			setup: function () {
				// Remove the onload listener, we don't need it anymore
				window.removeEventListener("load", this.onLoad, false);

				// Cleanup when window is unloaded
				window.addEventListener("unload",this.onUnload, false);

				// Setup page show/hide/content listeners, in order to get in action when
				// a new page is opened and content is loaded
				window.addEventListener("pageshow", this.onPageShow, true);


			},

			onUnload: function (ev) {
				//TODO: remove listeners etc.
			},

			onContentLoad: function (ev) {
				//TODO: Check if this listener is needed
			},

			onDocumentLoad: function (ev) {
				//TODO: Check if this listener is needed
			},

			/**
			 * The onPageShow listener checks if the page is served from one of the servers
			 * in our DTAP cycle. If so, displays a bar indicating which one.
			 */
			onPageShow: function (ev) {
				const HEADER_NAME = 'X-SERVER-TYPE';

				// We're going to do a HEAD request on the currently loaded URL
				//TODO: Find out how to ask Firefox for the header-data
				var url = window.content.location.href;

				var http = new XMLHttpRequest();
				http.open('HEAD', url, false);
				http.send();

				//Fetch the headers and reformat into Object for easy use
				rawHeaders = (http.getAllResponseHeaders()).trim().split("\n");
				headers = {};
				for(line in rawHeaders) {
					data = rawHeaders[line].split(": ");
					key = data.shift();
					headers[key] = data.join(":");
				}


				// If the header is not there, gracefully walk away.
				if(headers[HEADER_NAME]) {

					var nb = gBrowser.getNotificationBox();

					prio = nb.PRIORITY_INFO_LOW
					// icons from http://findicons.com
					switch(headers[HEADER_NAME]) {
						case 'development':
							prio = nb.PRIORITY_INFO_LOW;
							break;
						case 'testing':
							prio = nb.PRIORITY_INFO_HIGH;
							break;
						case 'acceptance':
							prio = nb.PRIORITY_WARNING_LOW;
							break;
						case 'production':
							prio = nb.PRIORITY_CRITICAL_HIGH;
							break;
					}

					// Available priorities
					// nb.PRIORITY_INFO_LOW
					// nb.PRIORITY_INFO_MEDIUM
					// nb.PRIORITY_INFO_HIGH
					// nb.PRIORITY_WARNING_LOW
					// nb.PRIORITY_WARNING_MEDIUM
					// nb.PRIORITY_WARNING_HIGH
					// nb.PRIORITY_CRITICAL_LOW
					// nb.PRIORITY_CRITICAL_MEDIUM
					// nb.PRIORITY_CRITICAL_HIGH
					// nb.PRIORITY_CRITICAL_BLOCK




					nb.appendNotification(
						"You are currently working on a " + headers[HEADER_NAME] + " server!!",
						"server-revealer-notification-" + headers[HEADER_NAME],
						"",
						prio,
						[]
					);
				}
			},

			onPageHide: function (ev) {
				serverRevealerOverlay.dump("onPageHide()");
//				serverRevealerOverlay.dump(ev);
				var d = ev.target;
				if (d instanceof HTMLDocument) {
					// var ns = noscriptOverlay.ns;
					// noscriptOverlay.toggleObjectsVisibility(d, false);
				}
			},





		}, //listeners

		dump : function (arr) {
			dump(this.dumpHelper(arr, 0));
		},

		dumpHelper : function (arr, level) {
			dumped_text = "";
			//The padding given at the beginning of the line.
			var level_padding = "";
			for(var j=0;j<level+1;j++) level_padding += "    ";


			if(typeof arr === 'object' && level < 2) { //Array/Hashes/Objects
				length = Object.keys(arr).length;
				dumped_text += typeof(arr) + "("+length+") {\n";
				for(var i in arr) {
//					dump("Got element i: "+ i + "\n");
					try {
						var value = arr[i];
						dumped_text += level_padding + '["' + i + '"] => ';
						dumped_text += this.dumpHelper(value,level+1);
					} catch (e) {
						// TODO: handle exception
//						dump(e);
					}
//



//					if(typeof(value) == 'object') { //If it is an array,
//						dumped_text += level_padding + "'" + i + "' ...\n";
//						dumped_text += this.dump(value,level+1);
//					} else {
//						dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
//					}

				}
				dumped_text += "}";
//				dump("Current dumped_text \n\n" + dumped_text + "\n\n---------------------------------\n" );
			} else if(arr == null) { //Stings/Chars/Numbers etc.
				dumped_text += "NULL\n";
			} else {
				dumped_text += typeof(arr) + "(" + arr.toString().length + ") " + '"' + arr.toString() + '"' + "\n";
			}

			return dumped_text;

		}


	}
})();

serverRevealerOverlay.initialise();

