var searchBooks = document.getElementById('searchbooks');
var showBooks = document.getElementById('showbooks');

var getBooks = async book => {
	const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}`)
	.catch(function(err) {console.log("something wrong : "+err);
	})
	const data = await response.json();
	return data;
}

const extractThumbnail = (volumeInfo) => {
	const DEFAULT_THUMBNAIL = 'icons/logo.svg'
	if (!volumeInfo.imageLinks || !volumeInfo.imageLinks.thumbnail) { return DEFAULT_THUMBNAIL }
	return volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')
}

const debounce = (fn, time, to = 0) => {
	to ? clearTimeout(to) : (to = setTimeout(searchBook, time))
}

const searchBook = async () => {
	if (searchBooks.value.trim() != '') { 	
		showBooks.style.display = 'flex'
		showBooks.innerHTML = `<div><div class="loader"></div></div>`
		const data = await getBooks(`${searchBooks.value}&maxResults=6`)
		if (data.error) {
			showBooks.innerHTML = `<div> Limit exceeded! Try after some time </div>`
		} else if (data.totalItems == 0) {
			showBooks.innerHTML = `<div> Nothing Found, try something else </div>`
		} else if (data.totalItems == undefined) {
			showBooks.innerHTML = `<div> Opps Network Problem! </div>`
		} else {
			showBooks.innerHTML = data.items
				.map(({
					volumeInfo
				}) => `
				<div class='mdc-card mdc-card--outlined book' style='background-color:#3eddff; border: 2px solid #009cf1'>
				<a href='${volumeInfo.previewLink}' target='_blank' rel='noreferrer'>
					<img loading='lazy' style='background-color:#3eddff;border-radius:5px' src='` + extractThumbnail(volumeInfo) + `' alt='cover'>
				</a>
				<div>
				<h3>
				<a href='${volumeInfo.previewLink}' rel='noreferrer' style='color:blue' class='mdc-button mdc-button__riple' target='_blank'>${volumeInfo.title}</a></h3>
				<div class='mdc-button mdc-button--raised' style='background-color:#1067a5;color:white; border: 2px solid #007bff' onclick='updateFilter(this,"author");'> ${volumeInfo.authors}</div>
				&nbsp;
				<div class='mdc-button mdc-button--raised' style='background-color:#007bff; color:white; border: 2px solid #007bff' onclick='updateFilter(this,"subject");'  >`  + (volumeInfo.categories === undefined ? 'Others' : volumeInfo.categories) + `</div>
				</div></div><br>`)
				.join('')
		}
	} else {
		showBooks.style.display = 'none'
	}
}

searchBooks.addEventListener('input', () => debounce(searchBook, 1000));

const updateFilter = ({
	innerHTML
}, f) => {
	let m
	switch (f) {
		case 'author':
			m = 'inauthor:'
			break
		case 'subject':
			m = 'subject:'
			break
	}
	searchBooks.value = m + innerHTML;
	debounce(searchBook, 1000)
}

let startIndex = 0

const next = (subject) => {
	startIndex += 6
	if (startIndex >= 0) {
		document.getElementById(`${subject}-prev`).style.display = 'inline-flex'
		booksCategory(subject, startIndex)
	} else {
		document.getElementById(`${subject}-prev`).style.display = 'none'
	}
}


const prev = (subject) => {
	startIndex -= 6
	if (startIndex <= 0) {
		startIndex = 0
		booksCategory(subject, startIndex)
		document.getElementById(`${subject}-prev`).style.display = 'none'
	} else {
		document.getElementById(`${subject}-prev`).style.display = 'inline-flex'
		booksCategory(subject, startIndex)
	}
}


const booksCategory = async (subject, startIndex = 0) => {
	let cbookContainer = document.querySelector(`.${subject}`)
	cbookContainer.innerHTML = `<div class='prompt'><div class="loader"></div></div>`
	const cdata = await getBooks(`subject:${subject}&startIndex=${startIndex}&maxResults=6`)
	if (cdata.error) {
		cbookContainer.innerHTML = `<div class='prompt'> Limit exceeded! Try after some time </div>`
	} else if (cdata.totalItems == 0) {
		cbookContainer.innerHTML = `<div class='prompt'>  No results, try a different term! </div>`
	} else if (cdata.totalItems == undefined) {
		cbookContainer.innerHTML = `<div class='prompt'> Opps Network problem! </div>`
	} else if (!cdata.items || cdata.items.length == 0) {
		cbookContainer.innerHTML = `<div class='prompt'> Enough Results! </div>`
	} else {
		cbookContainer.innerHTML = cdata.items
		cbookContainer.innerHTML = cdata.items
			.map(({
				volumeInfo
			}) => `<div class='book mdc-card' style='background-color:#3eddff; border: 2px solid #009cf1'>
			<a href='${volumeInfo.previewLink}' target='_blank' rel='noreferrer'>
				<img loading='lazy' style='background-color:#3eddff;border-radius:5px' class='thumbnail' src='` + extractThumbnail(volumeInfo) + `' alt='cover'>
			</a>
			<div class=''>
			<h3 class=''>
			<a rel='noreferrer' style='color:blue' class='mdc-button mdc-button__riple' href='${volumeInfo.previewLink}' target='_blank'>${volumeInfo.title}</a>
			</h3>
			<div class='mdc-button mdc-button--raised' style='background-color:#1067a5;color:white; border: 2px solid #007bff' onclick='updateFilter(this,"author");'>${volumeInfo.authors}</div>
			<div class='mdc-button mdc-button--raised' style='background-color:#007bff; color:white; border: 2px solid #007bff' onclick='updateFilter(this,"subject");' style='background-color: pink;'>` + (volumeInfo.categories === undefined ? 'Others' : volumeInfo.categories) + `</div></div></div><br>`)
			.join('')
	}
}


// Init all category books after DOM loaded

document.addEventListener('DOMContentLoaded', () => {
	booksCategory('love');
	booksCategory('fiction');
	booksCategory('poetry');
	booksCategory('fantasy');
	booksCategory('romance');
})