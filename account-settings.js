/* ==================== */
/* LIKED MODELS SYSTEM */
/* ==================== */

const accountMenuElement =
	document.getElementById(
		"accountMenu"
	);


/* ==================== */
/* LIKED MODELS DATA */
/* ==================== */

let likedModelIds =
	new Set();


let likedModelsUserId =
	null;


/* ==================== */
/* LIKE COUNTS */
/* ==================== */

let modelLikeCounts =
	new Map();


let likesRealtimeChannel =
	null;


/* ==================== */
/* MODEL IDs */
/* ==================== */

const likedModelsList = [
	"chair",
	"box",
	"trashCan",
	"stopSign"
];


/* ==================== */
/* CREATE LIKED STYLES */
/* ==================== */

const likedModelsStyle =
	document.createElement(
		"style"
	);


likedModelsStyle.id =
	"likedModelsStyle";


likedModelsStyle.textContent = `

	.model-like-button {

		position: absolute;

		top: 12px;

		right: 12px;

		width: 36px;

		height: 36px;

		border: none;

		border-radius: 50%;

		background: rgba(255, 255, 255, 0.94);

		color: #777;

		font-size: 21px;

		line-height: 36px;

		text-align: center;

		padding: 0;

		cursor: pointer;

		z-index: 20;

		transition:
			background 0.15s ease,
			color 0.15s ease,
			transform 0.15s ease;

		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.08);

	}


	.model-like-button:hover {

		transform: scale(1.06);

		background: #ffffff;

		color: #777;

	}


	.model-like-button.liked {

		color: #777;

	}


	.model-like-button:active {

		transform: scale(0.94);

	}


	.model-preview {

		position: relative;

	}


	.model-like-count {

		color: #777;

		font-size: 13px;

		margin-right: 2px;

		white-space: nowrap;

	}


	.model-like-separator {

		color: #777;

		margin-right: 2px;

		white-space: nowrap;

	}


	#likedModelsPage {

		display: none;

	}


	#likedModelsPage.open {

		display: block;

	}


	.liked-models-header {

		display: flex;

		align-items: center;

		gap: 14px;

		margin-bottom: 24px;

	}


	.liked-models-back {

		border: none;

		background: transparent;

		font-size: 15px;

		cursor: pointer;

		padding: 8px 0;

		color: inherit;

	}


	.liked-models-back:hover {

		color: #e53935;

	}


	.liked-models-title {

		margin: 0;

	}


	.liked-models-empty {

		padding: 40px 20px;

		text-align: center;

		opacity: 0.65;

	}


	.liked-models-grid {

		display: grid;

		grid-template-columns:
			repeat(
				auto-fill,
				minmax(220px, 1fr)
			);

		gap: 20px;

	}

`;


document.head.appendChild(
	likedModelsStyle
);


/* ==================== */
/* FIND LIKED BUTTON */
/* ==================== */

let likedModelsButton =
	null;


if (accountMenuElement) {

	const accountMenuItems =
		accountMenuElement.querySelectorAll(
			".account-menu-item"
		);


	accountMenuItems.forEach(
		function (button) {

			if (
				button.textContent.trim() ===
				"Liked models"
			) {

				likedModelsButton =
					button;

			}

		}
	);

}


/* ==================== */
/* CREATE LIKED PAGE */
/* ==================== */

const likedModelsPage =
	document.createElement(
		"div"
	);


likedModelsPage.id =
	"likedModelsPage";


likedModelsPage.innerHTML = `

	<div class="liked-models-header">

		<button
			type="button"
			class="liked-models-back"
			id="likedModelsBackButton"
		>
			← Models
		</button>


		<h1 class="liked-models-title">
			Liked models
		</h1>

	</div>


	<p
		class="models-count"
		id="likedModelsCount"
	>
		0 Models
	</p>


	<div
		class="liked-models-grid"
		id="likedModelsGrid"
	></div>


	<div
		class="liked-models-empty"
		id="likedModelsEmpty"
	>
		You haven't liked any models yet.
	</div>

`;


const existingModelsPage =
	document.getElementById(
		"modelsPage"
	);


if (existingModelsPage) {

	existingModelsPage.parentNode.insertBefore(
		likedModelsPage,
		existingModelsPage.nextSibling
	);

}


/* ==================== */
/* LIKED MODELS ELEMENTS */
/* ==================== */

const likedModelsGrid =
	document.getElementById(
		"likedModelsGrid"
	);


const likedModelsEmpty =
	document.getElementById(
		"likedModelsEmpty"
	);


