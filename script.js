/* ==================== */
/* SUPABASE */
/* ==================== */

const SUPABASE_URL =
	"https://dyvizqfvmfzivrrmfabu.supabase.co";


const SUPABASE_KEY =
	"sb_publishable_QrWLpoT4DON8dMTgIKGKsA_O6ear-pV";


const supabaseClient =
	window.supabase.createClient(
		SUPABASE_URL,
		SUPABASE_KEY
	);


/* ==================== */
/* ACCOUNT */
/* ==================== */

const accountButton =
	document.getElementById(
		"accountButton"
	);


const accountWrapper =
	document.getElementById(
		"accountWrapper"
	);


const accountMenu =
	document.getElementById(
		"accountMenu"
	);


const logoutButton =
	document.getElementById(
		"logoutButton"
	);


const logoutModal =
	document.getElementById(
		"logoutModal"
	);


const logoutCancelButton =
	document.getElementById(
		"logoutCancelButton"
	);


const logoutConfirmButton =
	document.getElementById(
		"logoutConfirmButton"
	);


/* ==================== */
/* SHOW LOGGED OUT */
/* ==================== */

function showLoggedOutAccount() {

	if (!accountButton) {
		return;
	}


	accountButton.innerHTML =
		"Log in";


	accountButton.href =
		"register.html";


	accountButton.classList.remove(
		"logged-in"
	);


	if (accountMenu) {

		accountMenu.classList.remove(
			"open"
		);

	}


	if (logoutModal) {

		logoutModal.classList.remove(
			"open"
		);

	}


	localStorage.removeItem(
		"qytmodels_username"
	);

}


/* ==================== */
/* SHOW LOGGED IN */
/* ==================== */

function showLoggedInAccount(
	username
) {

	if (!accountButton) {
		return;
	}


	accountButton.innerHTML = `

		<svg
			class="account-avatar"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>

			<circle
				cx="12"
				cy="12"
				r="10"
			></circle>


			<circle
				cx="12"
				cy="9"
				r="2.8"
			></circle>


			<path
				d="M6.5 19c0-3 2.4-5 5.5-5s5.5 2 5.5 5"
			></path>

		</svg>


		<span class="account-username">
			${username}
		</span>

	`;


	accountButton.href =
		"#";


	accountButton.classList.add(
		"logged-in"
	);


	localStorage.setItem(
		"qytmodels_username",
		username
	);

}


/* ==================== */
/* UPDATE ACCOUNT */
/* ==================== */

async function updateAccountButton() {

	if (!accountButton) {
		return;
	}


	try {

		const {
			data,
			error
		} =
		await supabaseClient.auth.getSession();


		if (error) {

			console.error(
				"Session error:",
				error
			);


			showLoggedOutAccount();

			return;

		}


		const session =
			data.session;


		/* ==================== */
		/* NOT LOGGED IN */
		/* ==================== */

		if (!session) {

			showLoggedOutAccount();

			return;

		}


		/* ==================== */
		/* GET USERNAME */
		/* ==================== */

		let username =
			session.user.user_metadata
				?.username;


		/* ==================== */
		/* FALLBACK TO PROFILE */
		/* ==================== */

		if (!username) {

			const {
				data: profile,
				error: profileError
			} =
			await supabaseClient
				.from("profiles")
				.select("username")
				.eq(
					"id",
					session.user.id
				)
				.maybeSingle();


			if (profileError) {

				console.error(
					"Profile error:",
					profileError
				);

			}


			if (profile) {

				username =
					profile.username;

			}

		}


		/* ==================== */
		/* USERNAME FOUND */
		/* ==================== */

		if (username) {

			showLoggedInAccount(
				username
			);

			return;

		}


		/* ==================== */
		/* SESSION WITHOUT NAME */
		/* ==================== */

		showLoggedOutAccount();

	} catch (error) {

		console.error(
			"Account check error:",
			error
		);


		showLoggedOutAccount();

	}

}


/* ==================== */
/* ACCOUNT MENU */
/* ==================== */

if (
	accountButton &&
	accountMenu
) {

	accountButton.addEventListener(
		"click",
		function (event) {

			if (
				accountButton.classList.contains(
					"logged-in"
				)
			) {

				event.preventDefault();


				accountMenu.classList.toggle(
					"open"
				);

			}

		}
	);


	document.addEventListener(
		"click",
		function (event) {

			if (
				accountWrapper &&
				!accountWrapper.contains(
					event.target
				)
			) {

				accountMenu.classList.remove(
					"open"
				);

			}

		}
	);

}


