const SUPABASE_URL =
	"https://dyvizqfvmfzivrrmfabu.supabase.co";

const SUPABASE_KEY =
	"sb_publishable_QrWLpoT4DON8dMTgIKGKsA_O6ear-pV";


const supabase =
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

			/*
				Find the profile by username.
			*/

			const {
				data: profile,
				error: profileError
			} =
			await supabase
				.from("profiles")
				.select("username")
				.eq(
					"username",
					username
				)
				.maybeSingle();


			if (profileError) {

				showLoginMessage(
					"Could not find the account."
				);

				console.error(
					profileError
				);

				return;

			}


			if (!profile) {

				showLoginMessage(
					"Username not found."
				);

				return;

			}


			const fakeEmail =
				username.toLowerCase() +
				"@qytmodels.local";


			const {
				error: loginError
			} =
			await supabase.auth.signInWithPassword({

				email:
					fakeEmail,

				password:
					password

			});


			if (loginError) {

				showLoginMessage(
					"Incorrect username or password."
				);

				console.error(
					loginError
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
			await supabase
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
			await supabase.auth.signUp({

				email:
					fakeEmail,

				password:
					password

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


			/* ==================== */
			/* SAVE PROFILE */
			/* ==================== */

			if (
				!data.user
			) {

				showRegisterMessage(
					"Account could not be created."
				);

				return;

			}


			const {
				error: profileInsertError
			} =
			await supabase
				.from("profiles")
				.insert({

					id:
						data.user.id,

					username:
						username

				});


			if (profileInsertError) {

				console.error(
					profileInsertError
				);


				/*
					If the database rejected the
					username because it already exists,
					show a clear message.
				*/

				if (
					profileInsertError.code ===
					"23505"
				) {

					showRegisterMessage(
						"That username is already taken."
					);

				} else {

					showRegisterMessage(
						"Account was created, but the profile could not be saved."
					);

				}


				return;

			}


			/* ==================== */
			/* SUCCESS */
/* ==================== */

			localStorage.setItem(
				"qytmodels_username",
				username
			);


			showRegisterMessage(
				"Account created successfully!"
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