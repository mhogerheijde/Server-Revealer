var serverRevealerOverlay = (function() {


	var $ = function (id) {
		return document.getElementById(id)
	};
//	const Cc = Components.classes;
//	const Ci = Components.interfaces;

	return {

		initialise: function() {
			console.log("TESTING!!");
			 window.addEventListener("load", this.listeners.onLoad, false);
		},

		listeners : {
			/**
			 * When the window is loaded, setup other listeners.
			 */
			onLoad : function(e) {
				Components.utils.reportError("onLoad()!");
				console.log("TESTING!!");
				Components.utils.reportError(e);
				// Setup the listeners
				serverRevealerOverlay.listeners.setup();
			},

			/*
			 * Setup listeners
			 */
			setup: function () {
				Components.utils.reportError("setup()");

				// Remove the onload listener, we don't need it anymore
				window.removeEventListener("load", this.onLoad, false);
				// Cleanup when window is unloaded
				window.addEventListener("unload",this.onUnload, false);

				// Setup page show/hide/content listeners, in order to get in action when
				// a new page is opened and content is loaded
				window.addEventListener("pageshow", this.onPageShow, true);
//				window.addEventListener("pagehide", this.onPageHide, true);
//				window.addEventListener("DOMContentLoaded", this.onContentLoad, false);


			},

			onUnload: function (ev) {
				//TODO remove listeners etc.
			},

			onContentLoad: function (ev) {


			},

			onDocumentLoad: function (ev) {
				serverRevealerOverlay.dump("onDocumentLoad()");
				if (ev.originalTarget instanceof HTMLDocument) {
					let w = ev.currentTarget;
					w.removeEventListener("load", serverRevealerOverlay.listeners.onDocumentLoad, false);
					serverRevealerOverlay.dump(w);
//					window.setTimeout(function () {
//						noscriptOverlay.ns.detectJSRedirects(w.document);
//					}, 50);
				}
			},

			onPageShow: function (ev) {
//				serverRevealerOverlay.dump("onPageShow()");

				var url = window.content.location.href;

				var http = new XMLHttpRequest();
				http.open('HEAD', url, false);
				http.send();

				rawHeaders = (http.getAllResponseHeaders()).trim().split("\n");
				headers = {};
				for(line in rawHeaders) {
					data = rawHeaders[line].split(": ");
					key = data.shift();
					headers[key] = data.join(":");
				}
//				serverRevealerOverlay.dump(headers);

//				dump(headers['X-SA-SERVERTYPE']);

				if(headers['X-SA-SERVERTYPE']) {

					var nb = gBrowser.getNotificationBox();

					prio = nb.PRIORITY_INFO_LOW

					switch(headers['X-SA-SERVERTYPE']) {
						case 'development':
							prio = nb.PRIORITY_INFO_LOW;
							break;
						case 'production':
							prio = nb.PRIORITY_CRITICAL_HIGH;
							break;
					}

//					nb.PRIORITY_INFO_LOW
//				    nb.PRIORITY_INFO_MEDIUM
//				    nb.PRIORITY_INFO_HIGH
//				    nb.PRIORITY_WARNING_LOW
//				    nb.PRIORITY_WARNING_MEDIUM
//				    nb.PRIORITY_WARNING_HIGH
//				    nb.PRIORITY_CRITICAL_LOW
//				    nb.PRIORITY_CRITICAL_MEDIUM
//				    nb.PRIORITY_CRITICAL_HIGH
//				    nb.PRIORITY_CRITICAL_BLOCK




					nb.appendNotification(
						"You are currently working on a " + headers['X-SA-SERVERTYPE'] + " server!!",
						"server-revealer-notification",
						"chrome://server_revealer/skin/notification.gif",
						prio,
						[]
					);
				}



//				serverRevealerOverlay.dump(ev);
//				alert('test onPageShow()');
//				try {
//					if (ev.persisted && (ev.target instanceof HTMLDocument)) {
//						// var d = ev.target;
//						// noscriptOverlay.toggleObjectsVisibility(d, true);
//					}
//				} catch (e) {}
				// noscriptOverlay._syncUIReal();
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

