var activityObserver = new MutationObserver(function(mutations, obs) {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(newNode => {
      console.log("Added new activity item:",
                  (newNode.id || newNode.tagName),
                  "with class:",
                  newNode.classList
                 );
      highlightCodeElementChildren(newNode);
    });
  });
});

function highlightAll() {
  console.log("Highlighting all activities.");
  var element = document.getElementById('activity-items');
  observeChildren(element, activityObserver);
  highlightCodeElementChildren(element);
}

function highlightCodeElementChildren(parent) {
  for (var codeElement of parent.getElementsByTagName('code')) {
    highlightItem(codeElement);
  }
}

function observeChildren(parent, observer) {
  observer.observe(parent, { childList: true });
}

function highlightItem(codeElement) {
  Prism.highlightAllUnder(codeElement);
  observeChildren(codeElement, new MutationObserver(function(mutations, obs) {
    mutations.forEach(mutation => {
      console.log("Code observer caught mutation of:", mutation.target.tagName);
      obs.disconnect();
      setTimeout(() => {
        if (!mutation.target.classList.contains("language-none") &&
            !mutation.target.querySelector('.token')) {
          console.log("Highlighting it.");
          Prism.highlightAllUnder(mutation.target.parentNode);
        }
        observeChildren(codeElement, obs);
      }, 250);
    });
  }));
}

function waitForActivityFeed() {
  if (document.getElementById('activity-items')) {
    highlightAll();
  } else {
    new MutationObserver(function(mutations, obs) {
      if (document.getElementById('activity-items')) {
        highlightAll();
        obs.disconnect();
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
}

waitForActivityFeed();

var postcss = require('postcss');
var colorTransform = require('postcss-color-transform');
var inverter = colorTransform({
    transform: color => color.lab().l(100 - color.lab().l())
});
var mainCss = document.querySelector('head link[href*=squared]');
if (mainCss) {
  console.log('Processing the CSS');
  var url = mainCss.href;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.addEventListener('load', function () {
    console.log('Loaded CSS');
    var inverted = document.createElement('style');
    inverted.innerHTML = postcss(inverter).process(this.responseText).css;
    document.head.appendChild(inverted);
  });
  request.send()
}
