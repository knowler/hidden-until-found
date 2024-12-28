# `hidden=until-found` polyfill

This is a work-in-progress polyfill for the `hidden=until-found` feature which
will hide content until it’s found (i.e. usually via “find in page” browser
features). This only works in Firefox as there’s no way to detect find-in-page
activity in Safari. Chrome already supports the feature, so we don’t polyfill
it.

## Usage

The script should be loaded before any stylesheets to ensure the anonymous
cascade layer we use gets set first.

## Limitations

- Currently does not work in shadow roots.
- Doesn’t work in Safari. So, it’s a good idea to include a fallback to get to
	the content if there’s no other way (e.g. perhaps make that content visible by
	default if it makes sense).
