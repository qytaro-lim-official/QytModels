const DEV_ID =
	"675b6dcd-5bf1-44e4-9d41-db336f36f467";


async function applySpecialTags() {

	const usernameElement =
		document.querySelector(
			".account-username"
		);


	if (!usernameElement) {
		return;
	}


	try {

		const {
			data
		} =
		await supabaseClient.auth.getUser();


		if (
			!data ||
			!data.user
		) {
			return;
		}


		if (
			data.user.id !== DEV_ID
		) {
			return;
		}


		if (
			usernameElement.querySelector(
				".dev-badge"
			)
		) {
			return;
		}


		const badge =
			document.createElement(
				"span"
			);


		badge.className =
			"dev-badge";


		badge.textContent =
			"Q DEV";


		usernameElement.appendChild(
			badge
		);

	} catch (error) {

		console.error(
			"Tag error:",
			error
		);

	}

}


/* ==================== */
/* WATCH ACCOUNT */
/* ==================== */

const accountObserver =
	new MutationObserver(
		function () {

			applySpecialTags();

		}
	);


const accountButtonElement =
	document.getElementById(
		"accountButton"
	);


if (accountButtonElement) {

	accountObserver.observe(
		accountButtonElement,
		{
			childList: true,
			subtree: true
		}
	);

}


/* ==================== */
/* AUTH CHANGES */
/* ==================== */

supabaseClient.auth.onAuthStateChange(
	function () {

		setTimeout(
			function () {

				applySpecialTags();

			},
			100
		);

	}
);


/* ==================== */
/* FIRST CHECK */
/* ==================== */

setTimeout(
	function () {

		applySpecialTags();

	},
	500
);