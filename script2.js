/* ==================== */
/* RATING SYSTEM */
/* ==================== */

const ratingSupabase =
	supabaseClient;


/* ==================== */
/* RATING MODEL IDS */
/* ==================== */

const ratingModelIds = [
	"chair",
	"box",
	"trashCan",
	"stopSign",
	"barChair",
	"comfortChair",
	"creepyLamp",
	"pumpkin"
];


/* ==================== */
/* COMFORT CHAIR VARIANTS */
/* ==================== */

const comfortChairVariants = {

	red: {

		image:
			"Red.Comfort.Chair.jpg",

		file:
			"Red.Comfort.Chair.blend"

	},

	blue: {

		image:
			"Blue.Comfort.Chair.jpg",

		file:
			"Blue.Comfort.Chair.blend"

	},

	green: {

		image:
			"Green.Comfort.Chair.jpg",

		file:
			"Green.Comfort.Chair.blend"

	}

};


/* ==================== */
/* CHANGE COMFORT CHAIR VARIANT */
/* ==================== */

function changeComfortChairVariant(
	color
) {

	const variant =
		comfortChairVariants[color];


	if (!variant) {

		return;

	}


	const image =
		document.getElementById(
			"modelPageImage"
		);


	const downloadButton =
		document.getElementById(
			"downloadButton"
		);


	/* ==================== */
	/* CHANGE IMAGE */
	/* ==================== */

	if (image) {

		image.src =
			variant.image;

	}


	/* ==================== */
	/* CHANGE DOWNLOAD */
	/* ==================== */

	if (downloadButton) {

		downloadButton.href =
			variant.file;

		downloadButton.setAttribute(
			"download",
			variant.file
		);

	}


	/* ==================== */
	/* UPDATE ACTIVE BUTTON */
	/* ==================== */

	const buttons =
		document.querySelectorAll(
			".model-color-button"
		);


	buttons.forEach(
		button => {

			button.classList.toggle(
				"active",
				button.dataset.color ===
					color
			);

		}
	);


	/* ==================== */
	/* UPDATE RATING */
	/* ==================== */

	setTimeout(
		() => {

			updateStarDisplay();

			updateModelRatingDisplay();

		},
		0
	);

}


/* ==================== */
/* CREATE COMFORT CHAIR BUTTONS */
/* ==================== */

function createComfortChairButtons() {

	const container =
		document.getElementById(
			"modelColorVariants"
		);


	if (!container) {

		return;

	}


	/* ==================== */
	/* CREATE ONLY ONCE */
/* ==================== */

	if (
		container.dataset.buttonsCreated ===
		"true"
	) {

		return;

	}


	container.innerHTML = `

		<button
			type="button"
			class="model-color-button red"
			data-color="red"
			aria-label="Red"
			title="Red"
		></button>

		<button
			type="button"
			class="model-color-button blue"
			data-color="blue"
			aria-label="Blue"
			title="Blue"
		></button>

		<button
			type="button"
			class="model-color-button green"
			data-color="green"
			aria-label="Green"
			title="Green"
		></button>

	`;


	/* ==================== */
	/* ADD CLICK EVENTS */
	/* ==================== */

	const buttons =
		container.querySelectorAll(
			".model-color-button"
		);


	buttons.forEach(
		button => {

			button.addEventListener(
				"click",
				function () {

					changeComfortChairVariant(
						button.dataset.color
					);

				}
			);

		}
	);


	container.dataset.buttonsCreated =
		"true";

}


/* ==================== */
/* UPDATE COMFORT CHAIR */
/* ==================== */

