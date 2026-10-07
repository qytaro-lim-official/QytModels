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
	document.getElementById("accountButton");

const accountWrapper =
	document.getElementById("accountWrapper");

const accountMenu =
	document.getElementById("accountMenu");

const logoutButton =
	document.getElementById("logoutButton");

const logoutModal =
	document.getElementById("logoutModal");

const logoutCancelButton =
	document.getElementById("logoutCancelButton");

const logoutConfirmButton =
	document.getElementById("logoutConfirmButton");


function showLoggedOutAccount() {

	if (!accountButton) return;

	accountButton.innerHTML = "Log in";
	accountButton.href = "register.html";
	accountButton.classList.remove("logged-in");

	if (accountMenu) {
		accountMenu.classList.remove("open");
	}

	if (logoutModal) {
		logoutModal.classList.remove("open");
	}

	localStorage.removeItem("qytmodels_username");
}


function showLoggedInAccount(username) {

	if (!accountButton) return;

	accountButton.innerHTML = `

		<svg
			class="account-avatar"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10"></circle>
			<circle cx="12" cy="9" r="2.8"></circle>
			<path d="M6.5 19c0-3 2.4-5 5.5-5s5.5 2 5.5 5"></path>
		</svg>

		<span class="account-username">
			${username}
		</span>

	`;

	accountButton.href = "#";
	accountButton.classList.add("logged-in");

	localStorage.setItem(
		"qytmodels_username",
		username
	);
}


async function updateAccountButton() {

	if (!accountButton) return;

	try {

		const {
			data,
			error
		} =
		await supabaseClient.auth.getSession();

		if (error) {

			console.error("Session error:", error);
			showLoggedOutAccount();
			return;

		}

		const session = data.session;

		if (!session) {

			showLoggedOutAccount();
			return;

		}

		let username =
			session.user.user_metadata?.username;

		if (!username) {

			const {
				data: profile,
				error: profileError
			} =
			await supabaseClient
				.from("profiles")
				.select("username")
				.eq("id", session.user.id)
				.maybeSingle();

			if (profileError) {
				console.error(
					"Profile error:",
					profileError
				);
			}

			if (profile) {
				username = profile.username;
			}

		}

		if (!username) {

			username =
				localStorage.getItem(
					"qytmodels_username"
				);

		}

		showLoggedInAccount(
			username || "Account"
		);

	} catch (error) {

		console.error(
			"Account check error:",
			error
		);

		showLoggedOutAccount();

	}

}


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


function openLogoutModal() {

	if (!logoutModal) return;

	if (accountMenu) {
		accountMenu.classList.remove("open");
	}

	logoutModal.classList.add("open");
}


function closeLogoutModal() {

	if (!logoutModal) return;

	logoutModal.classList.remove("open");
}


if (logoutButton) {

	logoutButton.addEventListener(
		"click",
		function () {

			openLogoutModal();

		}
	);

}


if (logoutCancelButton) {

	logoutCancelButton.addEventListener(
		"click",
		function () {

			closeLogoutModal();

		}
	);

}


if (logoutConfirmButton) {

	logoutConfirmButton.addEventListener(
		"click",
		async function () {

			logoutConfirmButton.disabled = true;

			try {

				const { error } =
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
					accountMenu.classList.remove("open");
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

				logoutConfirmButton.disabled = false;

			}

		}
	);

}


/* ==================== */
/* MODEL DATA */
/* ==================== */

