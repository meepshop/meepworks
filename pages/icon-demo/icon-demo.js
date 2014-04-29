var react = require('react');
var core = require('meepworks-core');
var meepIcon = require('meepworks-icon');
var meepButton = require('meepworks-button');
var meepApp = require('meepworks-app');

var dom = react.DOM;

var glyphicons = ["glyphicon-adjust","glyphicon-align-center","glyphicon-align-justify","glyphicon-align-left","glyphicon-align-right","glyphicon-arrow-down","glyphicon-arrow-left","glyphicon-arrow-right","glyphicon-arrow-up","glyphicon-asterisk","glyphicon-backward","glyphicon-ban-circle","glyphicon-barcode","glyphicon-bell","glyphicon-bold","glyphicon-book","glyphicon-bookmark","glyphicon-briefcase","glyphicon-bullhorn","glyphicon-calendar","glyphicon-camera","glyphicon-certificate","glyphicon-check","glyphicon-chevron-down","glyphicon-chevron-left","glyphicon-chevron-right","glyphicon-chevron-up","glyphicon-circle-arrow-down","glyphicon-circle-arrow-left","glyphicon-circle-arrow-right","glyphicon-circle-arrow-up","glyphicon-cloud","glyphicon-cloud-download","glyphicon-cloud-upload","glyphicon-cog","glyphicon-collapse-down","glyphicon-collapse-up","glyphicon-comment","glyphicon-compressed","glyphicon-copyright-mark","glyphicon-credit-card","glyphicon-cutlery","glyphicon-dashboard","glyphicon-download","glyphicon-download-alt","glyphicon-earphone","glyphicon-edit","glyphicon-eject","glyphicon-envelope","glyphicon-euro","glyphicon-exclamation-sign","glyphicon-expand","glyphicon-export","glyphicon-eye-close","glyphicon-eye-open","glyphicon-facetime-video","glyphicon-fast-backward","glyphicon-fast-forward","glyphicon-file","glyphicon-film","glyphicon-filter","glyphicon-fire","glyphicon-flag","glyphicon-flash","glyphicon-floppy-disk","glyphicon-floppy-open","glyphicon-floppy-remove","glyphicon-floppy-save","glyphicon-floppy-saved","glyphicon-folder-close","glyphicon-folder-open","glyphicon-font","glyphicon-forward","glyphicon-fullscreen","glyphicon-gbp","glyphicon-gift","glyphicon-glass","glyphicon-globe","glyphicon-hand-down","glyphicon-hand-left","glyphicon-hand-right","glyphicon-hand-up","glyphicon-hd-video","glyphicon-hdd","glyphicon-header","glyphicon-headphones","glyphicon-heart","glyphicon-heart-empty","glyphicon-home","glyphicon-import","glyphicon-inbox","glyphicon-indent-left","glyphicon-indent-right","glyphicon-info-sign","glyphicon-italic","glyphicon-leaf","glyphicon-link","glyphicon-list","glyphicon-list-alt","glyphicon-lock","glyphicon-log-in","glyphicon-log-out","glyphicon-magnet","glyphicon-map-marker","glyphicon-minus","glyphicon-minus-sign","glyphicon-move","glyphicon-music","glyphicon-new-window","glyphicon-off","glyphicon-ok","glyphicon-ok-circle","glyphicon-ok-sign","glyphicon-open","glyphicon-paperclip","glyphicon-pause","glyphicon-pencil","glyphicon-phone","glyphicon-phone-alt","glyphicon-picture","glyphicon-plane","glyphicon-play","glyphicon-play-circle","glyphicon-plus","glyphicon-plus-sign","glyphicon-print","glyphicon-pushpin","glyphicon-qrcode","glyphicon-question-sign","glyphicon-random","glyphicon-record","glyphicon-refresh","glyphicon-registration-mark","glyphicon-remove","glyphicon-remove-circle","glyphicon-remove-sign","glyphicon-repeat","glyphicon-resize-full","glyphicon-resize-horizontal","glyphicon-resize-small","glyphicon-resize-vertical","glyphicon-retweet","glyphicon-road","glyphicon-save","glyphicon-saved","glyphicon-screenshot","glyphicon-sd-video","glyphicon-search","glyphicon-send","glyphicon-share","glyphicon-share-alt","glyphicon-shopping-cart","glyphicon-signal","glyphicon-sort","glyphicon-sort-by-alphabet","glyphicon-sort-by-alphabet-alt","glyphicon-sort-by-attributes","glyphicon-sort-by-attributes-alt","glyphicon-sort-by-order","glyphicon-sort-by-order-alt","glyphicon-sound-5-1","glyphicon-sound-6-1","glyphicon-sound-7-1","glyphicon-sound-dolby","glyphicon-sound-stereo","glyphicon-star","glyphicon-star-empty","glyphicon-stats","glyphicon-step-backward","glyphicon-step-forward","glyphicon-stop","glyphicon-subtitles","glyphicon-tag","glyphicon-tags","glyphicon-tasks","glyphicon-text-height","glyphicon-text-width","glyphicon-th","glyphicon-th-large","glyphicon-th-list","glyphicon-thumbs-down","glyphicon-thumbs-up","glyphicon-time","glyphicon-tint","glyphicon-tower","glyphicon-transfer","glyphicon-trash","glyphicon-tree-conifer","glyphicon-tree-deciduous","glyphicon-unchecked","glyphicon-upload","glyphicon-usd","glyphicon-user","glyphicon-volume-down","glyphicon-volume-off","glyphicon-volume-up","glyphicon-warning-sign","glyphicon-wrench","glyphicon-zoom-in","glyphicon-zoom-out"];
var ionicons = ["ion-ionic","ion-arrow-up-a","ion-arrow-right-a","ion-arrow-down-a","ion-arrow-left-a","ion-arrow-up-b","ion-arrow-right-b","ion-arrow-down-b","ion-arrow-left-b","ion-arrow-up-c","ion-arrow-right-c","ion-arrow-down-c","ion-arrow-left-c","ion-arrow-return-right","ion-arrow-return-left","ion-arrow-swap","ion-arrow-shrink","ion-arrow-expand","ion-arrow-move","ion-arrow-resize","ion-chevron-up","ion-chevron-right","ion-chevron-down","ion-chevron-left","ion-log-in","ion-log-out","ion-checkmark-round","ion-checkmark","ion-checkmark-circled","ion-close-round","ion-close","ion-close-circled","ion-plus-round","ion-plus","ion-plus-circled","ion-minus-round","ion-minus","ion-minus-circled","ion-information","ion-information-circled","ion-help","ion-help-circled","ion-help-buoy","ion-alert","ion-alert-circled","ion-refresh","ion-loop","ion-shuffle","ion-home","ion-search","ion-flag","ion-star","ion-heart","ion-gear-a","ion-gear-b","ion-settings","ion-wrench","ion-hammer","ion-trash-a","ion-trash-b","ion-navicon-round","ion-navicon","ion-drag","ion-document","ion-document-text","ion-clipboard","ion-bookmark","ion-email","ion-folder","ion-filing","ion-archive","ion-reply","ion-reply-all","ion-forward","ion-share","ion-link","ion-paperclip","ion-compose","ion-briefcase","ion-medkit","ion-at","ion-pound","ion-cloud","ion-upload","ion-more","ion-grid","ion-calendar","ion-clock","ion-compass","ion-pinpoint","ion-pin","ion-navigate","ion-location","ion-map","ion-locked","ion-unlocked","ion-key","ion-arrow-graph-up-right","ion-arrow-graph-down-right","ion-arrow-graph-up-left","ion-arrow-graph-down-left","ion-stats-bars","ion-connection-bars","ion-pie-graph","ion-chatbubble","ion-chatbubble-working","ion-chatbubbles","ion-chatbox","ion-chatbox-working","ion-chatboxes","ion-person","ion-person-add","ion-person-stalker","ion-woman","ion-man","ion-female","ion-male","ion-fork","ion-knife","ion-spoon","ion-beer","ion-wineglass","ion-coffee","ion-icecream","ion-pizza","ion-power","ion-battery-full","ion-battery-half","ion-battery-low","ion-battery-empty","ion-battery-charging","ion-wifi","ion-bluetooth","ion-calculator","ion-camera","ion-eye","ion-flash","ion-flash-off","ion-image","ion-images","ion-contrast","ion-monitor","ion-laptop","ion-ipad","ion-iphone","ion-ipod","ion-usb","ion-printer","ion-code","ion-code-working","ion-code-download","ion-game-controller-a","ion-game-controller-b","ion-videocamera","ion-film-marker","ion-disc","ion-headphone","ion-music-note","ion-radio-waves","ion-speakerphone","ion-mic-a","ion-mic-b","ion-mic-c","ion-volume-high","ion-volume-medium","ion-volume-low","ion-volume-mute","ion-levels","ion-play","ion-pause","ion-stop","ion-record","ion-skip-forward","ion-skip-backward","ion-eject","ion-bag","ion-card","ion-pricetag","ion-pricetags","ion-thumbsup","ion-thumbsdown","ion-magnet","ion-beaker","ion-flask","ion-egg","ion-earth","ion-lightbulb","ion-leaf","ion-waterdrop","ion-umbrella","ion-nuclear","ion-thermometer","ion-speedometer","ion-plane","ion-jet","ion-load-d","ion-load-c","ion-load-b","ion-load-a","ion-ios7-ionic-outline","ion-ios7-arrow-back","ion-ios7-arrow-forward","ion-ios7-arrow-up","ion-ios7-arrow-right","ion-ios7-arrow-down","ion-ios7-arrow-left","ion-ios7-arrow-thin-up","ion-ios7-arrow-thin-right","ion-ios7-arrow-thin-down","ion-ios7-arrow-thin-left","ion-ios7-circle-filled","ion-ios7-circle-outline","ion-ios7-checkmark-empty","ion-ios7-checkmark-outline","ion-ios7-checkmark","ion-ios7-plus-empty","ion-ios7-plus-outline","ion-ios7-plus","ion-ios7-close-empty","ion-ios7-close-outline","ion-ios7-close","ion-ios7-minus-empty","ion-ios7-minus-outline","ion-ios7-minus","ion-ios7-information-empty","ion-ios7-information-outline","ion-ios7-information","ion-ios7-help-empty","ion-ios7-help-outline","ion-ios7-help","ion-ios7-search","ion-ios7-search-strong","ion-ios7-star","ion-ios7-star-outline","ion-ios7-heart","ion-ios7-heart-outline","ion-ios7-more","ion-ios7-more-outline","ion-ios7-cloud","ion-ios7-cloud-outline","ion-ios7-cloud-upload","ion-ios7-cloud-upload-outline","ion-ios7-cloud-download","ion-ios7-cloud-download-outline","ion-ios7-upload","ion-ios7-upload-outline","ion-ios7-download","ion-ios7-download-outline","ion-ios7-refresh-outline","ion-ios7-refresh","ion-ios7-refresh-empty","ion-ios7-reload","ion-ios7-bookmarks","ion-ios7-bookmarks-outline","ion-ios7-flag","ion-ios7-flag-outline","ion-ios7-glasses","ion-ios7-glasses-outline","ion-ios7-browsers","ion-ios7-browsers-outline","ion-ios7-at","ion-ios7-at-outline","ion-ios7-cart","ion-ios7-cart-outline","ion-ios7-pricetag","ion-ios7-pricetag-outline","ion-ios7-chatboxes-outline","ion-ios7-chatbubble","ion-ios7-chatbubble-outline","ion-ios7-cog","ion-ios7-cog-outline","ion-ios7-gear","ion-ios7-gear-outline","ion-ios7-pie","ion-ios7-pie-outline","ion-ios7-filing","ion-ios7-filing-outline","ion-ios7-box","ion-ios7-box-outline","ion-ios7-compose","ion-ios7-compose-outline","ion-ios7-trash","ion-ios7-trash-outline","ion-ios7-copy","ion-ios7-copy-outline","ion-ios7-email","ion-ios7-email-outline","ion-ios7-undo","ion-ios7-undo-outline","ion-ios7-redo","ion-ios7-redo-outline","ion-ios7-paperplane","ion-ios7-paperplane-outline","ion-ios7-folder","ion-ios7-folder-outline","ion-ios7-world","ion-ios7-world-outline","ion-ios7-alarm","ion-ios7-alarm-outline","ion-ios7-speedometer","ion-ios7-speedometer-outline","ion-ios7-stopwatch","ion-ios7-stopwatch-outline","ion-ios7-timer","ion-ios7-timer-outline","ion-ios7-clock","ion-ios7-clock-outline","ion-ios7-time","ion-ios7-time-outline","ion-ios7-calendar","ion-ios7-calendar-outline","ion-ios7-photos","ion-ios7-photos-outline","ion-ios7-albums","ion-ios7-albums-outline","ion-ios7-camera","ion-ios7-camera-outline","ion-ios7-eye","ion-ios7-eye-outline","ion-ios7-bolt","ion-ios7-bolt-outline","ion-ios7-briefcase","ion-ios7-briefcase-outline","ion-ios7-medkit","ion-ios7-medkit-outline","ion-ios7-infinite","ion-ios7-infinite-outline","ion-ios7-calculator","ion-ios7-calculator-outline","ion-ios7-keypad","ion-ios7-keypad-outline","ion-ios7-telephone","ion-ios7-telephone-outline","ion-ios7-drag","ion-ios7-location","ion-ios7-location-outline","ion-ios7-navigate","ion-ios7-navigate-outline","ion-ios7-locked","ion-ios7-locked-outline","ion-ios7-unlocked","ion-ios7-unlocked-outline","ion-ios7-monitor","ion-ios7-monitor-outline","ion-ios7-printer","ion-ios7-printer-outline","ion-ios7-person","ion-ios7-person-outline","ion-ios7-personadd","ion-ios7-personadd-outline","ion-ios7-people","ion-ios7-people-outline","ion-ios7-sunny","ion-ios7-sunny-outline","ion-ios7-partlysunny","ion-ios7-partlysunny-outline","ion-ios7-cloudy","ion-ios7-cloudy-outline","ion-ios7-rainy","ion-ios7-rainy-outline","ion-ios7-thunderstorm","ion-ios7-thunderstorm-outline","ion-ios7-moon","ion-ios7-moon-outline","ion-ios7-musical-notes","ion-ios7-musical-note","ion-ios7-bell","ion-ios7-bell-outline","ion-ios7-mic","ion-ios7-mic-outline","ion-ios7-mic-off","ion-ios7-volume-high","ion-ios7-volume-low","ion-ios7-play","ion-ios7-play-outline","ion-ios7-pause","ion-ios7-pause-outline","ion-ios7-recording","ion-ios7-recording-outline","ion-ios7-fastforward","ion-ios7-fastforward-outline","ion-ios7-rewind","ion-ios7-rewind-outline","ion-ios7-skipbackward","ion-ios7-skipbackward-outline","ion-ios7-skipforward","ion-ios7-skipforward-outline","ion-ios7-videocam","ion-ios7-videocam-outline","ion-ios7-film","ion-ios7-film-outline","ion-ios7-lightbulb","ion-ios7-lightbulb-outline","ion-ios7-wineglass","ion-ios7-wineglass-outline","ion-social-twitter","ion-social-twitter-outline","ion-social-facebook","ion-social-facebook-outline","ion-social-googleplus","ion-social-googleplus-outline","ion-social-dribbble","ion-social-dribbble-outline","ion-social-github","ion-social-github-outline","ion-social-pinterest","ion-social-pinterest-outline","ion-social-rss","ion-social-rss-outline","ion-social-tumblr","ion-social-tumblr-outline","ion-social-wordpress","ion-social-wordpress-outline","ion-social-reddit","ion-social-reddit-outline","ion-social-hackernews","ion-social-hackernews-outline","ion-social-designernews","ion-social-designernews-outline","ion-social-yahoo","ion-social-yahoo-outline","ion-social-buffer","ion-social-buffer-outline","ion-social-skype","ion-social-skype-outline","ion-social-linkedin","ion-social-linkedin-outline","ion-social-bitcoin","ion-social-bitcoin-outline","ion-social-vimeo","ion-social-vimeo-outline","ion-social-youtube","ion-social-youtube-outline","ion-social-dropbox","ion-social-dropbox-outline","ion-social-apple","ion-social-apple-outline","ion-social-android","ion-social-android-outline","ion-social-windows","ion-social-windows-outline"];
var iconDisplay = core.createClass({
	render: function ()
	{
		return dom.div({
			className: 'col-lg-3 col-md-4',
			style: {
				'font-size': '24px',
				'background-color': 'white',
				'margin': '2px 2px 0px 0px',
				'padding': '2px 2px 2px 2px',
				'text-align': 'center'
			},
			children: [
			this.props.icon,
			]
		});
	}
});

