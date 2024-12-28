# `hidden=until-found` polyfill

This is a work-in-progress polyfill for the `hidden=until-found` feature which
will hide content until it’s found (i.e. usually via “find in page” browser
features). This only works in Firefox as there’s no way to detect find-in-page
activity in Safari. Chrome already supports the feature, so we don’t polyfill
it.

## Usage

The script should be loaded before any stylesheets and any body content to
ensure the anonymous cascade layer we use gets set first and that the mutation
observer picks up elements as they are added to the DOM.

## Limitations

- Currently does not work in shadow roots.
- Doesn’t work in Safari. So, it’s a good idea to include a fallback to get to
	the content if there’s no other way (e.g. perhaps make that content visible by
	default if it makes sense).

## Improvements

- A mutation observer is probably a heavy handed way to accomplish this, it
	might be worth adding the styles and then deferring the shadow root stuff
	until after.
