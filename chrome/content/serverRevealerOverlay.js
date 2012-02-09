var serverRevealerOverlay = (function() {


	var $ = function (id) {
		return document.getElementById(id)
	};
	const Cc = Components.classes;
	const Ci = Components.interfaces;

	return {

		initialise: function() {
			
			window.addEventListener("load", this.listeners.onLoad, false);
			// window.addEventListener("load", "alert('test2')", false);
			
			// var message = 'Testing server';
			// var nb = gBrowser.getNotificationBox();
			// var n = nb.getNotificationWithValue('popup-blocked');
			// if(n) {
			// 	n.label = message;
			// } else {
			// 	var buttons = [
			// 		// {
			// 		// 	label: 'Button',
			// 		// 	accessKey: 'B',
			// 		// 	popup: 'blockedPopupOptions',
			// 		// 	callback: null
			// 		// }
			// 	];

			// 	const priority = nb.PRIORITY_WARNING_MEDIUM;
			// 	nb.appendNotification(
			// 			message, 'popup-blocked',
			// 			'chrome://browser/skin/Info.png',
			// 			priority, buttons);
			// }

		},

		listeners : {
			onLoad : function(e) {
				alert('test on load');
			},

			/*
			 * Setup listeners
			 */
			setup : function() {
				window.addEventListener("pageshow", this.onPageShow, true);
				window.addEventListener("pagehide", this.onPageHide, true);
			},

			onPageShow: function (ev) {
				try {
					if (ev.persisted && (ev.target instanceof HTMLDocument)) {
						// var d = ev.target;
						// noscriptOverlay.toggleObjectsVisibility(d, true);
					}
				} catch (e) {}
				// noscriptOverlay._syncUIReal();
			},

			onPageHide: function (ev) {
				var d = ev.target;
				if (d instanceof HTMLDocument) {
					// var ns = noscriptOverlay.ns;
					// noscriptOverlay.toggleObjectsVisibility(d, false);
				}
			},
		}


	}
})()

serverRevealerOverlay.initialise();