/* ==================== */
/* LOG OUT MODAL */
/* ==================== */

function openLogoutModal() {

	if (!logoutModal) {
		return;
	}


	if (accountMenu) {

		accountMenu.classList.remove(
			"open"
		);

	}


	logoutModal.classList.add(
		"open"
	);

}


function closeLogoutModal() {

	if (!logoutModal) {
		return;
	}


	logoutModal.classList.remove(
		"open"
	);

}


/* ==================== */
/* OPEN LOG OUT MODAL */
/* ==================== */

if (logoutButton) {

	logoutButton.addEventListener(
		"click",
		function () {

			openLogoutModal();

		}
	);

}


/* ==================== */
/* CANCEL LOG OUT */
/* ==================== */

if (logoutCancelButton) {

	logoutCancelButton.addEventListener(
		"click",
		function () {

			closeLogoutModal();

		}
	);

}


/* ==================== */
/* CONFIRM LOG OUT */
/* ==================== */

if (logoutConfirmButton) {

	logoutConfirmButton.addEventListener(
		"click",
		async function () {

			logoutConfirmButton.disabled =
				true;


			try {

				const {
					error
				} =
				await supabaseClient.auth.signOut();


				if (error) {

					console.error(
						"Logout error:",
						error
					);


					showSiteMessage(
						"Failed to log out. Please try again."
					);

					return;

				}


				closeLogoutModal();


				if (accountMenu) {

					accountMenu.classList.remove(
						"open"
					);

				}


				localStorage.removeItem(
					"qytmodels_username"
				);


				showLoggedOutAccount();

			} catch (error) {

				console.error(
					"Logout error:",
					error
				);


				showSiteMessage(
					"Failed to log out. Please try again."
				);

			} finally {

				logoutConfirmButton.disabled =
					false;

			}

		}
	);

}


/* ==================== */
/* MODEL DATA */
/* ==================== */

const models = {

	chair: {

		title:
			"Old Wooden Chair",

		image:
			"old_wooden_chair.jpg",

		creator:
			"QTeam",

		downloads:
			"↓ 0",

		downloadsNumber:
			0,

		order:
			1,

		description:
			"An old wooden chair with a simple and worn design. This model is suitable for abandoned rooms, liminal spaces and other atmospheric environments.",

		formats: {

			".blend": {

				file:
					"old_wooden_chair.blend",

				size:
					"435 KB",

				sizeKB:
					435,

				image:
					"old_wooden_chair.jpg"

			},

			".obj": {

				file:
					"old_wooden_chair.obj",

				size:
					"191 KB",

				sizeKB:
					191,

				image:
					"old_wooden_chair.obj.jpg"

			}

		}

	},


	box: {

		title:
			"Cardboard Box",

		image:
			"box.jpg",

		creator:
			"QTeam",

		downloads:
			"↓ 0",

		downloadsNumber:
			0,

		order:
			2,

		description:
			"A simple open cardboard box. This model can be used in warehouses, abandoned rooms, storage areas and other environments.",

		formats: {

			".blend": {

				file:
					"box.blend",

				size:
					"109 KB",

				sizeKB:
					109,

				image:
					"box.jpg"

			}

		}

	},


	trashCan: {

		title:
			"Trash Can",

		image:
			"Trash_Can.jpg",

		creator:
			"QTeam",

		downloads:
			"↓ 0",

		downloadsNumber:
			0,

		order:
			3,

		description:
			"A simple metal trash can with a mesh design. Suitable for offices, warehouses, abandoned rooms, liminal spaces and other environments.",

		formats: {

			".blend": {

				file:
					"Trash_Can.blend",

				size:
					"232 KB",

				sizeKB:
					232,

				image:
					"Trash_Can.jpg"

			}

		}

	}

};


/* ==================== */
/* ELEMENTS */
/* ==================== */

const searchInput =
	document.getElementById(
		"searchInput"
	);


const searchButton =
	document.getElementById(
		"searchButton"
	);


const modelsSection =
	document.querySelector(
		".models-section"
	);


const modelCards =
	document.querySelectorAll(
		".model-card"
	);


const modelPage =
	document.getElementById(
		"modelPage"
	);