const likedModelsCount =
	document.getElementById(
		"likedModelsCount"
	);


const likedModelsBackButton =
	document.getElementById(
		"likedModelsBackButton"
	);


/* ==================== */
/* SITE MESSAGE */
/* ==================== */

function showLikedModelsMessage(
	message
) {

	if (
		typeof showSiteMessage ===
		"function"
	) {

		showSiteMessage(
			message
		);

		return;

	}


	const messageElement =
		document.createElement(
			"div"
		);


	messageElement.textContent =
		message;


	messageElement.style.position =
		"fixed";


	messageElement.style.bottom =
		"24px";


	messageElement.style.left =
		"50%";


	messageElement.style.transform =
		"translateX(-50%)";


	messageElement.style.zIndex =
		"99999";


	messageElement.style.padding =
		"12px 18px";


	messageElement.style.borderRadius =
		"10px";


	messageElement.style.background =
		"#222";


	messageElement.style.color =
		"#fff";


	messageElement.style.fontSize =
		"14px";


	document.body.appendChild(
		messageElement
	);


	setTimeout(
		function () {

			messageElement.remove();

		},
		2500
	);

}


/* ==================== */
/* LOAD LIKE COUNTS */
/* ==================== */

async function loadModelLikeCounts() {

	try {

		const {
			data,
			error
		} =
		await supabaseClient.rpc(
			"get_model_like_counts"
		);


		if (error) {

			console.error(
				"Load model like counts error:",
				error
			);


			return;

		}


		const newCounts =
			new Map();


		if (Array.isArray(data)) {

			data.forEach(
				function (item) {

					if (
						item &&
						item.model_id
					) {

						newCounts.set(
							String(
								item.model_id
							),
							Number(
								item.like_count
							) || 0
						);

					}

				}
			);

		}


		modelLikeCounts =
			newCounts;


		updateAllLikeCounts();

	} catch (error) {

		console.error(
			"Load model like counts error:",
			error
		);

	}

}


/* ==================== */
/* UPDATE LIKE COUNTS */
/* ==================== */

function updateAllLikeCounts() {

	const countElements =
		document.querySelectorAll(
			".model-like-count"
		);


	countElements.forEach(
		function (element) {

			const modelId =
				element.dataset.modelId;


			const count =
				modelLikeCounts.get(
					modelId
				) || 0;


			element.textContent =
				"♡ " +
				count;

		}
	);

}


/* ==================== */
/* ADD LIKE COUNT */
/* ==================== */

function addLikeCount(
	card
) {

	if (!card) {
		return;
	}


	const modelId =
		card.dataset.model;


	if (!modelId) {
		return;
	}


	const stats =
		card.querySelector(
			".model-stats"
		);


	if (!stats) {
		return;
	}


	const existingCount =
		stats.querySelector(
			".model-like-count"
		);

	if (existingCount) {

		existingCount.dataset.modelId =
			modelId;

		existingCount.textContent =
			"♡ " +
			(
				modelLikeCounts.get(
					modelId
				) || 0
			);

		return;
	}


	const sizeSpan =
		stats.querySelector(
			"span"
		);


	if (!sizeSpan) {
		return;
	}


	const likeCount =
		document.createElement(
			"span"
		);


	likeCount.className =
		"model-like-count";


	likeCount.dataset.modelId =
		modelId;


	likeCount.textContent =
		"♡ " +
		(
			modelLikeCounts.get(
				modelId
			) || 0
		);


	const separator =
		document.createElement(
			"span"
		);


	separator.className =
		"model-like-separator";


	separator.textContent =
		"·";


	stats.insertBefore(
		likeCount,
		sizeSpan
	);


	stats.insertBefore(
		separator,
		sizeSpan
	);

}


/* ==================== */
/* ADD LIKE COUNTS */
/* ==================== */

function addAllLikeCounts() {

	const modelCards =
		document.querySelectorAll(
			".model-card[data-model]"
		);


	modelCards.forEach(
		function (card) {

			addLikeCount(
				card
			);

		}
	);


	updateAllLikeCounts();

}


/* ==================== */
/* REALTIME LIKES */
/* ==================== */

function startLikesRealtime() {

	if (likesRealtimeChannel) {

		supabaseClient.removeChannel(
			likesRealtimeChannel
		);

	}


	likesRealtimeChannel =
		supabaseClient
			.channel(
				"qytmodels-like-counts"
			)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "model_likes"
				},
				function () {

					loadModelLikeCounts();

					loadLikedModels();

				}
			)
			.subscribe(
				function (status) {

					console.log(
						"Likes realtime:",
						status
					);

				}
			);

}