function updateComfortChairVariants() {

	const container =
		document.getElementById(
			"modelColorVariants"
		);


	const image =
		document.getElementById(
			"modelPageImage"
		);


	if (!container || !image) {

		return;

	}


	const src =
		image.src;


	const isComfortChair =
		src.includes(
			"Red.Comfort.Chair.jpg"
		) ||
		src.includes(
			"Blue.Comfort.Chair.jpg"
		) ||
		src.includes(
			"Green.Comfort.Chair.jpg"
		);


	/* ==================== */
	/* NOT COMFORT CHAIR */
/* ==================== */

	if (!isComfortChair) {

		container.style.display =
			"none";

		return;

	}


	/* ==================== */
	/* CREATE BUTTONS */
/* ==================== */

	createComfortChairButtons();


	container.style.display =
		"flex";


	/* ==================== */
	/* DETERMINE CURRENT COLOR */
/* ==================== */

	let currentColor =
		"red";


	if (
		src.includes(
			"Blue.Comfort.Chair.jpg"
		)
	) {

		currentColor =
			"blue";

	}


	if (
		src.includes(
			"Green.Comfort.Chair.jpg"
		)
	) {

		currentColor =
			"green";

	}


	/* ==================== */
	/* ACTIVE BUTTON */
/* ==================== */

	const buttons =
		container.querySelectorAll(
			".model-color-button"
		);


	buttons.forEach(
		button => {

			button.classList.toggle(
				"active",
				button.dataset.color ===
					currentColor
			);

		}
	);


	/* ==================== */
	/* MAKE SURE DOWNLOAD IS CORRECT */
/* ==================== */

	const variant =
		comfortChairVariants[
			currentColor
		];


	const downloadButton =
		document.getElementById(
			"downloadButton"
		);


	if (
		variant &&
		downloadButton
	) {

		downloadButton.href =
			variant.file;

		downloadButton.setAttribute(
			"download",
			variant.file
		);

	}

}


/* ==================== */
/* GET CURRENT RATING MODEL ID */
/* ==================== */

function getCurrentRatingModelId() {

	const modelId =
		document.getElementById("modelPage")?.dataset.modelId;

	return ratingModelIds.includes(modelId)
		? modelId
		: null;

}


/* ==================== */
/* SAVE RATING */
/* ==================== */

async function saveModelRating(
	modelId,
	rating
) {

	try {

		console.log(
			"Trying to save rating:",
			modelId,
			rating
		);


		const {
			data: userData,
			error: userError
		} =
		await ratingSupabase.auth.getUser();


		if (userError) {

			console.error(
				"Could not get user:",
				userError
			);

			return false;

		}


		const user =
			userData.user;


		if (!user) {

			console.error(
				"No logged-in user."
			);

			alert(
				"You must be logged in to rate models."
			);

			return false;

		}


		console.log(
			"Logged in user:",
			user.id
		);


		const {
			data,
			error
		} =
		await ratingSupabase
			.from(
				"model_ratings"
			)
			.upsert(
				{
					user_id:
						user.id,

					model_id:
						modelId,

					rating:
						rating
				},
				{
					onConflict:
						"user_id,model_id"
				}
			)
			.select();


		if (error) {

			console.error(
				"SUPABASE RATING ERROR:",
				error
			);

			alert(
				"Rating could not be saved. Check the browser console."
			);

			return false;

		}


		console.log(
			"Rating successfully saved:",
			data
		);

		return true;

	} catch (error) {

		console.error(
			"RATING SAVE EXCEPTION:",
			error
		);

		return false;

	}

}


/* ==================== */
/* GET RATING STATS */
/* ==================== */

async function getModelRatingStats() {

	try {

		const {
			data,
			error
		} =
		await ratingSupabase
			.rpc(
				"get_model_rating_stats"
			);


		if (error) {

			console.error(
				"RATING STATS ERROR:",
				error
			);

			return [];

		}


		return data || [];

	} catch (error) {

		console.error(
			"RATING STATS EXCEPTION:",
			error
		);

		return [];

	}

}


/* ==================== */
/* GET USER RATING */
/* ==================== */

async function getUserModelRating(
	modelId
) {

	try {

		const {
			data: userData,
			error: userError
		} =
		await ratingSupabase.auth.getUser();


		if (
			userError ||
			!userData.user
		) {

			return null;

		}


		const {
			data,
			error
		} =
		await ratingSupabase
			.from(
				"model_ratings"
			)
			.select(
				"rating"
			)
			.eq(
				"user_id",
				userData.user.id
			)
			.eq(
				"model_id",
				modelId
			)
			.maybeSingle();


		if (error) {

			console.error(
				"GET USER RATING ERROR:",
				error
			);

			return null;

		}


		if (!data) {

			return null;

		}


		return Number(
			data.rating
		);

	} catch (error) {

		console.error(
			"GET USER RATING EXCEPTION:",
			error
		);

		return null;

	}

}


