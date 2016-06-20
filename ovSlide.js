var ovslider = function(el, minwidth, gutter){
	var self = this;
	
	el = $(el);
	var wrapper = el.children().first();
	this.els = wrapper.children();


	this.elsInView = this.els.length;
	this.elsPassed = 0;
	this.elsOver = 0;
	this.absPos = 0;
	this.panPos = 0;

	this.elWidth = minwidth;

	var c = {
		out: 'slide-out',
		in: 'slide-in',
		left: 'slide-out-left',
		right: 'slide-out-right'
	};

	this.setup = function(){
		var overflow = 0;
		self.elWidth = el.width() / self.els.length;
		while(self.elWidth < minwidth) {
			overflow++;
			self.elsInView = self.els.length - overflow;
			self.elWidth = el.width() / self.elsInView;
		}
		var totalWidth = self.elWidth * self.els.length;
		totalWidth = totalWidth + (gutter * self.els.length);

		wrapper.css('width', totalWidth);
		self.els.css('width', self.elWidth);

		setTimeout(function(){
			window.menublocks.synch();
			window.menuTitles.synch();
		},50);
	};
	this.setupSlides = function(){
		if (self.elsPassed < 0) {
			self.elsPassed = 0;
		}
		self.elsOver = self.els.length - (self.elsInView + self.elsPassed);

		var maxout = 50;
		while (self.elsOver < 0) {
			self.elsPassed--;
			self.elsOver = self.els.length - (self.elsInView + self.elsPassed);
			maxout--;
			if (maxout === 0) {
				console.error('not enough Elements');
				return false;
			}
		}

		self.els.each(function(i){
			var $t = $(this);
			var e = i+1;
			if (e <= self.elsPassed) {
				$t.removeClass([c.in, c.right].join(' ')).addClass([c.out, c.left].join(' '));
			}
			if (e > self.elsPassed && e <= (self.elsInView + self.elsPassed)) {
				$t.removeClass([c.right, c.left, c.out].join(' ')).addClass([c.in].join(' '));
			}
			if (e > (self.elsInView + self.elsPassed)) {
				$t.removeClass([c.in, c.left].join(' ')).addClass([c.out, c.right].join(' '));
			}
		});

		if (self.elsPassed > 0) {
			el.addClass('overflow-left');
		}else{
			el.removeClass('overflow-left');
		}
		if (self.elsOver > 0) {
			el.addClass('overflow-right');
		}else{
			el.removeClass('overflow-right');
		}

		var negPos = self.elWidth * self.elsPassed;
		wrapper.css('transform', 'translate3D(-'+negPos+'px, 0, 0)');
		self.absPos = negPos*-1;
	};

	this.goToSlide = function(ind) {
		if (ind === '+') {
			self.elsPassed++;
			self.setupSlides();
		}else if (ind === '-') {
			self.elsPassed--;
		}else{
			self.elsPassed = ind - 1;
		}
		self.setupSlides();
	}

	this.runSetup = function(){
		self.setup();
		self.setupSlides();
	};
	this.runSetup();

	this.pan = function(pos) {
		var negPos = self.absPos + (pos);
		wrapper.css({
			transform: 'translate3D('+negPos+'px, 0, 0)'
		});
		self.panPos = pos;
	};

	wrapper.on('touchstart', function(){
		wrapper.css({
			transition: 'none',
			'-webkit-transition': 'none'
		});
	}).on('touchend', function(){
		// setTimeout(function(){
			wrapper.css({
				transition: 'transform 450ms',
				'-webkit-transition': 'transform 450ms'
			});
		// });
		var panDir = '+';
		var panAmount = (self.panPos / self.elWidth);
		var moveBy = 0;

		// if (self.panPos < -80 || self.panPos > 80) {
			if (panAmount < 0) {
				panDir = '-';
				panAmount= panAmount*-1;
			}

			moveBy = Math.floor(panAmount + 0.6);
		// }

		setTimeout(function(){
			if (moveBy) {
				// console.log(moveBy, panDir, self.elsPassed);
				if (panDir == '+') {
					self.elsPassed = self.elsPassed - moveBy;
				}else{
					self.elsPassed = self.elsPassed + moveBy;
				}

				self.setupSlides();
			}else{
				wrapper.css({
					transform: 'translate3D('+self.absPos+'px, 0, 0)'
				});
			}
		});
	});

	this.hammer = new Hammer(el[0]);
	this.hammer.on('pan', function(ev) {
		if (ev.deltaY < 100 && ev.deltaY > -100) {
			self.pan(ev.deltaX);
		}
	});

	var to;
	$(window).on('resize', function(){
		clearTimeout(to);
		to = setTimeout(function(){
			self.setup();
			self.runSetup();
		}, 200);
	});
}

$(document).on('__ready', function(){
	var menulist = new ovslider('.markthalle__menu', 210, 0);
	// $(document).off('click').on('click', '.slide-out-left', function(){
	// 	console.log('asd');
	// 	menulist.goToSlide('-');
	// });
	// $(document).off('click').on('click', '.slide-out-right', function(){
	// 	menulist.goToSlide('+');
	// });
	$('.markthalle__menu__card').on('click', function () {
		var r = $(this).hasClass('slide-out-right');
		var l = $(this).hasClass('slide-out-left');
		if(r === true) {
			menulist.goToSlide('+');
		}
		if(l === true) {
			menulist.goToSlide('-');
		}
	});
});