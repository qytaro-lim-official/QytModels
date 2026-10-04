/* ==================== */
/* DELETE ACCOUNT SYSTEM */
/* ==================== */

const accountMenuElement =
	document.getElementById(
		"accountMenu"
	);


/* ==================== */
/* CREATE DELETE SYSTEM */
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


/* ==================== */
/* STEP 4 SCROLL EVENTS */
/* ==================== */

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


/* ==================== */
/* STEP 4 CHECKBOX */
/* ==================== */

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