/* ==================== */
/* HIGHLIGHT STARS */
/* ==================== */

function highlightStars(
	rating
) {

	const stars =
		document.querySelectorAll(
			".rating-star"
		);


	stars.forEach(
		star => {

			const starRating =
				Number(
					star.dataset.rating
				);


			star.classList.toggle(
				"selected",
				starRating <= rating
			);

		}
	);

}


/* ==================== */
/* UPDATE STAR DISPLAY */
/* ==================== */

async function updateStarDisplay() {

	const modelId =
		getCurrentRatingModelId();


	if (!modelId) {

		return;

	}


	const userRating =
		await getUserModelRating(
			modelId
		);


	const stars =
		document.querySelectorAll(
			".rating-star"
		);


	stars.forEach(
		star => {

			const starRating =
				Number(
					star.dataset.rating
				);


			const selected =
				userRating !== null &&
				starRating <= userRating;


			star.classList.toggle(
				"selected",
				selected
			);

		}
	);

}


/* ==================== */
/* RATING EFFECT */
/* ==================== */

let ratingEffectTimer =
	null;


function playRatingEffect(
	rating
) {

	if (
		window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches
	) {

		return;

	}


	const star =
		document.querySelector(
			`.rating-star[data-rating="${rating}"]`
		);


	if (!star) {

		return;

	}


	if (ratingEffectTimer) {

		clearTimeout(
			ratingEffectTimer
		);

	}


	document
		.querySelectorAll(
			".rating-effect-layer"
		)
		.forEach(
			effect =>
				effect.remove()
		);


	const effect =
		document.createElement(
			"span"
		);


	effect.className =
		`rating-effect-layer rating-effect-${rating}`;


	effect.setAttribute(
		"aria-hidden",
		"true"
	);


	const effectSettings = {

		1: {

			count:
				5,

			distance:
				25,

			symbols:
				["·", "·", "⌁"],

			color:
				"#929aa3",

			duration:
				650

		},

		2: {

			count:
				8,

			distance:
				33,

			symbols:
				["·", "•"],

			color:
				"#b39a72",

			duration:
				700

		},

		3: {

			count:
				11,

			distance:
				41,

			symbols:
				["•", "○", "·"],

			color:
				"#929292",

			duration:
				750

		},

		4: {

			count:
				16,

			distance:
				49,

			symbols:
				["✦", "✧", "·"],

			color:
				"#75a276",

			duration:
				850

		},

		5: {

			count:
				26,

			distance:
				62,

			symbols:
				["✦", "✧", "✶", "·"],

			color:
				"#e0ad35",

			duration:
				1100

		}

	};


	const settings =
		effectSettings[rating];


	if (!settings) {

		return;

	}


	if (rating >= 3) {

		const ring =
			document.createElement(
				"span"
			);


		ring.className =
			"rating-effect-ring";


		effect.appendChild(
			ring
		);

	}


	for (
		let index = 0;
		index < settings.count;
		index++
	) {

		const angle =
			(2 * Math.PI * index) /
				settings.count -
			Math.PI / 2;


		const particle =
			document.createElement(
				"span"
			);


		particle.className =
			"rating-effect-particle";


		particle.textContent =
			settings.symbols[
				index %
				settings.symbols.length
			];


		particle.style.setProperty(
			"--effect-x",
			`${Math.cos(angle) * settings.distance}px`
		);


		particle.style.setProperty(
			"--effect-y",
			`${Math.sin(angle) * settings.distance}px`
		);


		particle.style.setProperty(
			"--effect-delay",
			`${(index % 5) * 25}ms`
		);


		particle.style.setProperty(
			"--effect-size",
			rating === 5 &&
			index % 4 === 0
				? "21px"
				: rating >= 4
					? "16px"
					: "13px"
		);


		particle.style.setProperty(
			"--effect-rotation",
			`${(index % 2 ? 1 : -1) *
				(35 + index * 9)}deg`
		);


		particle.style.color =
			settings.color;


		effect.appendChild(
			particle
		);

	}


	star.appendChild(
		effect
	);


	ratingEffectTimer =
		setTimeout(
			() => {

				effect.remove();

				ratingEffectTimer =
					null;

			},
			settings.duration + 200
		);

}


