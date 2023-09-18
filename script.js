const articlesContainer = document.getElementById('articlesContainer');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const renderNews = function (countryArticles) {
	if  (!countryArticles.length) {
		articlesContainer.insertAdjacentHTML('beforeend', 'No articles available for selected country');
	} else {
		countryArticles.forEach(article => {
			const title = article.title;
			const content = article.content ? article.content : article.description;
			const imgSrc = article.urlToImage;

			const html = `
				<div class="container">
    			<h2>${title}</h2>
    			<div class="box" style="float: left; width:340px; height:340px;">
        			<img id="zoomy1" width="340" src="${imgSrc}" alt=""/>
    			</div>
    				<p class="text">${content}</p>
				</div>
		`
			articlesContainer.insertAdjacentHTML('beforeend', html);
		});
	}
}

const renderError = function (errorMsg) {
	articlesContainer.insertAdjacentHTML('beforeend', errorMsg);
}
const fetchCountry = async function(countryName)  {
	const res = await fetch('https://restcountries.com/v3.1/name/' + countryName);
	if (!res.ok) {
		throw new Error('Problem getting country data, check country name.')
	}
	return res.json();
}
const getTwoLetterCountry = async function() {
	const countryName = document.getElementById('countryName').value;
	const [country] = await fetchCountry(countryName);
	const twoLetterCountry = country.cca2;
	return twoLetterCountry;
}

const fetchCountryNews = async function() {
	let countryCode = await getTwoLetterCountry();
	countryCode = countryCode.toLowerCase();
	const apiKey = config.API_KEY;
	const res = await fetch(`https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${apiKey}`);
	if (!res.ok) {
		throw new Error('Problem getting country news, check country code');
	}
	return res.json();
}
const countryNews = async function() {
	try {
		const countryNews = await fetchCountryNews();
		const articles = countryNews.articles;
		console.log(articles)
		renderNews(articles);
	} catch (err) {
		console.error(err.message);
		renderError(err.message);
	} finally {
		const countrySearchDiv = document.getElementById('countrySearch');
		countrySearchDiv.style.visibility = 'hidden';
	}
}

const fetchTopicNews = async function() {
	const topic = document.getElementById('topic').value;
	const apiKey = config.API_KEY;
	const res = await fetch(`https://newsapi.org/v2/everything?q=${topic}&from=2023-09-17&sortBy=publishedAt&language=en&apiKey=${apiKey}`);
	if (!res.ok) {
		throw new Error('Problem getting topic news, check topic');
	}
	return res.json();
}

const topicNews = async function() {
	try {
		const topicNews = await fetchTopicNews();
		const articles = topicNews.articles;
		console.log(articles)
		renderNews(articles);
	} catch (err) {
		console.error(err.message);
		renderError(err.message);
	} finally {
		const countrySearchDiv = document.getElementById('countrySearch');
		countrySearchDiv.style.visibility = 'hidden';
	}
}

btn1.addEventListener('click', countryNews);
btn2.addEventListener('click', topicNews);