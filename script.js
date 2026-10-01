/* ========================================
   QytModels account system
   ======================================== */

const loginButton = document.getElementById("loginButton");

const profileButton = document.getElementById("profileButton");
const profileName = document.getElementById("profileName");

const profileOverlay = document.getElementById("profileOverlay");
const profilePanel = document.getElementById("profilePanel");
const panelClose = document.getElementById("panelClose");

const panelName = document.getElementById("panelName");
const panelEmail = document.getElementById("panelEmail");

const logoutButton = document.getElementById("logoutButton");
const deleteAccountButton = document.getElementById("deleteAccountButton");

const logoutConfirm = document.getElementById("logoutConfirm");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");


/* ========================================
   Удаление аккаунта
   ======================================== */

const deleteOverlay = document.getElementById("deleteOverlay");

const deleteSteps = document.querySelectorAll(".delete-step");

const deleteCancel1 = document.getElementById("deleteCancel1");

const deleteNext1 = document.getElementById("deleteNext1");
const deleteNext2 = document.getElementById("deleteNext2");
const deleteNext3 = document.getElementById("deleteNext3");
const deleteNext4 = document.getElementById("deleteNext4");
const deleteNext5 = document.getElementById("deleteNext5");

const deleteBack2 = document.getElementById("deleteBack2");
const deleteBack3 = document.getElementById("deleteBack3");
const deleteBack4 = document.getElementById("deleteBack4");
const deleteBack5 = document.getElementById("deleteBack5");
const deleteBack6 = document.getElementById("deleteBack6");

const deletionDocument = document.getElementById("deletionDocument");
const deletionConsent = document.getElementById("deletionConsent");
const deletionConsentArea = document.getElementById("deletionConsentArea");
const consentStatus = document.getElementById("consentStatus");

const deleteUsername = document.getElementById("deleteUsername");
const deleteEmail = document.getElementById("deleteEmail");
const deletePassword = document.getElementById("deletePassword");

const deleteError = document.getElementById("deleteError");

const verifyDelete = document.getElementById("verifyDelete");

const deleteVerifiedName = document.getElementById("deleteVerifiedName");

const deleteFinalCancel = document.getElementById("deleteFinalCancel");
const deleteFinalConfirm = document.getElementById("deleteFinalConfirm");


/* ========================================
   Остальные элементы
   ======================================== */

const profileItem = document.getElementById("profileItem");
const editProfileItem = document.getElementById("editProfileItem");
const myModelsItem = document.getElementById("myModelsItem");
const favoritesItem = document.getElementById("favoritesItem");
const settingsItem = document.getElementById("settingsItem");

const authModal = document.getElementById("authModal");
const closeAuth = document.getElementById("closeAuth");

const loginScreen = document.getElementById("loginScreen");
const registerEmailScreen = document.getElementById("registerEmailScreen");
const registerVerifyScreen = document.getElementById("registerVerifyScreen");
const registerVerifiedScreen = document.getElementById("registerVerifiedScreen");
const registerDetailsScreen = document.getElementById("registerDetailsScreen");

const authMessage = document.getElementById("authMessage");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerPasswordConfirm = document.getElementById("registerPasswordConfirm");

const loginSubmit = document.getElementById("loginSubmit");

const registerEmailContinue =
	document.getElementById("registerEmailContinue");

const checkVerification =
	document.getElementById("checkVerification");

const resendVerification =
	document.getElementById("resendVerification");

const changeEmail =
	document.getElementById("changeEmail");

const verifiedContinue =
	document.getElementById("verifiedContinue");

const registerSubmit =
	document.getElementById("registerSubmit");

const verificationEmail =
	document.getElementById("verificationEmail");

const toast = document.getElementById("toast");


/* ========================================
   Данные аккаунтов
   ======================================== */

function getAccounts() {

	return JSON.parse(
		localStorage.getItem("qytmodels-accounts") || "[]"
	);

}


function saveAccounts(accounts) {

	localStorage.setItem(
		"qytmodels-accounts",
		JSON.stringify(accounts)
	);

}