/* ==================== */
/* HANDLE RATING CLICK */
/* ==================== */

async function handleRatingClick(
	rating
) {

	console.log(
		"Rating button clicked:",
		rating
	);


	const modelId =
		getCurrentRatingModelId();


	console.log(
		"Current model:",
		modelId
	);


	if (!modelId) {

		console.error(
			"Could not determine current model."
		);

		return;

	}


	const stars =
		document.querySelectorAll(
			".rating-star"
		);


	stars.forEach(
		star => {

			star.disabled =
				true;

		}
	);


	const saved =
		await saveModelRating(
			modelId,
			rating
		);


	stars.forEach(
		star => {

			star.disabled =
				false;

		}
	);


	if (!saved) {

		await updateStarDisplay();

		return;

	}


	highlightStars(
		rating
	);


	playRatingEffect(
		rating
	);


	await updateModelRatingDisplay();

	await updateModelCardRatings();

	await updateStarDisplay();

}


/* ==================== */
/* UPDATE MODEL RATING */
/* ==================== */

async function updateModelRatingDisplay() {

	const modelId =
		getCurrentRatingModelId();


	if (!modelId) {

		return;

	}


	const stats =
		await getModelRatingStats();


	const modelStats =
		stats.find(
			item =>
				item.model_id ===
				modelId
		);


	const valueElement =
		document.getElementById(
			"modelPageRatingValue"
		);


	const countElement =
		document.getElementById(
			"modelPageRatingCount"
		);


	if (!modelStats) {

		if (valueElement) {

			valueElement.textContent =
				"☆ 0.0";

		}


		if (countElement) {

			countElement.textContent =
				"0 ratings";

		}


		return;

	}


	const rating =
		Number(
			modelStats.rating
		);


	const count =
		Number(
			modelStats.rating_count
		);


	if (valueElement) {

		valueElement.textContent =
			`☆ ${rating.toFixed(1)}`;

	}


	if (countElement) {

		countElement.textContent =
			`${count} ${
				count === 1
					? "rating"
					: "ratings"
			}`;

	}

}


/* ==================== */
/* UPDATE MODEL CARD RATINGS */
/* ==================== */

async function updateModelCardRatings() {

	const stats =
		await getModelRatingStats();

	const ratedModels =
		ratingModelIds
			.map(
				(modelId, index) => {
					const modelStats =
						stats.find(
							item =>
								item.model_id ===
								modelId
						);

					return {
						modelId,
						index,
						rating: Number(modelStats?.rating) || 0,
						ratingCount: Number(modelStats?.rating_count) || 0
					};
				}
			)
			.filter(model => model.ratingCount > 0)
			.sort(
				(a, b) =>
					b.rating - a.rating ||
					b.ratingCount - a.ratingCount ||
					a.index - b.index
			);

	const topRatedModelIds =
		new Set(
			ratedModels
				.slice(0, 5)
				.map(model => model.modelId)
		);

	const modelStatsById =
		new Map(
			stats.map(
				item => [
					item.model_id,
					{
						rating: Number(item.rating) || 0,
						ratingCount: Number(item.rating_count) || 0
					}
				]
			)
		);

	document
		.querySelectorAll(
			".model-card"
		)
		.forEach(
			card => {

				const modelId =
					card.dataset.model;

				const modelStats =
					modelStatsById.get(modelId);

				card.dataset.rating =
					String(modelStats?.rating || 0);

				card.dataset.ratingCount =
					String(modelStats?.ratingCount || 0);

				const isTopRated =
					topRatedModelIds.has(modelId);

				let topRatedIndicator =
					card.querySelector(
						".top-rated-indicator"
					);

				if (isTopRated && !topRatedIndicator) {
					topRatedIndicator =
						document.createElement("span");
					topRatedIndicator.className =
						"top-rated-indicator";
					topRatedIndicator.textContent = "🔥";
					topRatedIndicator.title =
						"Top 5 by star rating";
					topRatedIndicator.setAttribute(
						"aria-label",
						"Top 5 by star rating"
					);

					const statsElement =
						card.querySelector(".model-stats");

					if (statsElement) {
						const colorIndicator =
							statsElement.querySelector(
								".comfort-chair-color-indicator"
							);

						if (colorIndicator) {
							statsElement.insertBefore(
								topRatedIndicator,
								colorIndicator
							);
						} else {
							statsElement.appendChild(
								topRatedIndicator
							);
						}
					}
				} else if (!isTopRated && topRatedIndicator) {
					topRatedIndicator.remove();
				}

				const ratingElement =
					card.querySelector(
						".model-rating"
					);


				if (!ratingElement) {

					return;

				}


				if (!modelStats) {

					ratingElement.textContent =
						"☆ 0.0";

					return;

				}


				ratingElement.textContent =
					`☆ ${modelStats.rating.toFixed(1)}`;

			}
		);

	document.dispatchEvent(
		new Event("model-ratings-updated")
	);

}


