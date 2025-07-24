class JsonTool {
  constructor() {
    // Tool elements
    this.container = document.getElementById('json-tool');
    this.formatButton = document.getElementById('format-json');
    this.stringifyButton = document.getElementById('stringify-json');
    this.minifyButton = document.getElementById('minify-json');
    this.errorMessage = document.getElementById('json-error');
    this.successMessage = document.getElementById('json-success');

    this.initEditors();
    this.init();
  }

  initEditors() {
    this.inputEditor = CodeMirror(document.getElementById('json-input-editor'), {
      mode: { name: 'javascript', json: true },
      theme: 'material-darker',
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      tabSize: 2,
      placeholder: 'Paste JSON here...'
    });

    this.outputEditor = CodeMirror(document.getElementById('json-output-editor'), {
      mode: { name: 'javascript', json: true },
      theme: 'material-darker',
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      tabSize: 2,
      readOnly: true
    });
  }

  init() {
    this.formatButton.addEventListener('click', () => this.formatJson());
    this.stringifyButton.addEventListener('click', () => this.stringifyJson());
    this.minifyButton.addEventListener('click', () => this.minifyJson());

    this.inputEditor.on('change', () => {
      this.clearMessages();

      const value = this.inputEditor.getValue();
      if (value !== value.trim()) {
        this.inputEditor.setValue(value.trim());
      }
    });
  }

  parseAndRepair(inputText) {
    const repaired = window.jsonrepair(inputText);
    return JSON.parse(repaired);
  }

  formatJson() {
    const inputText = this.inputEditor.getValue().trim();
    this.clearMessages();

    if (!inputText) {
      this.outputEditor.setValue('');
      return;
    }

    try {
      const parsed = this.parseAndRepair(inputText);
      const formattedJson = JSON.stringify(parsed, null, 2);
      this.outputEditor.setValue(formattedJson);
      this.showSuccess('JSON formatted successfully.');
    } catch (error) {
      this.showError(`Error: ${error.message}`);
    }
  }

  stringifyJson() {
    const inputText = this.inputEditor.getValue().trim();
    this.clearMessages();

    if (!inputText) {
      this.outputEditor.setValue('');
      return;
    }

    try {
      const parsed = this.parseAndRepair(inputText);
      const stringified = JSON.stringify(JSON.stringify(parsed));
      this.outputEditor.setValue(stringified);
      this.showSuccess('JSON stringified successfully.');
    } catch (error) {
      this.showError(`Error: ${error.message}`);
    }
  }

  minifyJson() {
    const inputText = this.inputEditor.getValue().trim();
    this.clearMessages();

    if (!inputText) {
      this.outputEditor.setValue('');
      return;
    }

    try {
      const parsed = this.parseAndRepair(inputText);
      const minifiedJson = JSON.stringify(parsed);
      this.outputEditor.setValue(minifiedJson);
      this.showSuccess('JSON minified successfully.');
    } catch (error) {
      this.showError(`Error: ${error.message}`);
    }
  }

  clearMessages() {
    this.errorMessage.classList.remove('visible');
    this.successMessage.classList.remove('visible');
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add('visible');
    this.successMessage.classList.remove('visible');
  }

  showSuccess(message) {
    this.successMessage.textContent = message;
    this.successMessage.classList.add('visible');
    this.errorMessage.classList.remove('visible');
  }
}

export default JsonTool;
