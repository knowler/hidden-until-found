(function() {
	// TODO: find a way to support Safari?
	if ("onbeforematch" in document || !CSS.supports("(user-select: none)")) return;

	const sheet = new CSSStyleSheet();
	sheet.replaceSync(`
			@supports (user-select: none) {
				@layer {
					[hidden="until-found"] {
						display: revert;
						content-visibility: auto;
						contain: size layout paint style;
						contain-intrinsic-size: 0;
						user-select: none;
					}
				}
			}
		`);

	document.adoptedStyleSheets.push(sheet);

	const hiddenUntilFoundObserver = new MutationObserver(entries => {
		for (const entry of entries) {
			switch (entry.type) {
				case "attributes":
					// TODO: handle programmatic cases
					break;
				case "childList":
					for (const node of entry.addedNodes) {
						if (node.hasAttribute?.("hidden") && node.getAttribute("hidden") === "until-found") {
							// TODO: what do we do if we already have a shadow root??
							node.attachShadow({ mode: "open" });
							// 1. `aria-hidden=true` prevents the content from being exposed to AT.
							// 2. `tabindex=-1` removes any interactive content from the tab order.
							node.shadowRoot.innerHTML = "<slot aria-hidden=true tabindex=-1></slot>";
						}
					}
					break;
			}
		}
	});

	hiddenUntilFoundObserver.observe(document.documentElement, {
		subtree: true,
		childList: true,
		attributeOldValue: true,
		attributeFilter: ["hidden"],
	});

	document.addEventListener("selectionchange", event => {
		const selection = document.getSelection();
		const foundElement = selection.anchorNode?.parentElement.closest("[hidden=until-found]");
		if (foundElement) {
			// Store parts of the selection
			const {anchorNode, anchorOffset, focusNode, focusOffset} = selection;

			// TODO: add `onbeforematch` to `Element`?
			const cancelled = !foundElement.dispatchEvent(
				new Event("beforematch", { bubbles: true })
			);

			if (cancelled) return;

			// Clone element to remove the shadow root
			// TODO: child form elements probably lost form state this way (not ideal).
			const clone = foundElement.cloneNode();
			clone.removeAttribute("hidden");
			clone.append(...foundElement.childNodes);
			stopSelectionChange();
			foundElement.replaceWith(clone);

			// Clone selection (a bit naïve)
			// TODO: how do we handle “highlight all”?
			const range = document.createRange();
			range.setStart(anchorNode, anchorOffset);
			range.setEnd(focusNode, focusOffset);
			stopSelectionChange();
			selection.addRange(range);
		}
	});

	function stopSelectionChange() {
		for (const target of [window, document])
			target.addEventListener("selectionchange", event => event.stopImmediatePropagation(), { capture: true, once: true });
	}
})();
