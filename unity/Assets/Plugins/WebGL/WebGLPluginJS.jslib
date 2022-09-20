 mergeInto(LibraryManager.library, {
    SetSelection: function (selection) {
      try {
        window.dispatchReactUnityEvent("SetSelection", UTF8ToString(selection));
      } catch (e) {
        console.warn("Failed to dispatch event");
      }
    },
  });