function getCurrentUser() {

	return localStorage.getItem(
		"qytmodels-current-user"
	);

}


function setCurrentUser(email) {

	localStorage.setItem(
		"qytmodels-current-user",
		email
	);

}


function removeCurrentUser() {

	localStorage.removeItem(
		"qytmodels-current-user"
	);

}


/* ========================================
   Хеширование пароля
   ======================================== */

async function hashPassword(password) {

	const encoder = new TextEncoder();

	const data = encoder.encode(password);

	const hashBuffer =
		await crypto.subtle.digest("SHA-256", data);

	const hashArray =
		Array.from(new Uint8Array(hashBuffer));

	return hashArray
		.map(byte => byte.toString(16).padStart(2, "0"))
		.join("");

}


/* ========================================
   Авторизация
   ======================================== */

function openAuth(mode = "login") {

	authModal.classList.add("visible");

	authMessage.textContent = "";

	if (mode === "register") {

		showRegisterForm();

	} else {

		showLoginForm();

	}

}


function closeAuthWindow() {

	authModal.classList.remove("visible");

	authMessage.textContent = "";

	resetRegistrationFlow();

}


function showLoginForm() {

	loginScreen.classList.remove("hidden");

	registerEmailScreen.classList.add("hidden");
	registerVerifyScreen.classList.add("hidden");
	registerVerifiedScreen.classList.add("hidden");
	registerDetailsScreen.classList.add("hidden");

	authMessage.textContent = "";

	loginEmail.focus();

}


function showRegisterForm() {

	loginScreen.classList.add("hidden");

	registerEmailScreen.classList.remove("hidden");
	registerVerifyScreen.classList.add("hidden");
	registerVerifiedScreen.classList.add("hidden");
	registerDetailsScreen.classList.add("hidden");

	authMessage.textContent = "";

	registerEmail.focus();

}


/* ========================================
   Регистрация — состояние
   ======================================== */

let registrationEmail = "";

let registrationVerified = false;


/* ========================================
   Сброс регистрации
   ======================================== */

function resetRegistrationFlow() {

	registrationEmail = "";

	registrationVerified = false;

	registerEmail.value = "";
	registerName.value = "";
	registerPassword.value = "";
	registerPasswordConfirm.value = "";

	if (verificationEmail) {
		verificationEmail.textContent = "";
	}

	registerEmailScreen.classList.remove("hidden");

	registerVerifyScreen.classList.add("hidden");

	registerVerifiedScreen.classList.add("hidden");

	registerDetailsScreen.classList.add("hidden");

}


/* ========================================
   Регистрация — Email
   ======================================== */

registerEmailContinue.addEventListener("click", () => {

	const email =
		registerEmail.value.trim().toLowerCase();

	if (!email) {

		showAuthError(
			"Please enter your email address."
		);

		return;

	}

	if (!email.includes("@") || !email.includes(".")) {

		showAuthError(
			"Please enter a valid email."
		);

		return;

	}


	const accounts = getAccounts();

	const existingAccount = accounts.find(account => {

		return account.email === email;

	});


	if (existingAccount) {

		showAuthError(
			"An account with this email already exists."
		);

		return;

	}


	registrationEmail = email;

	registrationVerified = false;

	verificationEmail.textContent =
		registrationEmail;


	authMessage.textContent = "";


	registerEmailScreen.classList.add("hidden");

	registerVerifyScreen.classList.remove("hidden");

	registerVerifiedScreen.classList.add("hidden");

	registerDetailsScreen.classList.add("hidden");

});


/* ========================================
   Повторная отправка
   Пока только визуальная заглушка
   ======================================== */

resendVerification.addEventListener("click", () => {

	if (!registrationEmail) {
		return;
	}

	showToast(
		"Verification email resent."
	);

});


/* ========================================
   Изменить Email
   ======================================== */

changeEmail.addEventListener("click", () => {

	registerVerifyScreen.classList.add("hidden");

	registerEmailScreen.classList.remove("hidden");

	authMessage.textContent = "";

	registerEmail.value =
		registrationEmail;

	registerEmail.focus();

});