const backButton =
	document.getElementById(
		"backButton"
	);


const modelPageImage =
	document.getElementById(
		"modelPageImage"
	);


const modelPageTitle =
	document.getElementById(
		"modelPageTitle"
	);


const modelPageType =
	document.getElementById(
		"modelPageType"
	);


const modelPageCreator =
	document.getElementById(
		"modelPageCreator"
	);


const modelPageDownloads =
	document.getElementById(
		"modelPageDownloads"
	);


const modelPageSize =
	document.getElementById(
		"modelPageSize"
	);


const modelPageFormat =
	document.getElementById(
		"modelPageFormat"
	);


const modelPageDescription =
	document.getElementById(
		"modelPageDescription"
	);


const detailFormat =
	document.getElementById(
		"detailFormat"
	);


const detailCreator =
	document.getElementById(
		"detailCreator"
	);


const detailSize =
	document.getElementById(
		"detailSize"
	);


const downloadButton =
	document.getElementById(
		"downloadButton"
	);


const modelsPage =
	document.getElementById(
		"modelsPage"
	);


const helpPage =
	document.getElementById(
		"helpPage"
	);


const aboutPage =
	document.getElementById(
		"aboutPage"
	);


const modelsNavButton =
	document.getElementById(
		"modelsNavButton"
	);


const helpNavButton =
	document.getElementById(
		"helpNavButton"
	);


const aboutNavButton =
	document.getElementById(
		"aboutNavButton"
	);


/* ==================== */
/* CURRENT MODEL */
/* ==================== */

let currentModelId =
	null;


let currentFormat =
	".blend";


/* ==================== */
/* NO RESULTS */
/* ==================== */

let noResults =
	document.getElementById(
		"noResults"
	);


if (!noResults) {

	noResults =
		document.createElement(
			"div"
		);

	noResults.id =
		"noResults";

	noResults.textContent =
		"No models found.";

	noResults.style.display =
		"none";

	if (modelsSection) {

		modelsSection.appendChild(
			noResults
		);

	}

}


/* ==================== */
/* SITE MESSAGE */
/* ==================== */

function showSiteMessage(
	message
) {

	const messageOverlay =
		document.createElement(
			"div"
		);


	messageOverlay.style.position =
		"fixed";

	messageOverlay.style.inset =
		"0";

	messageOverlay.style.display =
		"flex";

	messageOverlay.style.alignItems =
		"center";

	messageOverlay.style.justifyContent =
		"center";

	messageOverlay.style.background =
		"rgba(0, 0, 0, 0.35)";

	messageOverlay.style.zIndex =
		"30000";


	const messageBox =
		document.createElement(
			"div"
		);


	messageBox.style.width =
		"min(380px, calc(100% - 40px))";

	messageBox.style.padding =
		"24px";

	messageBox.style.background =
		"#ffffff";

	messageBox.style.border =
		"1px solid #e5e5e5";

	messageBox.style.borderRadius =
		"16px";

	messageBox.style.boxShadow =
		"0 20px 60px rgba(0, 0, 0, 0.18)";

	messageBox.style.textAlign =
		"center";


	const text =
		document.createElement(
			"p"
		);


	text.textContent =
		message;

	text.style.margin =
		"0";

	text.style.color =
		"#555555";

	text.style.fontSize =
		"14px";

	text.style.lineHeight =
		"1.5";


	const okButton =
		document.createElement(
			"button"
		);


	okButton.textContent =
		"OK";

	okButton.style.marginTop =
		"20px";

	okButton.style.padding =
		"9px 18px";

	okButton.style.border =
		"none";

	okButton.style.borderRadius =
		"9px";

	okButton.style.background =
		"#222222";

	okButton.style.color =
		"#ffffff";

	okButton.style.fontFamily =
		"inherit";

	okButton.style.fontSize =
		"14px";

	okButton.style.fontWeight =
		"600";

	okButton.style.cursor =
		"pointer";


	okButton.addEventListener(
		"click",
		function () {

			messageOverlay.remove();

		}
	);


	messageBox.appendChild(
		text
	);


	messageBox.appendChild(
		okButton
	);


	messageOverlay.appendChild(
		messageBox
	);


	document.body.appendChild(
		messageOverlay
	);

}


/* ==================== */
/* SUPABASE HELPERS */
/* ==================== */

