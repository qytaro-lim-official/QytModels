function applySpecialTags() {

	const usernameElement =
		document.querySelector(
			".account-username"
		);

	if (!usernameElement) {
		return;
	}

	const username =
		usernameElement.textContent.trim();

	if (username === "Qytaro_lim") {

		usernameElement.classList.add(
			"rainbow-name"
		);

		if (
			!usernameElement.querySelector(
				".dev-badge"
			)
		) {

			const badge =
				document.createElement(
					"span"
				);

			badge.className =
				"dev-badge";

			badge.textContent =
				"DEV";

			usernameElement.appendChild(
				badge
			);

		}

	}

}

setInterval(
	applySpecialTags,
	500
);