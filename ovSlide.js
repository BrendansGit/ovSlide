function scrollControl(main, dialog, preload){
	var self = this;
	self.$main = $(main);
	self.$dialog = $(dialog);
	self.$preload = $(preload);

	if (!self.$main.length) {console.error('ScrollControl: no main found', main) }
	if (!self.$dialog.length) {console.error('ScrollControl: no dialog found', dialog) }
	if (!self.$preload.length) {console.error('ScrollControl: no preload found', preload) }

	self.originalMarginTop = parseInt(self.$main.css('margin-top'));
	self.saveScrollPos = 0;
	self.stateIs = '';
	self.set = function(key) {
		self.stateIs = (key);
		var sct = $(window).scrollTop();
		var h = $(window).height();

		if (key === 'dialog') {
			// dialog
			window.navigation.navLock = 1;
			$(window).scrollTop(0);
			self.saveScrollPos = sct;
			self.$main.css({
				position: 'fixed',
				'margin-top': sct*-1 + self.originalMarginTop,
				// 'margin-right': self.scrollBarWidth,
				overflow: 'hidden',
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			}).addClass('disabled');

			self.$dialog.addClass('is-visible');
		}
		if (key === 'preload') {
			// preload
			window.navigation.navLock = 1;
			$(window).scrollTop(0);
			self.saveScrollPos = sct;
			self.$main.css({
				position: 'fixed',
				'margin-top': sct*-1 + self.originalMarginTop,
				// 'margin-right': self.scrollBarWidth,
				overflow: 'hidden',
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			}).addClass('disabled');

			// self.$dialog.removeClass('is-visible');
		}
		if (key === 'main') {
			// main
			window.navigation.navLock = 0;
			self.$main.css({
				position: 'static',
				'margin-top': self.originalMarginTop,
				// 'margin-right': 0,
				overflow: 'visible',
				top: 'auto',
				bottom: 'auto'
			}).removeClass('disabled');;
			$(window).scrollTop(self.saveScrollPos + self.originalMarginTop);

			self.$dialog.removeClass('is-visible');
		}
	}

	this.getScrollbarWidth = function() {
	    var outer = document.createElement("div");
	    outer.style.visibility = "hidden";
	    outer.style.width = "100px";
	    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

	    document.body.appendChild(outer);

	    var widthNoScroll = outer.offsetWidth;
	    // force scrollbars
	    outer.style.overflow = "scroll";

	    // add innerdiv
	    var inner = document.createElement("div");
	    inner.style.width = "100%";
	    outer.appendChild(inner);        

	    var widthWithScroll = inner.offsetWidth;

	    // remove divs
	    outer.parentNode.removeChild(outer);

	    self.scrollBarWidth = widthNoScroll - widthWithScroll;
	}	
	this.getScrollbarWidth();

	var mainContent = this.$main.html().replace(/\n/g, '').length;
	if (!mainContent) {
		
		this.$main.load(window.location.protocol + '//' + window.location.host + '/' + ' .main__content', function(){
			$(window).trigger('scroll');
			$(document).trigger('__ready');
		})
	}
}

var scroll = new scrollControl('.main', '.dialog', '.header');