/* ==================== */
/* INITIALIZE */
/* ==================== */

async function initializeRatings() {

	await updateModelCardRatings();


	createComfortChairButtons();


	updateComfortChairVariants();


	const modelId =
		getCurrentRatingModelId();


	if (modelId) {

		await updateModelRatingDisplay();

		await updateStarDisplay();

	}

}


/* ==================== */
/* WATCH MODEL PAGE */
/* ==================== */

function startRatingWatcher() {

	let lastModelId =
		null;


	let lastComfortImage =
		null;


	setInterval(
		async function () {

			const modelId =
				getCurrentRatingModelId();


			/* ==================== */
			/* COMFORT CHAIR VARIANTS */
			/* ==================== */

			const image =
				document.getElementById(
					"modelPageImage"
				);


			const currentImage =
				image
					? image.src
					: null;


			if (
				currentImage !==
				lastComfortImage
			) {

				lastComfortImage =
					currentImage;


				updateComfortChairVariants();

			}


			/* ==================== */
			/* RATING WATCHER */
			/* ==================== */

			if (
				modelId !==
				lastModelId
			) {

				lastModelId =
					modelId;


				if (modelId) {

					await updateModelRatingDisplay();

					await updateStarDisplay();

				}

			}

		},
		300
	);

}


/* ==================== */
/* GLOBAL FUNCTIONS */
/* ==================== */

window.handleRatingClick =
	handleRatingClick;

window.highlightStars =
	highlightStars;

window.updateStarDisplay =
	updateStarDisplay;

window.changeComfortChairVariant =
	changeComfortChairVariant;


/* ==================== */
/* START */
/* ==================== */

document.addEventListener(
	"DOMContentLoaded",
	function () {

		initializeRatings();

		startRatingWatcher();

	}
);
document.addEventListener("DOMContentLoaded", function () {

	const themeToggle = document.getElementById("themeToggle");

	if (!themeToggle) {
		return;
	}


	// Load saved theme

	const savedTheme = localStorage.getItem("qytmodels-theme");

	if (savedTheme === "dark") {
		document.body.classList.add("dark-theme");
	}

	function updateThemeToggleLabel() {
		const nextTheme =
			document.body.classList.contains("dark-theme")
				? "light"
				: "dark";

		const label =
			"Switch to " + nextTheme + " theme";

		themeToggle.setAttribute("aria-label", label);
		themeToggle.title = label;
	}

	updateThemeToggleLabel();

	// Toggle theme

	themeToggle.addEventListener("click", function () {

		document.body.classList.toggle("dark-theme");

		const isDark =
			document.body.classList.contains("dark-theme");

		localStorage.setItem(
			"qytmodels-theme",
			isDark ? "dark" : "light"
		);

		updateThemeToggleLabel();

	});

});