/* ========================================
   Проверка Email
   Пока имитация настоящей ссылки
   ======================================== */

checkVerification.addEventListener("click", () => {

	if (!registrationEmail) {

		showAuthError(
			"Please enter your email first."
		);

		return;

	}


	registrationVerified = true;

	authMessage.textContent = "";


	registerVerifyScreen.classList.add("hidden");

	registerVerifiedScreen.classList.remove("hidden");

	registerDetailsScreen.classList.add("hidden");

});


/* ========================================
   Email подтвержден
   ======================================== */

verifiedContinue.addEventListener("click", () => {

	if (!registrationVerified) {
		return;
	}


	registerVerifiedScreen.classList.add("hidden");

	registerDetailsScreen.classList.remove("hidden");

	authMessage.textContent = "";

	registerName.focus();

});


/* ========================================
   Финальная регистрация
   ======================================== */

registerSubmit.addEventListener("click", async () => {

	const name =
		registerName.value.trim();

	const password =
		registerPassword.value;

	const confirmPassword =
		registerPasswordConfirm.value;

	const email =
		registrationEmail;


	if (!registrationVerified) {

		showAuthError(
			"Please verify your email first."
		);

		return;

	}


	if (!name || !email || !password || !confirmPassword) {

		showAuthError(
			"Please fill in all fields."
		);

		return;

	}


	if (name.length < 3) {

		showAuthError(
			"Username must contain at least 3 characters."
		);

		return;

	}


	if (!email.includes("@") || !email.includes(".")) {

		showAuthError(
			"Please enter a valid email."
		);

		return;

	}


	if (password.length < 6) {

		showAuthError(
			"Password must contain at least 6 characters."
		);

		return;

	}


	if (password !== confirmPassword) {

		showAuthError(
			"Passwords do not match."
		);

		return;

	}


	const accounts = getAccounts();


	const existingEmail = accounts.find(account => {

		return account.email === email;

	});


	if (existingEmail) {

		showAuthError(
			"An account with this email already exists."
		);

		return;

	}


	const existingUsername = accounts.find(account => {

		return account.name.toLowerCase() === name.toLowerCase();

	});


	if (existingUsername) {

		showAuthError(
			"This username is already taken."
		);

		return;

	}


	const passwordHash =
		await hashPassword(password);


	const newAccount = {

		name: name,

		email: email,

		password: passwordHash,

		emailVerified: true,

		createdAt: new Date().toISOString()

	};


	accounts.push(newAccount);

	saveAccounts(accounts);

	setCurrentUser(email);


	registerName.value = "";

	registerEmail.value = "";

	registerPassword.value = "";

	registerPasswordConfirm.value = "";


	closeAuthWindow();

	updateAccountUI();

	updateModelInteractions();


	showToast(
		"Account created successfully."
	);

});


/* ========================================
   Вход
   ======================================== */

loginSubmit.addEventListener("click", async () => {

	const email =
		loginEmail.value.trim().toLowerCase();

	const password =
		loginPassword.value;


	if (!email || !password) {

		showAuthError(
			"Please enter your email and password."
		);

		return;

	}


	const accounts = getAccounts();


	const account = accounts.find(item => {

		return item.email === email;

	});


	if (!account) {

		showAuthError(
			"Account not found."
		);

		return;

	}


	const passwordHash =
		await hashPassword(password);


	if (passwordHash !== account.password) {

		showAuthError(
			"Incorrect password."
		);

		return;

	}


	setCurrentUser(email);


	loginEmail.value = "";

	loginPassword.value = "";


	closeAuthWindow();

	updateAccountUI();

	updateModelInteractions();


	showToast(
		"Welcome back, " + account.name + "."
	);

});


/* ========================================
   Панель профиля
   ======================================== */

function openProfilePanel() {

	const currentUser = getCurrentUser();

	if (!currentUser) {
		return;
	}

	profilePanel.classList.add("visible");

	profileOverlay.classList.add("visible");

}