async function loadDownloadCounts() {

	try {

		const {
			data,
			error
		} =
		await supabaseClient
			.from("model_downloads")
			.select(
				"model_id, downloads"
			);


		if (error) {

			console.error(
				"Download count error:",
				error
			);

			return;

		}


		if (!data) {
			return;
		}


		data.forEach(
			function (row) {

				if (
					models[row.model_id]
				) {

					models[
						row.model_id
					].downloadsNumber =
						Number(
							row.downloads
						) || 0;

					models[
						row.model_id
					].downloads =
						"↓ " +
						models[
							row.model_id
						].downloadsNumber;

				}

			}
		);

	} catch (error) {

		console.error(
			"Download count error:",
			error
		);

	}

}


/* ==================== */
/* INCREMENT DOWNLOAD */
/* ==================== */

async function incrementDownload(
	modelId
) {

	if (
		!models[modelId]
	) {

		return;

	}


	try {

		const {
			data,
			error
		} =
		await supabaseClient
			.rpc(
				"increment_model_download",
				{
					model_key:
						modelId
				}
			);


		if (error) {

			console.error(
				"Download increment error:",
				error
			);

			return;

		}


		if (
			typeof data ===
			"number"
		) {

			models[
				modelId
			].downloadsNumber =
				data;

		} else {

			models[
				modelId
			].downloadsNumber +=
				1;

		}


		models[
			modelId
		].downloads =
			"↓ " +
			models[
				modelId
			].downloadsNumber;


		updateModelCards();


		if (
			currentModelId ===
			modelId
		) {

			modelPageDownloads.textContent =
				models[
					modelId
				].downloads;

		}

	} catch (error) {

		console.error(
			"Download increment error:",
			error
		);

	}

}


/* ==================== */
/* DOWNLOAD COOLDOWN */
/* ==================== */

const DOWNLOAD_COOLDOWN =
	1500;


let lastDownloadTime =
	0;


/* ==================== */
/* UPDATE MODEL CARDS */
/* ==================== */

function updateModelCards() {

	modelCards.forEach(
		function (card) {

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


			const spans =
				stats.querySelectorAll(
					"span"
				);


			if (spans[0]) {

				spans[0].textContent =
					model.downloads;

			}


			if (spans[1]) {

				const firstFormat =
					Object.keys(
						model.formats
					)[0];


				const format =
					model.formats[
						firstFormat
					];


				spans[1].textContent =
					format.size;

			}

		}
	);

}


/* ==================== */
/* DOWNLOAD HANDLER */
/* ==================== */

if (downloadButton) {

	downloadButton.addEventListener(
		"click",
		function () {

			const now =
				Date.now();


			if (
				now -
				lastDownloadTime <
				DOWNLOAD_COOLDOWN
			) {

				return;

			}


			lastDownloadTime =
				now;


			if (
				currentModelId
			) {

				incrementDownload(
					currentModelId
				);

			}

		}
	);

}


/* ==================== */
/* FORMAT HELPERS */
/* ==================== */

function getModelFormat(
	model,
	format
) {

	if (
		!model ||
		!model.formats
	) {

		return null;

	}


	return (
		model.formats[
			format
		] || null
	);

}


/* ==================== */
/* UPDATE MODEL FORMAT */
/* ==================== */

function updateModelFormat(
	format
) {

	if (
		!currentModelId
	) {

		return;

	}


	const model =
		models[
			currentModelId
		];


	const formatData =
		getModelFormat(
			model,
			format
		);


	if (!formatData) {

		return;

	}


	currentFormat =
		format;


	modelPageImage.src =
		formatData.image;


	modelPageImage.alt =
		model.title;


	modelPageType.textContent =
		format;


	modelPageSize.textContent =
		formatData.size;


	modelPageFormat.textContent =
		format;


	detailFormat.textContent =
		format;


	detailSize.textContent =
		formatData.size;


	downloadButton.href =
		formatData.file;


	const formatButtons =
		document.querySelectorAll(
			".format-button"
		);


	formatButtons.forEach(
		function (button) {

			if (
				button.dataset.format ===
				format
			) {

				button.classList.add(
					"active"
				);

			} else {

				button.classList.remove(
					"active"
				);

			}

		}
	);

}


/* ==================== */
/* OPEN MODEL */
/* ==================== */

