//setInterval(Prism.highlightAll, 2000);

var codeBlockObserver = new MutationObserver(function(mutations, obs) {
  for(var i = 0; i < mutations.length; ++i) {
    if (mutations[i].target.tagName == "CODE") {
      if (!mutations[i].target.querySelector('.token')) {
        Prism.highlightAllUnder(mutations[i].target.parentNode);
      }
    }
    for(var j = 0; j < mutations[i].addedNodes.length; ++j) {
      var newTag = mutations[i].addedNodes[j];
      if (newTag.querySelector && newTag.querySelector('pre')) {
        Prism.highlightAllUnder(newTag);
      }
    }
  }
});

function waitForElementToDisplay(selector, time) {
  var element = document.querySelector(selector);
  if (element != null) {
    Prism.highlightAllUnder(element);
    codeBlockObserver.observe(element, {
      childList: true,
      subtree: true
    });
  } else {
    setTimeout(function() {
      waitForElementToDisplay(selector, time);
    }, time);
  }
}

waitForElementToDisplay('#activity-items', 1000);