function closeProfilePanel() {

	profilePanel.classList.remove("visible");

	profileOverlay.classList.remove("visible");

}


profileButton.addEventListener("click", () => {

	openProfilePanel();

});


panelClose.addEventListener("click", () => {

	closeProfilePanel();

});


profileOverlay.addEventListener("click", () => {

	closeProfilePanel();

});


/* ========================================
   LOG IN
   ======================================== */

loginButton.addEventListener("click", () => {

	openAuth("login");

});


/* ========================================
   LOG OUT
   ======================================== */

logoutButton.addEventListener("click", () => {

	closeProfilePanel();

	logoutConfirm.classList.add("visible");

});


cancelLogout.addEventListener("click", () => {

	logoutConfirm.classList.remove("visible");

});


confirmLogout.addEventListener("click", () => {

	removeCurrentUser();

	logoutConfirm.classList.remove("visible");

	updateAccountUI();

	updateModelInteractions();

	showToast(
		"You have been logged out."
	);

});


logoutConfirm.addEventListener("click", event => {

	if (event.target === logoutConfirm) {

		logoutConfirm.classList.remove("visible");

	}

});


/* ========================================
   ОТКРЫТИЕ УДАЛЕНИЯ
   ======================================== */

deleteAccountButton.addEventListener("click", () => {

	closeProfilePanel();

	openDeleteAccount();

});


function openDeleteAccount() {

	resetDeleteForm();

	deleteOverlay.classList.add("visible");

	showDeleteStep(1);

}


function closeDeleteAccount() {

	deleteOverlay.classList.remove("visible");

	resetDeleteForm();

}


function showDeleteStep(number) {

	deleteSteps.forEach(step => {

		step.classList.remove("active");

	});


	const targetStep =
		document.getElementById(
			"deleteStep" + number
		);


	if (targetStep) {

		targetStep.classList.add("active");

	}


	deleteOverlay.scrollTop = 0;


	const modal =
		document.querySelector(".delete-modal");


	if (modal) {

		modal.scrollTop = 0;

	}


	if (number === 5) {

		resetDeletionTerms();

	}

}


/* ========================================
   Сброс удаления
   ======================================== */

function resetDeleteForm() {

	deleteUsername.value = "";

	deleteEmail.value = "";

	deletePassword.value = "";

	deleteError.textContent = "";

	deleteVerifiedName.textContent = "";

	resetDeletionTerms();

	showDeleteStep(1);

}


/* ========================================
   Документ удаления
   ======================================== */

function resetDeletionTerms() {

	if (!deletionDocument) {
		return;
	}


	deletionDocument.scrollTop = 0;

	deletionConsent.checked = false;

	deletionConsent.disabled = true;

	deletionConsentArea.classList.remove("ready");

	consentStatus.textContent =
		"Scroll to the bottom to continue.";

	deleteNext5.disabled = true;

	deleteNext5.classList.add(
		"disabled-button"
	);

}


/* ========================================
   Отслеживание прокрутки документа
   ======================================== */

deletionDocument.addEventListener("scroll", () => {

	const scrollTop =
		deletionDocument.scrollTop;

	const visibleHeight =
		deletionDocument.clientHeight;

	const totalHeight =
		deletionDocument.scrollHeight;

	const distanceFromBottom =
		totalHeight -
		(scrollTop + visibleHeight);


	if (distanceFromBottom <= 8) {

		deletionConsent.disabled = false;

		deletionConsentArea.classList.add(
			"ready"
		);

		consentStatus.textContent =
			"You have reached the end. You can now confirm.";

	} else {

		deletionConsent.disabled = true;

		deletionConsentArea.classList.remove(
			"ready"
		);

		deletionConsent.checked = false;

		consentStatus.textContent =
			"Scroll to the bottom to continue.";

		deleteNext5.disabled = true;

		deleteNext5.classList.add(
			"disabled-button"
		);

	}

});


/* ========================================
   Согласие с текстом
   ======================================== */

