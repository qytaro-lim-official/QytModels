/* ==================== */
/* SUPABASE */
/* ==================== */

const SUPABASE_URL =
	"https://dyvizqfvmfzivrrmfabu.supabase.co";

const SUPABASE_KEY =
	"sb_publishable_QrWLpoT4DON8dMTgIKGKsA_O6ear-pV";


/* ==================== */
/* MODEL DATA */
/* ==================== */

const models = {

	chair: {

		title: "Old Wooden Chair",

		image: "old_wooden_chair.jpg",

		creator: "QTeam",

		downloads: "↓ 0",

		downloadsNumber: 0,

		order: 1,

		description:
			"An old wooden chair with a simple and worn design. This model is suitable for abandoned rooms, liminal spaces and other atmospheric environments.",

		formats: {

			".blend": {

				file: "old_wooden_chair.blend",

				size: "435 KB",

				sizeKB: 435,

				image: "old_wooden_chair.jpg"

			},

			".obj": {

				file: "old_wooden_chair.obj",

				size: "191 KB",

				sizeKB: 191,

				image: "old_wooden_chair.obj.jpg"

			}

		}

	},


	box: {

		title: "Cardboard Box",

		image: "box.jpg",

		creator: "QTeam",

		downloads: "↓ 0",

		downloadsNumber: 0,

		order: 2,

		description:
			"A simple open cardboard box. This model can be used in warehouses, abandoned rooms, storage areas and other environments.",

		formats: {

			".blend": {

				file: "box.blend",

				size: "109 KB",

				sizeKB: 109,

				image: "box.jpg"

			}

		}

	},


	trashCan: {

		title: "Trash Can",

		image: "Trash_Can.jpg",

		creator: "QTeam",

		downloads: "↓ 0",

		downloadsNumber: 0,

		order: 3,

		description:
			"A simple metal trash can with a mesh design. Suitable for offices, warehouses, abandoned rooms and other environments.",

		formats: {

			".blend": {

				file: "Trash_Can.blend",

				size: "232 KB",

				sizeKB: 232,

				image: "Trash_Can.jpg"

			}

		}

	}

};


/* ==================== */
/* ELEMENTS */
/* ==================== */

const searchInput =
	document.getElementById("searchInput");

const searchButton =
	document.getElementById("searchButton");

const modelsSection =
	document.querySelector(".models-section");

const sortFilter =
	document.getElementById("sortFilter");

const formatFilter =
	document.getElementById("formatFilter");

const minSizeFilter =
	document.getElementById("minSizeFilter");

const maxSizeFilter =
	document.getElementById("maxSizeFilter");

const resetFilters =
	document.getElementById("resetFilters");

const modelsCount =
	document.getElementById("modelsCount");

const modelPage =
	document.getElementById("modelPage");

const backButton =
	document.getElementById("backButton");

const modelPageImage =
	document.getElementById("modelPageImage");

const modelPageTitle =
	document.getElementById("modelPageTitle");

const modelPageType =
	document.getElementById("modelPageType");

const modelPageCreator =
	document.getElementById("modelPageCreator");

const modelPageDownloads =
	document.getElementById("modelPageDownloads");

const modelPageSize =
	document.getElementById("modelPageSize");

const modelPageFormat =
	document.getElementById("modelPageFormat");

const modelPageDescription =
	document.getElementById("modelPageDescription");

const detailFormat =
	document.getElementById("detailFormat");

const detailCreator =
	document.getElementById("detailCreator");

const detailSize =
	document.getElementById("detailSize");

const downloadButton =
	document.getElementById("downloadButton");

const modelFormatSelect =
	document.getElementById("modelFormatSelect");

const modelsPage =
	document.getElementById("modelsPage");

const helpPage =
	document.getElementById("helpPage");

const aboutPage =
	document.getElementById("aboutPage");

const modelsNavButton =
	document.getElementById("modelsNavButton");

const helpNavButton =
	document.getElementById("helpNavButton");

const aboutNavButton =
	document.getElementById("aboutNavButton");


/* ==================== */
/* CURRENT MODEL */
/* ==================== */

let currentModelId = null;

let currentFormat = null;


/* ==================== */
/* NO RESULTS */
/* ==================== */

let noResults =
	document.getElementById("noResults");


if (!noResults && modelsSection) {

	noResults =
		document.createElement("div");

	noResults.id =
		"noResults";

	noResults.textContent =
		"No models found";

	noResults.style.display =
		"none";

	modelsSection.appendChild(
		noResults
	);

}


