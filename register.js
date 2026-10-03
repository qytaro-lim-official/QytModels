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
/* ELEMENTS */
/* ==================== */

const loginTab =
	document.getElementById(
		"loginTab"
	);

const registerTab =
	document.getElementById(
		"registerTab"
	);


const loginFormContainer =
	document.getElementById(
		"loginFormContainer"
	);

const registerFormContainer =
	document.getElementById(
		"registerFormContainer"
	);


const loginForm =
	document.getElementById(
		"loginForm"
	);

const registerForm =
	document.getElementById(
		"registerForm"
	);


const loginMessage =
	document.getElementById(
		"loginMessage"
	);

const registerMessage =
	document.getElementById(
		"registerMessage"
	);


let switchingForm = false;


/* ==================== */
/* FORM SWITCHING */
/* ==================== */

function switchForm(
	currentForm,
	nextForm,
	currentTab,
	nextTab
) {

	if (switchingForm) {
		return;
	}


	if (
		currentForm ===
		nextForm
	) {
		return;
	}


	switchingForm = true;


	currentTab.classList.remove(
		"active"
	);

	currentForm.classList.remove(
		"active"
	);

	currentForm.classList.add(
		"hiding"
	);


	setTimeout(
		function() {

			currentForm.classList.remove(
				"hiding"
			);

			nextTab.classList.add(
				"active"
			);

			nextForm.classList.add(
				"active"
			);

			switchingForm = false;

		},
		350
	);

}


loginTab.addEventListener(
	"click",
	function() {

		switchForm(
			registerFormContainer,
			loginFormContainer,
			registerTab,
			loginTab
		);

	}
);


registerTab.addEventListener(
	"click",
	function() {

		switchForm(
			loginFormContainer,
			registerFormContainer,
			loginTab,
			registerTab
		);

	}
);


/* ==================== */
/* MESSAGES */
/* ==================== */

function showLoginMessage(
	message
) {

	loginMessage.textContent =
		message;

}


function showRegisterMessage(
	message
) {

	registerMessage.textContent =
		message;

}


/* ==================== */
/* LOGIN */
/* ==================== */

loginForm.addEventListener(
	"submit",
	async function(event) {

		event.preventDefault();


		showLoginMessage(
			""
		);


		const username =
			document.getElementById(
				"loginUsername"
			).value.trim();


		const password =
			document.getElementById(
				"loginPassword"
			).value;


		if (!username) {

			showLoginMessage(
				"Please enter your username."
			);

			return;

		}


		if (!password) {

			showLoginMessage(
				"Please enter your password."
			);

			return;

		}


		showLoginMessage(
			"Logging in..."
		);


		try {

			/* ==================== */
			/* FIND PROFILE */
			/* ==================== */

			const {
				data: profile,
				error: profileError
			} =
			await supabaseClient
				.from("profiles")
				.select("username")
				.eq(
					"username",
					username
				)
				.maybeSingle();


			if (profileError) {

				console.error(
					profileError
				);

				showLoginMessage(
					"Could not find the account."
				);

				return;

			}


			if (!profile) {

				showLoginMessage(
					"Username not found."
				);

				return;

			}


			/* ==================== */
			/* LOGIN TO SUPABASE */
			/* ==================== */

			const fakeEmail =
				username.toLowerCase() +
				"@qytmodels.local";


			const {
				data,
				error: loginError
			} =
			await supabaseClient.auth.signInWithPassword({

				email:
					fakeEmail,

				password:
					password

			});


			if (loginError) {

				console.error(
					loginError
				);

				showLoginMessage(
					"Incorrect username or password."
				);

				return;

			}


			if (!data.session) {

				showLoginMessage(
					"Login session could not be created."
				);

				return;

			}


			localStorage.setItem(
				"qytmodels_username",
				username
			);


			showLoginMessage(
				"Logged in successfully!"
			);


			setTimeout(
				function() {

					window.location.href =
						"index.html";

				},
				500
			);

		} catch (error) {

			console.error(
				error
			);

			showLoginMessage(
				"Something went wrong."
			);

		}

	}
);


/* ==================== */
/* CREATE ACCOUNT */
/* ==================== */

