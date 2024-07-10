const addCopyButtonToCodeBlock = (block) => {
  if (block.querySelector(".copy-code-button")) return;
  const copyButton = document.createElement("button");
  const copyIcon = document.createElement("i");
  copyIcon.className = "ti ti-copy";
  copyIcon.style.pointerEvents = "none";
  copyButton.appendChild(copyIcon);
  copyButton.className = "copy-code-button";
  copyButton.style.cssText = `
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 10;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 2px 5px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 70%;
  `;
  copyButton.addEventListener("click", () => {
    copyCodeContent(block);
  });
  block.style.position = "relative";
  block.appendChild(copyButton);
};
const copyCodeContent = (block) => {
  const codeMirror = block.querySelector(".CodeMirror");
  let content = "";
  if (codeMirror && codeMirror.CodeMirror) {
    content = codeMirror.CodeMirror.getValue();
  } else {
    const codeElement =
      block.querySelector("textarea") || block.querySelector("pre");
    if (codeElement) {
      content = codeElement.value || codeElement.textContent;
    } else {
      console.error("No code content found");
      return;
    }
  }
  navigator.clipboard
    .writeText(content)
    .then(() => {
      logseq.api.show_msg("Copied to clipboard");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
      logseq.api.show_msg("Could not copy to clipboard");
    });
};
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains("cp__fenced-code-block")) {
            addCopyButtonToCodeBlock(node);
          } else {
            const codeBlocks = node.querySelectorAll(".cp__fenced-code-block");
            codeBlocks.forEach(addCopyButtonToCodeBlock);
          }
        }
      });
    }
  });
});
observer.observe(document.body, { childList: true, subtree: true });
document
  .querySelectorAll(".cp__fenced-code-block")
  .forEach(addCopyButtonToCodeBlock);
