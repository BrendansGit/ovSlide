# ovSlide

requires jQuery and hammer.js

basic usage examle:

```javascript
$(function(){
	var menulist = new ovslider('.selector', 240, 0);
	$(document).on('click', '.slide-out-left', function(){
		menulist.goToSlide('-');
	});
	$(document).on('click', '.slide-out-right', function(){
		menulist.goToSlide('+');
	});
});
```