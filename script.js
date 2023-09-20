import Zoomy from './Zoomy.js';
class NewsApp {
	/**
	 * The container that holds all articles
	 * @type {HTMLDivElement}
	 */
	articlesContainer;

	/**
	 * Button that submits country name value
	 * @type {HTMLButtonElement}
	 */
	btn1;

	/**
	 * Button that submits topic information
	 * @type {HTMLButtonElement}
	 */
	btn2;

	/**
	 * The container that holds input fields and buttons to search
	 * @type {HTMLDivElement}
	 */
	searchContainer;

	/**
	 * The search field for country name
	 * @type {HTMLInputElement}
	 */
	countryNameInput;

	/**
	 * The search field for topic
	 * @type {HTMLInputElement}
	 */
	topicInput;
	constructor() {
		this.articlesContainer = document.getElementById('articlesContainer');
		this.btn1 = document.getElementById('btn1');
		this.btn2 = document.getElementById('btn2');
		this.searchContainer = document.getElementById('countrySearch');
		this.countryNameInput = document.getElementById('countryName');
		this.topicInput = document.getElementById('topic');

		this.btn1.addEventListener('click', this.countryNews.bind(this));
		this.btn2.addEventListener('click', this.topicNews.bind(this));
	}

	/**
	 * Render the news on the page
	 * @param {Array} countryArticles
	 */
	renderNews(countryArticles) {
		this.articlesContainer.innerHTML = ''; // Clear existing content
		if (!countryArticles.length) {
			this.articlesContainer.insertAdjacentHTML('beforeend', 'No articles available for selected country');
		} else {
			countryArticles.forEach(article => {
				const title = article.title;
				const content = article.content ? article.content : article.description;
				const imgSrc = article.urlToImage;

				const html = `
          			<div class="container">
            			<h2>${title}</h2>
            			<div class="box" style="float: left;">
              				<img class="zoomable" width="340" src="${imgSrc}" alt=""/>
            			</div>
                        <p class="text">${content}</p>
          			</div>
        		`;
				this.articlesContainer.insertAdjacentHTML('beforeend', html);
			});
			const zoomableImages = document.querySelectorAll('.zoomable');
			let i = 0;
			zoomableImages.forEach(image => {
				i++;
				image.setAttribute('id', 'zoomable' + i);
				new Zoomy(image.id, {
					zoomUpperConstraint: 4 // You can adjust this constraint as needed
				});
			});
		}
	}

	/**
	 * Render the error on the page
	 * @param {String} errorMsg
	 */
	renderError(errorMsg) {
		this.articlesContainer.innerHTML = errorMsg;
	}

	/**
	 * Fetch country information
	 * @param {String} countryName
	 * @return {Promise<*>}
	 */
	async fetchCountry(countryName) {
		try {
			const res = await fetch('https://restcountries.com/v3.1/name/' + countryName);
			if (!res.ok) {
				throw new Error('Problem getting country data, check country name.');
			}
			const data = await res.json();
			return data[0];
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Transform the country name from a string to ISO 3166-1 alpha 2 format(two letter)
	 * @return {Promise<string>}
	 */
	async getTwoLetterCountry() {
		const countryName = this.countryNameInput.value;
		const country = await this.fetchCountry(countryName);
		const twoLetterCountry = country.cca2.toLowerCase();
		return twoLetterCountry;
	}

	/**
	 * Fetch the news of the country given on the country input field
	 * @return {Promise<*>}
	 */
	async fetchCountryNews() {
		try {
			const countryCode = await this.getTwoLetterCountry();
			const apiKey = config.API_KEY; // Make sure you have the API_KEY defined somewhere
			const res = await fetch(`https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${apiKey}`);
			if (!res.ok) {
				throw new Error('Problem getting country news, check country code');
			}
			const data = await res.json();
			return data.articles;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Render the news of a country in the page and check/handle errors
	 * @return {Promise<void>}
	 */
	async countryNews() {
		try {
			const countryNews = await this.fetchCountryNews();
			this.renderNews(countryNews);
		} catch (err) {
			console.error(err.message);
			this.renderError(err.message);
		} finally {
			this.searchContainer.style.visibility = 'hidden';
		}
	}

	/**
	 * Fetch the news of the topic given on the topic input field
	 * @return {Promise<*>}
	 */
	async fetchTopicNews() {
		try {
			const topic = this.topicInput.value;
			const apiKey = config.API_KEY; // Make sure you have the API_KEY defined somewhere
			const res = await fetch(`https://newsapi.org/v2/everything?q=${topic}&from=2023-09-17&sortBy=publishedAt&language=en&apiKey=${apiKey}`);
			if (!res.ok) {
				throw new Error('Problem getting topic news, check topic');
			}
			const data = await res.json();
			return data.articles;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Render the news of a topic in the page and check/handle errors
	 * @return {Promise<void>}
	 */
	async topicNews() {
		try {
			const topicNews = await this.fetchTopicNews();
			this.renderNews(topicNews);
		} catch (err) {
			console.error(err.message);
			this.renderError(err.message);
		} finally {
			this.searchContainer.style.visibility = 'hidden';
		}
	}
}

const newsApp = new NewsApp();
