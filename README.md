# `hidden=until-found` polyfill

This is a work-in-progress polyfill for the `hidden=until-found` feature which
will hide content until it’s found (i.e. usually via “find in page” browser
features). This only works in Firefox as there’s no way to detect find-in-page
activity in Safari. Chrome already supports the feature, so we don’t polyfill
it.

## Usage

The script should be loaded before any body content to ensure the mutation
observer picks up elements as they are added to the DOM.

```html
<!doctype html>
<script src=/path/to/hidden-until-found.js></script>
<!-- More importantly, make sure it loads before contents -->
<p hidden=until-found>Hello, World!
```

## Limitations

- Does not work inside of shadow roots.
	- Polyfilling declarative shadow DOM is heavy (i.e. you need to walk every
		element) and selection changes inside the shadow DOM are complicated in
		Firefox.
- Does not work in Safari.
	- So, this is really only relevant for Firefox at this point.