const models = {

	chair: {

		title: "Old Wooden Chair",

		image: "old_wooden_chair.jpg",

		creator: "QTeam",

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

		order: 3,

		description:
			"A simple metal trash can with a mesh design. Suitable for offices, warehouses, abandoned rooms, liminal spaces and other environments.",

		formats: {

			".blend": {

				file: "Trash_Can.blend",
				size: "232 KB",
				sizeKB: 232,
				image: "Trash_Can.jpg"

			}

		}

	},


	stopSign: {

		title: "Stop Sign",

		image: "Stop.Sign.jpg",

		creator: "QTeam",

		order: 4,

		description:
			"A simple stop sign model suitable for roads, streets, abandoned areas, liminal spaces and other environments.",

		formats: {

			".blend": {

				file: "Stop.Sign.blend",
				size: "440 KB",
				sizeKB: 440,
				image: "Stop.Sign.jpg"

			}

		}

	},


	barChair: {

		title: "Bar Chair",

		image: "Bar.Chair.jpg",

		creator: "QTeam",

		order: 5,

		description:
			"A simple bar chair with a clean design. Suitable for cafés, bars, restaurants, interiors, liminal spaces and other environments.",

		formats: {

			".blend": {

				file: "Bar.Chair.blend",
				size: "118 KB",
				sizeKB: 118,
				image: "Bar.Chair.jpg"

			}

		}

	},


	comfortChair: {

		title: "Comfort Chair",

		image: "Red.Comfort.Chair.jpg",

		creator: "QTeam",

		order: 6,

		description:
			"A comfortable chair available in multiple color variants. Suitable for interiors, gardens, cafés, liminal spaces and other environments.",

		formats: {

			".blend": {

				file: "Red.Comfort.Chair.blend",

				size: "126 KB",
				sizeKB: 126,

				image: "Red.Comfort.Chair.jpg"

			}

		},

		variants: {

			red: {

				name: "Red",

				color: "#430018",

				image: "Red.Comfort.Chair.jpg",

				file: "Red.Comfort.Chair.blend",

				size: "126 KB",
				sizeKB: 126

			},

			blue: {

				name: "Blue",

				color: "#1A0043",

				image: "Blue.Comfort.Chair.jpg",

				file: "Blue.Comfort.Chair.blend",

				size: "—",
				sizeKB: 0

			},

			green: {

				name: "Green",

				color: "#004301",

				image: "Green.Comfort.Chair.jpg",

				file: "Green.Comfort.Chair.blend",

				size: "—",
				sizeKB: 0

			}

		}

	},


	halloweenLamp: {

		title: "Creepy Lamp",
		creator: "QTeam",
		description: "A creepy lamp model from the Halloween Pack.",
		isHalloweenModel: true,
		formats: {
			".blend": {
				file: "Creepy.Lamp.blend",
				size: "120 KB",
				sizeKB: 120,
				image: "Creepy.Lamp.jpg"
			}
		}

	},


	halloweenPumpkin: {

		title: "Pumpkin",
		creator: "QTeam",
		description: "A pumpkin model from the Halloween Pack.",
		isHalloweenModel: true,
		formats: {
			".blend": {
				file: "Pumpkin.blend",
				size: "129 KB",
				sizeKB: 129,
				image: "Pumpkin.jpg"
			}
		}

	},


	halloweenBag: {

		title: "Pumpkin Bag",
		creator: "QTeam",
		description: "A pumpkin-shaped Halloween bag with a handle from the Halloween Pack.",
		isHalloweenModel: true,
		formats: {
			".blend": {
				file: "C.Bag.blend",
				size: "108 KB",
				sizeKB: 108,
				image: "C.Bag.jpg"
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


let modelCards =
	modelsSection
		? modelsSection.querySelectorAll(
			":scope > .model-card"
		)
		: [];


/* ==================== */
/* CURRENT MODEL */
/* ==================== */

let currentModelId = null;

let currentFormat = ".blend";

let currentComfortVariant = "red";


/* ==================== */
/* NO RESULTS */
/* ==================== */

let noResults =
	document.getElementById("noResults");

if (!noResults) {

	noResults =
		document.createElement("div");

	noResults.id = "noResults";

	noResults.textContent =
		"No models found.";

	noResults.style.display = "none";

	if (modelsSection) {

		modelsSection.appendChild(
			noResults
		);

	}

}


/* ==================== */
/* SITE MESSAGE */
/* ==================== */

function showSiteMessage(message) {

	const messageOverlay =
		document.createElement("div");

	messageOverlay.style.position = "fixed";
	messageOverlay.style.inset = "0";
	messageOverlay.style.display = "flex";
	messageOverlay.style.alignItems = "center";
	messageOverlay.style.justifyContent = "center";
	messageOverlay.style.background =
		"rgba(0, 0, 0, 0.35)";
	messageOverlay.style.zIndex = "30000";

	const messageBox =
		document.createElement("div");

	messageBox.style.width =
		"min(380px, calc(100% - 40px))";

	messageBox.style.padding = "24px";
	messageBox.style.background = "#ffffff";
	messageBox.style.border = "1px solid #e5e5e5";
	messageBox.style.borderRadius = "16px";
	messageBox.style.boxShadow =
		"0 20px 60px rgba(0, 0, 0, 0.18)";
	messageBox.style.textAlign = "center";

	const text =
		document.createElement("p");

	text.textContent = message;
	text.style.margin = "0";
	text.style.color = "#555555";
	text.style.fontSize = "14px";
	text.style.lineHeight = "1.5";

	const okButton =
		document.createElement("button");

	okButton.textContent = "OK";
	okButton.style.marginTop = "20px";
	okButton.style.padding = "9px 18px";
	okButton.style.border = "none";
	okButton.style.borderRadius = "9px";
	okButton.style.background = "#222222";
	okButton.style.color = "#ffffff";
	okButton.style.fontFamily = "inherit";
	okButton.style.fontSize = "14px";
	okButton.style.fontWeight = "600";
	okButton.style.cursor = "pointer";

	okButton.addEventListener(
		"click",
		function () {

			messageOverlay.remove();

		}
	);

	messageBox.appendChild(text);
	messageBox.appendChild(okButton);
	messageOverlay.appendChild(messageBox);

	document.body.appendChild(
		messageOverlay
	);

}


/* ==================== */
/* COMFORT CHAIR CARD */
/* ==================== */

function createComfortChairCard() {

	if (!modelsSection) return;

	if (
		document.querySelector(
			'.model-card[data-model="comfortChair"]'
		)
	) {
		return;
	}

	const card =
		document.createElement("div");

	card.className = "model-card";
	card.dataset.model = "comfortChair";

	card.innerHTML = `

		<div class="model-preview">
			<img
				src="Red.Comfort.Chair.jpg"
				alt="Comfort Chair"
			>
		</div>

		<div class="model-info">

			<h2>Comfort Chair</h2>

			<div class="model-type">
				.BLEND
			</div>

			<div class="model-author">
				QTeam
			</div>

			<div class="model-stats">

				<span class="model-like-count">
					♡ 0
				</span>

				<span class="model-rating">
					☆ 0.0
				</span>

				<span class="comfort-color-indicator">
					<span class="comfort-color-dot"></span>
					<span class="comfort-color-tooltip">
						Multiple Colors
					</span>
				</span>

				<span class="model-size">126 KB</span>

			</div>

		</div>

	`;

	modelsSection.appendChild(card);

}


/* ==================== */
/* REFRESH CARDS */
/* ==================== */

function refreshModelCards() {

	modelCards =
		modelsSection
			? modelsSection.querySelectorAll(
				":scope > .model-card"
			)
			: [];

}


/* ==================== */
/* MULTIPLE COLORS UI */
/* ==================== */

function setupMultipleColorIndicators() {

	const card =
		document.querySelector(
			'.model-card[data-model="comfortChair"]'
		);

	if (!card) return;

	const indicator =
		card.querySelector(
			".comfort-color-indicator"
		);

	const dot =
		card.querySelector(
			".comfort-color-dot"
		);

	if (!indicator || !dot) return;

	const colors = [
		"#430018",
		"#1A0043",
		"#004301"
	];

	let index = 0;

	function updateColor() {

		dot.style.background =
			colors[index];

		index =
			(index + 1) %
			colors.length;

	}

	updateColor();

	setInterval(
		updateColor,
		1000
	);

}


/* ==================== */
/* COMFORT PREVIEW */
/* ==================== */

function setupComfortChairPreview() {

	const card =
		document.querySelector(
			'.model-card[data-model="comfortChair"]'
		);

	if (!card) return;

	const image =
		card.querySelector(
			".model-preview img"
		);

	if (!image) return;

	const images = [
		"Red.Comfort.Chair.jpg",
		"Blue.Comfort.Chair.jpg",
		"Green.Comfort.Chair.jpg"
	];

	let index = 0;

	setInterval(
		function () {

			index =
				(index + 1) %
				images.length;

			image.src =
				images[index];

		},
		3000
	);

}


/* ==================== */
/* UPDATE MODEL CARDS */
/* ==================== */

function updateModelCards() {

	refreshModelCards();

	modelCards.forEach(
		function (card) {

			const modelId =
				card.dataset.model;

			const model =
				models[modelId];

			if (!model) return;

			const stats =
				card.querySelector(
					".model-stats"
				);

			if (!stats) return;

			const spans =
				stats.querySelectorAll(
					":scope > span"
				);

			const modelSize =
				stats.querySelector(".model-size");

			if (model.variants) {

				if (spans.length >= 2) {

					const sizeSpan =
						modelSize || spans[spans.length - 1];

					const firstVariant =
						model.variants.red;

					sizeSpan.textContent =
						firstVariant.size;

				}

				return;

			}

			const firstFormat =
				Object.keys(
					model.formats
				)[0];

			const format =
				model.formats[
					firstFormat
				];

			if (spans[0]) {

				const sizeSpan =
					modelSize || spans[spans.length - 1];

				sizeSpan.textContent =
					format.size;

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
/* COMFORT VARIANT */
/* ==================== */

function getComfortVariant(
	model
) {

	if (
		!model ||
		!model.variants
	) {
		return null;
	}

	return (
		model.variants[
			currentComfortVariant
		] ||
		model.variants.red
	);

}


/* ==================== */
/* UPDATE COMFORT PAGE */
/* ==================== */

function updateComfortChairVariant(
	variantId
) {

	const model =
		models.comfortChair;

	if (!model || !model.variants) {
		return;
	}

	const variant =
		model.variants[
			variantId
		];

	if (!variant) {
		return;
	}

	currentComfortVariant =
		variantId;

	if (modelPageImage) {

		modelPageImage.src =
			variant.image;

		modelPageImage.alt =
			`${model.title} - ${variant.name}`;

	}

	if (modelPageSize) {

		modelPageSize.textContent =
			variant.size;

	}

	if (detailSize) {

		detailSize.textContent =
			variant.size;

	}

	if (downloadButton) {

		downloadButton.href =
			variant.file;

		downloadButton.setAttribute(
			"download",
			""
		);

	}

	document
		.querySelectorAll(
			".comfort-detail-color"
		)
		.forEach(
			function (button) {

				button.classList.toggle(
					"active",
					button.dataset.color ===
						variantId
				);

			}
		);

}


/* ==================== */
/* CREATE DETAIL COLORS */
/* ==================== */

function createComfortDetailColors() {

	if (!modelPage) return;

	const imageBox =
		document.querySelector(
			".model-page-image"
		);

	if (!imageBox) return;

	let container =
		document.getElementById(
			"comfortColorVariants"
		);

	if (!container) {

		container =
			document.createElement("div");

		container.id =
			"comfortColorVariants";

		container.className =
			"comfort-color-variants";

		imageBox.appendChild(
			container
		);

	}

	container.replaceChildren();

	const variants =
		models.comfortChair.variants;

	Object.keys(variants).forEach(
		function (variantId) {

			const variant =
				variants[
					variantId
				];

			const button =
				document.createElement("button");

			button.type = "button";

			button.className =
				"comfort-detail-color";

			button.dataset.color =
				variantId;

			button.style.background =
				variant.color;

			button.setAttribute(
				"aria-label",
				variant.name
			);

			button.addEventListener(
				"click",
				function (event) {

					event.preventDefault();
					event.stopPropagation();

					updateComfortChairVariant(
						variantId
					);

				}
			);

			container.appendChild(
				button
			);

		}
	);

}


/* ==================== */
/* UPDATE MODEL FORMAT */
/* ==================== */

function updateModelFormat(format) {

	if (!currentModelId) return;

	const model =
		models[
			currentModelId
		];

	if (model.isHalloweenModel) {
		currentFormat = format;
		const formatData = model.formats[format];
		modelPageImage.src = formatData.image;
		modelPageImage.alt = model.title;
		modelPageType.textContent = format;
		modelPageSize.textContent = formatData.size;
		modelPageFormat.textContent = format;
		detailFormat.textContent = format;
		detailSize.textContent = formatData.size;
		downloadButton.href = formatData.file;
		downloadButton.setAttribute("download", formatData.file);
		if (modelFormatSelect) {
			modelFormatSelect.value = format;
		}
		return;
	}

	if (model.variants) {

		if (currentModelId === "comfortChair") {
			return;
		}

	}

	const formatData =
		getModelFormat(
			model,
			format
		);

	if (!formatData) return;

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
		models[
			modelId
		];

	if (!model) return;

	currentModelId =
		modelId;

	currentFormat =
		".blend";
	modelPage.classList.toggle(
		"halloween-model-open",
		Boolean(model.isHalloweenModel)
	);
	modelPage.classList.toggle(
		"comfort-chair-model-open",
		modelId === "comfortChair"
	);
	backButton.textContent = model.isHalloweenModel
		? "← Back to Halloween Pack"
		: "← Back";

	document.querySelectorAll(".rating-star").forEach(
		function (button) {
			button.disabled = Boolean(model.isHalloweenModel);
		}
	);

	downloadButton.removeAttribute("aria-disabled");
	downloadButton.tabIndex = 0;

	if (model.variants) {

		currentComfortVariant =
			"red";

		if (modelFormatSelect) {

			modelFormatSelect.replaceChildren();

			const option =
				document.createElement("option");

			option.value = ".blend";
			option.textContent = ".blend";

			modelFormatSelect.appendChild(
				option
			);

			modelFormatSelect.value =
				".blend";

		}

		modelPageImage.src =
			model.variants.red.image;

		modelPageImage.alt =
			"Comfort Chair - Red";

		modelPageTitle.textContent =
			model.title;

		modelPageType.textContent =
			".blend";

		modelPageCreator.textContent =
			"Creator: " +
			model.creator;

		modelPageSize.textContent =
			model.variants.red.size;

		modelPageFormat.textContent =
			".blend";

		modelPageDescription.textContent =
			model.description;

		detailFormat.textContent =
			".blend";

		detailCreator.textContent =
			model.creator;

		detailSize.textContent =
			model.variants.red.size;

		downloadButton.href =
			model.variants.red.file;
		downloadButton.setAttribute("download", "");

		createComfortDetailColors();

		updateComfortChairVariant("red");

	} else {

		const availableFormats =
			Object.keys(
				model.formats
			);

		if (modelFormatSelect) {

			modelFormatSelect.replaceChildren();

			availableFormats.forEach(
				function (format) {

					const option =
						document.createElement("option");

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

		currentFormat =
			availableFormats[0];

		const formatData =
			model.formats[
				currentFormat
			];

		modelPageImage.src = formatData.image;
		modelPageImage.alt = model.title;

		modelPageTitle.textContent =
			model.title;

		modelPageType.textContent =
			currentFormat;

		modelPageCreator.textContent =
			"Creator: " +
			model.creator;

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

		downloadButton.href = formatData.file;
		downloadButton.setAttribute(
			"download",
			model.isHalloweenModel ? formatData.file : ""
		);

		if (modelFormatSelect) {
			modelFormatSelect.value =
				currentFormat;
		}

		const colorContainer =
			document.getElementById(
				"comfortColorVariants"
			);

		if (colorContainer) {
			colorContainer.replaceChildren();
		}

	}

	modelPage.classList.add("open");

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

			updateModelFormat(
				modelFormatSelect.value
			);

		}
	);

}


/* ==================== */
/* MODEL CARDS */
/* ==================== */

function setupModelCardClicks() {

	refreshModelCards();

	modelCards.forEach(
		function (card) {

			card.addEventListener(
				"click",
				function () {

					openModel(
						card.dataset.model
					);

				}
			);

		}
	);

	[
		{ cardId: "halloweenLampCard", modelId: "halloweenLamp" },
		{ cardId: "halloweenPumpkinCard", modelId: "halloweenPumpkin" },
		{ cardId: "halloweenBagCard", modelId: "halloweenBag" }
	].forEach(function ({ cardId, modelId }) {
		const card = document.getElementById(cardId);
		if (!card) return;

		card.addEventListener("click", function () {
			openModel(modelId);
		});

		card.addEventListener("keydown", function (event) {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				openModel(modelId);
			}
		});
	});

}


/* ==================== */
/* CLOSE MODEL */
/* ==================== */

function closeModel() {
	let openedFromHalloween = false;

	if (modelPage) {
		openedFromHalloween =
			modelPage.classList.contains("halloween-model-open");

		modelPage.classList.remove(
			"open"
		);
		modelPage.classList.remove("halloween-model-open");
		backButton.textContent = "← Back";
		document.querySelectorAll(".rating-star").forEach(
			function (button) {
				button.disabled = false;
			}
		);
		document.body.style.overflow =
			openedFromHalloween ? "hidden" : "";

	}

	showPage("models");

	setActiveNav(
		modelsNavButton
	);

	document.body.style.overflow =
		openedFromHalloween ? "hidden" : "";

	currentModelId = null;

}


if (backButton) {

	backButton.addEventListener(
		"click",
		closeModel
	);

}


/* ==================== */
/* ESCAPE */
/* ==================== */

document.addEventListener(
	"keydown",
	function (event) {

		if (event.key !== "Escape") {
			return;
		}

		if (
			logoutModal &&
			logoutModal.classList.contains("open")
		) {

			closeLogoutModal();
			return;

		}

		if (
			modelPage &&
			modelPage.classList.contains("open")
		) {

			closeModel();

		}

	}
);


/* ==================== */
/* FILTER + SEARCH */
/* ==================== */

let currentSearch = "";

function applySearchFromInput() {
	currentSearch = searchInput
		? searchInput.value.trim()
		: "";

	applyAllFilters();
}


if (searchButton) {

	searchButton.addEventListener("click", applySearchFromInput);

}


if (searchInput) {

	searchInput.addEventListener(
		"keydown",
		function (event) {

			if (event.key === "Enter") {
				event.preventDefault();
				applySearchFromInput();
			}

		}
	);

}


/* ==================== */
/* SORT */
/* ==================== */

let sortMode = "newest";


function getModelCardSize(model) {

	if (model.variants) {

		return (
			model.variants.red.sizeKB || 0
		);

	}

	const primaryFormat =
		Object.values(
			model.formats
		)[0];

	return primaryFormat.sizeKB;

}


function sortModels() {

	if (!modelsSection) return;

	refreshModelCards();

	const cards =
		Array.from(modelCards);

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

			if (sortMode === "size-small") {

				return (
					getModelCardSize(modelA) -
					getModelCardSize(modelB)
				);

			}

			if (sortMode === "size-large") {

				return (
					getModelCardSize(modelB) -
					getModelCardSize(modelA)
				);

			}

			if (sortMode === "most-liked") {

				return (
					(Number(b.dataset.likeCount) || 0) -
					(Number(a.dataset.likeCount) || 0) ||
					modelB.order -
					modelA.order
				);

			}

			if (sortMode === "top-rated") {

				return (
					(Number(b.dataset.rating) || 0) -
					(Number(a.dataset.rating) || 0) ||
					(Number(b.dataset.ratingCount) || 0) -
					(Number(a.dataset.ratingCount) || 0) ||
					modelB.order -
					modelA.order
				);

			}

			if (sortMode === "oldest") {

				return (
					modelA.order -
					modelB.order
				);

			}

			return (
				modelB.order -
				modelA.order
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

document.addEventListener(
	"model-like-counts-updated",
	function () {
		if (sortMode === "most-liked") {
			sortModels();
		}
	}
);

document.addEventListener(
	"model-ratings-updated",
	function () {
		if (sortMode === "top-rated") {
			sortModels();
		}
	}
);


/* ==================== */
/* MODEL COUNT */
/* ==================== */

function updateModelCount() {

	const countElement =
		document.getElementById(
			"modelsCount"
		);

	if (!countElement) return;

	let count = 0;

	refreshModelCards();

	modelCards.forEach(
		function (card) {

			if (
				card.style.display !==
				"none"
			) {

				count++;

			}

		}
	);

	countElement.textContent =
		count +
		(count === 1 ? " Model" : " Models");

}


/* ==================== */
/* FILTERS */
/* ==================== */

const sortSelect =
	document.getElementById("sortFilter");

const formatFilter =
	document.getElementById("formatFilter");

const minSizeInput =
	document.getElementById("minSizeFilter");

const maxSizeInput =
	document.getElementById("maxSizeFilter");


if (sortSelect) {

	sortSelect.addEventListener(
		"change",
		function () {

			sortMode =
				sortSelect.value;

			sortModels();
			applyAllFilters();

		}
	);

}


if (formatFilter) {

	formatFilter.addEventListener(
		"change",
		applyAllFilters
	);

}


if (minSizeInput) {

	minSizeInput.addEventListener(
		"input",
		applyAllFilters
	);

}


if (maxSizeInput) {

	maxSizeInput.addEventListener(
		"input",
		applyAllFilters
	);

}


/* ==================== */
/* APPLY FILTERS */
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
			? Number(minSizeInput.value)
			: null;

	const maxSize =
		maxSizeInput &&
		maxSizeInput.value !== ""
			? Number(maxSizeInput.value)
			: null;

	let visibleCount = 0;

	refreshModelCards();

	modelCards.forEach(
		function (card) {

			const model =
				models[
					card.dataset.model
				];

			if (!model) return;

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
				searchableText.includes(search);

			let formatMatch = true;
			let sizeMatch = true;

			if (model.variants) {

				formatMatch =
					selectedFormat === "all" ||
					selectedFormat === ".blend";

				const sizes = [
					model.variants.red.sizeKB,
					model.variants.blue.sizeKB,
					model.variants.green.sizeKB
				];

				if (
					minSize !== null ||
					maxSize !== null
				) {

					sizeMatch =
						sizes.some(
							function (size) {

								return (
									(minSize === null || size >= minSize) &&
									(maxSize === null || size <= maxSize)
								);

							}
						);

				}

			} else {

				const formats =
					Object.keys(
						model.formats
					);

				formatMatch =
					selectedFormat === "all" ||
					formats.includes(
						selectedFormat
					);

				const matchingFormats =
					selectedFormat === "all"
						? formats
						: formats.filter(
							function (format) {

								return (
									format ===
									selectedFormat
								);

							}
						);

				sizeMatch =
					matchingFormats.some(
						function (format) {

							const size =
								model.formats[
									format
								].sizeKB;

							return (
								(minSize === null || size >= minSize) &&
								(maxSize === null || size <= maxSize)
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
				visibleCount++;
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

			currentSearch = "";

			if (searchInput) {
				searchInput.value = "";
			}

			if (sortSelect) {
				sortSelect.value = "newest";
			}

			if (formatFilter) {
				formatFilter.value = "all";
			}

			if (minSizeInput) {
				minSizeInput.value = "";
			}

			if (maxSizeInput) {
				maxSizeInput.value = "";
			}

			sortMode =
				sortSelect
					? sortSelect.value
					: "newest";

			sortModels();
			applyAllFilters();

		}
	);

}


/* ==================== */
/* NAVIGATION */
/* ==================== */

function setActiveNav(activeButton) {

	[
		modelsNavButton,
		helpNavButton,
		aboutNavButton
	].forEach(
		function (button) {

			if (!button) return;

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


function showPage(page) {

	if (modelsPage) {

		modelsPage.style.setProperty(
			"display",
			page === "models"
				? "block"
				: "none",
			"important"
		);

		modelsPage.style.setProperty(
			"opacity",
			page === "models"
				? "1"
				: "0",
			"important"
		);

		modelsPage.style.setProperty(
			"visibility",
			page === "models"
				? "visible"
				: "hidden",
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
/* NAV BUTTONS */
/* ==================== */

if (modelsNavButton) {

	modelsNavButton.addEventListener(
		"click",
		function () {

			closeModel();

		}
	);

}


if (helpNavButton) {

	helpNavButton.addEventListener(
		"click",
		function () {

			if (modelPage) {
				modelPage.classList.remove("open");
			}

			document.body.style.overflow = "";

			currentModelId = null;

			showPage("help");

			setActiveNav(helpNavButton);

		}
	);

}


if (aboutNavButton) {

	aboutNavButton.addEventListener(
		"click",
		function () {

			if (modelPage) {
				modelPage.classList.remove("open");
			}

			document.body.style.overflow = "";

			currentModelId = null;

			showPage("about");

			setActiveNav(aboutNavButton);

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
						"help-" + target
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

function initialize() {

	/*
	 * Создаём Comfort Chair только если
	 * карточки ещё нет в index.html.
	 */

	createComfortChairCard();

	refreshModelCards();

	updateModelCards();

	setupModelCardClicks();

	setupMultipleColorIndicators();

	setupComfortChairPreview();

	sortModels();

	applyAllFilters();

	updateModelCount();

	showPage("models");

	setActiveNav(
		modelsNavButton
	);

}

initialize();


/* ==================== */
/* ACCOUNT INITIALIZE */
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


/* ==================== */
/* DELETE ACCOUNT */
/* ==================== */

const deleteAccountButton =
	document.getElementById(
		"deleteAccountButton"
	);

if (deleteAccountButton) {

	deleteAccountButton.addEventListener(
		"click",
		function (event) {

			event.preventDefault();
			event.stopPropagation();

			if (
				typeof window.openDeleteAccountSystem ===
				"function"
			) {

				window.openDeleteAccountSystem();

			} else {

				console.error(
					"account-settings.js is not loaded."
				);

			}

		}
	);

}