/* ==================== */
/* GET CURRENT SESSION */
/* ==================== */

async function getLikedModelsSession() {

	try {

		const {
			data,
			error
		} =
		await supabaseClient.auth.getSession();


		if (
			error ||
			!data ||
			!data.session
		) {

			return null;

		}


		return data.session;

	} catch (error) {

		console.error(
			"Liked models session error:",
			error
		);


		return null;

	}

}


/* ==================== */
/* LOAD LIKES */
/* ==================== */

async function loadLikedModels() {

	const session =
		await getLikedModelsSession();


	likedModelIds =
		new Set();


	likedModelsUserId =
		null;


	if (!session) {

		updateAllLikeButtons();

		renderLikedModels();

		return;

	}


	likedModelsUserId =
		session.user.id;


	try {

		const {
			data,
			error
		} =
		await supabaseClient
			.from(
				"model_likes"
			)
			.select(
				"model_id"
			)
			.eq(
				"user_id",
				likedModelsUserId
			);


		if (error) {

			console.error(
				"Load liked models error:",
				error
			);


			return;

		}


		if (Array.isArray(data)) {

			data.forEach(
				function (item) {

					if (
						item &&
						item.model_id
					) {

						likedModelIds.add(
							String(
								item.model_id
							)
						);

					}

				}
			);

		}


		updateAllLikeButtons();

		renderLikedModels();

	} catch (error) {

		console.error(
			"Load liked models error:",
			error
		);

	}

}


/* ==================== */
/* UPDATE LIKE BUTTONS */
/* ==================== */

function updateAllLikeButtons() {

	const likeButtons =
		document.querySelectorAll(
			".model-like-button"
		);


	likeButtons.forEach(
		function (button) {

			const modelId =
				button.dataset.modelId;


			const isLiked =
				likedModelIds.has(
					modelId
				);


			button.classList.toggle(
				"liked",
				isLiked
			);


			button.textContent =
				isLiked
					? "♥"
					: "♡";


			button.setAttribute(
				"aria-label",
				isLiked
					? "Unlike model"
					: "Like model"
			);

		}
	);


	updateAllLikeCounts();

}


/* ==================== */
/* TOGGLE LIKE */
/* ==================== */

async function toggleModelLike(
	modelId,
	button
) {

	const session =
		await getLikedModelsSession();


	if (!session) {

		showLikedModelsMessage(
			"Log in to like models."
		);


		return;

	}


	const userId =
		session.user.id;


	const isLiked =
		likedModelIds.has(
			modelId
		);


	if (button) {

		button.disabled =
			true;

	}


	try {

		if (isLiked) {

			const {
				error
			} =
			await supabaseClient
				.from(
					"model_likes"
				)
				.delete()
				.eq(
					"user_id",
					userId
				)
				.eq(
					"model_id",
					modelId
				);


			if (error) {

				throw error;

			}


			likedModelIds.delete(
				modelId
			);


			modelLikeCounts.set(
				modelId,
				Math.max(
					0,
					(
						modelLikeCounts.get(
							modelId
						) || 0
					) - 1
				)
			);

		} else {

			const {
				error
			} =
			await supabaseClient
				.from(
					"model_likes"
				)
				.insert(
					{
						user_id:
							userId,

						model_id:
							modelId
					}
				);


			if (error) {

				throw error;

			}


			likedModelIds.add(
				modelId
			);


			modelLikeCounts.set(
				modelId,
				(
					modelLikeCounts.get(
						modelId
					) || 0
				) + 1
			);

		}


		updateAllLikeButtons();

		renderLikedModels();

	} catch (error) {

		console.error(
			"Toggle model like error:",
			error
		);


		showLikedModelsMessage(
			"Could not update the like."
		);


	} finally {

		if (button) {

			button.disabled =
				false;

		}

	}

}


/* ==================== */
/* ADD LIKE BUTTONS */
/* ==================== */