/* ==================== */
/* SUPABASE HELPERS */
/* ==================== */

async function loadDownloadCounts() {

	try {

		const response =
			await fetch(
				SUPABASE_URL +
				"/rest/v1/models?select=model_id,downloads",
				{

					method: "GET",

					headers: {

						"apikey":
							SUPABASE_KEY

					}

				}
			);


		if (!response.ok) {

			console.error(
				"Failed to load download counts:",
				response.status,
				await response.text()
			);

			return;

		}


		const data =
			await response.json();


		data.forEach(function (item) {

			if (!models[item.model_id]) {
				return;
			}


			models[item.model_id].downloadsNumber =
				Number(item.downloads) || 0;


			models[item.model_id].downloads =
				"↓ " +
				models[item.model_id].downloadsNumber;

		});


		updateModelCards();


		if (currentModelId) {

			const model =
				models[currentModelId];


			if (
				model &&
				modelPageDownloads
			) {

				modelPageDownloads.textContent =
					model.downloads;

			}

		}


		sortModels();

	} catch (error) {

		console.error(
			"Supabase connection error:",
			error
		);

	}

}


async function incrementDownload(
	modelId
) {

	try {

		const response =
			await fetch(
				SUPABASE_URL +
				"/rest/v1/rpc/increment_download",
				{

					method: "POST",

					headers: {

						"apikey":
							SUPABASE_KEY,

						"Content-Type":
							"application/json"

					},

					body: JSON.stringify({

						model_name:
							modelId

					})

				}
			);


		if (!response.ok) {

			console.error(
				"Failed to increment download count:",
				response.status,
				await response.text()
			);

			return false;

		}


		return true;

	} catch (error) {

		console.error(
			"Supabase download error:",
			error
		);

		return false;

	}

}


/* ==================== */
/* UPDATE MODEL CARDS */
/* ==================== */

function updateModelCards() {

	const cards =
		document.querySelectorAll(
			".model-card"
		);


	cards.forEach(function (card) {

		const modelId =
			card.dataset.model;


		const model =
			models[modelId];


		if (!model) {
			return;
		}


		const stats =
			card.querySelector(
				".model-stats"
			);


		if (!stats) {
			return;
		}


		const downloadElement =
			stats.querySelector(
				"span:first-child"
			);


		if (downloadElement) {

			downloadElement.textContent =
				model.downloads;

		}

	});

}


/* ==================== */
/* DOWNLOAD HANDLER */
/* ==================== */

if (downloadButton) {

	downloadButton.addEventListener(
		"click",
		async function (event) {

			if (!currentModelId) {
				return;
			}


			const model =
				models[currentModelId];


			if (!model) {
				return;
			}


			const format =
				currentFormat;


			if (!format) {
				return;
			}


			const formatData =
				model.formats[format];


			if (!formatData) {
				return;
			}


			event.preventDefault();


			const downloadSuccessful =
				await incrementDownload(
					currentModelId
				);


			if (downloadSuccessful) {

				await loadDownloadCounts();

			}


			const link =
				document.createElement(
					"a"
				);


			link.href =
				formatData.file;


			link.download =
				formatData.file;


			document.body.appendChild(
				link
			);


			link.click();


			document.body.removeChild(
				link
			);

		}
	);

}


/* ==================== */
/* FORMAT HELPERS */
/* ==================== */

function getFormats(model) {

	if (!model || !model.formats) {
		return [];
	}

	return Object.keys(
		model.formats
	);

}


function getSmallestSize(model) {

	if (
		!model ||
		!model.formats ||
		!model.formats[".blend"]
	) {

		return 0;

	}

	return model.formats[".blend"].sizeKB;

}


function getLargestSize(model) {

	if (
		!model ||
		!model.formats ||
		!model.formats[".blend"]
	) {

		return 0;

	}

	return model.formats[".blend"].sizeKB;

}


function modelHasFormat(
	model,
	format
) {

	return getFormats(model).includes(
		format
	);

}


/* ==================== */
/* UPDATE MODEL FORMAT */
/* ==================== */

