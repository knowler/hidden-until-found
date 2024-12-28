# `hidden=until-found` polyfill

This is a work-in-progress polyfill for the `hidden=until-found` feature which
will hide content until it’s found (i.e. usually via “find in page” browser
features). This only works in Firefox as there’s no way to detect find-in-page
activity in Safari. Chrome already supports the feature, so we don’t polyfill
it.
