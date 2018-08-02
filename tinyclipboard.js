(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.TinyClipboard = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    "use strict";
    var clipboard = function (options) {
        var defaults = {
            format: "html",
            content: "",
            button: null,
            target: null
        }
            , settings;
        var execCopy = function () {
            var successful = false;
            try {
                successful = document.execCommand("copy");
            } catch (err) {
                console.log(err);
            }
            return successful;
        };

        var select = function (el, selection, selectContent) {
            var range = document.createRange();
            if (selectContent === true) {
                range.selectNodeContents(el);
            } else {
                range.selectNode(el);
            }
            selection.removeAllRanges();
            selection.addRange(range);
            return selection;
        };

        var createTmpDiv = function () {
            var input = document.createElement("div");
            input.style.position = "absolute";
            input.style.left = "-9999px";
            input.setAttribute("contentEditable", true);
            var contents = {
                "html": function () { input.innerHTML = settings.content },
                "text": function () { input.innerText = settings.content }
            }
            var setContent = (contents[settings.format] || function () { input.innerHTML = settings.content })();
            return input;
        };

        var bindEvent = function (btn) {
            document.getElementById(btn).addEventListener('click', copy);
        };

        var extendDefaults = function (properties) {
            var source = defaults
                , property
                , error = "";
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    if (typeof properties[property] === "string") {
                        source[property] = properties[property];
                    } else {
                        error += property + " must be a string. ";
                    }
                }
            }
            if (error != "") { console.log(error); }
            return error !== "" ? source : defaults;
        };

        var copy = function () {
            var msg,
                sel = window.getSelection();
            if (settings.content !== "") {
                var element = createTmpDiv()
                    , body = document.body;
                body.appendChild(element);
                sel = select(element, sel, true);
                msg = execCopy();
                sel.deleteFromDocument();
                body.removeChild(element);               
            } else if (settings.target !== null) {
                var element = document.getElementById(settings.target);
                if (element.tagName.toLowerCase() == "input" || element.tagName.toLowerCase() == "textarea") {
                    element.select();
                } else {
                    sel = select(element, sel, false);
                }
                msg = execCopy();
                sel.removeAllRanges();
            }
            return msg;
        };

        var init = function (para) {
            settings = extendDefaults(para);
            if (settings.button !== null) { bindEvent(settings.button); }
        };

        clipboard.destroy = function () {
            settings.button.removeEventListener('click', copy, false);
            settings = defaults;
        };

        init(options); 
    }

    return clipboard;

});