function addLikeButtons() {

	const modelCards =
		document.querySelectorAll(
			".model-card[data-model]"
		);


	modelCards.forEach(
		function (card) {

			addLikeCount(
				card
			);


			if (
				card.querySelector(
					".model-like-button"
				)
			) {

				return;

			}


			const modelId =
				card.dataset.model;


			if (!modelId) {

				return;

			}


			const preview =
				card.querySelector(
					".model-preview"
				);


			if (!preview) {

				return;

			}


			const button =
				document.createElement(
					"button"
				);


			button.type =
				"button";


			button.className =
				"model-like-button";


			button.dataset.modelId =
				modelId;


			button.textContent =
				"♡";


			button.addEventListener(
				"click",
				function (event) {

					event.preventDefault();

					event.stopPropagation();


					toggleModelLike(
						modelId,
						button
					);

				}
			);


			preview.appendChild(
				button
			);

		}
	);


	updateAllLikeButtons();

}


/* ==================== */
/* FIND ORIGINAL CARD */
/* ==================== */

function findOriginalModelCard(
	modelId
) {

	return document.querySelector(
		`.model-card[data-model="${modelId}"]`
	);

}


/* ==================== */
/* CREATE LIKED MODEL CARD */
/* ==================== */

function createLikedModelCard(
	modelId
) {

	const originalCard =
		findOriginalModelCard(
			modelId
		);


	if (!originalCard) {

		return null;

	}


	const card =
		originalCard.cloneNode(
			true
		);


	addLikeCount(
		card
	);


	const likeButton =
		card.querySelector(
			".model-like-button"
		);


	if (likeButton) {

		likeButton.disabled =
			false;


		likeButton.addEventListener(
			"click",
			function (event) {

				event.preventDefault();

				event.stopPropagation();


				toggleModelLike(
					modelId,
					likeButton
				);

			}
		);

	}


	card.addEventListener(
		"click",
		function (event) {

			if (
				event.target.closest(
					".model-like-button"
				)
			) {

				return;

			}


			openModel(
				modelId
			);

		}
	);


	return card;

}


/* ==================== */
/* RENDER LIKED MODELS */
/* ==================== */

function renderLikedModels() {

	if (
		!likedModelsGrid ||
		!likedModelsEmpty ||
		!likedModelsCount
	) {

		return;

	}


	likedModelsGrid.innerHTML =
		"";


	const validLikedIds =
		likedModelsList.filter(
			function (modelId) {

				return likedModelIds.has(
					modelId
				);

			}
		);


	likedModelsCount.textContent =
		`${validLikedIds.length} Models`;


	likedModelsEmpty.style.display =
		validLikedIds.length === 0
			? "block"
			: "none";


	likedModelsGrid.style.display =
		validLikedIds.length === 0
			? "none"
			: "grid";


	validLikedIds.forEach(
		function (modelId) {

			const card =
				createLikedModelCard(
					modelId
				);


			if (card) {

				likedModelsGrid.appendChild(
					card
				);

			}

		}
	);


	updateAllLikeButtons();

}


/* ==================== */
/* OPEN LIKED MODELS */
/* ==================== */

function openLikedModelsPage() {

	if (accountMenuElement) {

		accountMenuElement.classList.remove(
			"open"
		);

	}


	const currentModelsPage =
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


	if (currentModelsPage) {

		currentModelsPage.style.display =
			"none";

	}


	if (helpPage) {

		helpPage.style.display =
			"none";

	}


	if (aboutPage) {

		aboutPage.style.display =
			"none";

	}


	likedModelsPage.style.display =
		"block";


	likedModelsPage.classList.add(
		"open"
	);


	renderLikedModels();

}


/* ==================== */
/* CLOSE LIKED MODELS */
/* ==================== */

function closeLikedModelsPage() {

	likedModelsPage.classList.remove(
		"open"
	);


	likedModelsPage.style.display =
		"none";


	const currentModelsPage =
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


	if (currentModelsPage) {

		currentModelsPage.style.display =
			"block";

	}


	if (helpPage) {

		helpPage.style.display =
			"none";

	}


	if (aboutPage) {

		aboutPage.style.display =
			"none";

	}


}


/* ==================== */
/* LIKED MODELS BUTTON */
/* ==================== */

if (likedModelsButton) {

	likedModelsButton.addEventListener(
		"click",
		function (event) {

			event.preventDefault();

			event.stopPropagation();


			openLikedModelsPage();

		}
	);

}


/* ==================== */
/* BACK TO MODELS */
/* ==================== */

if (likedModelsBackButton) {

	likedModelsBackButton.addEventListener(
		"click",
		function (event) {

			event.preventDefault();

			event.stopPropagation();


			closeLikedModelsPage();

		}
	);

}


/* ==================== */
/* INITIALIZE LIKES */
/* ==================== */

addLikeButtons();


addAllLikeCounts();


loadModelLikeCounts();


