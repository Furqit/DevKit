class YamlTool {
  constructor() {
    // Tool elements
    this.container = document.getElementById('yaml-tool');
    this.formatButton = document.getElementById('format-yaml');
    this.minifyButton = document.getElementById('minify-yaml');
    this.toJsonButton = document.getElementById('to-json-yaml');
    this.errorMessage = document.getElementById('yaml-error');
    this.successMessage = document.getElementById('yaml-success');

    this.initEditors();
    this.init();
  }

  initEditors() {
    this.inputEditor = CodeMirror(document.getElementById('yaml-input-editor'), {
      mode: 'yaml',
      theme: 'material-darker',
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      tabSize: 2,
      placeholder: 'Paste Yaml here...'
    });

    this.outputEditor = CodeMirror(document.getElementById('yaml-output-editor'), {
      mode: 'yaml',
      theme: 'material-darker',
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      tabSize: 2,
      readOnly: true
    });
  }

  init() {
    this.formatButton.addEventListener('click', () => this.formatYaml());
    this.minifyButton.addEventListener('click', () => this.minifyYaml());
    this.toJsonButton.addEventListener('click', () => this.convertToJson());

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

  formatYaml() {
    const inputText = this.inputEditor.getValue().trim();
    this.clearMessages();

    if (!inputText) {
      this.outputEditor.setValue('');
      return;
    }

    try {
      const parsed = window.jsyaml.load(inputText);
      
      this.outputEditor.setOption('mode', 'yaml');
      const formattedYaml = window.jsyaml.dump(parsed, {
        indent: 2,
        lineWidth: -1,
        noRefs: true
      });
      
      this.outputEditor.setValue(formattedYaml);
      this.showSuccess('YAML formatted successfully.');
    } catch (error) {
      this.showError(`Error: ${error.message}`);
    }
  }

  minifyYaml() {
    const inputText = this.inputEditor.getValue().trim();
    this.clearMessages();

    if (!inputText) {
      this.outputEditor.setValue('');
      return;
    }

    try {
      const parsed = window.jsyaml.load(inputText);
      this.outputEditor.setOption('mode', 'yaml');
      
      const minifiedYaml = window.jsyaml.dump(parsed, {
        indent: 0,
        flowLevel: 0,
        lineWidth: -1,
        noRefs: true
      });
      
      this.outputEditor.setValue(minifiedYaml);
      this.showSuccess('YAML minified successfully.');
    } catch (error) {
      this.showError(`Error: ${error.message}`);
    }
  }

  convertToJson() {
    const inputText = this.inputEditor.getValue().trim();
    this.clearMessages();

    if (!inputText) {
      this.outputEditor.setValue('');
      return;
    }

    try {
      const parsed = window.jsyaml.load(inputText);
      const jsonOutput = JSON.stringify(parsed, null, 2);
      
      this.outputEditor.setOption('mode', { name: 'javascript', json: true });
      this.outputEditor.setValue(jsonOutput);
      this.showSuccess('Converted to JSON successfully.');
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

export default YamlTool;