deletionConsent.addEventListener("change", () => {

	if (
		!deletionConsent.disabled &&
		deletionConsent.checked
	) {

		deleteNext5.disabled = false;

		deleteNext5.classList.remove(
			"disabled-button"
		);

		consentStatus.textContent =
			"Confirmation received. You may continue.";

	} else {

		deleteNext5.disabled = true;

		deleteNext5.classList.add(
			"disabled-button"
		);

	}

});


/* ========================================
   Шаг 1
   ======================================== */

deleteCancel1.addEventListener("click", () => {

	closeDeleteAccount();

});


deleteNext1.addEventListener("click", () => {

	showDeleteStep(2);

});


/* ========================================
   Шаг 2
   ======================================== */

deleteBack2.addEventListener("click", () => {

	showDeleteStep(1);

});


deleteNext2.addEventListener("click", () => {

	showDeleteStep(3);

});


/* ========================================
   Шаг 3
   ======================================== */

deleteBack3.addEventListener("click", () => {

	showDeleteStep(2);

});


deleteNext3.addEventListener("click", () => {

	showDeleteStep(4);

});


/* ========================================
   Шаг 4
   ======================================== */

deleteBack4.addEventListener("click", () => {

	showDeleteStep(3);

});


deleteNext4.addEventListener("click", () => {

	showDeleteStep(5);

});


/* ========================================
   Шаг 5 — документ
   ======================================== */

deleteBack5.addEventListener("click", () => {

	resetDeletionTerms();

	showDeleteStep(4);

});


deleteNext5.addEventListener("click", () => {

	if (
		deletionConsent.disabled ||
		!deletionConsent.checked
	) {

		return;

	}


	showDeleteStep(6);

	deleteUsername.focus();

});


/* ========================================
   Шаг 6 — проверка аккаунта
   ======================================== */

deleteBack6.addEventListener("click", () => {

	deleteError.textContent = "";

	showDeleteStep(5);

});


verifyDelete.addEventListener("click", async () => {

	const currentUser =
		getCurrentUser();


	if (!currentUser) {

		deleteError.textContent =
			"You are no longer logged in. Please close this window.";

		return;

	}


	const username =
		deleteUsername.value.trim();

	const email =
		deleteEmail.value.trim().toLowerCase();

	const password =
		deletePassword.value;


	if (!username || !email || !password) {

		deleteError.textContent =
			"Please enter your username, email and password.";

		return;

	}


	const accounts = getAccounts();


	const account = accounts.find(item => {

		return item.email === currentUser;

	});


	if (!account) {

		deleteError.textContent =
			"Your account could not be found.";

		return;

	}


	if (username !== account.name) {

		deleteError.textContent =
			"The username does not match your account.";

		return;

	}


	if (email !== account.email) {

		deleteError.textContent =
			"The email does not match your account.";

		return;

	}


	const passwordHash =
		await hashPassword(password);


	if (passwordHash !== account.password) {

		deleteError.textContent =
			"The password is incorrect.";

		return;

	}


	deleteError.textContent = "";

	deleteVerifiedName.textContent =
		"Username: " + account.name;


	showDeleteStep(7);

});


/* ========================================
   Шаг 7 — последнее подтверждение
   ======================================== */

deleteFinalCancel.addEventListener("click", () => {

	closeDeleteAccount();

});


deleteFinalConfirm.addEventListener("click", () => {

	const currentUser =
		getCurrentUser();


	if (!currentUser) {

		closeDeleteAccount();

		showToast(
			"No account is currently logged in."
		);

		return;

	}


	const accounts =
		getAccounts();


	const updatedAccounts =
		accounts.filter(account => {

			return account.email !== currentUser;

		});


	saveAccounts(updatedAccounts);


	const keysToDelete = [];


	for (
		let i = 0;
		i < localStorage.length;
		i++
	) {

		const key =
			localStorage.key(i);


		if (!key) {
			continue;
		}


		if (
			key.startsWith(
				"qytmodels-like-" +
				currentUser +
				"-"
			) ||
			key.startsWith(
				"qytmodels-rating-" +
				currentUser +
				"-"
			)
		) {

			keysToDelete.push(key);

		}

	}


	keysToDelete.forEach(key => {

		localStorage.removeItem(key);

	});


	removeCurrentUser();

	closeDeleteAccount();

	updateAccountUI();

	updateModelInteractions();


	showToast(
		"Your QytModels account has been deleted."
	);

});