var iconSwitcher = core.createClass({
	getDefaultProps: function ()
	{
		return {
			context: 0,
			handleGlyph: null,
			handleIon: null
		};
	},
	render: function ()
	{
		return meepApp.header({
			content: [
			meepButton.buttonToolbar({
				children: [
				meepButton({
					label: 'Glyphicons',
					bootstrapStyle: this.props.context==0 ? 'primary': 'default',
					onClick: this.props.handleGlyph,
					tooltip: 'Show Glyphicons long tip',
					tooltipPosition: 'bottom',
				}),
				meepButton({
					label: 'Ionicons',
					bootstrapStyle: this.props.context==1 ? 'primary': 'default',
					onClick: this.props.handleIon,
					tooltip: 'Show Ionicons',
					tooltipPosition: 'bottom'
				})
				]
			})
			]
		});
	}
});
function handleSwitch(context)
{
	if(context != this.state.context)
	{
		this.setState({
			context: context
		});
	}
}
module.exports = core.createClass({
	getInitialState: function()
	{
		return {
			context: 0
		};
	},
	render: function ()
	{
		var icons = [];
		switch(this.state.context)
		{
			case 0:
				glyphicons.forEach(function (icon)
				{	icons.push(iconDisplay({
						key: 'glyph-'+icon,
						name: icon,
						icon: meepIcon.glyphicon({
							name: icon
						})
					}));
				});
				break;
			case 1: 
				ionicons.forEach(function (icon)
				{
					icons.push(iconDisplay({
						key: 'ion-'+icon,
						name: icon,
						icon: meepIcon.ionicon({
							name: icon
						})
					}));
				});
				break;
		}

		return meepApp({
			body: meepApp.body({
				content:  //icons
				react.addons.CSSTransitionGroup({
					component: dom.div,
					transitionLeave: false,
					transitionName: 'icon-demo',
					children: dom.div({
						key: 'content-' + this.state.context,
						children: icons})
				})
			}),
			header: iconSwitcher({
				handleGlyph: handleSwitch.bind(this, 0),
				handleIon: handleSwitch.bind(this, 1),
				context: this.state.context
			})
		});
	}
});