loadLikedModels();


startLikesRealtime();


/* ==================== */
/* AUTH STATE */
/* ==================== */

supabaseClient.auth.onAuthStateChange(
	function () {

		setTimeout(
			function () {

				loadLikedModels();

				loadModelLikeCounts();

			},
			0
		);

	}
);


/* ==================== */
/* DELETE ACCOUNT SYSTEM */
/* ==================== */

const deleteSystem =
	document.createElement(
		"div"
	);


deleteSystem.id =
	"deleteSystem";


deleteSystem.className =
	"delete-system";


document.body.appendChild(
	deleteSystem
);


/* ==================== */
/* CURRENT STEP */
/* ==================== */

let currentDeleteStep =
	0;


/* ==================== */
/* DELETE DATA */
/* ==================== */

let deletePassword =
	"";


let deleteUsername =
	"";


/* ==================== */
/* CREATE STEP */
/* ==================== */

function createDeleteStep(
	step
) {

	const modal =
		document.createElement(
			"div"
		);


	modal.className =
		"delete-step";


	modal.dataset.step =
		step;


	deleteSystem.appendChild(
		modal
	);


	return modal;

}


/* ==================== */
/* STEP 1 */
/* ==================== */

const step1 =
	createDeleteStep(
		1
	);


step1.innerHTML = `

	<div class="delete-step-content">

		<h2 class="delete-step-title">
			Delete your account?
		</h2>


		<p class="delete-step-text">
			Deleting your QytModels account is permanent and cannot be undone.
		</p>


		<div class="delete-step-actions">

			<button
				type="button"
				class="delete-step-button delete-step-cancel"
				data-delete-cancel
			>
				Cancel
			</button>


			<button
				type="button"
				class="delete-step-button delete-step-continue"
				data-delete-next
			>
				Continue
			</button>

		</div>

	</div>

`;


/* ==================== */
/* STEP 2 */
/* ==================== */

const step2 =
	createDeleteStep(
		2
	);


step2.innerHTML = `

	<div class="delete-step-content">

		<h2 class="delete-step-title">
			Are you sure?
		</h2>


		<p class="delete-step-text">
			Your account, profile information and account-related data will no longer be available after deletion.
		</p>


		<div class="delete-step-actions">

			<button
				type="button"
				class="delete-step-button delete-step-cancel"
				data-delete-cancel
			>
				Cancel
			</button>


			<button
				type="button"
				class="delete-step-button delete-step-continue"
				data-delete-next
			>
				Continue
			</button>

		</div>

	</div>

`;


/* ==================== */
/* STEP 3 */
/* ==================== */

const step3 =
	createDeleteStep(
		3
	);


step3.innerHTML = `

	<div class="delete-step-content">

		<h2 class="delete-step-title">
			One more warning
		</h2>


		<p class="delete-step-text">
			This action is permanent. Once the account is deleted, it cannot be restored.
		</p>


		<div class="delete-step-actions">

			<button
				type="button"
				class="delete-step-button delete-step-cancel"
				data-delete-cancel
			>
				Cancel
			</button>


			<button
				type="button"
				class="delete-step-button delete-step-continue"
				data-delete-next
			>
				Continue
			</button>

		</div>

	</div>

`;


/* ==================== */
/* STEP 4 */
/* ==================== */

const step4 =
	createDeleteStep(
		4
	);


step4.innerHTML = `

	<div class="delete-step-content delete-step-large">

		<h2 class="delete-step-title">
			What will be deleted?
		</h2>


		<div
			class="delete-information-box"
			id="deleteInformationBox"
		>

			<p>
				Deleting your QytModels account is a permanent action.
			</p>


			<p>
				Your account and the information connected to it will no longer be available.
			</p>


			<p>
				This includes your QytModels username and account profile.
			</p>


			<p>
				Any account-related preferences, ratings, likes, downloads and other information associated with your account may also be removed.
			</p>


			<p>
				You will not be able to use the deleted account to access your previous account information.
			</p>


			<p>
				Creating another account later will not restore the deleted account or its previous information.
			</p>


			<p>
				Make sure you really want to continue before proceeding.
			</p>


			<p>
				There is no recovery option after the deletion has been completed.
			</p>


			<p>
				Scroll to the bottom of this section before continuing.
			</p>

		</div>


		<div
			class="delete-scroll-status"
			id="deleteScrollStatus"
		>
			Scroll to the bottom to continue.
		</div>


		<label
			class="delete-checkbox-row"
			id="deleteCheckboxRow"
		>

			<input
				type="checkbox"
				id="deleteConfirmCheckbox"
				disabled
			>


			<span>
				I understand what will happen to my account.
			</span>

		</label>


		<div class="delete-step-actions">

			<button
				type="button"
				class="delete-step-button delete-step-cancel"
				data-delete-cancel
			>
				Cancel
			</button>


			<button
				type="button"
				class="delete-step-button delete-step-continue"
				id="deleteStep4Continue"
				disabled
			>
				Continue
			</button>

		</div>

	</div>

`;


