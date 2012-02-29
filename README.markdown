# Server Revealer
This is an Add-On for Firefox Mozilla which aims to reveal to you which server in the [DTAP](http://en.wikipedia.org/wiki/Development,_testing,_acceptance_and_production) cycle you are currently visiting.

Aimed at developers who often change their hosts file in order to visit a diffrent server in the DTAP cycle or just for developers who visit dev.example.com and www.example.com.

The plugin will add a 'notification' to the window. The severety (and thus color) of the notification depends on which server you are visting.

## Setup

The plugin itself has no configuration (yet) and is not (yet) submitted to Mozilla. In order to try it, you should clone this repository and add a link to the source in your Firefox profile.

If you don't know how, I advice you to look at (and read) [this section](https://developer.mozilla.org/en/Building_an_Extension#Test) from the Mozilla Developer Network. Otherwise in short:

* git clone git://github.com/mhogerheijde/Server-Revealer.git `path-to-workspace`
* Locate your [profile folder](http://kb.mozillazine.org/Profile_folder) (e.g. Firefox/Profiles/`<profile_id>`.default) or make a [new one](http://kb.mozillazine.org/Profile_manager)
* Open the extensions/ folder, creating it if need be.
* Create a new text file with the id of this extension as its name (i.e. `server_revealer@hogerheijde.net`). No file extension
* In it, put the full path to `paht-to-workspace`  (e.g. C:\workspace\server\_revealer\ or ~/workspace/server\_revealer/)

## Server Setup

This plugin works by looking at a custom header added to the response of your server. For now it listens only to the header `X-SERVER-TYPE` and understands only these four values:

1. development
2. testing
3. acceptance 
4. production

This means you have to add these headers to the response of your server.

### Apache 2.2

You can add headers to the response of Apache using [`mod_headers`](http://httpd.apache.org/docs/2.0/mod/mod_headers.html)

	<ifModule mod_headers.c>
		Header set X-SERVER-TYPE "development"
	</ifModule>

This can be set within a .htaccess file or within the VirtualHost (Changes to the VirtualHost needs Apache to be reloaded).

### ISS 7

[Here](http://technet.microsoft.com/en-us/library/cc753133\(v=ws.10\).aspx) is a detailed description of how to set custom headers for IIS

# Known Issues

See https://github.com/mhogerheijde/Server-Revealer/issues

# To Do

* Make Add-On configurable
 * Custom header name
 * Custom header values
 * Custom theming?
* Easy accessable enable/disable button
