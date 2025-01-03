(function() {
	// TODO: find a way to support Safari?
	if ("onbeforematch" in document || !CSS.supports("(user-select: none)")) return;

	const sheet = new CSSStyleSheet();
	sheet.replaceSync(`
		:host([hidden="until-found"]) {
			display: revert;
			content-visibility: auto;
			contain: size;
			user-select: none;
			background-clip: initial !important;

			slot {
				color: transparent;
				pointer-events: none;
			}

			::slotted(*) {
				opacity: 0 !important;
			}
		}
	`);

	const hiddenUntilFoundObserver = new MutationObserver(entries => {
		for (const entry of entries) {
			if (entry.type === "attributes" && entry.target.getAttribute("hidden") === "until-found") addShadow(entry.target);
			else if (entry.type === "childList")
				for (const node of entry.addedNodes) if (node.getAttribute?.("hidden") === "until-found") addShadow(node);
		}
	});

	hiddenUntilFoundObserver.observe(document, {
		subtree: true,
		childList: true,
		attributeFilter: ["hidden"],
	});

	document.addEventListener("selectionchange", event => {
		const foundElement = document.getSelection().anchorNode?.parentElement.closest("[hidden=until-found]");

		if (foundElement) {
			// TODO: add `onbeforematch` to `Element`?
			const cancelled = !foundElement.dispatchEvent(
				new Event("beforematch", { bubbles: true })
			);

			if (cancelled) return;

			foundElement.removeAttribute("hidden");
			const slot = foundElement.shadowRoot.querySelector("slot");
			slot.removeAttribute("tabindex");
			slot.removeAttribute("aria-hidden");
		}
	});

	function addShadow(element) {
		if (element.shadowRoot) return;
		// TODO: what do we do if we already have a shadow root??
		element.attachShadow({ mode: "open" });
		// 1. `aria-hidden=true` prevents the content from being exposed to AT.
		// 2. `tabindex=-1` removes any interactive content from the tab order.
		element.shadowRoot.innerHTML = "<slot aria-hidden=true tabindex=-1></slot>";
		element.shadowRoot.adoptedStyleSheets = [sheet];
	}
})();