registerForm.addEventListener(
	"submit",
	async function(event) {

		event.preventDefault();


		showRegisterMessage(
			""
		);


		const username =
			document.getElementById(
				"username"
			).value.trim();


		const password =
			document.getElementById(
				"password"
			).value;


		const confirmPassword =
			document.getElementById(
				"confirmPassword"
			).value;


		const notRobot =
			document.getElementById(
				"notRobot"
			);


		/* ==================== */
		/* BASIC VALIDATION */
		/* ==================== */

		if (!username) {

			showRegisterMessage(
				"Please enter a username."
			);

			return;

		}


		if (username.length < 3) {

			showRegisterMessage(
				"Username must be at least 3 characters."
			);

			return;

		}


		if (username.length > 30) {

			showRegisterMessage(
				"Username must be 30 characters or less."
			);

			return;

		}


		if (!/^[a-zA-Z0-9_]+$/.test(username)) {

			showRegisterMessage(
				"Username can only contain letters, numbers and underscores."
			);

			return;

		}


		if (!password) {

			showRegisterMessage(
				"Please enter a password."
			);

			return;

		}


		if (password.length < 6) {

			showRegisterMessage(
				"Password must be at least 6 characters."
			);

			return;

		}


		if (
			password !==
			confirmPassword
		) {

			showRegisterMessage(
				"Passwords do not match."
			);

			return;

		}


		if (!notRobot.checked) {

			showRegisterMessage(
				"Please confirm that you are not a robot."
			);

			return;

		}


		showRegisterMessage(
			"Creating account..."
		);


		try {

			/* ==================== */
			/* CHECK USERNAME */
			/* ==================== */

			const {
				data: existingProfile,
				error: profileCheckError
			} =
			await supabaseClient
				.from("profiles")
				.select("username")
				.eq(
					"username",
					username
				)
				.maybeSingle();


			if (profileCheckError) {

				console.error(
					profileCheckError
				);

				showRegisterMessage(
					"Could not check username."
				);

				return;

			}


			if (existingProfile) {

				showRegisterMessage(
					"That username is already taken."
				);

				return;

			}


			/* ==================== */
			/* CREATE AUTH ACCOUNT */
			/* ==================== */

			const fakeEmail =
				username.toLowerCase() +
				"@qytmodels.local";


			const {
				data,
				error
			} =
			await supabaseClient.auth.signUp({

				email:
					fakeEmail,

				password:
					password,

				options: {

					data: {

						username:
							username

					}

				}

			});


			if (error) {

				console.error(
					error
				);


				if (
					error.message
						.toLowerCase()
						.includes("already")
				) {

					showRegisterMessage(
						"That username is already taken."
					);

				} else {

					showRegisterMessage(
						error.message
					);

				}


				return;

			}


			if (!data.user) {

				showRegisterMessage(
					"Account could not be created."
				);

				return;

			}


			/* ==================== */
			/* ENSURE SESSION */
			/* ==================== */

			let session =
				data.session;


			if (!session) {

				const {
					data: loginData,
					error: loginError
				} =
				await supabaseClient.auth.signInWithPassword({

					email:
						fakeEmail,

					password:
						password

				});


				if (loginError) {

					console.error(
						loginError
					);

					showRegisterMessage(
						"Account was created, but automatic login failed."
					);

					return;

				}


				session =
					loginData.session;

			}


			if (!session) {

				showRegisterMessage(
					"Account was created, but no login session was created."
				);

				return;

			}


			/* ==================== */
			/* PROFILE IS CREATED */
			/* ==================== */

			showRegisterMessage(
				"Account created successfully!"
			);


			localStorage.setItem(
				"qytmodels_username",
				username
			);


			setTimeout(
				function() {

					window.location.href =
						"index.html";

				},
				700
			);

		} catch (error) {

			console.error(
				error
			);


			showRegisterMessage(
				"Something went wrong while creating the account."
			);

		}

	}
);


/* ==================== */
/* INITIAL STATE */
/* ==================== */

loginFormContainer.classList.add(
	"active"
);

loginTab.classList.add(
	"active"
);