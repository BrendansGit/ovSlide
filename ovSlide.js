var ovslider = function(el, minwidth, gutter){
	var self = this;
	
	el = $(el);
	var wrapper = el.children().first();
	this.els = wrapper.children();


	this.elsInView = this.els.length;
	this.elsPassed = 0;
	this.elsOver = 0;

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
		this.setup();
		this.setupSlides();
	};
	this.runSetup();

	this.hammer = new Hammer(el[0]);
	this.hammer.on('swipe', function(ev) {
		if (ev.deltaX < -50) {
			self.goToSlide('+');
		}
		if (ev.deltaX > 50) {
			self.goToSlide('-');
		}
	});

	var to;
	$(window).on('resize', function(){
		clearTimeout(to);
		to = setTimeout(function(){
			self.runSetup();
		}, 200);
	});
}