/* ==================== */
/* STEP 5 */
/* ==================== */

const step5 =
	createDeleteStep(
		5
	);


step5.innerHTML = `

	<div class="delete-step-content">

		<h2 class="delete-step-title">
			Confirm your account
		</h2>


		<p class="delete-step-text">
			Enter your current username and password to continue.
		</p>


		<div class="delete-input-group">

			<label
				for="deleteUsernameInput"
			>
				Username
			</label>


			<input
				type="text"
				id="deleteUsernameInput"
				autocomplete="username"
				placeholder="Enter your username"
			>

		</div>


		<div class="delete-input-group">

			<label
				for="deletePasswordInput"
			>
				Password
			</label>


			<input
				type="password"
				id="deletePasswordInput"
				autocomplete="current-password"
				placeholder="Enter your password"
			>

		</div>


		<p
			class="delete-validation-message"
			id="deleteValidationMessage"
		></p>


		<div class="delete-step-actions">

			<button
				type="button"
				class="delete-step-button delete-step-cancel"
				data-delete-cancel
			>
				Cancel
			</button>


			<button
				type="button"
				class="delete-step-button delete-step-continue"
				id="deleteStep5Continue"
			>
				Continue
			</button>

		</div>

	</div>

`;


/* ==================== */
/* STEP 6 */
/* ==================== */

const step6 =
	createDeleteStep(
		6
	);


step6.innerHTML = `

	<div class="delete-step-content">

		<h2 class="delete-step-title">
			Delete account permanently?
		</h2>


		<p class="delete-step-text delete-final-text">
			This is the final confirmation. Your QytModels account will be permanently deleted.
		</p>


		<p class="delete-final-warning">
			This action cannot be undone.
		</p>


		<div class="delete-step-actions">

			<button
				type="button"
				class="delete-step-button delete-step-cancel"
				data-delete-cancel
			>
				Cancel
			</button>


			<button
				type="button"
				class="delete-step-button delete-final-button"
				id="deleteFinalButton"
			>
				Delete account permanently
			</button>

		</div>

	</div>

`;


/* ==================== */
/* STEP 4 ELEMENTS */
/* ==================== */

const deleteInformationBox =
	document.getElementById(
		"deleteInformationBox"
	);


const deleteConfirmCheckbox =
	document.getElementById(
		"deleteConfirmCheckbox"
	);


const deleteStep4Continue =
	document.getElementById(
		"deleteStep4Continue"
	);


const deleteScrollStatus =
	document.getElementById(
		"deleteScrollStatus"
	);


/* ==================== */
/* CHECK STEP 4 */
/* ==================== */

function checkDeleteInformationScroll() {

	if (
		!deleteInformationBox ||
		!deleteConfirmCheckbox ||
		!deleteStep4Continue
	) {

		return;

	}


	const scrollPosition =
		deleteInformationBox.scrollTop +
		deleteInformationBox.clientHeight;


	const scrollHeight =
		deleteInformationBox.scrollHeight;


	const reachedBottom =
		scrollPosition >=
		scrollHeight - 10;


	if (reachedBottom) {

		deleteConfirmCheckbox.disabled =
			false;


		if (deleteScrollStatus) {

			deleteScrollStatus.textContent =
				"You can now check the confirmation box.";

		}

	}

}


if (deleteInformationBox) {

	deleteInformationBox.addEventListener(
		"scroll",
		checkDeleteInformationScroll
	);


	deleteInformationBox.addEventListener(
		"wheel",
		function () {

			setTimeout(
				checkDeleteInformationScroll,
				0
			);

		}
	);


	deleteInformationBox.addEventListener(
		"touchmove",
		function () {

			setTimeout(
				checkDeleteInformationScroll,
				0
			);

		}
	);

}


if (deleteConfirmCheckbox) {

	deleteConfirmCheckbox.addEventListener(
		"change",
		function () {

			if (!deleteStep4Continue) {

				return;

			}


			deleteStep4Continue.disabled =
				!deleteConfirmCheckbox.checked;

		}
	);

}