function openModel(
	modelId
) {

	const model =
		models[
			modelId
		];


	if (!model) {
		return;
	}


	currentModelId =
		modelId;


	const availableFormats =
		Object.keys(
			model.formats
		);


	currentFormat =
		availableFormats[0];


	const formatData =
		model.formats[
			currentFormat
		];


	modelPageImage.src =
		formatData.image;


	modelPageImage.alt =
		model.title;


	modelPageTitle.textContent =
		model.title;


	modelPageType.textContent =
		currentFormat;


	modelPageCreator.textContent =
		"Creator: " +
		model.creator;


	modelPageDownloads.textContent =
		model.downloads;


	modelPageSize.textContent =
		formatData.size;


	modelPageFormat.textContent =
		currentFormat;


	modelPageDescription.textContent =
		model.description;


	detailFormat.textContent =
		currentFormat;


	detailCreator.textContent =
		model.creator;


	detailSize.textContent =
		formatData.size;


	downloadButton.href =
		formatData.file;


	const formatButtons =
		document.querySelectorAll(
			".format-button"
		);


	formatButtons.forEach(
		function (button) {

			if (
				button.dataset.format ===
				currentFormat
			) {

				button.classList.add(
					"active"
				);

			} else {

				button.classList.remove(
					"active"
				);

			}

		}
	);


	modelPage.classList.add(
		"open"
	);


	document.body.style.overflow =
		"hidden";

}


/* ==================== */
/* FORMAT SWITCHER */
/* ==================== */

const formatButtons =
	document.querySelectorAll(
		".format-button"
	);


formatButtons.forEach(
	function (button) {

		button.addEventListener(
			"click",
			function () {

				updateModelFormat(
					button.dataset.format
				);

			}
		);

	}
);


/* ==================== */
/* MODEL CARDS */
/* ==================== */

modelCards.forEach(
	function (card) {

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

	}
);


/* ==================== */
/* CLOSE MODEL */
/* ==================== */

if (backButton) {

	backButton.addEventListener(
		"click",
		function () {

			if (modelPage) {

				modelPage.classList.remove(
					"open"
				);

			}


			document.body.style.overflow =
				"";

			currentModelId =
				null;

		}
	);

}


/* ==================== */
/* ESCAPE */
/* ==================== */

document.addEventListener(
	"keydown",
	function (event) {

		if (
			event.key ===
			"Escape"
		) {

			if (
				logoutModal &&
				logoutModal.classList.contains(
					"open"
				)
			) {

				closeLogoutModal();

				return;

			}


			if (
				modelPage &&
				modelPage.classList.contains(
					"open"
				)
			) {

				modelPage.classList.remove(
					"open"
				);


				document.body.style.overflow =
					"";


				currentModelId =
					null;

			}

		}

	}
);


/* ==================== */
/* FILTER + SEARCH */
/* ==================== */

let currentSearch =
	"";


function filterModels() {

	const search =
		currentSearch
			.trim()
			.toLowerCase();


	let visibleCount =
		0;


	modelCards.forEach(
		function (card) {

			const modelId =
				card.dataset.model;


			const model =
				models[
					modelId
				];


			if (!model) {
				return;
			}


			const searchableText =
				(
					model.title +
					" " +
					model.creator +
					" " +
					model.description
				).toLowerCase();


			const matches =
				search === "" ||
				searchableText.includes(
					search
				);


			if (matches) {

				card.style.display =
					"";


				visibleCount +=
					1;

			} else {

				card.style.display =
					"none";

			}

		}
	);


	if (noResults) {

		noResults.style.display =
			visibleCount === 0
				? "block"
				: "none";

	}

}


/* ==================== */
/* SEARCH BUTTON */
/* ==================== */

if (searchButton) {

	searchButton.addEventListener(
		"click",
		function () {

			currentSearch =
				searchInput
					? searchInput.value
					: "";


			filterModels();

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

			currentSearch =
				searchInput.value;


			filterModels();

		}
	);


	searchInput.addEventListener(
		"keydown",
		function (event) {

			if (
				event.key ===
				"Enter"
			) {

				currentSearch =
					searchInput.value;


				filterModels();

			}

		}
	);

}


/* ==================== */
/* SORT MODELS */
/* ==================== */

let sortMode =
	"default";