/* ========================================
   Закрытие удаления по фону
   ======================================== */

deleteOverlay.addEventListener("click", event => {

	if (event.target === deleteOverlay) {

		closeDeleteAccount();

	}

});


/* ========================================
   Неактивные пункты меню
   ======================================== */

profileItem.addEventListener("click", () => {

	showToast(
		"Profile is coming soon."
	);

});


editProfileItem.addEventListener("click", () => {

	showToast(
		"Edit Profile is coming soon."
	);

});


myModelsItem.addEventListener("click", () => {

	showToast(
		"My Models is coming soon."
	);

});


favoritesItem.addEventListener("click", () => {

	showToast(
		"Favorites is coming soon."
	);

});


settingsItem.addEventListener("click", () => {

	showToast(
		"Settings is coming soon."
	);

});


/* ========================================
   Переключение Login / Register
   ======================================== */

showRegister.addEventListener("click", () => {

	showRegisterForm();

});


showLogin.addEventListener("click", () => {

	showLoginForm();

});


/* ========================================
   Закрытие авторизации
   ======================================== */

closeAuth.addEventListener("click", () => {

	closeAuthWindow();

});


authModal.addEventListener("click", event => {

	if (event.target === authModal) {

		closeAuthWindow();

	}

});


/* ========================================
   Сообщения
   ======================================== */

function showAuthError(message) {

	authMessage.textContent = message;

}


function showToast(message) {

	toast.textContent = message;

	toast.classList.add("visible");


	setTimeout(() => {

		toast.classList.remove("visible");

	}, 2500);

}


/* ========================================
   Интерфейс аккаунта
   ======================================== */

function updateAccountUI() {

	const currentUser =
		getCurrentUser();


	if (!currentUser) {

		loginButton.style.display = "block";

		profileButton.classList.remove(
			"visible"
		);

		profileName.textContent = "";

		return;

	}


	const accounts =
		getAccounts();


	const account = accounts.find(item => {

		return item.email === currentUser;

	});


	if (!account) {

		removeCurrentUser();

		loginButton.style.display = "block";

		profileButton.classList.remove(
			"visible"
		);

		return;

	}


	loginButton.style.display = "none";

	profileButton.classList.add(
		"visible"
	);

	profileName.textContent =
		account.name;

	panelName.textContent =
		account.name;

	panelEmail.textContent =
		account.email;

}


/* ========================================
   Лайки
   ======================================== */

const likeButtons =
	document.querySelectorAll(".like-button");


function getUserLikeKey(model) {

	const currentUser =
		getCurrentUser();


	if (!currentUser) {

		return null;

	}


	return (
		"qytmodels-like-" +
		currentUser +
		"-" +
		model
	);

}


function updateLikeButtons() {

	const currentUser =
		getCurrentUser();


	likeButtons.forEach(button => {

		const model =
			button.dataset.model;


		if (!currentUser) {

			button.textContent = "♡ 0";

			button.classList.remove(
				"liked"
			);

			return;

		}


		const savedLike =
			localStorage.getItem(
				"qytmodels-like-" +
				currentUser +
				"-" +
				model
			);


		if (savedLike === "true") {

			button.classList.add(
				"liked"
			);

			button.textContent = "♥ 1";

		} else {

			button.classList.remove(
				"liked"
			);

			button.textContent = "♡ 0";

		}

	});

}


likeButtons.forEach(button => {

	button.addEventListener("click", () => {

		const currentUser =
			getCurrentUser();


		if (!currentUser) {

			showToast(
				"Log in to like this model."
			);

			openAuth("login");

			return;

		}


		const model =
			button.dataset.model;

		const key =
			getUserLikeKey(model);


		const isLiked =
			localStorage.getItem(key) === "true";


		if (isLiked) {

			localStorage.setItem(
				key,
				"false"
			);

			button.classList.remove(
				"liked"
			);

			button.textContent = "♡ 0";

		} else {

			localStorage.setItem(
				key,
				"true"
			);

			button.classList.add(
				"liked"
			);

			button.textContent = "♥ 1";

		}

	});

});


