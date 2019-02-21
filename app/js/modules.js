/*
	Mobile navigation menu
	burger-style
*/
//for open/close mobile navigation menu
let keepBodyPosition;
var classToggle = function classToggle(event) {
	let el = event.currentTarget;
	el.classList.toggle('open');
	if (!!el.classList.contains('open')) {
		showModalWindow(true);
	} else {
		showModalWindow(false);
	}
};
document.querySelector('.icon').addEventListener('click', classToggle);
document.querySelector('.icon').addEventListener('touch', classToggle);

//close mobile menu choosing necessary point

function goFromMenu(event) {
	event.preventDefault();
	var el = event.currentTarget;
	var dir = el.getAttribute('href');

	if (el.parentNode.parentNode.parentNode.classList.contains('open')) {
		showModalWindow(false);
		document.querySelector('.icon').classList.remove('open');
	}

	//different behavior for anchors and external urls
	if (dir.search('#') == 0) {
		var id = dir,
		    top = $(id).offset().top;

		// smooth scroll to the anchor id
		setTimeout(function () {
			$('html, body').animate({
				scrollTop: top
			}, 1000);
		}, 10);
	} else {
		window.location.href = dir;
	}
}

//open modal window end prevent page scroll under it
function showModalWindow(bool){
	let modalEl = document.querySelector('.nav__wrapper');
	if (!!bool) {
		modalEl.className = 'nav__wrapper open';
		keepBodyPosition = window.pageYOffset;
	} else {
		modalEl.className = 'nav__wrapper';
		window.scrollTo(0, keepBodyPosition);
	}
}