function updateModelFormat(
	modelId,
	format
) {

	const model =
		models[modelId];

	if (!model) {
		return;
	}


	const formatData =
		model.formats[format];

	if (!formatData) {
		return;
	}


	currentModelId =
		modelId;

	currentFormat =
		format;


	/* ==================== */
	/* IMAGE */
	/* ==================== */

	if (modelPageImage) {

		modelPageImage.src =
			formatData.image;

		modelPageImage.alt =
			model.title + " " + format;

	}


	/* ==================== */
	/* FORMAT */
	/* ==================== */

	if (modelPageType) {

		modelPageType.textContent =
			format;

	}


	if (modelPageFormat) {

		modelPageFormat.textContent =
			format;

	}


	if (detailFormat) {

		detailFormat.textContent =
			format;

	}


	/* ==================== */
	/* SIZE */
	/* ==================== */

	if (modelPageSize) {

		modelPageSize.textContent =
			formatData.size;

	}


	if (detailSize) {

		detailSize.textContent =
			formatData.size;

	}


	/* ==================== */
	/* DOWNLOAD */
	/* ==================== */

	if (downloadButton) {

		downloadButton.href =
			formatData.file;

		downloadButton.setAttribute(
			"download",
			formatData.file
		);

		downloadButton.textContent =
			"Download " + format;

	}


	/* ==================== */
	/* FORMAT SELECT */
	/* ==================== */

	if (modelFormatSelect) {

		modelFormatSelect.value =
			format;

	}

}


/* ==================== */
/* OPEN MODEL */
/* ==================== */

function openModel(modelId) {

	const model =
		models[modelId];

	if (!model) {
		return;
	}


	/* ==================== */
	/* BASIC INFORMATION */
/* ==================== */

	if (modelPageTitle) {

		modelPageTitle.textContent =
			model.title;

	}


	if (modelPageCreator) {

		modelPageCreator.textContent =
			"Creator: " + model.creator;

	}


	if (modelPageDownloads) {

		modelPageDownloads.textContent =
			model.downloads;

	}


	if (modelPageDescription) {

		modelPageDescription.textContent =
			model.description;

	}


	if (detailCreator) {

		detailCreator.textContent =
			model.creator;

	}


	/* ==================== */
	/* FORMAT SELECTOR */
/* ==================== */

	if (modelFormatSelect) {

		modelFormatSelect.innerHTML =
			"";


		const formats =
			getFormats(model);


		formats.forEach(
			function (format) {

				const option =
					document.createElement(
						"option"
					);


				option.value =
					format;


				option.textContent =
					format;


				modelFormatSelect.appendChild(
					option
				);

			}
		);

	}


	/* ==================== */
	/* FIRST FORMAT */
/* ==================== */

	const formats =
		getFormats(model);


	if (formats.length > 0) {

		updateModelFormat(
			modelId,
			formats[0]
		);

	}


	/* ==================== */
	/* OPEN PAGE */
/* ==================== */

	if (modelPage) {

		modelPage.classList.add(
			"open"
		);

	}


	document.body.style.overflow =
		"hidden";

}


/* ==================== */
/* FORMAT SWITCHER */
/* ==================== */

if (modelFormatSelect) {

	modelFormatSelect.addEventListener(
		"change",
		function () {

			if (!currentModelId) {
				return;
			}


			updateModelFormat(
				currentModelId,
				this.value
			);

		}
	);

}


/* ==================== */
/* MODEL CARDS */
/* ==================== */

const modelCards =
	document.querySelectorAll(
		".model-card"
	);


modelCards.forEach(function (card) {

	card.addEventListener(
		"click",
		function () {

			const modelId =
				card.dataset.model;


			openModel(
				modelId
			);

		}
	);

});


/* ==================== */
/* CLOSE MODEL */
/* ==================== */

function closeModel() {

	if (modelPage) {

		modelPage.classList.remove(
			"open"
		);

	}


	document.body.style.overflow =
		"";


	currentModelId =
		null;


	currentFormat =
		null;

}


if (backButton) {

	backButton.addEventListener(
		"click",
		closeModel
	);

}


document.addEventListener(
	"keydown",
	function (event) {

		if (
			event.key === "Escape" &&
			modelPage &&
			modelPage.classList.contains(
				"open"
			)
		) {

			closeModel();

		}

	}
);


/* ==================== */
/* FILTER + SEARCH */
/* ==================== */

