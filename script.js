const searchInput = document.querySelector(".search-area input");
const modelsSection = document.querySelector(".models-section");

if (searchInput && modelsSection) {

	const noResults = document.createElement("div");

	noResults.textContent = "No models found";
	noResults.style.display = "none";
	noResults.style.padding = "30px 0";
	noResults.style.fontSize = "16px";
	noResults.style.color = "#999";

	modelsSection.appendChild(noResults);


	searchInput.addEventListener("input", function () {

		const searchText = this.value.trim().toLowerCase();
		const modelCards = modelsSection.querySelectorAll(".model-card");

		let visibleModels = 0;


		modelCards.forEach(function (card) {

			const title = card.querySelector(".model-info h2");
			const type = card.querySelector(".model-type");

			const titleText = title
				? title.textContent.toLowerCase()
				: "";

			const typeText = type
				? type.textContent.toLowerCase()
				: "";


			const matches =
				titleText.includes(searchText) ||
				typeText.includes(searchText);


			if (matches) {
				card.style.display = "";
				visibleModels++;
			} else {
				card.style.display = "none";
			}

		});


		if (visibleModels === 0) {
			noResults.style.display = "";
		} else {
			noResults.style.display = "none";
		}

	});

}