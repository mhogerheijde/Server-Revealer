var serverRevealerOverlay = (function() {

	var $ = function (id) {
		return document.getElementById(id)
	};

	return {

		settings: {
			HEADER_NAME: 'X-SERVER-TYPE',
			SKIN_PATH: 'chrome://server_revealer/skin/',
			NOTIFICTION_VALUE_PREFIX: 'server-revealer-notification-'
		},

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
				// window.addEventListener("documentload", this.onDocumentLoad, true);


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
				// We're going to do a HEAD request on the currently loaded URL
				//FIXME: Find out how to ask Firefox for the header-data
				//Do that using this: https://developer.mozilla.org/en/XUL_School/Intercepting_Page_Loads#HTTP_Observers
				var url = window.content.location.href;

				var http = new XMLHttpRequest();
				http.open('HEAD', url, false);
				http.send();

				//Fetch the headers and reformat into Object for easy use
				var rawHeaders = (http.getAllResponseHeaders()).trim().split("\n");
				var headers = {};
				for(var line in rawHeaders) {
					var data = rawHeaders[line].split(": ");
					var key = data.shift();
					headers[key] = data.join(":");
				}

				// If the header is not there, gracefully walk away.
				if(headers[serverRevealerOverlay.settings.HEADER_NAME]) {
					serverRevealerOverlay.setNotification(headers[serverRevealerOverlay.settings.HEADER_NAME]);
				} else {
					//If there is no header set, remove notifications set by us, since they have no meaning.
					serverRevealerOverlay.cleanNotifications();
				}
			},

			onPageHide: function (ev) {
				serverRevealerOverlay.dump("onPageHide()");
			},

		}, //listeners

		/**
		 * Cleans all notification set by ourself.
		 */
		cleanNotifications : function () {
			var nb = gBrowser.getNotificationBox();
			if(nb.allNotifications) {
				for (i in nb.allNotifications) {
					if(notification.value 
							&& notification.indexOf(serverRevealerOverlay.settings.NOTIFICTION_VALUE_PREFIX) == 0) {
						nb.removeNotification(notification);
					}
				}	
			}
			
		},

		/**
		 * Abstraction for adding a notification to the browserwindow
		 */
		setNotification : function(header) {
			// First: remove old notifications.
			serverRevealerOverlay.cleanNotifications();

			// Set values for new notification, depending on header value
			var nb = gBrowser.getNotificationBox();
			var icon = "";
			var prio = nb.PRIORITY_INFO_LOW;
			// icons from http://findicons.com
			switch(header) {
				case 'development':
					prio = nb.PRIORITY_INFO_LOW;
					icon = serverRevealerOverlay.settings.SKIN_PATH + "notification_ok.png";
					break;
				case 'testing':
					prio = nb.PRIORITY_INFO_HIGH;
					icon = serverRevealerOverlay.settings.SKIN_PATH + "notification_warning.png";
					break;
				case 'acceptance':
					prio = nb.PRIORITY_WARNING_LOW;
					icon = serverRevealerOverlay.settings.SKIN_PATH + "notification_warning.png";
					break;
				case 'production':
					prio = nb.PRIORITY_CRITICAL_HIGH;
					icon = serverRevealerOverlay.settings.SKIN_PATH + "notification_alert.png";
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
				"You are currently working on a " + header + " server!!",
				serverRevealerOverlay.settings.NOTIFICTION_VALUE_PREFIX + header,
				icon,
				prio,
				[]
			);


		},

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

