/*
 * Site theme toggle.
 *
 * Loaded synchronously in <head> of every page, before the first paint, so the
 * stored preference is applied without a flash of the other theme.
 *
 * Dark is the default: this file only ever sets data-theme="light", and
 * theme.css keeps the dark tokens in :root. A page with no JS therefore still
 * renders dark, which is also what happens if localStorage is unavailable
 * (it is blocked on some file:// setups) - the toggle then lasts for the
 * current page only.
 */

var PKDX_THEME_KEY = "pkdx-theme";
var PKDX_DARK = "dark";
var PKDX_LIGHT = "light";

/* U+262E followed by U+FE0F. The variation selector is what makes it render
   as the colour emoji; without it platforms fall back to a monochrome dingbat,
   which came out looking flat. A single glyph is used for both states: it reads
   as "switch" without claiming a direction. Which theme you are on, and what a
   click will do, is carried by the title and aria-label instead. */
var PKDX_ICON = "☯️";

function pkdxReadTheme() {
    try {
        return window.localStorage.getItem(PKDX_THEME_KEY);
    } catch (e) {
        return null; /* private mode, file:// restrictions, storage disabled */
    }
}

function pkdxWriteTheme(theme) {
    try {
        window.localStorage.setItem(PKDX_THEME_KEY, theme);
    } catch (e) {
        /* Nothing to do: the theme still applies for this page. */
    }
}

function pkdxCurrentTheme() {
    if (document.documentElement.getAttribute("data-theme") === PKDX_LIGHT) {
        return PKDX_LIGHT;
    }
    return PKDX_DARK;
}

function pkdxApplyTheme(theme) {
    if (theme === PKDX_LIGHT) {
        document.documentElement.setAttribute("data-theme", PKDX_LIGHT);
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
    pkdxSyncToggle();
    pkdxWriteTheme(theme);
}

/* The button shows the theme it switches TO, so its label always names the
   next state rather than the current one. */
function pkdxSyncToggle() {
    var button = document.getElementById("theme-toggle");
    if (!button) {
        return;
    }
    var dark = pkdxCurrentTheme() === PKDX_DARK;
    var nextLabel = dark ? "Switch to light theme" : "Switch to dark theme";
    button.innerHTML = PKDX_ICON;
    button.setAttribute("title", nextLabel);
    button.setAttribute("aria-label", nextLabel);
    button.setAttribute("data-next-theme", dark ? PKDX_LIGHT : PKDX_DARK);
}

function pkdxToggleTheme() {
    pkdxApplyTheme(pkdxCurrentTheme() === PKDX_DARK ? PKDX_LIGHT : PKDX_DARK);
}

/* Apply the stored theme now, while still in <head>. */
if (pkdxReadTheme() === PKDX_LIGHT) {
    document.documentElement.setAttribute("data-theme", PKDX_LIGHT);
}

/* One delegated listener, so it does not matter whether the button exists yet
   and it keeps working on pages that add the header dynamically. */
document.addEventListener("click", function (event) {
    var node = event.target;
    while (node && node !== document) {
        if (node.id === "theme-toggle") {
            pkdxToggleTheme();
            return;
        }
        node = node.parentNode;
    }
}, false);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pkdxSyncToggle, false);
} else {
    pkdxSyncToggle();
}

/*
 * When this page is rendered inside the constant-address shell (index.html),
 * tell the shell where we are. postMessage is used rather than reading
 * frame.contentWindow because the shell cannot script this document across
 * origins on file://.
 */
if (window.parent !== window) {
    var pkdxReport = function () {
        try {
            window.parent.postMessage({
                pkdxNav: 1,
                path: location.pathname + location.search,
                title: document.title
            }, "*");
        } catch (e) {
            /* A parent that refuses messages is not worth breaking the page. */
        }
    };
    pkdxReport();
    window.addEventListener("popstate", pkdxReport, false);
    window.addEventListener("hashchange", pkdxReport, false);
    window.addEventListener("load", pkdxReport, false);
}