/* ==================== */
/* SHOW STEP */
/* ==================== */

function showDeleteStep(
	step
) {

	currentDeleteStep =
		step;


	const steps =
		deleteSystem.querySelectorAll(
			".delete-step"
		);


	steps.forEach(
		function (currentStep) {

			const stepNumber =
				Number(
					currentStep.dataset.step
				);


			currentStep.classList.toggle(
				"open",
				stepNumber === step
			);

		}
	);


	deleteSystem.classList.add(
		"open"
	);


	if (step === 4) {

		setTimeout(
			function () {

				checkDeleteInformationScroll();

			},
			50
		);

	}

}


/* ==================== */
/* OPEN DELETE ACCOUNT */
/* ==================== */

window.openDeleteAccountSystem =
	function () {

		if (accountMenuElement) {

			accountMenuElement.classList.remove(
				"open"
			);

		}


		showDeleteStep(
			1
		);

	};


/* ==================== */
/* CLOSE DELETE SYSTEM */
/* ==================== */

function closeDeleteSystem() {

	deleteSystem.classList.remove(
		"open"
	);


	currentDeleteStep =
		0;


	deletePassword =
		"";


	deleteUsername =
		"";


	const usernameInput =
		document.getElementById(
			"deleteUsernameInput"
		);


	const passwordInput =
		document.getElementById(
			"deletePasswordInput"
		);


	const validationMessage =
		document.getElementById(
			"deleteValidationMessage"
		);


	const checkbox =
		document.getElementById(
			"deleteConfirmCheckbox"
		);


	const step4Continue =
		document.getElementById(
			"deleteStep4Continue"
		);


	const informationBox =
		document.getElementById(
			"deleteInformationBox"
		);


	const scrollStatus =
		document.getElementById(
			"deleteScrollStatus"
		);


	if (usernameInput) {

		usernameInput.value =
			"";

	}


	if (passwordInput) {

		passwordInput.value =
			"";

	}


	if (validationMessage) {

		validationMessage.textContent =
			"";

	}


	if (checkbox) {

		checkbox.checked =
			false;


		checkbox.disabled =
			true;

	}


	if (step4Continue) {

		step4Continue.disabled =
			true;

	}


	if (informationBox) {

		informationBox.scrollTop =
			0;

	}


	if (scrollStatus) {

		scrollStatus.textContent =
			"Scroll to the bottom to continue.";

	}

}


/* ==================== */
/* NEXT BUTTONS */
/* ==================== */

const nextButtons =
	deleteSystem.querySelectorAll(
		"[data-delete-next]"
	);


nextButtons.forEach(
	function (button) {

		button.addEventListener(
			"click",
			function (event) {

				event.preventDefault();


				const currentStepElement =
					button.closest(
						".delete-step"
					);


				if (!currentStepElement) {

					return;

				}


				const currentStep =
					Number(
						currentStepElement.dataset.step
					);


				if (
					currentStep >= 1 &&
					currentStep < 4
				) {

					showDeleteStep(
						currentStep + 1
					);

				}

			}
		);

	}
);


/* ==================== */
/* STEP 4 CONTINUE */
/* ==================== */

if (deleteStep4Continue) {

	deleteStep4Continue.addEventListener(
		"click",
		function (event) {

			event.preventDefault();


			if (
				!deleteConfirmCheckbox ||
				!deleteConfirmCheckbox.checked
			) {

				return;

			}


			showDeleteStep(
				5
			);

		}
	);

}


/* ==================== */
/* CANCEL BUTTONS */
/* ==================== */

const cancelButtons =
	deleteSystem.querySelectorAll(
		"[data-delete-cancel]"
	);


cancelButtons.forEach(
	function (button) {

		button.addEventListener(
			"click",
			function (event) {

				event.preventDefault();


				closeDeleteSystem();

			}
		);

	}
);


/* ==================== */
/* STEP 5 ELEMENTS */
/* ==================== */

const deleteStep5Continue =
	document.getElementById(
		"deleteStep5Continue"
	);


const deleteUsernameInput =
	document.getElementById(
		"deleteUsernameInput"
	);


const deletePasswordInput =
	document.getElementById(
		"deletePasswordInput"
	);


const deleteValidationMessage =
	document.getElementById(
		"deleteValidationMessage"
	);


/* ==================== */
/* STEP 5 VERIFICATION */
/* ==================== */