/* ========================================
   Рейтинг
   ======================================== */

const ratings =
	document.querySelectorAll(".rating");


function updateStars(stars, value) {

	stars.forEach(star => {

		const starValue =
			Number(star.dataset.value);


		if (starValue <= value) {

			star.classList.add("active");

		} else {

			star.classList.remove("active");

		}

	});

}


function getRatingText(value) {

	switch (value) {

		case 1:
			return "1 / 5 — Poor";

		case 2:
			return "2 / 5 — Fair";

		case 3:
			return "3 / 5 — Good";

		case 4:
			return "4 / 5 — Great";

		case 5:
			return "5 / 5 — Excellent";

		default:
			return "No rating";

	}

}


function updateRatings() {

	const currentUser =
		getCurrentUser();


	ratings.forEach(rating => {

		const model =
			rating.dataset.model;

		const stars =
			rating.querySelectorAll(
				".star"
			);

		const ratingValue =
			rating.querySelector(
				".rating-value"
			);


		if (!currentUser) {

			updateStars(stars, 0);

			ratingValue.textContent =
				"No rating";

			rating.classList.remove(
				"has-rating"
			);

			return;

		}


		const savedRating =
			localStorage.getItem(
				"qytmodels-rating-" +
				currentUser +
				"-" +
				model
			);


		if (savedRating) {

			const value =
				Number(savedRating);


			updateStars(
				stars,
				value
			);

			ratingValue.textContent =
				value + " / 5";

			rating.classList.add(
				"has-rating"
			);

		} else {

			updateStars(
				stars,
				0
			);

			ratingValue.textContent =
				"No rating";

			rating.classList.remove(
				"has-rating"
			);

		}

	});

}


ratings.forEach(rating => {

	const stars =
		rating.querySelectorAll(
			".star"
		);

	const ratingValue =
		rating.querySelector(
			".rating-value"
		);


	stars.forEach(star => {

		star.addEventListener(
			"mouseenter",
			() => {

				const value =
					Number(
						star.dataset.value
					);


				updateStars(
					stars,
					value
				);

				ratingValue.textContent =
					getRatingText(value);

			}
		);


		star.addEventListener(
			"click",
			() => {

				const currentUser =
					getCurrentUser();


				if (!currentUser) {

					showToast(
						"Log in to rate this model."
					);

					openAuth("login");

					return;

				}


				const value =
					Number(
						star.dataset.value
					);


				localStorage.setItem(
					"qytmodels-rating-" +
					currentUser +
					"-" +
					rating.dataset.model,
					value
				);


				updateStars(
					stars,
					value
				);

				ratingValue.textContent =
					value + " / 5";

				rating.classList.add(
					"has-rating"
				);


				showToast(
					"Your rating has been saved."
				);

			}
		);

	});


	rating.addEventListener(
		"mouseleave",
		() => {

			const currentUser =
				getCurrentUser();


			if (!currentUser) {

				updateStars(
					stars,
					0
				);

				ratingValue.textContent =
					"No rating";

				return;

			}


			const savedRating =
				localStorage.getItem(
					"qytmodels-rating-" +
					currentUser +
					"-" +
					rating.dataset.model
				);


			if (savedRating) {

				const value =
					Number(savedRating);


				updateStars(
					stars,
					value
				);

				ratingValue.textContent =
					value + " / 5";

			} else {

				updateStars(
					stars,
					0
				);

				ratingValue.textContent =
					"No rating";

			}

		}
	);

});


/* ========================================
   Обновление взаимодействий
   ======================================== */

function updateModelInteractions() {

	updateLikeButtons();

	updateRatings();

}


/* ========================================
   Запуск
   ======================================== */

updateAccountUI();

updateModelInteractions();