function applyFilters() {

	if (!modelsSection) {
		return;
	}


	const searchText =
		searchInput
			? searchInput.value
				.trim()
				.toLowerCase()
			: "";


	const selectedFormat =
		formatFilter
			? formatFilter.value
			: "all";


	const minSize =
		minSizeFilter &&
		minSizeFilter.value !== ""
			? Number(
				minSizeFilter.value
			)
			: null;


	const maxSize =
		maxSizeFilter &&
		maxSizeFilter.value !== ""
			? Number(
				maxSizeFilter.value
			)
			: null;


	const cards =
		Array.from(
			modelsSection.querySelectorAll(
				".model-card"
			)
		);


	let visibleModels = 0;


	cards.forEach(function (card) {

		const modelId =
			card.dataset.model;


		const model =
			models[modelId];


		if (!model) {
			return;
		}


		const formats =
			getFormats(model);


		/* ==================== */
		/* SEARCH */
		/* ==================== */

		const searchMatches =
			searchText === "" ||
			model.title
				.toLowerCase()
				.includes(searchText) ||
			formats.some(
				function (format) {

					return format
						.toLowerCase()
						.includes(searchText);

				}
			);


		/* ==================== */
		/* FORMAT */
		/* ==================== */

		const formatMatches =
			selectedFormat === "all" ||
			modelHasFormat(
				model,
				selectedFormat
			);


		/* ==================== */
		/* SIZE */
		/* ==================== */

		let sizeMatches =
			true;


		const formatsToCheck =
			selectedFormat === "all"
				? formats
				: [selectedFormat];


		if (
			minSize !== null ||
			maxSize !== null
		) {

			sizeMatches =
				formatsToCheck.some(
					function (format) {

						if (
							!model.formats[
								format
							]
						) {

							return false;

						}


						const size =
							model.formats[
								format
							].sizeKB;


						const minMatches =
							minSize === null ||
							size >= minSize;


						const maxMatches =
							maxSize === null ||
							size <= maxSize;


						return (
							minMatches &&
							maxMatches
						);

					}
				);

		}


		/* ==================== */
		/* FINAL RESULT */
		/* ==================== */

		const matches =
			searchMatches &&
			formatMatches &&
			sizeMatches;


		if (matches) {

			card.style.display =
				"";


			card.classList.remove(
				"search-hidden"
			);


			visibleModels++;

		} else {

			card.style.display =
				"none";


			card.classList.add(
				"search-hidden"
			);

		}

	});


	updateModelsCount(
		visibleModels
	);


	if (noResults) {

		noResults.style.display =
			visibleModels === 0
				? ""
				: "none";

	}

}


/* ==================== */
/* SORT MODELS */
/* ==================== */

function sortModels() {

	if (!modelsSection) {
		return;
	}


	const cards =
		Array.from(
			modelsSection.querySelectorAll(
				".model-card"
			)
		);


	const sortType =
		sortFilter
			? sortFilter.value
			: "newest";


	cards.sort(function (
		cardA,
		cardB
	) {

		const modelA =
			models[
				cardA.dataset.model
			];


		const modelB =
			models[
				cardB.dataset.model
			];


		if (!modelA || !modelB) {
			return 0;
		}


		if (sortType === "newest") {

			return modelB.order -
				modelA.order;

		}


		if (sortType === "oldest") {

			return modelA.order -
				modelB.order;

		}


		if (sortType === "downloads") {

			return modelB.downloadsNumber -
				modelA.downloadsNumber;

		}


		if (sortType === "size-small") {

			return getSmallestSize(
				modelA
			) -
				getSmallestSize(
					modelB
				);

		}


		if (sortType === "size-large") {

			return getLargestSize(
				modelB
			) -
				getLargestSize(
					modelA
				);

		}


		return 0;

	});


	cards.forEach(function (card) {

		modelsSection.appendChild(
			card
		);

	});


	applyFilters();

}


/* ==================== */
/* MODEL COUNT */
/* ==================== */

function updateModelsCount(
	count
) {

	if (!modelsCount) {
		return;
	}


	if (count === 1) {

		modelsCount.textContent =
			"1 Model";

		return;

	}


	modelsCount.textContent =
		count + " Models";

}


/* ==================== */
/* SEARCH BUTTON */
/* ==================== */

if (searchButton) {

	searchButton.addEventListener(
		"click",
		function () {

			applyFilters();

		}
	);

}


/* ==================== */
/* SEARCH INPUT */
/* ==================== */

if (searchInput) {

	searchInput.addEventListener(
		"input",
		function () {

			applyFilters();

		}
	);


	searchInput.addEventListener(
		"keydown",
		function (event) {

			if (event.key === "Enter") {

				applyFilters();

			}

		}
	);

}


