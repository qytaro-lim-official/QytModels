/* ==================== */
/* QYTMODELS RATINGS */
/* ==================== */

const ratingSupabase =
	supabaseClient;


/* ==================== */
/* MODEL IDS */
/* ==================== */

const ratingModelIds = [
	"chair",
	"box",
	"trashCan",
	"stopSign"
];


/* ==================== */
/* GET CURRENT MODEL */
/* ==================== */

function getCurrentRatingModelId() {

	const image =
		document.getElementById(
			"modelPageImage"
		);


	if (!image) {

		return null;

	}


	const imageSource =
		image.getAttribute(
			"src"
		) || "";


	if (
		imageSource.includes(
			"old_wooden_chair.jpg"
		)
	) {

		return "chair";

	}


	if (
		imageSource.includes(
			"box.jpg"
		)
	) {

		return "box";

	}


	if (
		imageSource.includes(
			"Trash_Can.jpg"
		)
	) {

		return "trashCan";

	}


	if (
		imageSource.includes(
			"Stop.Sign.jpg"
		)
	) {

		return "stopSign";

	}


	return null;

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
			count: 5,
			distance: 25,
			symbols: ["·", "·", "⌁"],
			color: "#929aa3",
			duration: 650
		},
		2: {
			count: 8,
			distance: 33,
			symbols: ["·", "•"],
			color: "#b39a72",
			duration: 700
		},
		3: {
			count: 11,
			distance: 41,
			symbols: ["•", "○", "·"],
			color: "#929292",
			duration: 750
		},
		4: {
			count: 16,
			distance: 49,
			symbols: ["✦", "✧", "·"],
			color: "#75a276",
			duration: 850
		},
		5: {
			count: 26,
			distance: 62,
			symbols: ["✦", "✧", "✶", "·"],
			color: "#e0ad35",
			duration: 1100
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
			rating === 5 && index % 4 === 0
				? "21px"
				: rating >= 4
					? "16px"
					: "13px"
		);


		particle.style.setProperty(
			"--effect-rotation",
			`${(index % 2 ? 1 : -1) * (35 + index * 9)}deg`
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
/* UPDATE MODEL CARDS */
/* ==================== */

async function updateModelCardRatings() {

	const stats =
		await getModelRatingStats();


	document
		.querySelectorAll(
			".model-card"
		)
		.forEach(
			card => {

				const modelId =
					card.dataset.model;


				const ratingElement =
					card.querySelector(
						".model-rating"
					);


				if (!ratingElement) {

					return;

				}


				const modelStats =
					stats.find(
						item =>
							item.model_id ===
							modelId
					);


				if (!modelStats) {

					ratingElement.textContent =
						"☆ 0.0";

					return;

				}


				const rating =
					Number(
						modelStats.rating
					);


				ratingElement.textContent =
					`☆ ${rating.toFixed(1)}`;

			}
		);

}


/* ==================== */
/* INITIALIZE RATINGS */
/* ==================== */

async function initializeRatings() {

	console.log(
		"QytModels ratings initialized."
	);


	await updateModelCardRatings();


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


	setInterval(
		async () => {

			const modelId =
				getCurrentRatingModelId();


			if (
				modelId !==
				lastModelId
			) {

				lastModelId =
					modelId;


				if (modelId) {

					console.log(
						"Model changed:",
						modelId
					);


					await updateModelRatingDisplay();


					await updateStarDisplay();

				}

			}

		},
		300
	);

}


/* ==================== */
/* MAKE FUNCTIONS GLOBAL */
/* ==================== */

window.handleRatingClick =
	handleRatingClick;

window.highlightStars =
	highlightStars;

window.updateStarDisplay =
	updateStarDisplay;


/* ==================== */
/* START */
/* ==================== */

document.addEventListener(
	"DOMContentLoaded",
	() => {

		initializeRatings();


		startRatingWatcher();

	}
);