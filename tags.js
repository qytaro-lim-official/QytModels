const DEV_ID =
	"675b6dcd-5bf1-44e4-9d41-db336f36f467";


const TESTER_ID =
	"ac7d0fed-5b94-4060-80ad-ef33d09c01a0";


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


		/* ==================== */
		/* OWNER */
		/* ==================== */

		if (
			data.user.id === DEV_ID
		) {

			usernameElement.classList.remove(
				"tester-name"
			);

			usernameElement.classList.add(
				"rainbow-name"
			);


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
				"OWNER";


			usernameElement.appendChild(
				badge
			);


			return;

		}


		/* ==================== */
		/* TESTER */
		/* ==================== */

		if (
			data.user.id === TESTER_ID
		) {

			usernameElement.classList.remove(
				"rainbow-name"
			);

			usernameElement.classList.add(
				"tester-name"
			);


			if (
				usernameElement.querySelector(
					".tester-badge"
				)
			) {
				return;
			}


			const badge =
				document.createElement(
					"span"
				);


			badge.className =
				"tester-badge";


			badge.textContent =
				"TESTER";


			usernameElement.appendChild(
				badge
			);

		}

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