/* ==================== */
/* SORT FILTER */
/* ==================== */

if (sortFilter) {

	sortFilter.addEventListener(
		"change",
		function () {

			sortModels();

		}
	);

}


/* ==================== */
/* FORMAT FILTER */
/* ==================== */

if (formatFilter) {

	formatFilter.addEventListener(
		"change",
		function () {

			applyFilters();

		}
	);

}


/* ==================== */
/* MIN SIZE */
/* ==================== */

if (minSizeFilter) {

	minSizeFilter.addEventListener(
		"input",
		function () {

			applyFilters();

		}
	);

}


/* ==================== */
/* MAX SIZE */
/* ==================== */

if (maxSizeFilter) {

	maxSizeFilter.addEventListener(
		"input",
		function () {

			applyFilters();

		}
	);

}


/* ==================== */
/* RESET FILTERS */
/* ==================== */

if (resetFilters) {

	resetFilters.addEventListener(
		"click",
		function () {

			if (searchInput) {

				searchInput.value =
					"";

			}


			if (sortFilter) {

				sortFilter.value =
					"newest";

			}


			if (formatFilter) {

				formatFilter.value =
					"all";

			}


			if (minSizeFilter) {

				minSizeFilter.value =
					"";

			}


			if (maxSizeFilter) {

				maxSizeFilter.value =
					"";

			}


			sortModels();

		}
	);

}


/* ==================== */
/* MODELS NAVIGATION */
/* ==================== */

if (modelsNavButton) {

	modelsNavButton.addEventListener(
		"click",
		function () {

			modelsPage.classList.remove(
				"page-hidden"
			);


			helpPage.classList.remove(
				"page-visible"
			);


			aboutPage.classList.remove(
				"page-visible"
			);


			helpPage.style.display =
				"";


			aboutPage.style.display =
				"";


			modelsNavButton.classList.add(
				"active"
			);


			helpNavButton.classList.remove(
				"active"
			);


			aboutNavButton.classList.remove(
				"active"
			);

		}
	);

}


/* ==================== */
/* HELP NAVIGATION */
/* ==================== */

if (helpNavButton) {

	helpNavButton.addEventListener(
		"click",
		function () {

			helpPage.classList.add(
				"page-visible"
			);


			helpPage.style.display =
				"block";


			aboutPage.classList.remove(
				"page-visible"
			);


			aboutPage.style.display =
				"none";


			modelsPage.classList.add(
				"page-hidden"
			);


			helpNavButton.classList.add(
				"active"
			);


			modelsNavButton.classList.remove(
				"active"
			);


			aboutNavButton.classList.remove(
				"active"
			);


			window.scrollTo({

				top: 0,

				behavior: "smooth"

			});

		}
	);

}


/* ==================== */
/* ABOUT NAVIGATION */
/* ==================== */

if (aboutNavButton) {

	aboutNavButton.addEventListener(
		"click",
		function () {

			aboutPage.style.display =
				"block";


			aboutPage.classList.add(
				"page-visible"
			);


			helpPage.classList.remove(
				"page-visible"
			);


			helpPage.style.display =
				"none";


			modelsPage.classList.add(
				"page-hidden"
			);


			aboutNavButton.classList.add(
				"active"
			);


			modelsNavButton.classList.remove(
				"active"
			);


			helpNavButton.classList.remove(
				"active"
			);


			window.scrollTo({

				top: 0,

				behavior: "smooth"

			});

		}
	);

}


/* ==================== */
/* HELP SECTIONS */
/* ==================== */

const helpButtons =
	document.querySelectorAll(
		".help-menu-item"
	);


const helpTutorials =
	document.querySelectorAll(
		".help-tutorial"
	);


helpButtons.forEach(
	function (button) {

		button.addEventListener(
			"click",
			function () {

				const target =
					button.dataset.help;


				helpButtons.forEach(
					function (item) {

						item.classList.remove(
							"active"
						);

					}
				);


				button.classList.add(
					"active"
				);


				helpTutorials.forEach(
					function (tutorial) {

						tutorial.classList.remove(
							"active"
						);

					}
				);


				const selectedTutorial =
					document.getElementById(
						"help-" + target
					);


				if (selectedTutorial) {

					selectedTutorial.classList.add(
						"active"
					);

				}

			}
		);

	}
);


/* ==================== */
/* INITIALIZE */
/* ==================== */

sortModels();

loadDownloadCounts();