if (deleteStep5Continue) {

	deleteStep5Continue.addEventListener(
		"click",
		async function (event) {

			event.preventDefault();


			const username =
				deleteUsernameInput
					? deleteUsernameInput.value.trim()
					: "";


			const password =
				deletePasswordInput
					? deletePasswordInput.value
					: "";


			if (
				!username ||
				!password
			) {

				if (deleteValidationMessage) {

					deleteValidationMessage.textContent =
						"Enter your username and password.";

				}

				return;

			}


			deleteStep5Continue.disabled =
				true;


			if (deleteValidationMessage) {

				deleteValidationMessage.textContent =
					"Checking account information...";

			}


			try {

				const {
					data: sessionData,
					error: sessionError
				} =
				await supabaseClient.auth.getSession();


				if (
					sessionError ||
					!sessionData ||
					!sessionData.session
				) {

					throw new Error(
						"Your session has expired. Please log in again."
					);

				}


				const session =
					sessionData.session;


				let storedUsername =
					session.user.user_metadata
						?.username;


				if (!storedUsername) {

					storedUsername =
						localStorage.getItem(
							"qytmodels_username"
						);

				}


				if (
					!storedUsername ||
					storedUsername !==
					username
				) {

					throw new Error(
						"The username does not match this account."
					);

				}


				const email =
					session.user.email;


				if (!email) {

					throw new Error(
						"Your account does not have a valid login email."
					);

				}


				const {
					error: passwordError
				} =
				await supabaseClient.auth.signInWithPassword(
					{
						email:
							email,

						password:
							password
					}
				);


				if (passwordError) {

					throw new Error(
						"The password is incorrect."
					);

				}


				deleteUsername =
					username;


				deletePassword =
					password;


				if (deleteValidationMessage) {

					deleteValidationMessage.textContent =
						"Account information confirmed.";

				}


				setTimeout(
					function () {

						showDeleteStep(
							6
						);

					},
					400
				);

			} catch (error) {

				console.error(
					"Delete account verification error:",
					error
				);


				if (deleteValidationMessage) {

					deleteValidationMessage.textContent =
						error.message ||
						"Could not verify your account.";

				}

			} finally {

				deleteStep5Continue.disabled =
					false;

			}

		}
	);

}


/* ==================== */
/* FINAL DELETE */
/* ==================== */

const deleteFinalButton =
	document.getElementById(
		"deleteFinalButton"
	);


if (deleteFinalButton) {

	deleteFinalButton.addEventListener(
		"click",
		async function (event) {

			event.preventDefault();


			deleteFinalButton.disabled =
				true;


			deleteFinalButton.textContent =
				"Deleting account...";


			const finalWarning =
				step6.querySelector(
					".delete-final-warning"
				);


			if (finalWarning) {

				finalWarning.textContent =
					"Deleting your account...";

			}


			try {

				const {
					data: sessionData,
					error: sessionError
				} =
				await supabaseClient.auth.getSession();


				if (
					sessionError ||
					!sessionData ||
					!sessionData.session
				) {

					throw new Error(
						"Your session has expired. Please log in again."
					);

				}


				const {
					data,
					error
				} =
				await supabaseClient.functions.invoke(
					"delete-user-account"
				);


				if (error) {

					console.error(
						"Delete user account function error:",
						error
					);


					throw new Error(
						error.message ||
						"Failed to send a request to the Edge Function."
					);

				}


				if (
					!data ||
					data.success !== true
				) {

					throw new Error(
						data?.error ||
						"Account deletion was not completed."
					);

				}


				deleteFinalButton.textContent =
					"Account deleted";


				if (finalWarning) {

					finalWarning.textContent =
						"Your account has been permanently deleted.";

				}


				await supabaseClient.auth.signOut();


				deleteSystem.classList.remove(
					"open"
				);


				currentDeleteStep =
					0;


				deletePassword =
					"";


				deleteUsername =
					"";


				localStorage.removeItem(
					"qytmodels_username"
				);


				setTimeout(
					function () {

						window.location.href =
							"index.html";

					},
					500
				);

			} catch (error) {

				console.error(
					"Delete account error:",
					error
				);


				deleteFinalButton.disabled =
					false;


				deleteFinalButton.textContent =
					"Delete account permanently";


				if (finalWarning) {

					finalWarning.textContent =
						error.message ||
						"Account deletion failed. Please try again.";

				}

			}

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
			"Escape" &&
			deleteSystem.classList.contains(
				"open"
			)
		) {

			closeDeleteSystem();

		}

	}
);