function sortModels() {

	if (!modelsSection) {
		return;
	}


	const cards =
		Array.from(
			modelCards
		);


	cards.sort(
		function (a, b) {

			const modelA =
				models[
					a.dataset.model
				];


			const modelB =
				models[
					b.dataset.model
				];


			if (
				sortMode ===
				"downloads"
			) {

				return (
					modelB.downloadsNumber -
					modelA.downloadsNumber
				);

			}


			if (
				sortMode ===
				"name"
			) {

				return modelA.title.localeCompare(
					modelB.title
				);

			}


			return (
				modelA.order -
				modelB.order
			);

		}
	);


	cards.forEach(
		function (card) {

			modelsSection.appendChild(
				card
			);

		}
	);

}


/* ==================== */
/* MODEL COUNT */
/* ==================== */

function updateModelCount() {

	const countElement =
		document.getElementById(
			"modelsCount"
		);


	if (!countElement) {
		return;
	}


	let count =
		0;


	modelCards.forEach(
		function (card) {

			if (
				card.style.display !==
				"none"
			) {

				count +=
					1;

			}

		}
	);


	countElement.textContent =
		count;

}


/* ==================== */
/* SORT SELECT */
/* ==================== */

const sortSelect =
	document.getElementById(
		"sortFilter"
	);


if (sortSelect) {

	sortSelect.addEventListener(
		"change",
		function () {

			sortMode =
				sortSelect.value;


			sortModels();

			filterModels();

			updateModelCount();

		}
	);

}


/* ==================== */
/* FORMAT FILTER */
/* ==================== */

const formatFilter =
	document.getElementById(
		"formatFilter"
	);


if (formatFilter) {

	formatFilter.addEventListener(
		"change",
		function () {

			const selected =
				formatFilter.value;


			modelCards.forEach(
				function (card) {

					const model =
						models[
							card.dataset.model
						];


					if (!model) {
						return;
					}


					const formats =
						Object.keys(
							model.formats
						);


					const matches =
						selected ===
						"all" ||
						formats.includes(
							selected
						);


					card.dataset.formatMatch =
						matches
							? "true"
							: "false";

				}
			);


			applyAllFilters();

		}
	);

}


/* ==================== */
/* MIN SIZE */
/* ==================== */

const minSizeInput =
	document.getElementById(
		"minSizeFilter"
	);


/* ==================== */
/* MAX SIZE */
/* ==================== */

const maxSizeInput =
	document.getElementById(
		"maxSizeFilter"
	);


/* ==================== */
/* APPLY ALL FILTERS */
/* ==================== */

function applyAllFilters() {

	const search =
		currentSearch
			.trim()
			.toLowerCase();


	const selectedFormat =
		formatFilter
			? formatFilter.value
			: "all";


	const minSize =
		minSizeInput &&
		minSizeInput.value !== ""
			? Number(
				minSizeInput.value
			)
			: null;


	const maxSize =
		maxSizeInput &&
		maxSizeInput.value !== ""
			? Number(
				maxSizeInput.value
			)
			: null;


	let visibleCount =
		0;


	modelCards.forEach(
		function (card) {

			const model =
				models[
					card.dataset.model
				];


			if (!model) {
				return;
			}


			const searchableText =
				(
					model.title +
					" " +
					model.creator +
					" " +
					model.description
				).toLowerCase();


			const searchMatch =
				search === "" ||
				searchableText.includes(
					search
				);


			const formats =
				Object.keys(
					model.formats
				);


			const formatMatch =
				selectedFormat ===
				"all" ||
				formats.includes(
					selectedFormat
				);


			let sizeMatch =
				true;


			const sizes =
				formats.map(
					function (format) {

						return model
							.formats[
								format
							].sizeKB;

					}
				);


			if (
				minSize !== null
			) {

				sizeMatch =
					sizes.some(
						function (size) {

							return (
								size >=
								minSize
							);

						}
					);

			}


			if (
				maxSize !== null
			) {

				sizeMatch =
					sizeMatch &&
					sizes.some(
						function (size) {

							return (
								size <=
								maxSize
							);

						}
					);

			}


			const visible =
				searchMatch &&
				formatMatch &&
				sizeMatch;


			card.style.display =
				visible
					? ""
					: "none";


			if (visible) {

				visibleCount +=
					1;

			}

		}
	);


	if (noResults) {

		noResults.style.display =
			visibleCount === 0
				? "block"
				: "none";

	}


	updateModelCount();

}


