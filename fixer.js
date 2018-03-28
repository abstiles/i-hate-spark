var codeBlockObserver = new MutationObserver(function(mutations, obs) {
  window.console.log("Activities have been mutated.");
  for (var i = 0; i < mutations.length; ++i) {
    var mutation = mutations[i];
    if (mutation.target.tagName == "CODE") {
      if (!mutation.target.querySelector('.token')
          && !mutation.target.classList.contains("language-none")) {
        // Need to re-highlight this code.
        Prism.highlightAllUnder(mutation.target.parentNode);
      }
    } else if (mutation.target.id == "activity-items") {
      window.console.log("Added new activity item.");
      for(var j = 0; j < mutation.addedNodes.length; ++j) {
        var newTag = mutation.addedNodes[j];
        window.console.log("Added:", newTag);
        if (newTag.querySelector && newTag.querySelector('pre')) {
          window.console.log("Highlighting:", newTag);
          Prism.highlightAllUnder(newTag);
        }
      }
    } else {
      window.console.log("Detected mutation on",
                         (mutation.target.id || mutation.target.tagName),
                         "with class",
                         mutation.target.classList);
    }
  }
});

function waitForActivityFeed() {
  var element = document.getElementById('activity-items');
  if (element != null) {
    window.console.log("Highlighting all activities.");
    Prism.highlightAllUnder(element);
    codeBlockObserver.observe(element, {
      childList: true,
      subtree: true
    });
  } else {
    setTimeout(function() {
      waitForActivityFeed();
    }, 1000);
  }
}

waitForActivityFeed();