/* ==================== */
/* RESET FILTERS */
/* ==================== */

const resetFilters =
	document.getElementById(
		"resetFilters"
	);


if (resetFilters) {

	resetFilters.addEventListener(
		"click",
		function () {

			currentSearch =
				"";


			if (searchInput) {

				searchInput.value =
					"";

			}


			if (sortSelect) {

				sortSelect.value =
					"default";

			}


			if (formatFilter) {

				formatFilter.value =
					"all";

			}


			if (minSizeInput) {

				minSizeInput.value =
					"";

			}


			if (maxSizeInput) {

				maxSizeInput.value =
					"";

			}


			sortMode =
				"default";


			sortModels();

			applyAllFilters();

		}
	);

}


/* ==================== */
/* NAVIGATION */
/* ==================== */

function setActiveNav(
	activeButton
) {

	[
		modelsNavButton,
		helpNavButton,
		aboutNavButton
	].forEach(
		function (button) {

			if (!button) {
				return;
			}


			button.classList.remove(
				"active"
			);

		}
	);


	if (activeButton) {

		activeButton.classList.add(
			"active"
		);

	}

}


/* ==================== */
/* SHOW PAGE */
/* ==================== */

function showPage(
	page
) {

	if (modelsPage) {

		modelsPage.style.setProperty(
			"display",
			page === "models"
				? "block"
				: "none",
			"important"
		);

	}


	if (helpPage) {

		helpPage.style.setProperty(
			"display",
			page === "help"
				? "block"
				: "none",
			"important"
		);


		helpPage.style.setProperty(
			"opacity",
			page === "help"
				? "1"
				: "0",
			"important"
		);


		helpPage.style.setProperty(
			"visibility",
			page === "help"
				? "visible"
				: "hidden",
			"important"
		);

	}


	if (aboutPage) {

		aboutPage.style.setProperty(
			"display",
			page === "about"
				? "block"
				: "none",
			"important"
		);


		aboutPage.style.setProperty(
			"opacity",
			page === "about"
				? "1"
				: "0",
			"important"
		);


		aboutPage.style.setProperty(
			"visibility",
			page === "about"
				? "visible"
				: "hidden",
			"important"
		);

	}

}


/* ==================== */
/* MODELS */
/* ==================== */

if (modelsNavButton) {

	modelsNavButton.addEventListener(
		"click",
		function () {

			showPage(
				"models"
			);


			setActiveNav(
				modelsNavButton
			);

		}
	);

}


/* ==================== */
/* HELP */
/* ==================== */

if (helpNavButton) {

	helpNavButton.addEventListener(
		"click",
		function () {

			showPage(
				"help"
			);


			setActiveNav(
				helpNavButton
			);

		}
	);

}


/* ==================== */
/* ABOUT */
/* ==================== */

if (aboutNavButton) {

	aboutNavButton.addEventListener(
		"click",
		function () {

			showPage(
				"about"
			);


			setActiveNav(
				aboutNavButton
			);

		}
	);

}


/* ==================== */
/* HELP SECTIONS */
/* ==================== */

const helpMenuItems =
	document.querySelectorAll(
		".help-menu-item"
	);


const helpTutorials =
	document.querySelectorAll(
		".help-tutorial"
	);


helpMenuItems.forEach(
	function (button) {

		button.addEventListener(
			"click",
			function () {

				const target =
					button.dataset.help;


				helpMenuItems.forEach(
					function (item) {

						item.classList.remove(
							"active"
						);

					}
				);


				helpTutorials.forEach(
					function (section) {

						section.classList.remove(
							"active"
						);

					}
				);


				button.classList.add(
					"active"
				);


				const targetSection =
					document.getElementById(
						"help-" +
						target
					);


				if (targetSection) {

					targetSection.classList.add(
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

async function initialize() {

	await loadDownloadCounts();


	updateModelCards();


	sortModels();


	applyAllFilters();


	updateModelCount();


	showPage(
		"models"
	);


	setActiveNav(
		modelsNavButton
	);

}


initialize();


/* ==================== */
/* INITIALIZE ACCOUNT */
/* ==================== */

updateAccountButton();


/* ==================== */
/* AUTH STATE CHANGES */
/* ==================== */

supabaseClient.auth.onAuthStateChange(
	function () {

		setTimeout(
			function () {

				updateAccountButton();

			},
			0
		);

	}
);